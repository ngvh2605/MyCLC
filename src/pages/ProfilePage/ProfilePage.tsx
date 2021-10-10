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
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { brushOutline, camera, pencil } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import { database } from "../../firebase";
import { VerifyStatus } from "../../models";

const ProfilePage: React.FC = () => {
  const { userId, emailVerified } = useAuth();
  const history = useHistory();
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: true,
    phoneVerify: true,
    personalInfo: true,
    hasAvatar: true,
  });
  const [fullName, setFullName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");

  var QRCode = require("qrcode.react");

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

    userData.child("personal").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.fullName) setFullName(data.fullName);
        if (data.avatar) setAvatarUrl(data.avatar);
      } else {
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot="end">
            <IonButton onClick={() => history.push("/my/profile/personal")}>
              <IonIcon icon={brushOutline} color="primary" />
            </IonButton>
          </IonButtons>
          <IonTitle>Hồ sơ</IonTitle>
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
            className="ion-margin"
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
            <b>{fullName || <i>Tên bạn là gì?</i>}</b>
          </p>
        </div>
        <br />

        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">
            Xác minh 3 bước
          </IonLabel>
        </IonItemDivider>
        <div className="ion-padding">
          <IonChip
            color="primary"
            style={{ height: "max-content", marginBottom: 10 }}
            className="ion-margin"
          >
            <IonLabel text-wrap className="ion-padding">
              Để cùng xây dựng một cộng đồng kết nối Chuyên Lào Cai - MyCLC an
              toàn và bền vững. Bạn cần thực hiện đủ 3 bước xác minh để có thể
              sử dụng được các chức năng khác!
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
              <IonLabel>Xác minh Email</IonLabel>
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
              <IonLabel>Xác minh Số điện thoại</IonLabel>
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
              <IonLabel>Xác thực danh tính</IonLabel>
            </IonItem>
          </IonList>
        </div>
        <br />
        <IonItemDivider
          color="primary"
          style={{ paddingTop: 6, paddingBottom: 6 }}
        >
          <IonLabel className="ion-padding-horizontal">Mã QR của bạn</IonLabel>
        </IonItemDivider>
        <div className="ion-padding">
          <IonChip
            color="primary"
            style={{ height: "max-content", marginBottom: 10 }}
            className="ion-margin"
          >
            <IonLabel text-wrap className="ion-padding">
              Mã QR này sử dụng cho các tính năng kết nối và check in khi tham
              gia các sự kiện sẽ được ra mắt trong thời gian tới
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
