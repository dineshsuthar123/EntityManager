import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import createAuthRefreshInterceptor from 'axios-auth-refresh';
import { API_URLS } from '../config/api-config';

interface JwtPayload {
    sub: string;
    roles: string[];
    exp: number;
    iat: number;
}

interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}

interface LoginRequest {
    username: string;
    password: string;
}

interface SignupRequest {
    username: string;
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    roles?: string[];
}

interface AuthResponse {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    roles: string[];
    accessToken: string;
    refreshToken: string;
    tokenType: string;
}

class AuthService {
    private API_URL = API_URLS.AUTH;
    private tokenKey = 'auth_tokens';
    private userKey = 'auth_user';

    constructor() {
        this.setupAxiosInterceptors();
    }

    async login(request: LoginRequest): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(`${this.API_URL}/signin`, request);

        if (response.data.accessToken) {
            this.saveTokens({
                accessToken: response.data.accessToken,
                refreshToken: response.data.refreshToken
            });
            this.saveUser(response.data);
        }

        return response.data;
    }

    async signup(request: SignupRequest): Promise<any> {
        return axios.post(`${this.API_URL}/signup`, request);
    }

    logout(): void {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
    }

    refreshToken(): Promise<AuthResponse> {
        const tokens = this.getTokens();
        if (!tokens) {
            return Promise.reject('No refresh token available');
        }

        return axios.post<AuthResponse>(`${this.API_URL}/refreshtoken`, {
            refreshToken: tokens.refreshToken
        }).then(response => {
            if (response.data.accessToken) {
                this.saveTokens({
                    accessToken: response.data.accessToken,
                    refreshToken: response.data.refreshToken
                });
            }
            return response.data;
        });
    }

    getCurrentUser(): any {
        const userStr = localStorage.getItem(this.userKey);
        if (userStr) {
            return JSON.parse(userStr);
        }
        return null;
    }

    isLoggedIn(): boolean {
        const tokens = this.getTokens();
        if (!tokens) {
            return false;
        }

        try {
            const decoded = jwtDecode<JwtPayload>(tokens.accessToken);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                return false;
            }

            return true;
        } catch (error) {
            return false;
        }
    }

    getRoles(): string[] {
        const tokens = this.getTokens();
        if (!tokens) {
            return [];
        }

        try {
            const decoded = jwtDecode<JwtPayload>(tokens.accessToken);
            return decoded.roles || [];
        } catch {
            return [];
        }
    }

    hasRole(role: string): boolean {
        return this.getRoles().includes(role);
    }

    getAccessToken(): string | null {
        const tokens = this.getTokens();
        return tokens ? tokens.accessToken : null;
    }

    private getTokens(): AuthTokens | null {
        const tokensStr = localStorage.getItem(this.tokenKey);
        if (tokensStr) {
            return JSON.parse(tokensStr);
        }
        return null;
    }

    private saveTokens(tokens: AuthTokens): void {
        localStorage.setItem(this.tokenKey, JSON.stringify(tokens));
    }

    private saveUser(user: any): void {
        localStorage.setItem(this.userKey, JSON.stringify(user));
    }

    private setupAxiosInterceptors(): void {
        // Add access token to requests
        axios.interceptors.request.use(
            (config) => {
                const token = this.getAccessToken();

                if (token && config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }

                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Setup refresh logic
        const refreshAuthLogic = (failedRequest: any) => {
            return this.refreshToken()
                .then(data => {
                    failedRequest.response.config.headers['Authorization'] = 'Bearer ' + data.accessToken;
                    return Promise.resolve();
                })
                .catch(() => {
                    this.logout();
                    return Promise.reject();
                });
        };

        // Setup interceptor for refresh token
        createAuthRefreshInterceptor(axios, refreshAuthLogic, {
            statusCodes: [401, 403]
        });
    }
}

export default new AuthService();
