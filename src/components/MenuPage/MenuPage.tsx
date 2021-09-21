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
  buildOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";
import { auth, database } from "../../firebase";
import { VerifyStatus } from "../../models";
import "./MenuPage.scss";

const MenuPage = () => {
  const { userId } = useAuth();

  const history = useHistory();
  const location = useLocation();
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
        <IonList lines="none">
          <IonItem
            onClick={() => {
              history.push("/my/home");
              menuClose();
            }}
            detail={false}
            color={location.pathname === "/my/home" ? "primary" : ""}
          >
            <IonIcon
              icon={newspaperOutline}
              color={location.pathname !== "/my/home" ? "primary" : ""}
              slot="start"
            />
            <IonLabel>CLC News</IonLabel>
          </IonItem>
          <IonItem
            onClick={() => {
              history.push("/my/profile");
              menuClose();
            }}
            detail={false}
            color={location.pathname === "/my/profile" ? "primary" : ""}
          >
            <IonIcon
              icon={personOutline}
              color={location.pathname !== "/my/profile" ? "primary" : ""}
              slot="start"
            />
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
            color={location.pathname === "/my/event" ? "primary" : ""}
          >
            <IonIcon
              icon={calendarOutline}
              color={location.pathname !== "/my/event" ? "primary" : ""}
              slot="start"
            />
            <IonLabel>Sự kiện</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              history.push("/my/about");
              menuClose();
            }}
            color={location.pathname === "/my/about" ? "primary" : ""}
          >
            <IonIcon
              icon={sparklesOutline}
              color={location.pathname !== "/my/about" ? "primary" : ""}
              slot="start"
            />
            <IonLabel>Giới thiệu</IonLabel>
          </IonItem>

          <IonItem
            onClick={() => {
              history.push("/my/settings");
              menuClose();
            }}
            hidden
            color={location.pathname === "/my/settings" ? "primary" : ""}
          >
            <IonIcon
              icon={settingsOutline}
              color={location.pathname !== "/my/settings" ? "primary" : ""}
              slot="start"
            />
            <IonLabel>Cài đặt</IonLabel>
          </IonItem>
          <IonItem
            href="https://m.me/CLCMultimedia"
            target="_blank"
            detail={false}
          >
            <IonIcon icon={sendOutline} color="primary" slot="start" />
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
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <IonList lines="none">
            <IonItem>
              <IonLabel style={{ marginLeft: 16 }}>Phiên bản: 1.5</IonLabel>
            </IonItem>
            <IonItem
              onClick={() => {
                history.push("/my/manage");
                menuClose();
              }}
              detail={false}
              color={location.pathname === "/my/manage" ? "primary" : ""}
            >
              <IonIcon
                icon={buildOutline}
                color={location.pathname !== "/my/manage" ? "primary" : ""}
                slot="start"
              />
              <IonLabel>Quản lý</IonLabel>
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
