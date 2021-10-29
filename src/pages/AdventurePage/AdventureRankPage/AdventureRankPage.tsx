import { RefresherEventDetail } from "@ionic/core";
import {
  IonAvatar,
  IonBadge,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonRouterOutlet,
  IonTab,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronDown, trophy } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { Route, Switch, useHistory } from "react-router";
import { database, firestore } from "../../../firebase";
import EntryPage from "../../EntryPage";
import { getInfoByUserId } from "../../HomePage/services";
import { Player, Team } from "../model";
import "./AdventureRankPage.scss";

const AdventureRankPage: React.FC = () => {
  const history = useHistory();

  const [teams, setTeams] = useState<Team[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    const { docs } = await firestore
      .collection("adventure")
      .orderBy("score", "desc")
      .get();
    let temp: Team[] = [];

    const promises = docs.map(async (doc) => {
      const data = doc.data();
      if (data && data.isStarted && data.player && data.player.length > 0) {
        let tempPlayers: any[] = [];
        for (let player of data.player) {
          await getInfoByUserId(player).then((playerInfo) => {
            console.log(playerInfo);
            tempPlayers.push({
              id: player,
              ...playerInfo,
            });
          });
        }
        console.log("temp player", tempPlayers);

        temp.push({ id: doc.id, playerInfo: tempPlayers, ...data });
        console.log("temp data", temp);
      }
    });

    await Promise.all(promises);

    setTeams(temp);
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchTeams();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };
  return (
    <IonPage id="adventure-rank">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Adventure Hunt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>

        {teams.map((team, index) => (
          <IonCard key={index}>
            <IonCardSubtitle>
              <IonItem lines="none">
                <IonNote slot="start">
                  <div className="number-circle">
                    <p>{55}</p>
                  </div>
                </IonNote>
                <IonText color="dark" style={{ fontSize: "x-large" }}>
                  {team.id}
                </IonText>
                <IonNote slot="end">
                  <IonLabel>
                    <IonText color="warning">{99999}</IonText>{" "}
                    <IonIcon
                      icon={trophy}
                      color="warning"
                      style={{ fontSize: 17 }}
                    />
                  </IonLabel>
                </IonNote>
              </IonItem>
            </IonCardSubtitle>
            <IonCardContent>
              {team.playerInfo &&
                team.playerInfo.length > 0 &&
                team.playerInfo.map((player, index) => (
                  <IonChip
                    key={index}
                    className="ion-no-margin"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      history.push(`/my/user/${player.id}`);
                    }}
                  >
                    <IonAvatar>
                      <IonImg
                        src={player.avatar || "/assets/image/placeholder.png"}
                      />
                    </IonAvatar>
                    <IonLabel>{player.fullName || ""}</IonLabel>
                  </IonChip>
                ))}
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default AdventureRankPage;
