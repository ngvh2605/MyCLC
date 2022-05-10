import { RefresherEventDetail } from "@ionic/core";
import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
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
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronDown, trophy } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { firestore } from "../../../firebase";
import { getInfoByUserId } from "../../HomePage/services";
import { Player, Team } from "../model";
import "./AdventureRankPage.scss";

const AdventureRankPage: React.FC = () => {
  const history = useHistory();

  const [teams, setTeams] = useState<Team[]>([]);

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
            tempPlayers.push({
              id: player,
              ...playerInfo,
            });
          });
        }

        temp.push({ id: doc.id, playerInfo: tempPlayers, ...data });
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
      <IonHeader>
        <IonToolbar className="toolbar-prize ion-no-padding ion-no-margin">
          <div>
            <IonItem lines="none">
              <IonIcon slot="start" icon={trophy} />
              <IonLabel>
                <b>Giải thưởng</b>
              </IonLabel>
              <IonNote slot="end">
                <b>600,000 VNĐ</b>
              </IonNote>
            </IonItem>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="">
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>

        {teams
          .sort((a, b) => {
            return b.score - a.score;
          })
          .map((team, index) => (
            <IonCard key={index}>
              <IonCardSubtitle style={{ marginTop: 8 }}>
                <IonItem lines="none">
                  <IonNote slot="start">
                    <div className="number-circle">
                      <p>{index + 1}</p>
                    </div>
                  </IonNote>
                  <IonText color="dark" style={{ fontSize: "x-large" }}>
                    {team.id}
                  </IonText>
                  <IonNote slot="end">
                    <IonLabel color="warning" style={{}}>
                      {team.score}{" "}
                      <IonIcon icon={trophy} style={{ fontSize: 12 }} />
                    </IonLabel>
                  </IonNote>
                </IonItem>
              </IonCardSubtitle>
              <IonCardContent
                className="ion-no-padding ion-padding-horizontal"
                style={{ paddingBottom: 8 }}
              >
                <IonGrid className="ion-no-padding">
                  <IonRow>
                    {team.playerInfo &&
                      team.playerInfo.length > 0 &&
                      team.playerInfo.map((player, index) => (
                        <IonCol size="6" key={index}>
                          <IonItem lines="none" className="ion-no-padding">
                            <IonChip
                              className="ion-no-margin"
                              onClick={() => {
                                history.push(`/my/user/${player.id}`);
                              }}
                              style={{ width: "100%" }}
                            >
                              <IonAvatar>
                                <IonImg
                                  style={{ width: 24, height: 24 }}
                                  src={
                                    player.avatar ||
                                    "/assets/image/placeholder.png"
                                  }
                                />
                              </IonAvatar>
                              <IonLabel>{player.fullName || ""}</IonLabel>
                            </IonChip>
                          </IonItem>
                        </IonCol>
                      ))}
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          ))}
      </IonContent>
    </IonPage>
  );
};

export default AdventureRankPage;
