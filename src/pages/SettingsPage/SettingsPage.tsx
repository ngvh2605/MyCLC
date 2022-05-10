import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { cameraOutline, homeOutline, personOutline } from "ionicons/icons";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";

const SettingsPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Cài đặt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <br />
        <br />
        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">
            Cài đặt tài khoản
          </IonLabel>
        </IonItemDivider>
        <IonList lines="none" className="ion-padding">
          <IonItem
            onClick={() => {
              history.push("/my/profile/avatar");
            }}
          >
            <IonIcon icon={cameraOutline} slot="start" />
            <IonLabel>Sửa ảnh đại diện</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/profile/personal");
            }}
          >
            <IonIcon icon={personOutline} slot="start" />
            <IonLabel>Sửa thông tin cá nhân</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push({
                pathname: `/my/user/${userId}`,
                state: {
                  isEdit: true,
                },
              });
            }}
          >
            <IonIcon icon={homeOutline} slot="start" />
            <IonLabel>Sửa trang cá nhân</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
