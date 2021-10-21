import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLabel,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import React, { useState } from "react";
import { Route, Switch } from "react-router";
import EntryPage from "../../EntryPage";
import { alertController } from "@ionic/core";
import { database, firestore } from "../../../firebase";
import { useAuth } from "../../../auth";
import useAdventureCheck from "../useAdventureCheck";

const AdventureHomePage: React.FC = () => {
  const { userId } = useAuth();
  const { teamId } = useAdventureCheck(userId);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [presentToast] = useIonToast();

  const handleJoin = () => {
    getTeamInfo().then((data: any) => {
      console.log("data", data);
      if (data && data.code && data.pin) {
        firestore
          .collection("adventure")
          .doc(data.code)
          .get()
          .then((doc) => {
            console.log(doc.data());
            const info = doc.data();
            if (!info || !info.pin) {
              presentToast({
                message: "Vui lòng kiểm tra lại thông tin nhóm",
                duration: 2000,
                color: "danger",
              });
            } else {
              if (data.pin !== info.pin) {
                presentToast({
                  message: "Vui lòng kiểm tra lại thông tin nhóm",
                  duration: 2000,
                  color: "danger",
                });
              } else if (info.isStarted && info.isStarted === true) {
                presentToast({
                  message: "Nhóm đã bắt đầu chơi, không thể thêm thành viên",
                  duration: 2000,
                  color: "danger",
                });
              } else if (info.total && info.total === 4) {
                presentToast({
                  message: "Nhóm đã đủ số lượng thành viên",
                  duration: 2000,
                  color: "danger",
                });
              } else {
                userJoinTeam(userId, data.code, info);
              }
            }
          });
      } else
        presentToast({
          message: "Vui lòng kiểm tra lại thông tin nhóm",
          duration: 2000,
          color: "danger",
        });
    });
  };

  const userJoinTeam = (userId: string, teamId: string, teamInfo: any) => {
    database.ref().child("adventure").child(userId).update({
      teamId: teamId,
    });

    console.log(teamInfo);

    let temp =
      teamInfo && teamInfo.player && teamInfo.player.length > 0
        ? teamInfo.player
        : [];
    temp.push(userId);

    firestore.collection("adventure").doc(teamId).update({
      player: temp,
      total: temp.length,
      score: 0,
      isStarted: false,
    });

    presentToast({
      message: "Bạn đã tham gia Adventure Hunt thành công",
      duration: 2000,
      color: "success",
    });
  };

  const getTeamInfo = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập thông tin nhóm",
        backdropDismiss: true,
        inputs: [
          {
            placeholder: "Mã nhóm (3 chữ số)",
            name: "code",
          },
          {
            placeholder: "Mã pin (4 chữ số)",
            name: "pin",
          },
        ],
        buttons: [
          { text: "Huỷ" },
          {
            text: "Tham gia",
            handler: (data) => {
              return resolve(data);
            },
          },
        ],
      });

      await confirm.present();
    });
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Adventure Hunt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {!teamId && (
          <>
            <IonButton
              expand="block"
              shape="round"
              fill="outline"
              onClick={() => {}}
            >
              Đăng ký
            </IonButton>
            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                if (!teamId) handleJoin();
              }}
            >
              Tham gia
            </IonButton>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default AdventureHomePage;
