import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { person } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { database } from "../../firebase";
import { getInfoByUserId } from "../HomePage/services";
import "./UserPage.scss";

interface RouteParams {
  id: string;
}

interface User {
  fullName: string;
  birth: string;
  gender: string;
  role: string;
  avatar?: string;
  email?: string;
  studentClass?: string;
  studentStart?: string;
  studentEnd?: string;
}

const UserPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [userInfo, setUserInfo] = useState<User>();
  const [badges, setBadges] = useState<String[]>([]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setUserInfo({ ...(await getInfoByUserId(id)) });
    };
    if (id) fetchUserInfo();
  }, [id]);

  useEffect(() => {
    const readBadge = async () => {
      let temp: String[] = [];
      await database
        .ref()
        .child("badge")
        .child(id)
        .get()
        .then((snapshot) => {
          temp.push(snapshot.val());
        });
      setBadges(temp);
    };
    readBadge();
  }, [id]);

  return (
    <IonPage id="user-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/home" text="" />
          </IonButtons>
          <IonTitle></IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-vertical">
        <div className="ion-padding-horizontal">
          <IonAvatar
            className="ion-margin"
            style={{
              width: 100,
              height: 100,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <IonImg
              src={
                userInfo && userInfo.avatar
                  ? userInfo.avatar
                  : "/assets/image/placeholder.png"
              }
            />
          </IonAvatar>

          <p style={{ textAlign: "center", fontSize: "large" }}>
            <b>{userInfo && userInfo.fullName ? userInfo.fullName : ""}</b>
          </p>
        </div>

        {badges && (
          <>
            <IonItemDivider
              color="primary"
              style={{ paddingTop: 6, paddingBottom: 6 }}
            >
              <IonLabel className="ion-padding-horizontal">Huy hiệu</IonLabel>
            </IonItemDivider>

            <div className="ion-padding">
              {badges.length > 0 &&
                badges.map((badge, index) => (
                  <IonChip className="badge-chip">
                    <IonText color="dark">
                      <b>{badge}</b>
                    </IonText>
                  </IonChip>
                ))}
            </div>
          </>
        )}
        {userInfo && (
          <>
            <IonItemDivider
              color="primary"
              style={{ paddingTop: 6, paddingBottom: 6 }}
            >
              <IonLabel className="ion-padding-horizontal">Thông tin</IonLabel>
            </IonItemDivider>
            <div className="ion-padding">
              <IonList lines="none">
                {userInfo.role && (
                  <IonItem>
                    <IonIcon
                      icon={person}
                      slot="start"
                      color="medium"
                      size="small"
                    />
                    {userInfo.role === "student" && (
                      <IonLabel text-wrap>Học sinh / Cựu học sinh</IonLabel>
                    )}
                    {userInfo.role === "teacher" && (
                      <IonLabel text-wrap>Giáo viên / Nhân viên</IonLabel>
                    )}
                    {userInfo.role === "parent" && (
                      <IonLabel text-wrap>Phụ huynh / Người giám hộ</IonLabel>
                    )}
                    {userInfo.role === "club" && (
                      <IonLabel text-wrap>Câu lạc bộ / Tổ chức</IonLabel>
                    )}
                    {userInfo.role === "other" && (
                      <IonLabel text-wrap>Đối tượng khác</IonLabel>
                    )}
                  </IonItem>
                )}
                {userInfo.role && (
                  <IonItem>
                    <IonIcon
                      icon={person}
                      slot="start"
                      color="medium"
                      size="small"
                    />
                    {userInfo.role === "student" && (
                      <IonLabel text-wrap>Học sinh / Cựu học sinh</IonLabel>
                    )}
                    {userInfo.role === "teacher" && (
                      <IonLabel text-wrap>Giáo viên / Nhân viên</IonLabel>
                    )}
                    {userInfo.role === "parent" && (
                      <IonLabel text-wrap>Phụ huynh / Người giám hộ</IonLabel>
                    )}
                    {userInfo.role === "club" && (
                      <IonLabel text-wrap>Câu lạc bộ / Tổ chức</IonLabel>
                    )}
                    {userInfo.role === "other" && (
                      <IonLabel text-wrap>Đối tượng khác</IonLabel>
                    )}
                  </IonItem>
                )}
              </IonList>
            </div>
          </>
        )}
        <IonButton
          onClick={() => {
            console.log(userInfo);
          }}
        >
          Click
        </IonButton>
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
