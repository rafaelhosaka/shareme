import { useState } from "react";
import { AxiosResponse, CancelToken } from "axios";
import { useCancellableRequest } from "./useCancellableRequest";

export function useBase64File<T extends any[]>(
  method: (...args: [...T, CancelToken]) => Promise<AxiosResponse<any, any>>
) {
  const [file, setFile] = useState<string | undefined>();
  const [execute, cancelRequest] = useCancellableRequest(method);
  const [type, setType] = useState("");

  function clearImage() {
    setFile(undefined);
  }

  async function executeRequest(...args: [...T]) {
    async function getImage(...args: [...T]) {
      const { data } = await execute(...args);
      if (data[0]) {
        setType(data[1]);
        setFile(`data:${data[1]};base64,${data[0]}`);
      } else {
        setFile(process.env.PUBLIC_URL + "/images/no-picture.jpeg");
      }
    }
    getImage(...args);
  }

  return { file, type, executeRequest, cancelRequest, clearImage };
}
