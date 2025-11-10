import type { User } from "./user";

export interface AuthRequest {
  email: string;
  password: string;
  username?: string;
  googleId?: string;
}

export interface AuthResponse {
  token : string;
  user: User;
}