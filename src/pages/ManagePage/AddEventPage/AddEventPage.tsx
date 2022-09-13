import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
  IonChip,
  IonContent,
  IonDatetime,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { image } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { firestore, storage } from "../../../firebase";
import { Events } from "../../../models";
import { resizeImage } from "../../../utils/helpers/helpers";

const AddEventPage: React.FC = () => {
  const { t } = useTranslation();
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
  const [sellTicket, setSellTicket] = useState<boolean>();
  const [sellInApp, setSellInApp] = useState<boolean>();
  const [totalTicket, setTotalTicket] = useState<number>();
  const [externalLink, setExternalLink] = useState("");
  const [pictureUrl, setPictureUrl] = useState("");

  const [events, setEvents] = useState<Events>();

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
        sellTicket: !!sellTicket,
        sellInApp: !!sellInApp,
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
    if (pictureUrl && pictureUrl !== events.pictureUrl) {
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
        sellTicket: !!sellTicket,
        sellInApp: !!sellInApp,
        totalTicket: totalTicket ? totalTicket : 0,
        externalLink,
        pictureUrl:
          pictureUrl && pictureUrl !== events.pictureUrl
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
            <IonBackButton text={t("Cancel")} defaultHref="/my/manage" />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton
              disabled={
                !title ||
                !startDate ||
                !endDate ||
                !location ||
                !pictureUrl ||
                body.length < 50
              }
              onClick={() => {
                if (events) handleEdit();
                else handlePost();
              }}
            >
              <b>{t("Post")}</b>
            </IonButton>
          </IonButtons>
          <IonTitle>{events ? t("Edit event") : t("Create event")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonButton
          hidden
          onClick={() => {
            console.log(sellTicket);
          }}
        >
          Debug
        </IonButton>
        <IonList lines="inset">
          <IonListHeader>{t("Event cover")}</IonListHeader>
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
            color="primary"
            onClick={() => {
              handlePictureClick();
            }}
          >
            <IonIcon icon={image} slot="start" />
            <IonText>{pictureUrl ? t("Change image") : t("Add image")}</IonText>
          </IonButton>
          <IonCard hidden={!pictureUrl}>
            <IonImg
              src={pictureUrl}
              style={{
                width: window.screen.width - 32,
                height: ((window.screen.width - 32) * 9) / 16,
                margin: 0,
                objectFit: "cover",
              }}
              onClick={handlePictureClick}
            />
          </IonCard>
          <IonChip
            color="primary"
            style={{ height: "max-content", marginTop: 10 }}
            className="ion-margin"
          >
            <IonLabel text-wrap className="ion-padding">
              {t(
                "You should choose a 16:9 aspect ratio or pre-cropped cover photo"
              )}
            </IonLabel>
          </IonChip>

          <IonListHeader>{t("Event details")}</IonListHeader>
          <IonItem>
            <IonLabel position="stacked">
              {t("Event name")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="text"
              maxlength={80}
              value={title}
              onIonChange={(e) => setTitle(e.detail.value)}
              placeholder={t("Maximum 80 characters")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              {t("Start date and time")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY - HH:mm"
              minuteValues="0,05,10,15,20,25,30,35,40,45,50,55"
              min={moment().toISOString()}
              cancelText={t("Cancel")}
              doneText={t("Done")}
              value={startDate ? moment(startDate).toISOString() : ""}
              onIonChange={(e) =>
                setStartDate(moment(e.detail.value).valueOf())
              }
              placeholder={t("Please select")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              {t("End date and time")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY - HH:mm"
              minuteValues="0,05,10,15,20,25,30,35,40,45,50,55"
              min={
                startDate > 0
                  ? moment(startDate).toISOString()
                  : moment().toISOString()
              }
              cancelText={t("Cancel")}
              doneText={t("Done")}
              value={endDate ? moment(endDate).toISOString() : ""}
              onIonChange={(e) => setEndDate(moment(e.detail.value).valueOf())}
              placeholder={t("Please select")}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              {t("Event location")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="text"
              maxlength={160}
              placeholder={t("Maximum 160 characters")}
              value={location}
              onIonChange={(e) => setLocation(e.detail.value)}
            />
          </IonItem>

          <br />
          <IonListHeader>{t("Description")}</IonListHeader>
          <IonItem>
            <IonLabel position="stacked">{t("Short description")}</IonLabel>
            <IonInput
              type="text"
              maxlength={140}
              placeholder={t("Maximum 160 characters")}
              value={description}
              onIonChange={(e) => setDescription(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">
              {t("Detail description")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonTextarea
              placeholder={t("Minimum 50 characters")}
              autoGrow
              cols={5}
              value={body}
              onIonChange={(e) => setBody(e.detail.value)}
            />
          </IonItem>

          <br />
          <IonListHeader>{t("Registration")}</IonListHeader>
          <IonItem>
            <IonLabel position="stacked">
              {t("Is the event open to registration?")}{" "}
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonSelect
              interface="popover"
              onIonChange={(e) => {
                if (e.detail.value === "Yes") {
                  setSellTicket(true);
                  setSellInApp(true);
                } else setSellTicket(false);
              }}
              value={!!sellTicket ? "Yes" : "No"}
            >
              <IonSelectOption value="Yes">{t("Yes")}</IonSelectOption>
              <IonSelectOption value="No">{t("No")}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={!sellTicket}>
            <IonLabel position="stacked">
              {t("How to register for the event?")}{" "}
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
                {t("Register via MyCLC")}
              </IonSelectOption>
              <IonSelectOption value="No">
                {t("Register via external link")}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={!sellTicket || (sellTicket && !sellInApp)}>
            <IonLabel position="stacked">
              {t("Maximum number of registrations")}{" "}
              <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="number"
              placeholder={t("Enter number only. Minimum 10")}
              value={totalTicket}
              onIonChange={(e) => setTotalTicket(parseInt(e.detail.value))}
            />
          </IonItem>
          <IonItem hidden={!sellTicket || (sellTicket && sellInApp)}>
            <IonLabel position="stacked">
              {t("Registration link")} <span style={{ color: "red" }}>*</span>
            </IonLabel>
            <IonInput
              type="url"
              placeholder="https://myclcproject.web.app"
              value={externalLink}
              onIonChange={(e) => setExternalLink(e.detail.value)}
            />
          </IonItem>
        </IonList>
        <br />
        <br />
        <IonLoading isOpen={status.loading} />
      </IonContent>
    </IonPage>
  );
};

export default AddEventPage;
