export interface JwtPayload {
  sub: string; // user id
  email: string;
  role: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}
