import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

export function useBase64File(httpService: Promise<AxiosResponse> | null) {
  const [file, setFile] = useState<string | undefined>();
  const [service, setService] = useState(httpService);
  const [type, setType] = useState("");

  useEffect(() => {
    async function getImage() {
      if (service) {
        const { data } = await service;

        if (data[0]) {
          setType(data[1]);
          setFile(`data:${data[1]};base64,${data[0]}`);
        } else {
          setFile(process.env.PUBLIC_URL + "/images/no-picture.jpeg");
        }
      } else {
        setFile(undefined);
      }
    }
    getImage();
  }, [service]);

  return { file, setService, type };
}
