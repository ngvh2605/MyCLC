import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { isPlatform } from "@ionic/react";
import { useState } from "react";
import { resizeImage } from "../utils/helpers/helpers";

const useAddImage = (
  imgMaxSize: number,
  fileInputRef: React.MutableRefObject<HTMLInputElement>
) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);

      const resizeUrl = await (
        await resizeImage(pictureUrl, imgMaxSize)
      ).imageUrl;
      setImageUrl(resizeUrl);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: imgMaxSize,
        });

        const resizeUrl = await (
          await resizeImage(photo.webPath, imgMaxSize)
        ).imageUrl;
        setImageUrl(resizeUrl);
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current.click();
    }
  };

  const clearImageUrl = () => {
    setImageUrl("");
  };

  return { imageUrl, clearImageUrl, handleFileChange, handlePictureClick };
};

export default useAddImage;
