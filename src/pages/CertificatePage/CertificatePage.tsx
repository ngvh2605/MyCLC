import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import { add, close, image } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import useAddImage from "../../common/useAddImage";
import useCheckUserPermission from "../../common/useCheckUserPermission";
import useUploadFile from "../../common/useUploadFile";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { database, firestore } from "../../firebase";
import CertificateCard, { CertificateCardSkeleton } from "./CertificateCard";
import CertificateItem, { CertificateItemSkeleton } from "./CertificateItem";
import "./CertificatePage.scss";
interface CertiRaw {
  email: string;
  url: string;
}

export interface Certificate {
  name: string;
  url: string;
  image: string;
  timestamp: number;
}

const CertificatePage: React.FC = () => {
  const { t } = useTranslation();
  const { userEmail, userId } = useAuth();
  const { isAdmin } = useCheckUserPermission(userId);

  const [showAddModal, setShowAddModal] = useState(false);

  const [certificate, setCertificate] = useState<Certificate[]>();
  const [displayType, setDisplayType] = useState("grid");

  const [addCertiName, setAddCertiName] = useState("");
  const [addCertiText, setAddCertiText] = useState("");

  const fileInputRef = useRef<HTMLInputElement>();
  const { imageUrl, clearImageUrl, handleFileChange, handlePictureClick } =
    useAddImage(800, fileInputRef);
  const { handleUploadImage } = useUploadFile();

  const [isFetching, setIsFetching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    fetchCerti();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userEmail]);

  const fetchCerti = async () => {
    setIsFetching(true);
    try {
      const temp: Certificate[] = [];

      const { docs } = await firestore
        .collection("certificates")
        .where("email", "==", userEmail.replace(/\s/g, "").toLowerCase())
        .get();

      for (let i = 0; i < docs.length; i++) {
        let doc = docs[i];
        if (doc.data() && doc.data().id) {
          const certiData = (
            await database
              .ref()
              .child("certiDatabase")
              .child(doc.data().id)
              .once("value")
          ).val();
          temp.push({
            ...doc.data(),
            ...certiData,
            timestamp: parseInt(doc.data().id),
          });
        }
      }
      console.log("certificates", temp);

      setCertificate(
        temp.sort((a, b) => {
          return b.timestamp - a.timestamp;
        })
      );
    } catch (error) {
      console.log(error);
    }
    setIsFetching(false);
  };

  const addBulkCerti = async () => {
    setIsLoading(true);
    try {
      const data: CertiRaw[] = formatCsv(addCertiText);

      if (
        data &&
        data.length > 0 &&
        data.every((item) => item.email && item.url)
      ) {
        const timestamp = moment().valueOf().toString();

        //add certi infor
        let image = "";
        if (imageUrl) {
          image = await handleUploadImage(imageUrl, "certiDatabase", timestamp);
        }
        database.ref().child("certiDatabase").child(timestamp).update({
          name: addCertiName,
          image: image,
        });

        //add personal certi
        data.forEach((item) => {
          firestore.collection("certificates").add({
            email: item.email.replace(/\s/g, "").toLowerCase(),
            url: item.url.replace(/\s/g, ""),
            id: timestamp,
          });
        });

        presentToast({
          message: "Đã thêm certificate thành công!",
          color: "success",
          duration: 3000,
        });

        setShowAddModal(false);
      } else
        presentAlert({
          header: t("Error"),
          message: "Vui lòng kiểm tra lại csv",
          buttons: [{ text: "OK" }],
        });

      setIsLoading(false);
    } catch (err) {
      console.log(err);
      presentToast({ message: err, color: "danger", duration: 3000 });
      setIsLoading(false);
    }
  };

  return (
    <IonPage id="certificate-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Certificates</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <div className="ion-padding-horizontal ion-padding-top">
          <IonSegment
            value={displayType}
            onIonChange={(e) => {
              setDisplayType(e.detail.value);
            }}
            color="primary"
          >
            <IonSegmentButton value="grid">{t("Grid")}</IonSegmentButton>
            <IonSegmentButton value="list">{t("List")}</IonSegmentButton>
          </IonSegment>
        </div>

        <RefresherItem
          handleRefresh={() => {
            fetchCerti();
          }}
        />

        {isFetching ? (
          displayType === "grid" ? (
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <CertificateCardSkeleton />
                </IonCol>
                <IonCol size="6">
                  <CertificateCardSkeleton />
                </IonCol>
              </IonRow>
            </IonGrid>
          ) : (
            <>
              <CertificateItemSkeleton />
              <CertificateItemSkeleton />
              <CertificateItemSkeleton />
            </>
          )
        ) : certificate && certificate.length > 0 ? (
          displayType === "grid" ? (
            <IonGrid>
              <IonRow>
                {certificate.map((certi, index) => (
                  <IonCol size="6" key={index}>
                    <CertificateCard certi={certi} />
                  </IonCol>
                ))}
              </IonRow>
            </IonGrid>
          ) : (
            certificate.map((certi, index) => (
              <CertificateItem certi={certi} key={index} />
            ))
          )
        ) : (
          <EmptyUI />
        )}

        {isAdmin && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton onClick={() => setShowAddModal(true)}>
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>
        )}

        <IonModal
          isOpen={showAddModal}
          onDidDismiss={() => {
            setShowAddModal(false);
            setAddCertiName("");
            setAddCertiText("");
            clearImageUrl();
          }}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowAddModal(false)}>
                  <IonIcon icon={close} color="primary" />
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  disabled={!addCertiName || !addCertiText || !imageUrl}
                  onClick={() => {
                    addBulkCerti();
                  }}
                >
                  <b>{t("Post")}</b>
                </IonButton>
              </IonButtons>
              <IonTitle>Thêm Certificate</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonButton
              hidden
              onClick={() => {
                console.log("data", formatCsv(addCertiText));
              }}
            >
              Debug Button
            </IonButton>
            <br />
            <IonList>
              <IonItem>
                <IonLabel position="stacked">Tên Certificate</IonLabel>
                <IonInput
                  placeholder="Viết thường, không dấu, không cách"
                  onIonChange={(e) => {
                    setAddCertiName(e.detail.value);
                  }}
                />
              </IonItem>
              <br />
              <IonItem>
                <IonLabel position="stacked">Nhập csv</IonLabel>
                <IonTextarea
                  placeholder="email, name, url"
                  autoGrow={true}
                  onIonChange={(e) => {
                    setAddCertiText(e.detail.value);
                  }}
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
            <br />

            <IonButton
              shape="round"
              expand="full"
              className="ion-margin-horizontal"
              onClick={() => {
                handlePictureClick();
              }}
            >
              <IonIcon icon={image} slot="start" />
              <IonText>{imageUrl ? t("Change image") : t("Add image")}</IonText>
            </IonButton>

            <IonCard hidden={!imageUrl}>
              <IonImg
                src={imageUrl}
                style={{
                  width: window.screen.width - 32,
                  height: ((window.screen.width - 32) * 9) / 16,
                  margin: 0,
                  objectFit: "cover",
                }}
                onClick={handlePictureClick}
              />
            </IonCard>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={isLoading} />
      </IonContent>
    </IonPage>
  );
};

function formatCsv(csv: string) {
  var lines = csv.split("\n");

  var result = [];

  // NOTE: If your columns contain commas in their values, you'll need
  // to deal with those before doing the next step
  // (you might convert them to &&& or something, then covert them back later)
  // jsfiddle showing the issue https://jsfiddle.net/
  var headers = lines[0].split(",");

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(",");

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  //return result; //JavaScript object
  return result; //JSON
}

export default CertificatePage;
