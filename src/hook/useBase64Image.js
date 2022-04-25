import { useEffect, useState } from "react";

export function useBase64Image(httpService) {
  const [image, setImage] = useState();

  useEffect(() => {
    async function getImage() {
      if (httpService) {
        const { data } = await httpService;
        if (data) {
          setImage(`data:image/jpeg;base64,${data}`);
        } else {
          setImage(process.env.PUBLIC_URL + "/images/no-picture.jpeg");
        }
      }
    }
    getImage();
  }, []);

  return image;
}
