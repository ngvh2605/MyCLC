import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonRouterOutlet,
  IonSlide,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { warning } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import EntryPage from "../../EntryPage";
import { getInfoByUserId } from "../../HomePage/services";
import useAdventureCheck from "../useAdventureCheck";

const AdventureTeamPage: React.FC = () => {
  const history = useHistory();
  const { userId } = useAuth();
  const { teamId, teamInfo } = useAdventureCheck(userId);
  const [playerInfo, setPlayerInfo] = useState<any[]>();

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    (async () => {
      if (teamInfo && teamInfo.player && teamInfo.player.length > 0) {
        let tempInfo = [];
        for (let player of teamInfo.player) {
          tempInfo.push({ ...(await getInfoByUserId(player)), id: player });
        }
        setPlayerInfo(tempInfo);
      }
    })();
  }, [teamInfo]);

  const startGame = () => {
    firestore.collection("adventure").doc(teamId).update({
      isStarted: true,
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
      {teamInfo && teamInfo.isStarted ? (
        <IonContent className="ion-padding"></IonContent>
      ) : (
        <IonContent className="ion-padding">
          <IonButton hidden onClick={() => console.log(teamInfo)}>
            Click
          </IonButton>
          <div style={{ width: "100%", textAlign: "center" }}>
            <IonText color="primary" style={{ fontSize: "xxx-large" }}>
              <b>{teamId}</b>
            </IonText>
          </div>
          <br />
          <IonList lines="none">
            <IonListHeader>Danh sách người chơi</IonListHeader>
            {playerInfo &&
              playerInfo.length > 0 &&
              playerInfo.map((player, index) => (
                <IonItem
                  key={index}
                  onClick={() => {
                    history.push(`/my/user/${player.id}`);
                  }}
                  className="ion-margin-vertical"
                >
                  <IonAvatar slot="start">
                    <IonImg
                      src={player.avatar || "/assets/image/placeholder.png"}
                    />
                  </IonAvatar>
                  <IonLabel>{player.fullName || ""}</IonLabel>
                </IonItem>
              ))}
          </IonList>

          <IonChip
            color="warning"
            style={{ height: "max-content", marginBottom: 10 }}
          >
            <IonLabel text-wrap className="ion-padding">
              Lưu ý: Sau khi một thành viên bất kỳ bắt đầu trò chơi thì đội chơi
              không thể thêm thành viên được nữa
            </IonLabel>
          </IonChip>

          <IonButton
            expand="block"
            shape="round"
            color="warning"
            onClick={() =>
              presentAlert({
                header: "Bắt đầu trò chơi?",
                message:
                  "Sau khi bắt đầu thì đội chơi không thể thêm thành viên được nữa",
                buttons: [
                  "Huỷ",
                  {
                    text: "Đồng ý",
                    handler: () => {
                      startGame();
                    },
                  },
                ],
              })
            }
          >
            <IonIcon icon={warning} slot="start" />
            <IonIcon icon={warning} slot="end" />
            Bắt đầu trò chơi
          </IonButton>
        </IonContent>
      )}
    </IonPage>
  );
};

export default AdventureTeamPage;
