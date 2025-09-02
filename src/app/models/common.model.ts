export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface FilterOptions {
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface AuthToken {
  token: string;
  userId: number;
  empresaId?: number;
  instalacionId?: number;
  rol: 'ADMIN_GENERAL' | 'ADMIN_EMPRESA' | 'ADMIN_INSTALACION' | 'USUARIO';
  permisos: string[];
  expiresAt: Date;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: {
    id: number;
    username: string;
    email: string;
    nombreCompleto: string;
    rol: string;
    empresaId?: number;
    instalacionId?: number;
  };
}
