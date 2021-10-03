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
  useIonViewDidEnter,
  useIonViewWillEnter,
} from "@ionic/react";
import { person, school } from "ionicons/icons";
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
  teacherSubject?: string;
  teacherClass?: string;
  clubLink?: string;
  childName?: string;
  childClass?: string;
  otherSpecify?: string;
  otherPurpose?: string;
}

const UserPage: React.FC = () => {
  const { id } = useParams<RouteParams>();

  const [userInfo, setUserInfo] = useState<User>();
  const [badges, setBadges] = useState<String[]>([]);

  useEffect(() => {
    if (id) {
      fetchUserInfo();
    }
  }, [id]);

  useIonViewDidEnter(() => {
    if (id) {
      readBadge();
    }
  });

  const fetchUserInfo = async () => {
    setUserInfo({ ...(await getInfoByUserId(id)) });
  };

  const readBadge = async () => {
    const data = database.ref().child("badge").child(id).get();
    setBadges((await data).val());
  };

  return (
    <IonPage id="user-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/home" text="" />
          </IonButtons>
          <IonTitle>{userInfo && userInfo.fullName}</IonTitle>
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
                    <IonIcon icon={person} slot="start" color="medium" />
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
                {userInfo.studentClass && userInfo.studentStart && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Lớp {userInfo.studentClass} Khoá{" "}
                      {parseInt(userInfo.studentStart) - 2002}
                    </IonLabel>
                  </IonItem>
                )}
                {userInfo.teacherSubject && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Chuyên môn: {userInfo.teacherSubject}
                    </IonLabel>
                  </IonItem>
                )}
                {userInfo.teacherClass && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Chủ nhiệm: {userInfo.teacherClass}
                    </IonLabel>
                  </IonItem>
                )}
              </IonList>
            </div>
          </>
        )}

        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">Huy hiệu</IonLabel>
        </IonItemDivider>

        {badges && badges.length > 0 && badges[0] !== null ? (
          <div className="ion-padding">
            <IonList lines="none">
              <IonItem>
                {badges.length > 0 &&
                  badges.map((badge, index) => (
                    <IonChip className="badge-chip" color="medium" key={index}>
                      <IonText color="dark">
                        <b>{badge}</b>
                      </IonText>
                    </IonChip>
                  ))}
              </IonItem>
            </IonList>
          </div>
        ) : (
          <div className="ion-padding">
            <IonList lines="none">
              <IonItem>
                <i>Trống</i>
              </IonItem>
            </IonList>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
