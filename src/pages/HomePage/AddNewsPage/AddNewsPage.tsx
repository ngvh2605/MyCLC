import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
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
import { image } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { auth, database, firestore, storage } from "../../../firebase";
import { News } from "../../../models";
import { resizeImage } from "../../../utils/helpers/helpers";
const { GoogleSpreadsheet } = require("google-spreadsheet");

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
      .then(async () => {
        //send news to discord
        try {
          var request = new XMLHttpRequest();
          request.open(
            "POST",
            "https://discord.com/api/webhooks/983977150145261590/B4YzLh3pu_lSG8ltxWswzP1YuAGiZIhGDftJxBA4Lo6Cg2Yxqot1FNoJL5bJE01JPQJh"
          );

          const params = {
            content: null,
            embeds: [
              {
                title: title,
                description: body,
                color: null,
                author: {
                  name: auth.currentUser.displayName,
                  icon_url: auth.currentUser.photoURL,
                },
                timestamp: moment().format(),
                image: {
                  url: uploadedUrl,
                },
              },
            ],
            attachments: [],
          };

          request.setRequestHeader("Content-type", "application/json");
          request.send(JSON.stringify(params));
        } catch (error) {
          console.log("Send news to discord error", error);
        }

        //send news to facebook group
        try {
          const doc = new GoogleSpreadsheet(
            "1OfgDg7Ahk_q3tw0wZYjQP12KMCxOT5XsaleHgc8wjP8"
          );
          await doc.useServiceAccountAuth({
            type: "service_account",
            project_id: "myclcproject",
            private_key_id: "1e78ee294ac75df46728216dbe2126939bb0baf5",
            private_key:
              "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCix7uaI7ZYZGp7\nxDJVlpFQWlQHD8R7/D1vDgx93JSnLIkbYN1QnrPlPQZBITEu/aKPwtJRhqRUNb26\nabAOWijAGz+0madRbs+3oV59mnxgvtPh18UICaJLsNaFTCketcTfhTvgH67E60h8\ngP0SJxTyyKViAR+NUoFF1EkK/nh2AZoz+H32kSKXUl0Cmx2xDBpvWY0+MT53DdOv\nRXSYksLZTFWuM6q8syIFFSP2JEq1xBHAOB2FGPkV8qmRRflNWLUXltD37imgpS7c\njPZ7435F9vsEAPKMZu/l6sRY1lT04VnSzRMZKmjSLcc7XPHVjXciUrT+qAOM5tiv\n6byhnhPVAgMBAAECggEABrv3nzDqCQOQtNw0p8U/RPvokJPHlQFQum/VvehcacpW\nKRYw2qDuLjfxzyD5dlBhXFpsmWCAxcgzKgf0TM9CK8VNtXO8xV9KKvZ7QKar4vCD\n4Wcr9vZwZ0GQyfafQm6ZctvXKATM3RzNpLpNKJ8KEcSR0MQWIVtTgMrjAZhDmId3\nqQM2C/vxXV8Pvjgli7d4ztQlpBU0COMf4HajS7pxcWD9THZaT3Ieoey5HH1zTx+t\n8nXoHirTvgz777vf4gzVHa8M9KXYx2a6VAaNSSRWl2+n0XEoOVK0MqRHyufiAWS+\nGhs6zKVItJB9L+Kk0XFVQPp8fxgL/sbijfc3benoMwKBgQDO8iqIEQYZJUzQQsIX\ncX1Okip6HzJ5JFmqukEGCK61QK9+/qlaI1C2VSl5PF/uVly8hbprbBgsdeUpkTTT\nPFbu5LbbIk5+kbQcEpr9PHPc1d2kVoLu1edfYEkc0cL3A1/TgWr5T5sQVWNtu8j/\naKOY5hgvhp7fhQOcjO7NX2yHawKBgQDJXYNqTcjD8XsA1XLvpxk+7yIdoJNh9+9Y\n31YAnJQMD20Y+ohTxqkQ4yQ8sKOfBBhNNIu7D4Thi62yKgSbIO7ii1dvqPiTwqOM\nXNk2GWTW4qpSyBGVTPFtqKHMB598GbCdWuITVijp31zccfM8FLiZS3BoBJOQK1k8\nAP1PbeDhvwKBgFx6veT2bpo4H/6FhsUBM3U0PoU6gcy/IM750usGYEShdouy9C1S\n0NPadOE3yMryjxi0Th2JPbhIqzMLL+ch9NtnHAwLZbaMGEffTKHULRbH//dbrcFb\nl7z4g1O8rXrDaERVdl+ZYntHHVrBa04wDcPbN32tlDvg7j88f88JUK+nAoGARVaN\nFQLZ2hcB+wSFAl7ww4oGnlsXxQliAqFM9QL1u71oHMzQOsDSoL0GUluky/HWCGfK\nocwzPpMhaZMsaNqLR7khj5KIniDMvl2OciGGZrRAYCcCXv3SuKbzp9UMJuiVt2l/\nJZdqmTXPvR0D27Fq62Zdu4Ov6Fn07UON9lbos/MCgYEAyhVKIa80suoV1FkrPxSb\nQ3bT8xl7F9IEKcjC96izCC+Apf37VVmcBjwG+xV3XM7d5qCkWU/YfauETFs2YV9o\nDTEpAldL5snCd0dyFhUIzACk1IyayVGbxvwvjwos3nO12r7C7qoNC+9QWI3BmOEM\nFy+I7Ea4awb/2lZXZU9VqcE=\n-----END PRIVATE KEY-----\n",
            client_email:
              "google-sheet-service-account@myclcproject.iam.gserviceaccount.com",
            client_id: "104531246062669966612",
            auth_uri: "https://accounts.google.com/o/oauth2/auth",
            token_uri: "https://oauth2.googleapis.com/token",
            auth_provider_x509_cert_url:
              "https://www.googleapis.com/oauth2/v1/certs",
            client_x509_cert_url:
              "https://www.googleapis.com/robot/v1/metadata/x509/google-sheet-service-account%40myclcproject.iam.gserviceaccount.com",
          });
          await doc.loadInfo();
          const sheet = doc.sheetsByIndex[0];
          await sheet.addRow({
            name: auth.currentUser.displayName,
            email: auth.currentUser.email,
            timestamp: moment().format(),
            title: title ? title.toUpperCase() : "",
            body: body,
            picture: uploadedUrl
              ? uploadedUrl
              : (
                  await database
                    .ref()
                    .child("public")
                    .child("newsDefault")
                    .get()
                ).val(),
          });
        } catch (error) {
          console.log("Send news to facebook error", error);
        }

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
    if (pictureUrl && pictureUrl !== news.pictureUrl) {
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
