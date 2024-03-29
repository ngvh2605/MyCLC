import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonListHeader,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { camera, homeOutline, logoFacebook } from "ionicons/icons";
import { default as Jimp, default as jimp } from "jimp";
import mergeImages from "merge-images";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";
import { database } from "../../firebase";
import useUploadFile from "./../../common/useUploadFile";

interface Frame {
  name: string;
  url: string;
  date: string;
}

const FramePage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const { userId } = useAuth();
  const contentRef = useRef<any>();
  const fileInputRef = useRef<HTMLInputElement>();

  const [frameList, setFrameList] = useState<Frame[]>();
  const [chosenFrame, setChosenFrame] = useState<Frame>();
  const [imgUrl, setImgUrl] = useState("");
  const [mergeUrl, setMergeUrl] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const { handleUploadImage } = useUploadFile(userId);
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (uploadUrl) {
      presentAlert({
        header: t("Done"),
        message: t(
          "Please download the photo and set it as your Facebook avatar!"
        ),
        buttons: [
          {
            text: t("Download"),
            handler: () => {
              window.open(uploadUrl, "_blank");
              if (userId) history.push("/my/home");
              else history.push("/index");
            },
          },
        ],
        backdropDismiss: false,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadUrl]);

  useEffect(() => {
    const processMerge = async () => {
      if (imgUrl && chosenFrame) {
        setLoading(true);

        try {
          crop(imgUrl, 1).then(async (cropImg: string) => {
            const cropResize = await resizeToFrame(cropImg, "b64");
            const frameResize = await resizeToFrame(chosenFrame.url, "png");

            mergeImages([cropResize, frameResize], {
              width: 960,
              height: 960,
              quality: 1,
              crossOrigin: "Anonymous",
            }).then((b64: string) => {
              setMergeUrl(b64);
              setLoading(false);
              scrollToBottomOnInit();
            });
          });
        } catch (error) {
          presentToast({ message: error, color: "danger", duration: 3000 });
        }
      }
    };

    processMerge();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgUrl, chosenFrame]);

  useEffect(() => {
    const readFrameDatabase = async () => {
      setLoading(true);
      const data = (
        await database.ref().child("public").child("frameDatabase").get()
      ).val();
      let temp: Frame[] = [];
      if (data) {
        for (var prop in data) {
          if (data.hasOwnProperty(prop)) {
            temp.push(data[prop]);
          }
        }
      }
      temp = temp.sort((a, b) => {
        return (
          moment(b.date, "DD/MM/YYYY").valueOf() -
          moment(a.date, "DD/MM/YYYY").valueOf()
        );
      });
      setChosenFrame(temp[0]);
      setFrameList(temp);
      setLoading(false);
    };

    readFrameDatabase();
  }, []);

  const resizeToFrame = async (data: string, type: "b64" | "png") => {
    let image: Jimp;
    if (type === "b64")
      image = await jimp.read(
        Buffer.from(data.replace(/^data:image\/png;base64,/, ""), "base64")
      );
    else image = await jimp.read(data);

    if (image.getWidth() < image.getHeight()) {
      image.resize(960, jimp.AUTO);
    } else image.resize(jimp.AUTO, 960);

    if (type === "b64") return image.getBase64Async(jimp.MIME_JPEG);
    else return image.getBase64Async(jimp.MIME_PNG);
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);

      setImgUrl(pictureUrl);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: 960,
        });

        setImgUrl(photo.webPath);
      } catch (error) {
        console.log("Camera error:", error);
        presentToast({ message: error, color: "danger", duration: 3000 });
      }
    } else {
      fileInputRef.current.click();
    }
  };

  function scrollToBottomOnInit() {
    setTimeout(() => {
      contentRef.current.scrollToBottom(1000);
    }, 100);
  }

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
          <IonTitle>{t("Add avatar frame")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef}>
        <IonListHeader style={{ marginBottom: 8 }} color="black">
          {t("Choose frame")}
        </IonListHeader>
        {frameList && chosenFrame && frameList.length > 0 && (
          <IonSlides
            options={{
              slidesPerView: window.screen.width / 120,
              freeMode: true,
            }}
          >
            {frameList.map((frame, index) => (
              <IonSlide
                key={index}
                onClick={() => {
                  setChosenFrame(frame);
                }}
              >
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonAvatar
                        style={
                          frame.url === chosenFrame.url
                            ? {
                                height: 80,
                                width: 80,
                                margin: "0 auto",
                                boxShadow:
                                  "0px 0px 0px 3px var(--ion-color-light), 0px 0px 0px 6px var(--ion-color-primary)",
                              }
                            : { height: 80, width: 80, margin: "0 auto" }
                        }
                      >
                        <IonImg src={frame.url} />
                      </IonAvatar>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol className="ion-no-padding">
                      <IonLabel
                        text-wrap
                        color={frame.url === chosenFrame.url ? "primary" : ""}
                        style={
                          frame.url === chosenFrame.url
                            ? {
                                fontWeight: "bold",
                              }
                            : {}
                        }
                      >
                        {frame.name}
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonSlide>
            ))}
          </IonSlides>
        )}
        <div
          style={{ maxWidth: 680, margin: "0 auto" }}
          className="ion-padding-horizontal"
        >
          <input
            type="file"
            id="upload"
            accept="image/*"
            hidden
            multiple={false}
            ref={fileInputRef}
            onChange={handleFileChange}
          />
          <IonButton
            expand="block"
            color={mergeUrl ? "medium" : "primary"}
            onClick={() => {
              handlePictureClick();
            }}
          >
            <IonIcon icon={camera} slot="start" />
            {mergeUrl ? t("Change image") : t("Choose image")}
          </IonButton>

          <br />

          {mergeUrl ? (
            <>
              <br />
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
                        setUploadUrl(uploadedUrl);
                      });
                  } else {
                    const uploadedUrl = await handleUploadImage(
                      mergeUrl,
                      "frame"
                    );
                    setLoading(false);
                    setUploadUrl(uploadedUrl);
                  }
                }}
              >
                <IonIcon icon={logoFacebook} slot="start" />
                {t("Set as avatar")}
              </IonButton>

              <br />
              <IonChip
                color="primary"
                style={{ height: "max-content", marginBottom: 10 }}
              >
                <IonLabel text-wrap className="ion-padding">
                  {t(
                    "After downloading the photo, you can go to Facebook and upload it as your avatar"
                  )}
                </IonLabel>
              </IonChip>
            </>
          ) : (
            <>
              <IonChip
                color="primary"
                style={{ height: "max-content", marginBottom: 10 }}
              >
                <IonLabel text-wrap className="ion-padding">
                  {t("You should choose a square or pre-cropped avatar")}
                </IonLabel>
              </IonChip>
              <br />
              <br />
              {chosenFrame && <IonImg src={chosenFrame.url} />}
            </>
          )}
        </div>
        <br />
        <br />
        <br />
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
