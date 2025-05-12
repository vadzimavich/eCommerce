import { env } from '../environmentKey';
import { EnvironmentKey } from '../models/types';

export const getEnvironmentValue = (key: EnvironmentKey): string => {
  const value = env[key];
  return value || '';
};
