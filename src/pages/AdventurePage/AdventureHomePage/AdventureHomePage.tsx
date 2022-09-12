import { alertController } from "@ionic/core";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonToast,
} from "@ionic/react";
import { gameController, ticketOutline } from "ionicons/icons";
import React from "react";
import { useAuth } from "../../../auth";
import { database, firestore } from "../../../firebase";
import useAdventureCheck from "../useAdventureCheck";

const AdventureHomePage: React.FC = () => {
  const { userId } = useAuth();
  const { teamId } = useAdventureCheck(userId);
  const [presentToast] = useIonToast();

  const handleJoin = () => {
    getTeamInfo().then((data: any) => {
      if (data && data.code) {
        firestore
          .collection("adventure")
          .doc(data.code.toLowerCase())
          .get()
          .then((doc) => {
            const info = doc.data();
            console.log("info", info);
            if (!doc.exists) {
              presentToast({
                message: "Vui lòng kiểm tra lại thông tin đội chơi",
                duration: 2000,
                color: "danger",
              });
            } else {
              if (info.isStarted && info.isStarted === true) {
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
                userJoinTeam(userId, data.code, "", info);
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

  const handleCreate = async () => {
    createTeamInfo().then((data: any) => {
      if (data && data.name && data.name.length <= 30) {
        const tempPin = Math.random().toString(16).slice(9);
        firestore
          .collection("adventure")
          .doc(tempPin)
          .get()
          .then((doc) => {
            if (doc.exists) {
              presentToast({
                message: "Vui lòng thử lại!",
                duration: 2000,
                color: "danger",
              });
            } else {
              userJoinTeam(userId, tempPin, data.name, undefined);
              presentToast({
                message: "Bạn đã tham gia Adventure Hunt thành công",
                duration: 2000,
                color: "success",
              });
            }
          });
      } else {
        presentToast({
          message: "Tên đội chơi không hợp lệ",
          duration: 2000,
          color: "danger",
        });
      }
    });
  };

  const userJoinTeam = (
    userId: string,
    teamId: string,
    name: string,
    teamInfo: any
  ) => {
    database.ref().child("adventure").child(userId).update({
      teamId: teamId,
    });

    console.log(teamInfo);

    let temp =
      teamInfo && teamInfo.player && teamInfo.player.length > 0
        ? teamInfo.player
        : [];
    temp.push(userId);

    firestore
      .collection("adventure")
      .doc(teamId)
      .set({
        player: temp,
        total: temp.length,
        score: 0,
        isStarted: false,
        name: teamInfo && teamInfo.name ? teamInfo.name : name ? name : "",
      });

    presentToast({
      message: "Bạn đã tham gia Adventure Hunt thành công",
      duration: 2000,
      color: "success",
    });
  };

  const createTeamInfo = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập tên đội chơi",
        message: "Chú ý: Tên đội chơi không thể thay đổi sau khi tạo",
        backdropDismiss: true,
        inputs: [
          {
            placeholder: "Tối đa 30 ký tự",
            name: "name",
          },
        ],
        buttons: [
          { text: "Huỷ" },
          {
            text: "Tạo",
            handler: (data) => {
              return resolve(data);
            },
          },
        ],
      });

      await confirm.present();
    });
  };

  const getTeamInfo = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập thông tin đội chơi",
        message: "Chú ý: Lấy thông tin mã đội từ thành viên trong đội",
        backdropDismiss: true,
        inputs: [
          {
            placeholder: "Mã đội (6 ký tự)",
            name: "code",
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
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {!teamId && (
            <div className="ion-padding">
              <IonButton
                expand="block"
                shape="round"
                fill="outline"
                onClick={() => {
                  if (!teamId) handleCreate();
                }}
              >
                <IonIcon icon={ticketOutline} slot="start" />
                Tạo đội chơi
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
          <IonCard>
            <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BAdventure%5D%20Prize.jpg?alt=media&token=2f6634a1-15e9-4bb5-840e-b5657eedd0f9" />
          </IonCard>
          <IonCard>
            <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BAdventure%5D%20Mission.jpg?alt=media&token=44817e73-3eb6-4c27-863b-93ac6a7d191f" />
          </IonCard>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdventureHomePage;
