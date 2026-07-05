// UserResponseDTO from backend returns role as a plain string, not an object
export interface UserResponse {
  id: string;
  username: string;
  role: string; // just the role name string, e.g. "admin", "school", "seduc_user"
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface SignUpCredentials {
  username: string;
  password: string;
}
