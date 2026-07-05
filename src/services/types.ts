export interface Role {
  id?: string;
  name: string;
}

export interface UserResponse {
  id: string;
  username: string;
  role: Role;
  createdAt: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  password: string;
}
