import { Camera, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonDatetime,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { chevronBack, heart, image } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";

import { auth as firebaseAuth, firestore, storage } from "../../../firebase";
import { Events, News } from "../../../models";
import { resizeImage } from "../../../utils/helpers/helpers";

const AddEventPage: React.FC = () => {
  const locationRef = useLocation<Events>();
  const { userId } = useAuth();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const fileInputRef = useRef<HTMLInputElement>();

  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState<number>();
  const [endDate, setEndDate] = useState<number>();
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [body, setBody] = useState("");
  const [sellTicket, setSellTicket] = useState<boolean>(true);
  const [sellInApp, setSellInApp] = useState<boolean>(true);
  const [totalTicket, setTotalTicket] = useState<number>();
  const [externalLink, setExternalLink] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const [events, setEvents] = useState<Events>();

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const { handleUploadImage } = useUploadFile();

  useEffect(() => {
    if (locationRef.state) {
      const temp: Events = { ...locationRef.state };
      setEvents(temp);
      if (temp.title) setTitle(temp.title);
      if (temp.startDate) setStartDate(temp.startDate);
      if (temp.endDate) setEndDate(temp.endDate);
      if (temp.location) setLocation(temp.location);
      if (temp.description) setDescription(temp.description);
      if (temp.sellTicket) setSellTicket(temp.sellTicket);
      if (temp.sellInApp) setSellInApp(temp.sellInApp);
      if (temp.totalTicket) setTotalTicket(temp.totalTicket);
      if (temp.externalLink) setExternalLink(temp.externalLink);
      if (temp.pictureUrl) setPictureUrl(temp.pictureUrl);
      setBody(decodeURI(temp.body));
      if (temp.pictureUrl) setPictureUrl(temp.pictureUrl);
    }
    console.log(locationRef.state);
  }, [locationRef]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files.length > 0) {
      const file = event.target.files.item(0);
      const pictureUrl = URL.createObjectURL(file);
      const resizeUrl = await (await resizeImage(pictureUrl, 800)).imageUrl;
      setPictureUrl(resizeUrl);
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

        const resizeUrl = await (
          await resizeImage(photo.webPath, 800)
        ).imageUrl;
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
    let uploadedUrl = "";
    if (pictureUrl) uploadedUrl = await handleUploadImage(pictureUrl, "events");
    firestore
      .collection("events")
      .add({
        author: userId,
        createDate: moment().valueOf(),
        title,
        startDate,
        endDate,
        location,
        description,
        body: encodeURI(body),
        sellTicket,
        sellInApp,
        totalTicket,
        externalLink,
        pictureUrl: uploadedUrl,
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        //setAlertHeader("Chúc mừng!");
        //setAlertMessage("Bài viết của bạn đã được đăng tải thành công");
        //setShowAlert(true);
        history.replace("/my/manage");
      });
  };

  const handleEdit = async () => {
    setStatus({ loading: true, error: false });
    let uploadedUrl = "";
    if (pictureUrl && pictureUrl != events.pictureUrl) {
      uploadedUrl = await handleUploadImage(pictureUrl, "events");
      if (events.pictureUrl) storage.refFromURL(events.pictureUrl).delete();
    }
    firestore
      .collection("events")
      .doc(events.id)
      .update({
        title,
        startDate,
        endDate,
        location,
        description,
        body: encodeURI(body),
        sellTicket,
        sellInApp,
        totalTicket,
        externalLink,
        pictureUrl:
          pictureUrl && pictureUrl != events.pictureUrl
            ? uploadedUrl
            : events.pictureUrl
            ? events.pictureUrl
            : "",
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        //history.goBack();
        history.replace("/my/manage");
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/manage" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              disabled={body.length < 50}
              onClick={() => {
                if (events) handleEdit();
                else handlePost();
              }}
            >
              <b>Đăng</b>
            </IonButton>
          </IonButtons>
          <IonTitle>{events ? "Sửa sự kiện" : "Tạo sự kiện"}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">
              Tên sự kiện <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="text"
              maxlength={80}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value)}
              placeholder="Tối đa 80 chữ cái"
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Ngày và giờ bắt đầu <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY lúc HH:mm"
              minuteValues="0,15,30,45"
              min={moment().toISOString()}
              cancelText="Huỷ"
              doneText="Xác nhận"
              value={startDate ? moment(startDate).toISOString() : ""}
              onIonChange={(e) =>
                setStartDate(moment(e.detail.value).valueOf())
              }
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Ngày và giờ kết thúc <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY lúc HH:mm"
              minuteValues="0,05,10,15,20,25,30,35,40,45,50,55"
              min={
                startDate > 0
                  ? moment(startDate).toISOString()
                  : moment().toISOString()
              }
              cancelText="Huỷ"
              doneText="Xác nhận"
              value={endDate ? moment(endDate).toISOString() : ""}
              onIonChange={(e) => setEndDate(moment(e.detail.value).valueOf())}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Địa điểm tổ chức
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="text"
              maxlength={140}
              placeholder="Tối đa 140 chữ cái"
              value={location}
              onIonChange={(e) => setLocation(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Mô tả ngắn</IonLabel>
            <IonInput
              type="text"
              maxlength={140}
              placeholder={"Không bắt buộc, tối đa 140 chữ cái"}
              value={description}
              onIonChange={(e) => setDescription(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Mô tả chi tiết <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonTextarea
              placeholder={"Tối thiểu 50 chữ cái"}
              autoGrow
              cols={5}
              value={body}
              onIonChange={(e) => setBody(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              Sự kiện có cho đăng ký không?{" "}
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonSelect
              interface="popover"
              onIonChange={(e) => {
                if (e.detail.value === "Yes") setSellTicket(true);
                else setSellTicket(false);
              }}
              value={sellTicket ? "Yes" : "No"}
            >
              <IonSelectOption value="Yes">Có</IonSelectOption>
              <IonSelectOption value="No">Không</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={!sellTicket}>
            <IonLabel position="floating">
              Cách đăng ký tham gia sự kiện{" "}
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonSelect
              interface="action-sheet"
              onIonChange={(e) => {
                if (e.detail.value === "Yes") setSellInApp(true);
                else setSellInApp(false);
              }}
              value={sellInApp ? "Yes" : "No"}
            >
              <IonSelectOption value="Yes">
                Qua ứng dụng MyCLC 💙
              </IonSelectOption>
              <IonSelectOption value="No">
                Qua liên kết bên ngoài
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={!sellTicket || (sellTicket && !sellInApp)}>
            <IonLabel position="floating">
              Tổng số lượng đăng ký tối đa{" "}
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="number"
              placeholder={"Chỉ nhập chữ số. Tối thiểu 10 người"}
              value={totalTicket}
              onIonChange={(e) => setTotalTicket(parseInt(e.detail.value))}
            />
          </IonItem>
          <IonItem hidden={!sellTicket || (sellTicket && sellInApp)}>
            <IonLabel position="floating">
              Liên kết đăng ký <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="url"
              placeholder="Ví dụ: https://myclcproject.web.app"
              value={externalLink}
              onIonChange={(e) => setExternalLink(e.detail.value)}
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
        <br />
        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            Nên chọn ảnh bìa tỷ lệ khung hình 16:9 hoặc đã được crop sẵn
          </IonLabel>
        </IonChip>
        <IonCard hidden={!pictureUrl}>
          <IonImg
            src={pictureUrl}
            style={{
              width: window.screen.width - 64,
              height: ((window.screen.width - 64) * 9) / 16,
              margin: 0,
              objectFit: "cover",
            }}
            onClick={handlePictureClick}
          />
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
              <IonText>
                {pictureUrl ? "Đổi ảnh bìa " : "Thêm ảnh bìa "}
                <span style={{ color: "red" }}>{" *"}</span>
              </IonText>
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default AddEventPage;
