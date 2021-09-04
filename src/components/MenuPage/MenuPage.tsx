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
  IonSkeletonText,
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
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    if (userId) {
      readStatus();
    }
  }, [userId]);

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

    userData.child("personal").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.fullName) setFullName(data.fullName);
        if (data.avatar) setAvatarUrl(data.avatar);
      } else {
        console.log("No data available");
        setFullName("");
        setAvatarUrl("");
      }
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
                  <IonSkeletonText animated hidden={avatarUrl ? true : false} />
                  <IonImg
                    hidden={avatarUrl ? false : true}
                    src={avatarUrl || "/assets/image/placeholder.png"}
                  />
                </IonAvatar>
              </IonCol>
              <IonCol>
                <IonLabel hidden={fullName ? true : false}>
                  <IonSkeletonText animated style={{ width: "70%" }} />
                </IonLabel>
                <IonLabel hidden={fullName ? false : true}>
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
              <IonLabel>Phiên bản: 1.4</IonLabel>
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
