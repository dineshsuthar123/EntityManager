import http from './http';
import { API_URLS } from '../config/api-config';

const API_URL = `${API_URLS.AUTH}/`;

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
}

interface AuthResponse {
    accessToken: string;
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

interface UserInfo {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    roles: string[];
}

class AuthService {
    private notifyAuthChange() {
        if (typeof window !== 'undefined') {
            window.dispatchEvent(new Event('auth-changed'));
        }
    }

    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await http.post<AuthResponse>(API_URL + 'signin', {
            username,
            password
        });
        
        if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.accessToken);
            this.notifyAuthChange();
        }
        
        return response.data;
    }

    async signup(signupData: SignupRequest): Promise<any> {
        return http.post(API_URL + 'signup', signupData);
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        this.notifyAuthChange();
    }

    getCurrentUser(): UserInfo | null {
        const userStr = localStorage.getItem('user');
        if (userStr) {
            try {
                return JSON.parse(userStr);
            } catch {
                return null;
            }
        }
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    // Alias for getToken - used by ImportExportTools
    getAccessToken(): string | null {
        return this.getToken();
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    // Alias for isAuthenticated - used by ProtectedRoute
    isLoggedIn(): boolean {
        return this.isAuthenticated();
    }

    getRoles(): string[] {
        const user = this.getCurrentUser();
        return user?.roles || [];
    }

    hasRole(role: string): boolean {
        const roles = this.getRoles();
        return roles.includes(role);
    }

    hasAnyRole(requiredRoles: string[]): boolean {
        const userRoles = this.getRoles();
        return requiredRoles.some(role => userRoles.includes(role));
    }

    isAdmin(): boolean {
        return this.hasRole('ROLE_ADMIN');
    }

    isModerator(): boolean {
        return this.hasRole('ROLE_MODERATOR');
    }

    getFullName(): string {
        const user = this.getCurrentUser();
        if (user) {
            return `${user.firstName} ${user.lastName}`.trim();
        }
        return '';
    }

    getEmail(): string {
        const user = this.getCurrentUser();
        return user?.email || '';
    }

    getUsername(): string {
        const user = this.getCurrentUser();
        return user?.username || '';
    }
}

export default new AuthService();
