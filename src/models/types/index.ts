export type Subscriber = () => void;
export type EnvironmentKey =
  | 'CTP_PROJECT_KEY'
  | 'CTP_CLIENT_ID'
  | 'CTP_CLIENT_SECRET'
  | 'CTP_AUTH_URL'
  | 'CTP_API_URL'
  | 'CTP_SCOPES';

