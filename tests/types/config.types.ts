export interface Credentials {
  account: string;
  password: string;
}

export interface Organization {
  name: string;
}

export interface DispatchCenter {
  name: string;
}

export interface TestConfig {  
  baseUrl: string;  
  credentials: Credentials;  
  organization: Organization;
  dispatchCenter: DispatchCenter;
} 