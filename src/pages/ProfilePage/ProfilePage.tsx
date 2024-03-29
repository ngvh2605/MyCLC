/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { camera, createOutline, settingsOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import useCheckUserVerify from "../../common/useCheckUserVerify";
import { database } from "../../firebase";
import { VerifyStatus } from "../../models";
import "./ProfilePage.scss";

const ProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { userId, emailVerified } = useAuth();
  const history = useHistory();
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: true,
    phoneVerify: true,
    personalInfo: true,
    hasAvatar: true,
  });

  var QRCode = require("qrcode.react");

  const { fullName, avatarUrl } = useCheckUserInfo(userId);
  const { isVerify, avatarVerify } = useCheckUserVerify(userId);

  useEffect(() => {
    console.log("verify", isVerify);
    console.log("avatar", avatarVerify);
  }, [isVerify, avatarVerify]);

  useEffect(() => {
    readStatus();
  }, [history]);

  useEffect(() => {
    checkEmailVerify();
  }, [verifyStatus, emailVerified]);

  const readStatus = () => {
    const userData = database.ref().child("users").child(userId);
    userData.child("verify").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVerifyStatus(data);
      } else {
        setVerifyStatus({
          emailVerify: false,
          phoneVerify: false,
          personalInfo: false,
          hasAvatar: false,
        });
        console.log("No data available");
      }
    });
  };

  const checkEmailVerify = async () => {
    if (emailVerified && !verifyStatus?.emailVerify) {
      const userData = database.ref();
      await userData.child("users").child(userId).child("verify").update({
        emailVerify: true,
      });
    }
  };

  return (
    <IonPage id="profile-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/my/profile/personal")}>
              <IonIcon icon={createOutline} color="primary" />
            </IonButton>
          </IonButtons>
          <IonTitle>{t("Profile")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-vertical">
        <div className="ion-padding-horizontal">
          <IonFab
            horizontal="center"
            style={{ paddingLeft: 48, paddingTop: 70 }}
          >
            <IonFabButton
              style={{ width: 30, height: 30 }}
              onClick={() => {
                history.push("/my/profile/avatar");
              }}
            >
              <IonIcon icon={camera} style={{ width: 18, height: 18 }} />
            </IonFabButton>
          </IonFab>

          <IonAvatar
            className={avatarVerify ? "ion-margin avatar-verify" : "ion-margin"}
            style={{
              width: 100,
              height: 100,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <IonImg src={avatarUrl || "/assets/image/placeholder.png"} />
          </IonAvatar>

          <p style={{ textAlign: "center", fontSize: "large" }}>
            <b>{fullName || <i>{t("Your name?")}</i>}</b>
          </p>
        </div>

        <>
          <IonButton
            expand="block"
            color="primary"
            fill="outline"
            className="ion-padding-horizontal"
            style={{ marginTop: 32 }}
            onClick={() => {
              history.push({
                pathname: "/my/settings",
                state: {
                  isBack: true,
                },
              });
            }}
          >
            <IonIcon icon={settingsOutline} slot="start" />
            {t("Settings")}
          </IonButton>
        </>

        {/* <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">
            Xác minh 3 bước
          </IonLabel>
        </IonItemDivider> */}

        <hr style={{ paddingTop: 16 }} />
        <IonListHeader>{t("3 verification steps")}</IonListHeader>
        <div className="ion-padding">
          <IonChip
            color="primary"
            style={{ height: "max-content", marginBottom: 10 }}
            className="ion-margin"
          >
            <IonLabel text-wrap className="ion-padding">
              {t("3 verification steps introduce")}
            </IonLabel>
          </IonChip>
          <IonList lines="none">
            <IonItem
              detail={!emailVerified}
              disabled={emailVerified}
              onClick={() => {
                history.push("/my/profile/email");
              }}
            >
              <IonCheckbox
                checked={emailVerified}
                hidden={!emailVerified}
                slot="end"
              />
              <IonLabel>{t("Email verification")}</IonLabel>
            </IonItem>
            <IonItem
              detail={!verifyStatus?.phoneVerify}
              disabled={verifyStatus?.phoneVerify}
              onClick={() => {
                history.push("/my/profile/phone");
              }}
            >
              <IonCheckbox
                checked={verifyStatus?.phoneVerify}
                hidden={!verifyStatus?.phoneVerify}
                slot="end"
              />
              <IonLabel>{t("Phone verification")}</IonLabel>
            </IonItem>
            <IonItem
              detail={!verifyStatus?.personalInfo}
              disabled={verifyStatus?.personalInfo}
              onClick={() => {
                history.push("/my/profile/personal");
              }}
            >
              <IonCheckbox
                checked={verifyStatus?.personalInfo}
                hidden={!verifyStatus?.personalInfo}
                slot="end"
              />
              <IonLabel>{t("Identity verification")}</IonLabel>
            </IonItem>
          </IonList>
        </div>

        {/* <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">Mã QR của bạn</IonLabel>
        </IonItemDivider> */}
        <hr />
        <IonListHeader>{t("Your QR code")}</IonListHeader>

        <div className="ion-padding">
          <IonChip
            color="primary"
            style={{ height: "max-content", marginBottom: 10 }}
            className="ion-margin"
          >
            <IonLabel text-wrap className="ion-padding">
              {t("QR code introduce")}
            </IonLabel>
          </IonChip>
          <br />
          <br />
          <div style={{ marginLeft: "auto", marginRight: "auto", width: 150 }}>
            <QRCode value={userId} size={150} />
          </div>
        </div>
        <br />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
