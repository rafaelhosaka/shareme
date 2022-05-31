import { useEffect, useState } from "react";

export function useBase64Image(httpService) {
  const [image, setImage] = useState();
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
        setImage(null);
      }
    }
    getImage();
  }, [service]);

  return { image: image, setService: setService };
}
