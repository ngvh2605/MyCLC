import {
  IonBackButton,
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import i18next from "i18next";
import {
  cameraOutline,
  chatbubbleOutline,
  homeOutline,
  imageOutline,
  languageOutline,
  logoFacebook,
  personOutline,
  sendOutline,
} from "ionicons/icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const history = useHistory();
  const location = useLocation<{ isBack: boolean }>();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            {location && location.state && location.state.isBack ? (
              <IonBackButton text="" />
            ) : (
              <IonMenuButton />
            )}
          </IonButtons>
          <IonTitle>{t("Settings")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <br />
        <IonListHeader>{t("Account settings")}</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            onClick={() => {
              history.push("/my/profile/avatar");
            }}
          >
            <IonIcon icon={cameraOutline} slot="start" color="primary" />
            <IonLabel>{t("Change avatar")}</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/profile/personal");
            }}
          >
            <IonIcon icon={personOutline} slot="start" color="primary" />
            <IonLabel>{t("Edit personal information")}</IonLabel>
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
            <IonLabel>{t("Edit home page")}</IonLabel>
          </IonItem>
        </IonList>

        <hr />
        <IonListHeader>{t("Application settings")}</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem onClick={() => {}}>
            <IonIcon icon={languageOutline} slot="start" color="primary" />
            <IonLabel>{t("Language")}</IonLabel>
            <IonSelect
              interface="popover"
              onIonChange={(e) => {
                i18next.changeLanguage(e.detail.value);
                localStorage.setItem("i18nLanguage", e.detail.value);
              }}
              value={i18next.language}
            >
              <IonSelectOption value="en">English</IonSelectOption>
              <IonSelectOption value="vi">Tiếng Việt</IonSelectOption>
            </IonSelect>
          </IonItem>
        </IonList>

        <hr />
        <IonListHeader>{t("Extensions")}</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            onClick={() => {
              history.push("/my/frame");
            }}
          >
            <IonIcon icon={imageOutline} slot="start" color="primary" />
            <IonLabel>{t("Add avatar frame")}</IonLabel>
          </IonItem>
        </IonList>

        <hr />
        <IonListHeader>{t("Help & support")}</IonListHeader>
        <IonList lines="none" className="ion-padding">
          <IonItem
            href="https://m.me/CLCMultimedia"
            target="_blank"
            detail={false}
          >
            <IonIcon icon={sendOutline} slot="start" color="primary" />
            <IonLabel>{t("Contact")}</IonLabel>
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
            <IonLabel>{t("Discussion")}</IonLabel>
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
