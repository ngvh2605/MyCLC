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
import { database } from "../../firebase";
import CertificateCard from "./CertificateCard";
import CertificateItem from "./CertificateItem";
import "./CertificatePage.scss";
interface CertiRaw {
  email: string;
  url: string;
}

interface CertiData {
  name: string;
  image: string;
}

export interface Certificate {
  name: string;
  url: string;
  image: string;
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

  const [isLoading, setIsLoading] = useState(false);
  const [presentToast] = useIonToast();

  useEffect(() => {
    const fetchCerti = async () => {
      try {
        const temp: Certificate[] = [];
        const email = userEmail
          .replace(/[^a-zA-Z0-9 ]/g, "")
          .replace(/\s/g, "")
          .toLowerCase();
        const snapshot = await database
          .ref()
          .child("certi")
          .child(email)
          .once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          for (var prop in data) {
            // if (data.hasOwnProperty(prop)) {
            //   temp.push(data[prop]);
            // }

            const propSnapshot = await database
              .ref()
              .child("certiDatabase")
              .child(prop)
              .once("value");

            if (propSnapshot.exists()) {
              const certiData: CertiData = propSnapshot.val();

              temp.push({
                name: certiData.name,
                url: data[prop],
                image: certiData.image,
              });
            }
          }
        }
        setCertificate(temp);
      } catch (error) {
        console.log(error);
      }
    };

    fetchCerti();
  }, [userEmail]);

  const addBulkCerti = async () => {
    setIsLoading(true);
    try {
      const data: CertiRaw[] = formatCsv(addCertiText);
      const certi = addCertiName
        .replace(/[^a-zA-Z0-9 ]/g, "")
        .replace(/\s/g, "")
        .toLowerCase();

      if (data && data.length > 0) {
        //add certi infor
        let image = "";
        if (imageUrl) {
          image = await handleUploadImage(
            imageUrl,
            "certiDatabase",
            `${addCertiName}.png`
          );
        }
        database.ref().child("certiDatabase").child(certi).update({
          name: "In2CLC 2022",
          image: image,
          timestamp: moment().valueOf(),
        });

        //add personal certi
        data.forEach((item) => {
          const email = item.email
            .replace(/[^a-zA-Z0-9 ]/g, "")
            .replace(/\s/g, "")
            .toLowerCase();
          database.ref().child("certi").child(email).child(certi).set(item.url);
        });
      }

      presentToast({
        message: "Đã thêm certificate thành công!",
        color: "success",
        duration: 3000,
      });
      setShowAddModal(false);
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

        <RefresherItem handleRefresh={() => {}} />

        {certificate && certificate.length > 0 ? (
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
                  <b>Đăng</b>
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
                <IonLabel position="stacked">Certificate Code</IonLabel>
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
              <IonText>{imageUrl ? "Đổi ảnh khác" : "Thêm hình ảnh"}</IonText>
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
