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
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";

import { auth as firebaseAuth, firestore, storage } from "../../../firebase";
import { News } from "../../../models";
import { resizeImage } from "../../../utils/helpers/helpers";

const AddNewsPage: React.FC = () => {
  const location = useLocation<News>();
  const { userId } = useAuth();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const fileInputRef = useRef<HTMLInputElement>();
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");
  const [pictureRatio, setPictureRatio] = useState(1);

  const [news, setNews] = useState<News>();

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { handleUploadImage } = useUploadFile();

  useEffect(() => {
    if (location.state) {
      const temp: News = { ...location.state };
      setNews(temp);
      if (temp.title) setTitle(temp.title);
      setBody(decodeURI(temp.body));
      if (temp.pictureUrl) setPictureUrl(temp.pictureUrl);
    }
    console.log(location.state);
  }, [location]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      const resizeImg = await resizeImage(pictureUrl, 800);
      setPictureUrl(await resizeImg.imageUrl);
      setPictureRatio(resizeImg.imageRatio);
    }
  };

  const handlePictureClick = async () => {
    if (isPlatform("capacitor")) {
      try {
        const photo = await Camera.getPhoto({
          resultType: CameraResultType.Uri,
          source: CameraSource.Prompt,
          width: 800,
        });

        const resizeImg = await resizeImage(photo.webPath, 800);
        setPictureUrl(await resizeImg.imageUrl);
        setPictureRatio(resizeImg.imageRatio);
      } catch (error) {
        console.log("Camera error:", error);
      }
    } else {
      fileInputRef.current.click();
    }
  };

  const handlePost = async () => {
    setStatus({ loading: true, error: false });
    let uploadedUrl = "";
    if (pictureUrl) uploadedUrl = await handleUploadImage(pictureUrl, "news");
    firestore
      .collection("news")
      .add({
        title: title,
        body: encodeURI(body),
        pictureUrl: uploadedUrl,
        pictureRatio: pictureRatio,
        author: userId,
        timestamp: moment().valueOf(),
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        //setAlertHeader("Chúc mừng!");
        //setAlertMessage("Bài viết của bạn đã được đăng tải thành công");
        //setShowAlert(true);
        history.replace("/my/home");
      });
  };

  const handleEdit = async () => {
    setStatus({ loading: true, error: false });
    let uploadedUrl = "";
    if (pictureUrl && pictureUrl != news.pictureUrl) {
      uploadedUrl = await handleUploadImage(pictureUrl, "news");
      if (news.pictureUrl) storage.refFromURL(news.pictureUrl).delete();
    }
    firestore
      .collection("news")
      .doc(news.id)
      .update({
        title: title,
        body: encodeURI(body),
        pictureUrl:
          pictureUrl && pictureUrl !== news.pictureUrl
            ? uploadedUrl
            : news.pictureUrl
            ? news.pictureUrl
            : "",
        pictureRatio:
          pictureRatio !== news.pictureRatio ? pictureRatio : news.pictureRatio,
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        //history.goBack();
        history.replace("/my/home");
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/home" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              disabled={body.length < 50}
              onClick={() => {
                if (news) handleEdit();
                else handlePost();
              }}
            >
              <b>Đăng</b>
            </IonButton>
          </IonButtons>
          <IonTitle>{news ? "Sửa News" : "Tạo News"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Tiêu đề </IonLabel>
            <IonInput
              type="text"
              maxlength={50}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value)}
              placeholder="Không bắt buộc, tối đa 50 chữ cái"
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">
              Nội dung <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonTextarea
              placeholder={"Tối thiểu 50 chữ cái"}
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
            history.replace("/my/home");
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
              {pictureUrl ? "Đổi ảnh khác" : "Thêm hình ảnh"}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AddNewsPage;
