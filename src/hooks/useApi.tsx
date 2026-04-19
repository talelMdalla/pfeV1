import axios from "axios";
import { DependencyList, useCallback, useEffect, useState } from "react";

interface UseApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

interface UseApiOptions {
  enabled?: boolean;
}

interface ApiErrorResponse {
  error?: string;
  message?: string;
}

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    return error.response?.data?.error || error.response?.data?.message || error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Une erreur est survenue";
};

export function useApi<T>(
  apiCall: () => Promise<T>,
  dependencies: DependencyList = [],
  options: UseApiOptions = {},
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const dependencyKey = JSON.stringify(dependencies);
  const hasAllDependencies = dependencies.every((dependency) => dependency !== undefined);

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [apiCall]);

  useEffect(() => {
    const enabled = options.enabled ?? true;

    if (enabled && hasAllDependencies) {
      void execute();
    }
  }, [dependencyKey, execute, hasAllDependencies, options.enabled]);

  return {
    ...state,
    execute,
    refetch: execute,
  };
}

// Hook spécialisé pour les mutations (POST, PUT, DELETE)
export function useMutation<T, P = unknown>(
  apiCall: (params: P) => Promise<T>,
) {
  const [state, setState] = useState<UseApiState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const mutate = useCallback(async (params: P) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await apiCall(params);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setState({ data: null, loading: false, error: errorMessage });
      throw error;
    }
  }, [apiCall]);

  return {
    ...state,
    mutate,
  };
}
