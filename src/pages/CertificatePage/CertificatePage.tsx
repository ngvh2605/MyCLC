import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add, close } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { database } from "../../firebase";
import { getInfoByUserId } from "../HomePage/services";
import CertificateCard from "./CertificateCard";

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
  const { userEmail } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);

  const [certificate, setCertificate] = useState<Certificate[]>();

  const [addCertiName, setAddCertiName] = useState("");
  const [addCertiText, setAddCertiText] = useState("");

  useEffect(() => {
    const fetchCerti = async () => {
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
    };

    try {
      fetchCerti();
    } catch (error) {}
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Certificate</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            {certificate &&
              certificate.length > 0 &&
              certificate.map((certi, index) => (
                <IonCol size="6" key={index}>
                  <CertificateCard certi={certi} />
                </IonCol>
              ))}
          </IonRow>
        </IonGrid>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowAddModal(true)}>
            <IonIcon icon={add} />
          </IonFabButton>
        </IonFab>

        <IonModal
          isOpen={showAddModal}
          onDidDismiss={() => setShowAddModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonButton onClick={() => setShowAddModal(false)}>
                  <IonIcon icon={close} color="primary" />
                </IonButton>
              </IonButtons>
              <IonTitle>Thêm Certificate</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent className="ion-padding">
            <IonButton
              onClick={() => {
                console.log(addCertiText);
                try {
                  const data: CertiRaw[] = JSON.parse(addCertiText);
                  const certi = addCertiName
                    .replace(/[^a-zA-Z0-9 ]/g, "")
                    .replace(/\s/g, "")
                    .toLowerCase();

                  if (data && data.length > 0) {
                    //add certi infor
                    database.ref().child("certiDatabase").child(certi).update({
                      name: "In2CLC 2022",
                      image:
                        "https://scontent.fcbr1-1.fna.fbcdn.net/v/t39.30808-6/277738715_2137464263097110_7884089031801519933_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=e3f864&_nc_ohc=52GWwWZV9U8AX_DomdA&_nc_ht=scontent.fcbr1-1.fna&oh=00_AT_lP152CAKi_RVP_M5o_hL8TNXbeYwuUFZCvgUQOYflPQ&oe=6299D496",
                    });

                    //add personal certi

                    data.forEach((item) => {
                      const email = item.email
                        .replace(/[^a-zA-Z0-9 ]/g, "")
                        .replace(/\s/g, "")
                        .toLowerCase();
                      database
                        .ref()
                        .child("certi")
                        .child(email)
                        .child(certi)
                        .set(item.url);
                    });
                  }
                } catch (err) {
                  console.log(err);
                }
              }}
            >
              Debug
            </IonButton>
            <IonInput
              placeholder="Nhập tên certi (viết thường, không dấu, không khoảng trống)"
              onIonChange={(e) => {
                setAddCertiName(e.detail.value);
              }}
            />
            <IonTextarea
              placeholder="Nhập json"
              autoGrow={true}
              onIonChange={(e) => {
                setAddCertiText(e.detail.value);
              }}
            />
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CertificatePage;
