import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

export function useBase64Image(httpService: Promise<AxiosResponse> | null) {
  const [image, setImage] = useState<string | undefined>();
  const [service, setService] = useState(httpService);
  const [type, setType] = useState("");

  useEffect(() => {
    async function getImage() {
      if (service) {
        const { data } = await service;

        if (data) {
          setType(data[1]);
          setImage(`data:${data[1]};base64,${data[0]}`);
        } else {
          setImage(process.env.PUBLIC_URL + "/images/no-picture.jpeg");
        }
      } else {
        setImage(undefined);
      }
    }
    getImage();
  }, [service]);

  return { image, setService, type };
}
