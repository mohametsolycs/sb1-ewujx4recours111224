import { User } from '../types/auth';
import { INSURANCE_COMPANIES } from './insuranceCompanies';

export const DEMO_USERS: Record<string, User> = {
  insurer: {
    id: 'demo-insurer',
    email: 'demo@example.com',
    name: 'Assureur Demo',
    role: 'insurer',
    insuranceCompanyId: 'axa'
  },
  sunu: {
    id: 'sunu-insurer',
    email: 'sunu@example.com',
    name: 'Assureur SUNU',
    role: 'insurer',
    insuranceCompanyId: 'sunu'
  },
  admin: {
    id: 'demo-admin',
    email: 'admin@aar.sn',
    name: 'Administrateur AAR',
    role: 'admin'
  }
};

export const DEMO_PASSWORDS: Record<string, string> = {
  'demo@example.com': 'password',
  'sunu@example.com': 'sunu123',
  'admin@aar.sn': 'admin123'
};