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
    const data: T = await response.json();

    if (!response.ok) {
      const errorData = data as { error?: string };
      throw new Error(errorData.error || 'Something went wrong');
    }

    if (successMessage) {
      toast.success(successMessage);
    }

    return { 
      success: true, 
      message: successMessage || 'Operation completed successfully',
      ...data 
    };
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
