import { toast } from 'react-hot-toast';

type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
};

export const handleApiResponse = async <T>(
  promise: Promise<Response>,
  successMessage?: string
): Promise<ApiResponse<T>> => {
  try {
    const response = await promise;
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Something went wrong');
    }

    if (successMessage) {
      toast.success(successMessage);
    }

    return { success: true, ...data };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
    toast.error(errorMessage);
    return { success: false, message: errorMessage, error: errorMessage };
  }
};

export const showSuccess = (message: string) => {
  toast.success(message);
};

export const showError = (message: string) => {
  toast.error(message);
};
