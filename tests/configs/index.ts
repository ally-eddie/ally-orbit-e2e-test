import { TestConfig } from '../types/config.types';
import { authConfig } from './auth.config';

const ENV_URL = {
  local: 'http://localhost:3000',
  dev: 'https://portal-dev.allytransport.com.tw',
  stage: 'https://portal-stage.allytransport.com.tw',
}
export const baseConfig: TestConfig = {
  baseUrl: ENV_URL.local,  
  credentials: authConfig.credentials,
  organization: authConfig.organization,
  dispatchCenter: authConfig.dispatchCenter
}; 