export interface User {
  id: string;
  email: string;
  name: string;
  role: 'insurer' | 'admin';
  insuranceCompanyId?: string; // Added for insurer users
}

export interface LoginCredentials {
  email: string;
  password: string;
}