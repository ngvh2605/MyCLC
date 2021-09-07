import { Camera, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { chevronBack, image } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { auth as firebaseAuth, firestore } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";

const AddNewsPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const fileInputRef = useRef<HTMLInputElement>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { progress, url, handleUpload } = useUploadFile();

  useEffect(() => {
    if (progress === 100) {
      setStatus({ loading: false, error: false });
      setAlertHeader("Chúc mừng!");
      setAlertMessage("Ảnh đại diện của bạn đã được cập nhật thành công");
      //setShowAlert(true);
    }
  }, [progress]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      const resizeUrl = await resizeImage(pictureUrl, 1080);
      setPictureUrl(resizeUrl);
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

        const resizeUrl = await resizeImage(photo.webPath, 1080);
        setPictureUrl(resizeUrl);
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current.click();
    }
  };

  const handlePost = async () => {
    setStatus({ loading: true, error: false });
    if (pictureUrl) {
      await handleUpload(pictureUrl, "news").then(() => {
        firestore
          .collection("news")
          .add({
            title: title,
            body: body,
            pictureUrl: pictureUrl ? url : "",
            author: userId,
            timestamp: moment(moment.now()).format(),
          })
          .then(() => {
            setStatus({ loading: false, error: false });
          });
      });
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/home" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton disabled={!body} onClick={() => handlePost()}>
              <b>Đăng</b>
            </IonButton>
          </IonButtons>
          <IonTitle>Tạo News</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton
          onClick={() => {
            console.log(moment(moment.now()).format());
          }}
        >
          Clcick
        </IonButton>
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              Tiêu đề{" "}
              <i style={{ float: "right" }}>
                (Không bắt buộc, tối đa 50 chữ cái)
              </i>
            </IonLabel>
            <IonInput
              type="text"
              maxlength={50}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">
              Nội dung <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonTextarea
              autoGrow
              cols={5}
              value={body}
              onIonChange={(e) => setBody(e.detail.value)}
            />
          </IonItem>
        </IonList>

        <input
          type="file"
          id="upload"
          accept="image/*"
          hidden
          multiple={false}
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <IonCard hidden={!pictureUrl}>
          <IonImg src={pictureUrl} onClick={handlePictureClick} />
        </IonCard>

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
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              className="ion-margin"
              expand="block"
              fill="clear"
              onClick={() => {
                handlePictureClick();
              }}
            >
              <IonIcon icon={image} slot="start" />
              Thêm hình ảnh
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AddNewsPage;
