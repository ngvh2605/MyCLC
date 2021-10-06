/* eslint-disable react-hooks/exhaustive-deps */
import { Storage } from "@capacitor/storage";
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
  IonRow,
  IonSkeletonText,
  IonToolbar,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import {
  bookOutline,
  buildOutline,
  calendarOutline,
  chatbubbleOutline,
  logoFacebook,
  logOutOutline,
  newspaperOutline,
  personOutline,
  sendOutline,
  settingsOutline,
  sparklesOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";
import { auth, database } from "../../firebase";
import "./MenuPage.scss";

const MenuPage = () => {
  const { userId } = useAuth();

  const history = useHistory();
  const location = useLocation();
  const menuEl = useRef<HTMLIonMenuElement>(null);

  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [presentToast] = useIonToast();

  const [allowCreateEvent, setAllowCreateEvent] = useState<boolean>(false);

  useEffect(() => {
    if (userId) {
      readStatus();
      readAuth(userId);
    }
  }, [userId]);

  const readStatus = () => {
    const userData = database.ref().child("users").child(userId);

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

  const readAuth = (userId: string) => {
    database
      .ref()
      .child("auth")
      .child(userId)
      .once("value")
      .then((snapshot) => {
        const data = snapshot.val();
        if (data && data.createEvent) setAllowCreateEvent(true);
        else setAllowCreateEvent(false);
      });
  };

  const menuClose = () => {
    menuEl.current.close();
  };

  const onItemClick = async (link: string) => {
    const { value } = await Storage.get({ key: "verify" });
    if (value === "true") {
      history.push(link);
      menuClose();
    } else {
      presentToast({
        message: "Bạn cần hoàn thành 3 bước xác minh trước!",
        duration: 2000,
        color: "danger",
        onDidDismiss: () => console.log("dismissed"),
        onWillDismiss: () => console.log("will dismiss"),
      });
      history.push(link);
      menuClose();
    }
  };

  return (
    <IonMenu contentId="main" type="overlay" ref={menuEl} id="menu-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin"></div>
          <IonGrid
            onClick={() => {
              history.push(`/my/user/${userId}`);
              menuClose();
            }}
          >
            <IonRow className="ion-align-items-center">
              <IonCol size="3.5">
                <IonAvatar className="ion-margin">
                  <IonImg src={avatarUrl || "/assets/image/placeholder.png"} />
                </IonAvatar>
              </IonCol>
              <IonCol>
                <IonLabel>
                  <b>{fullName || <i>Tên bạn là gì?</i>}</b>
                  <p style={{ paddingTop: 3 }}>Xem trang cá nhân</p>
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
              onItemClick("/my/event");
            }}
            detail={false}
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
              onItemClick("/my/timetable");
            }}
            color={location.pathname === "/my/timetable" ? "primary" : ""}
          >
            <IonIcon
              icon={bookOutline}
              color={location.pathname !== "/my/timetable" ? "primary" : ""}
              slot="start"
            />
            <IonLabel>Thời khoá biểu</IonLabel>
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
        <IonToolbar className="ion-no-padding">
          <IonList lines="none">
            <IonItem>
              <IonLabel style={{ marginLeft: 16 }}>Phiên bản: 1.5</IonLabel>
            </IonItem>
            {allowCreateEvent && (
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
            )}
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
