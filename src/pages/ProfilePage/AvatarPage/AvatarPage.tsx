import { Camera, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonLabel,
  IonLoading,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { database } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";

const AvatarPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [avatarUrl, setAvatarUrl] = useState("");
  const [status, setStatus] = useState({ loading: false, error: false });
  const fileInputRef = useRef<HTMLInputElement>();

  const [isDisabled, setIsDisabled] = useState(true);
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { handleUploadImage } = useUploadFile(userId);

  useEffect(() => {
    readData();
  }, []);

  useEffect(
    () => () => {
      if (avatarUrl.startsWith("blob:")) {
        URL.revokeObjectURL(avatarUrl);
      }
    },
    [avatarUrl]
  );

  const readData = () => {
    const userData = database.ref().child("users").child(userId);

    userData.child("personal").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.avatar) setAvatarUrl(data.avatar);
        else setAvatarUrl("/assets/image/placeholder.png");
      } else {
        console.log("No data available");
      }
    });
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);

      setIsDisabled(false);

      const resizeUrl = await resizeImage(pictureUrl, 400);
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

        const resizeUrl = await resizeImage(photo.webPath, 400);
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
    userData
      .child("users")
      .child(userId)
      .child("personal")
      .update({
        avatar: uploadedUrl,
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        setAlertHeader("Chúc mừng!");
        setAlertMessage("Ảnh đại diện của bạn đã được cập nhật thành công");
        setShowAlert(true);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/profile" />
          </IonButtons>
          <IonTitle>Sửa ảnh đại diện</IonTitle>
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
          <IonSkeletonText animated hidden={avatarUrl ? true : false} />
          <img
            hidden={avatarUrl ? false : true}
            src={avatarUrl || "/assets/image/placeholder.png"}
            alt=""
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
        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            Ấn vào khung ảnh để thay đổi. Nên chọn ảnh đại diện hình vuông hoặc
            đã được crop sẵn
          </IonLabel>
        </IonChip>
        <br />
        <IonLoading isOpen={status.loading} />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            history.replace("/my/profile");
          }}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
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
              Áp dụng
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AvatarPage;
