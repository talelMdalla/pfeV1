import { useState, useEffect } from 'react';

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: any[] = []
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const execute = async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Une erreur est survenue';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  useEffect(() => {
    if (dependencies.length > 0 && dependencies.every(dep => dep !== undefined)) {
      execute();
    }
  }, dependencies);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook spécialisé pour les mutations (POST, PUT, DELETE)
export function useMutation<T, P = any>(
  apiCall: (params: P) => Promise<T>
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = async (params: P) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Une erreur est survenue';
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  };

  return {
    ...state,
    mutate,
  };
}