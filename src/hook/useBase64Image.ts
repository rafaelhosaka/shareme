import { useEffect, useState } from "react";
import { AxiosResponse } from "axios";

export function useBase64Image(httpService: Promise<AxiosResponse> | null) {
  const [image, setImage] = useState<string | undefined>();
  const [service, setService] = useState(httpService);

  useEffect(() => {
    async function getImage() {
      if (service) {
        const { data } = await service;
        if (data) {
          setImage(`data:image/jpeg;base64,${data}`);
        } else {
          setImage(process.env.PUBLIC_URL + "/images/no-picture.jpeg");
        }
      } else {
        setImage(undefined);
      }
    }
    getImage();
  }, [service]);

  return { image: image, setService: setService };
}
