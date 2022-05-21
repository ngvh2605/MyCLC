import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import jimp from "jimp";
import mergeImages from "merge-images";
import React, { useEffect, useState } from "react";
import { homeOutline } from "ionicons/icons";
import { useAuth } from "../../auth";
import { useHistory } from "react-router";

const FramePage: React.FC = () => {
  const history = useHistory();
  const { userId } = useAuth();
  const [imgUrl, setImgUrl] = useState("");
  const [mergeUrl, setMergeUrl] = useState("");

  useEffect(() => {
    if (!!imgUrl) {
      crop(imgUrl, 1).then((cropImg: string) => {
        resizeToFrame(cropImg).then((resizeImg: string) => {
          mergeImages([resizeImg, "/assets/image/FacebookFrame.png"], {
            width: 960,
            height: 960,
          }).then((b64: string) => {
            setMergeUrl(b64);
          });
        });
      });
    }
  }, [imgUrl]);

  const resizeToFrame = async (b64: string) => {
    const image = await jimp.read(
      Buffer.from(b64.replace(/^data:image\/png;base64,/, ""), "base64")
    );

    if (image.getWidth() < image.getHeight()) {
      image.resize(960, jimp.AUTO);
    } else image.resize(jimp.AUTO, 960);

    return image.getBase64Async(jimp.MIME_JPEG);
  };

  const handlePictureClick = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Prompt,
        width: 960,
      });

      setImgUrl(photo.webPath);
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {userId ? (
              <IonMenuButton />
            ) : (
              <IonButton
                onClick={() => {
                  history.push("/index");
                }}
              >
                <IonIcon icon={homeOutline} />
              </IonButton>
            )}
          </IonButtons>
          <IonTitle>Thêm khung</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          expand="block"
          color="primary"
          onClick={() => {
            handlePictureClick();
          }}
        >
          Chọn ảnh
        </IonButton>
        <br />
        <br />
        {mergeUrl && <IonImg src={mergeUrl} />}
      </IonContent>
    </IonPage>
  );
};

function crop(url: string, aspectRatio: number) {
  // we return a Promise that gets resolved with our canvas element
  return new Promise((resolve) => {
    // this image will hold our source image data
    const inputImage = new Image();

    // we want to wait for our image to load
    inputImage.onload = () => {
      // let's store the width and height of our image
      const inputWidth = inputImage.naturalWidth;
      const inputHeight = inputImage.naturalHeight;

      // get the aspect ratio of the input image
      const inputImageAspectRatio = inputWidth / inputHeight;

      // if it's bigger than our target aspect ratio
      let outputWidth = inputWidth;
      let outputHeight = inputHeight;
      if (inputImageAspectRatio > aspectRatio) {
        outputWidth = inputHeight * aspectRatio;
      } else if (inputImageAspectRatio < aspectRatio) {
        outputHeight = inputWidth / aspectRatio;
      }

      // calculate the position to draw the image at
      const outputX = (outputWidth - inputWidth) * 0.5;
      const outputY = (outputHeight - inputHeight) * 0.5;

      // create a canvas that will present the output image
      const outputImage = document.createElement("canvas");

      // set it to the same size as the image
      outputImage.width = outputWidth;
      outputImage.height = outputHeight;

      // draw our image at position 0, 0 on the canvas
      const ctx = outputImage.getContext("2d");
      ctx.drawImage(inputImage, outputX, outputY);

      resolve(outputImage.toDataURL());
    };

    // start loading our image
    inputImage.src = url;
  });
}

export default FramePage;
