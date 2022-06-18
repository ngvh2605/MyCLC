import {
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  cameraOutline,
  chatbubbleOutline,
  homeOutline,
  imageOutline,
  logoFacebook,
  personOutline,
  sendOutline,
} from "ionicons/icons";
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
        <IonListHeader>Cài đặt tài khoản</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            onClick={() => {
              history.push("/my/profile/avatar");
            }}
          >
            <IonIcon icon={cameraOutline} slot="start" color="primary" />
            <IonLabel>Sửa ảnh đại diện</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/profile/personal");
            }}
          >
            <IonIcon icon={personOutline} slot="start" color="primary" />
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
            <IonIcon icon={homeOutline} slot="start" color="primary" />
            <IonLabel>Sửa trang cá nhân</IonLabel>
          </IonItem>
        </IonList>

        <hr />
        <IonListHeader>Tiện ích</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            onClick={() => {
              history.push("/my/frame");
            }}
          >
            <IonIcon icon={imageOutline} slot="start" color="primary" />
            <IonLabel>Thêm khung ảnh đại diện</IonLabel>
          </IonItem>
        </IonList>

        <hr />
        <IonListHeader>Trợ giúp & hỗ trợ</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            href="https://m.me/CLCMultimedia"
            target="_blank"
            detail={false}
          >
            <IonIcon icon={sendOutline} slot="start" color="primary" />
            <IonLabel>Liên hệ</IonLabel>
            <IonIcon
              icon={logoFacebook}
              color="medium"
              size="small"
              slot="end"
              style={{ marginRight: 16 }}
            />
          </IonItem>

          <IonItem
            href="https://www.facebook.com/groups/ChuyenLaoCai"
            target="_blank"
            detail={false}
          >
            <IonIcon icon={chatbubbleOutline} color="primary" slot="start" />
            <IonLabel>Thảo luận</IonLabel>
            <IonIcon
              icon={logoFacebook}
              color="medium"
              size="small"
              slot="end"
              style={{ marginRight: 16 }}
            />
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default SettingsPage;
