import axios, { AxiosResponse, CancelToken, CancelTokenSource } from "axios";

export function useCancellableRequest<T extends any[]>(
  method: (...args: [...T, CancelToken]) => Promise<AxiosResponse<any, any>>
): [(...args: [...T]) => Promise<AxiosResponse>, () => void] {
  let source: CancelTokenSource;

  async function execute(...args: [...T]): Promise<AxiosResponse<any, any>> {
    source = axios.CancelToken.source();
    return await method(...args, source.token);
  }

  function cancel() {
    source?.cancel("cancel_hook");
  }

  return [execute, cancel];
}
