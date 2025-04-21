import { Credentials, Organization } from '../types/config.types';
require('dotenv').config();

export const authConfig = {
  credentials: {
    account: process.env.ACCOUNT,
    password: process.env.PASSWORD
  } as Credentials,
  organization: {
    name: 'Ally Transport'
  } as Organization,
  dispatchCenter: {
    name: '花仙子 DC'
  }
}; 
