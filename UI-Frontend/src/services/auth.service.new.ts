import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth/';

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

class AuthService {
    async login(username: string, password: string): Promise<AuthResponse> {
        const response = await axios.post<AuthResponse>(API_URL + 'signin', {
            username,
            password
        });

        if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data));
            localStorage.setItem('token', response.data.accessToken);
        }

        return response.data;
    }

    async signup(signupData: SignupRequest): Promise<any> {
        return axios.post(API_URL + 'signup', signupData);
    }

    logout(): void {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
    }

    getCurrentUser(): any {
        const userStr = localStorage.getItem('user');
        if (userStr) return JSON.parse(userStr);
        return null;
    }

    getToken(): string | null {
        return localStorage.getItem('token');
    }

    isAuthenticated(): boolean {
        return !!this.getToken();
    }

    getRoles(): string[] {
        const user = this.getCurrentUser();
        return user?.roles || [];
    }
}

export default new AuthService();
