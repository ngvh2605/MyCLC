import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { home, homeOutline, logoFacebook } from "ionicons/icons";
import jimp from "jimp";
import mergeImages from "merge-images";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";
import { database } from "../../firebase";
import useUploadFile from "./../../common/useUploadFile";

const FramePage: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { userId } = useAuth();
  const [imgUrl, setImgUrl] = useState("");
  const [mergeUrl, setMergeUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const { handleUploadImage } = useUploadFile(userId);
  const [presentToast] = useIonToast();

  useEffect(() => {
    if (!!imgUrl) {
      setLoading(true);
      crop(imgUrl, 1).then((cropImg: string) => {
        resizeToFrame(cropImg).then((resizeImg: string) => {
          mergeImages([resizeImg, "/assets/image/FacebookFrame.png"], {
            width: 960,
            height: 960,
          }).then((b64: string) => {
            setMergeUrl(b64);
            setLoading(false);
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
              location.pathname.includes("/my/frame") ? (
                <IonBackButton text="" defaultHref="/my/settings" />
              ) : (
                <IonMenuButton />
              )
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
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <IonButton
            expand="block"
            color={mergeUrl ? "medium" : "primary"}
            onClick={() => {
              handlePictureClick();
            }}
          >
            {mergeUrl ? "Chọn ảnh khác" : "Chọn ảnh"}
          </IonButton>

          <br />
          <br />
          {mergeUrl && (
            <>
              <IonImg src={mergeUrl} />

              <br />
              <IonButton
                expand="block"
                color="primary"
                onClick={async () => {
                  setLoading(true);
                  if (userId) {
                    const uploadedUrl = await handleUploadImage(
                      mergeUrl,
                      "avatar"
                    );
                    const userData = database.ref();
                    await userData
                      .child("users")
                      .child(userId)
                      .child("verify")
                      .update({
                        hasAvatar: true,
                      });
                    await userData
                      .child("users")
                      .child(userId)
                      .child("personal")
                      .update({
                        avatar: uploadedUrl,
                      })
                      .then(() => {
                        setLoading(false);
                        presentToast({
                          message:
                            "Ảnh đại diện của bạn đã được cập nhật thành công",
                          color: "success",
                          duration: 3000,
                        });
                        history.push(`/my/home`);
                        window.open(uploadedUrl, "_blank").focus();
                      });
                  } else {
                    const uploadedUrl = await handleUploadImage(
                      mergeUrl,
                      "frame"
                    );
                    setLoading(false);
                    presentToast({
                      message: "Hãy tải ảnh về và đổi ảnh đại diện Facebook",
                      color: "success",
                      duration: 3000,
                    });
                    history.push(`/index`);
                    window.open(uploadedUrl, "_blank").focus();
                  }
                }}
              >
                <IonIcon icon={logoFacebook} slot="start" />
                Đặt làm ảnh đại diện
              </IonButton>

              <br />
              <IonChip
                color="primary"
                style={{ height: "max-content", marginBottom: 10 }}
              >
                <IonLabel text-wrap className="ion-padding">
                  Sau khi tải ảnh xuống, bạn có thể vào Facebook và tải ảnh lên
                  để làm ảnh đại diện
                </IonLabel>
              </IonChip>
            </>
          )}
        </div>

        <IonLoading isOpen={loading} />
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
