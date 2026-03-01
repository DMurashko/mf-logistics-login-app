import axios from 'axios';
import { ConfigService } from '../config/ConfigService.ts';

export const apiAxiosInstance = axios.create({
  baseURL: ConfigService.apiUrl,
});
