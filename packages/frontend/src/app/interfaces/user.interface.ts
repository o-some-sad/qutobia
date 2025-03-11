export interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  image: string|null;
  contact: {
    address: string;
    phone: string;
  } | null;
}

export interface UserResponse {
  data: User;
}
export interface UsersResponse {
  totalPages: number;
  data: User[];
}

export interface UserPassword{
  _id: string;
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
