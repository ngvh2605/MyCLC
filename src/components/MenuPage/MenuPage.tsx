import {
  IonAvatar,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  homeSharp,
  warningSharp,
  hammerSharp,
  person,
  newspaperOutline,
  settingsOutline,
  personOutline,
  logOutOutline,
  calendarOutline,
  mailOutline,
  chatbubbleOutline,
  sendOutline,
  logoFacebook,
  sparklesOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import { auth, database } from "../../firebase";
import "./MenuPage.scss";

interface VerifyStatus {
  emailVerify: boolean;
  phoneVerify: boolean;
  personalInfo: boolean;
  hasAvatar: boolean;
}

const MenuPage = () => {
  const { userId } = useAuth();

  const history = useHistory();
  const menuEl = useRef<HTMLIonMenuElement>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: false,
    phoneVerify: false,
    personalInfo: false,
    hasAvatar: false,
  });

  const [fullName, setFullName] = useState("");

  useEffect(() => {
    if (userId) {
      readStatus();
    }
  }, []);

  const readStatus = () => {
    const userData = database.ref();
    userData
      .child("users")
      .child(userId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          try {
            setVerifyStatus(data.verify);
          } catch {}
          try {
            setFullName(data.personal.fullName);
          } catch {}
        } else {
          setVerifyStatus({
            emailVerify: false,
            phoneVerify: false,
            personalInfo: false,
            hasAvatar: false,
          });
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const menuClose = () => {
    menuEl.current.close();
  };

  return (
    <IonMenu contentId="main" type="overlay" ref={menuEl} id="menu-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin"></div>
          <IonGrid>
            <IonRow className="ion-align-items-center">
              <IonCol size="3.5">
                <IonAvatar className="ion-margin">
                  <IonImg src="/assets/image/placeholder.png" />
                </IonAvatar>
              </IonCol>
              <IonCol>
                <IonLabel>
                  <b>{fullName}</b>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="none" className="ion-margin">
          <IonItem
            onClick={() => {
              history.push("/my/home");
              menuClose();
            }}
            detail={false}
          >
            <IonIcon icon={newspaperOutline} color="primary" slot="start" />
            <IonLabel>CLC News</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/profile");
              menuClose();
            }}
            detail={false}
          >
            <IonIcon icon={personOutline} color="primary" slot="start" />
            <IonLabel>Hồ sơ</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/event");
              menuClose();
            }}
            detail={false}
            hidden={
              !(
                verifyStatus.emailVerify &&
                verifyStatus.phoneVerify &&
                verifyStatus.personalInfo
              )
            }
          >
            <IonIcon icon={calendarOutline} color="primary" slot="start" />
            <IonLabel>Sự kiện</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              history.push("/my/about");
              menuClose();
            }}
          >
            <IonIcon icon={sparklesOutline} color="primary" slot="start" />
            <IonLabel>Giới thiệu</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              history.push("/my/settings");
              menuClose();
            }}
            hidden
          >
            <IonIcon icon={settingsOutline} color="primary" slot="start" />
            <IonLabel>Cài đặt</IonLabel>
          </IonItem>
          <IonItem
            href="https://m.me/CLCMultimedia"
            target="_blank"
            detail={true}
            detailIcon={logoFacebook}
          >
            <IonIcon icon={sendOutline} color="primary" slot="start" />
            <IonLabel>Liên hệ</IonLabel>
          </IonItem>
          <IonItem
            href="https://www.facebook.com/groups/ChuyenLaoCai"
            target="_blank"
            detail={true}
            detailIcon={logoFacebook}
          >
            <IonIcon icon={chatbubbleOutline} color="primary" slot="start" />
            <IonLabel>Thảo luận</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonList lines="none" className="ion-margin">
            <IonItem>
              <IonLabel>Phiên bản: 1.2</IonLabel>
            </IonItem>
            <IonItem
              onClick={() => {
                auth.signOut();
                menuClose();
              }}
            >
              <IonIcon icon={logOutOutline} color="primary" slot="start" />
              <IonLabel>Đăng xuất</IonLabel>
            </IonItem>
          </IonList>
        </IonToolbar>
      </IonFooter>
    </IonMenu>
  );
};

export default MenuPage;
