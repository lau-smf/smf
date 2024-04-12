import { AxiosError } from 'axios';
import { ApiError } from '@/types/api';

export const DEFAULT_TOAST_MESSAGE = {
  loading: 'Loading...',
  success: 'Success',
  error: (err: AxiosError<ApiError>) =>
    err?.response?.data?.message ?? 'Something is wrong, please try again',
};
