// Định nghĩa interface cho Auth
export interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
}

// Định nghĩa interface cho login response
export interface LoginResponse {
  token: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: number;
    username: string;
    email: string;
    role: string;
  };
}

// Định nghĩa interface cho register response
export interface RegisterResponse {
  message: string;
  success: boolean;
  user: {
    id: number;
    username: string;
    email: string;
  };
}

// Định nghĩa interface cho token payload
export interface TokenPayload {
  sub: string; // user id
  username: string;
  roles: string[];
  exp: number; // expiration timestamp
  iat: number; // issued at timestamp
}
