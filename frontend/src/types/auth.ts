import type { User } from "./user";

export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
  googleId?: string;
}

export interface AuthResponse {
  tokens : Tokens;
  user: User;
}

export interface Tokens {
  accessToken: string,
  refreshToken: string,
  refreshTokenId: string,
  expiresAt: Date
}
