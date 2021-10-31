import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
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
import { gameController, ticketOutline } from "ionicons/icons";

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
                message: "Vui lòng kiểm tra lại thông tin đội chơi",
                duration: 2000,
                color: "danger",
              });
            } else {
              if (data.pin !== info.pin) {
                presentToast({
                  message: "Vui lòng kiểm tra lại thông tin đội chơi",
                  duration: 2000,
                  color: "danger",
                });
              } else if (info.isStarted && info.isStarted === true) {
                presentToast({
                  message:
                    "Đội chơi đã bắt đầu chơi, không thể thêm thành viên",
                  duration: 2000,
                  color: "danger",
                });
              } else if (info.total && info.total === 4) {
                presentToast({
                  message: "Đội chơi đã đủ số lượng thành viên",
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
          message: "Vui lòng kiểm tra lại thông tin đội chơi",
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
        header: "Nhập thông tin đội chơi",
        backdropDismiss: true,
        inputs: [
          {
            placeholder: "Mã đội (3 số) - viết trên vé",
            name: "code",
          },
          {
            placeholder: "Mã pin (4 số) - người đại diện đặt",
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
      <IonContent>
        {!teamId && (
          <div className="ion-padding">
            <IonButton
              expand="block"
              shape="round"
              fill="outline"
              href="https://bitly.com.vn/sz2rai"
              target="_blank"
            >
              <IonIcon icon={ticketOutline} slot="start" />
              Mua vé - 20k/đội
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                if (!teamId) handleJoin();
              }}
              className="ion-margin-top"
            >
              <IonIcon icon={gameController} slot="start" />
              Gia nhập đội chơi
            </IonButton>
          </div>
        )}

        <IonCard>
          <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BAdventure%5D%20Intro.png?alt=media&token=2eb4fc1d-e60a-4c2a-8dad-3c2b6ae695eb" />
        </IonCard>
        <IonCard>
          <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BAdventure%5D%20Rule.png?alt=media&token=6c0ef3ce-656d-4f0a-887a-9fc9774ea809" />
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default AdventureHomePage;
