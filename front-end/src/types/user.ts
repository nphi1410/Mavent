// Định nghĩa interface cho User
export interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isActive?: boolean;
}

// Enum cho các loại role
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  CUSTOMER = 'CUSTOMER',
}

// Interface cho phân trang user
export interface UserPagination {
  users: User[];
  totalUsers: number;
  totalPages: number;
  currentPage: number;
}
