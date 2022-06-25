/* eslint-disable react-hooks/exhaustive-deps */
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
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import {
  bookOutline,
  buildOutline,
  calendarOutline,
  chatbubbleEllipsesOutline,
  checkmarkCircle,
  folderOutline,
  gameControllerOutline,
  logOutOutline,
  newspaperOutline,
  personOutline,
  planetOutline,
  settingsOutline,
  sparklesOutline,
} from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import { auth, database, remoteConfig } from "../../firebase";
import "./MenuPage.scss";

const MenuPage = () => {
  const { userId } = useAuth();

  const history = useHistory();
  const location = useLocation();
  const menuEl = useRef<HTMLIonMenuElement>(null);

  const [presentAlert] = useIonAlert();
  const [appVersion, setAppVersion] = useState("");

  const { isVerify, avatarVerify, fullName, avatarUrl, allowCreateEvent } =
    useCheckUserInfo(userId);

  const menuClose = () => {
    menuEl.current.close();
  };

  const menuList = [
    {
      text: "CLC News",
      url: "home",
      icon: newspaperOutline,
      requireVerify: false,
      isShown: true,
    },
    {
      text: "Hồ sơ",
      url: "profile",
      icon: personOutline,
      requireVerify: false,
      isShown: true,
    },
    {
      text: "Sự kiện",
      url: "event",
      icon: calendarOutline,
      requireVerify: false,
      isShown: true,
    },

    {
      text: "Câu lạc bộ",
      url: "club",
      icon: planetOutline,
      requireVerify: false,
      isShown: true,
    },
    // {
    //   text: "To Do List",
    //   url: "timetable",
    //   icon: timeOutline,
    // },
    {
      text: "Adventure Hunt",
      url: "adventure",
      icon: gameControllerOutline,
      isShown: remoteConfig.getBoolean("showAdventure"),
    },
    {
      text: "In2CLC",
      url: "in2clc",
      icon: bookOutline,
      requireVerify: false,
      isShown: remoteConfig.getBoolean("showIn2CLC"),
    },
    {
      text: "Phòng chat",
      url: "chat",
      icon: chatbubbleEllipsesOutline,
      requireVerify: true,
      isShown: true,
    },
    {
      text: "Certificate",
      url: "certi",
      icon: folderOutline,
      requireVerify: true,
      isShown: true,
    },
    {
      text: "Giới thiệu",
      url: "about",
      icon: sparklesOutline,
      requireVerify: false,
      isShown: true,
    },
    {
      text: "Cài đặt",
      url: "settings",
      icon: settingsOutline,
      requireVerify: false,
      isShown: true,
    },
  ];

  useEffect(() => {
    try {
      //get app version
      let pjson = require("../../../package.json");
      setAppVersion(pjson.version);

      database
        .ref()
        .child("public")
        .child("appVersion")
        .once("value")
        .then(function (snapshot) {
          console.log("current appVersion", pjson.version);
          console.log("database appVersion", snapshot.val());
          if (snapshot.val() !== pjson.version) {
            presentAlert({
              header: `Đã có phiên bản ${snapshot.val()}`,
              message: "Vui lòng tải lại trang để cập nhật phiên bản mới",
              buttons: [{ text: "OK" }],
            });
          }
        });
    } catch (error) {
      console.log(error);
    }
  }, [userId]);

  const onItemClick = async (link: string) => {
    if (isVerify) {
      history.push(link);
      menuClose();
    } else {
      presentAlert({
        header: "Lưu ý",
        message:
          "Bạn cần hoàn thành 3 bước xác minh để có thể sử dụng tính năng này!",
        buttons: [{ text: "OK" }],
      });
      history.push("/my/profile");
      menuClose();
    }
  };

  const MenuItem: React.FC<{
    text: string;
    url: string;
    icon: string;
    requireVerify: boolean;
    isShown: boolean;
  }> = (props) => {
    const { text, url, icon, requireVerify, isShown } = props;
    return (
      isShown && (
        <IonItem
          onClick={() => {
            if (!!requireVerify) onItemClick(`/my/${url}`);
            else {
              history.push(`/my/${url}`);
              menuClose();
            }
          }}
          color={location.pathname.includes(`/my/${url}`) ? "primary" : ""}
        >
          <IonIcon
            icon={icon}
            color={!location.pathname.includes(`/my/${url}`) ? "primary" : ""}
            slot="start"
          />
          <IonLabel>{text}</IonLabel>
        </IonItem>
      )
    );
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
                <IonAvatar
                  className="ion-margin"
                  style={
                    avatarVerify
                      ? {
                          boxShadow: "0px 0px 0px 2px var(--ion-color-primary)",
                        }
                      : {}
                  }
                >
                  <IonImg src={avatarUrl || "/assets/image/placeholder.png"} />
                </IonAvatar>
              </IonCol>
              <IonCol>
                <IonLabel>
                  <b>
                    {fullName || <i>Tên bạn là gì?</i>}
                    {isVerify && (
                      <>
                        {" "}
                        <IonIcon
                          icon={checkmarkCircle}
                          color="primary"
                          style={{ verticalAlign: "text-bottom" }}
                        />
                      </>
                    )}
                  </b>

                  <p style={{ paddingTop: 3 }}>Xem trang cá nhân</p>
                </IonLabel>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList lines="none">
          {menuList &&
            menuList.length > 0 &&
            menuList.map((item, index) => (
              <MenuItem
                text={item.text}
                url={item.url}
                icon={item.icon}
                requireVerify={item.requireVerify}
                isShown={item.isShown}
                key={index}
              />
            ))}
        </IonList>
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar className="ion-no-padding">
          <IonList lines="none">
            <IonItem>
              <IonLabel style={{ marginLeft: 16 }}>
                Phiên bản: {appVersion}
              </IonLabel>
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
