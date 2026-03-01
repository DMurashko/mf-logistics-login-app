import {AuthApi} from './generated/api/auth-api.ts';
import {ConfigService} from '../config/ConfigService.ts';
import {Configuration} from './generated/configuration.ts';
import {apiAxiosInstance} from './axiosInstance.ts';

export const authApi = new AuthApi(
  new Configuration({ basePath: ConfigService.apiUrl }),
  undefined,
  apiAxiosInstance
);
