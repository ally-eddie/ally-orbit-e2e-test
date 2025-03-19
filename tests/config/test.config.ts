import { TestConfig } from '../types/config.types';
import { authConfig } from './auth.config';

export const config: TestConfig = {
  baseUrl: 'http://localhost:3000',
  apiBaseUrl: 'http://localhost:3000/ally-auth-service/api',
  credentials: authConfig.credentials,
  organization: authConfig.organization,
  dispatchCenter: authConfig.dispatchCenter
}; 