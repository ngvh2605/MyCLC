/* eslint-disable react-hooks/exhaustive-deps */
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
  useIonAlert,
} from "@ionic/react";
import { image } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useCheckUserInfo from "../../../common/useCheckUserInfo";
import useUploadFile from "../../../common/useUploadFile";
import { database } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";

const AvatarPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { avatarUrl: userAvatarUrl } = useCheckUserInfo(userId);
  const history = useHistory();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState({ loading: false, error: false });
  const fileInputRef = useRef<HTMLInputElement>();

  const [isDisabled, setIsDisabled] = useState(true);
  const [presentAlert] = useIonAlert();

  const { handleUploadImage } = useUploadFile(userId);

  useEffect(
    () => () => {
      if (avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    },
    [avatarUrl]
  );

  useEffect(() => {
    if (userAvatarUrl) setAvatarUrl(userAvatarUrl);
  }, [userAvatarUrl]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);

      setIsDisabled(false);

      const resizeUrl = await (await resizeImage(pictureUrl, 400)).imageUrl;
      setAvatarUrl(resizeUrl);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: 600,
        });

        const resizeUrl = await (
          await resizeImage(photo.webPath, 400)
        ).imageUrl;
        setAvatarUrl(resizeUrl);

        setIsDisabled(false);
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current.click();
    }
  };

  const handleUploadFile = async (url: string) => {
    setStatus({ loading: true, error: false });
    const uploadedUrl = await handleUploadImage(url, "avatar");
    const userData = database.ref();
    userData.child("users").child(userId).child("verify").update({
      hasAvatar: true,
    });
    userData
      .child("users")
      .child(userId)
      .child("personal")
      .update({
        avatar: uploadedUrl,
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        presentAlert({
          header: t("Done"),
          message: t("Your avatar has been successfully updated"),
          buttons: [{ text: "OK" }],
          onDidDismiss: () => {
            history.push("/my/profile");
          },
        });
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("Cancel")} defaultHref="/my/profile" />
          </IonButtons>
          <IonTitle>{t("Avatar")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonAvatar
          className="ion-margin"
          style={{
            width: window.screen.height / 3,
            height: window.screen.height / 3,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        >
          <IonImg
            src={avatarUrl || "/assets/image/placeholder.png"}
            onClick={handlePictureClick}
          />
        </IonAvatar>
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
          className="ion-margin"
          expand="block"
          fill="clear"
          onClick={() => {
            handlePictureClick();
          }}
        >
          <IonIcon icon={image} slot="start" />
          {avatarUrl && avatarUrl !== "/assets/image/placeholder.png"
            ? t("Change image")
            : t("Add image")}
        </IonButton>
        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            {t("You should choose a square or pre-cropped avatar")}
          </IonLabel>
        </IonChip>
        <br />
        <IonLoading isOpen={status.loading} />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              className="ion-margin"
              expand="block"
              shape="round"
              onClick={() => {
                handleUploadFile(avatarUrl);
              }}
              disabled={isDisabled}
            >
              {t("Save")}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AvatarPage;
