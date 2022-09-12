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
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { trophy } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import RefresherItem from "../../../components/CommonUI/RefresherItem";
import { firestore } from "../../../firebase";
import { getNameAndAvatarByUserId } from "../../HomePage/services";
import { Team } from "../model";
import "./AdventureRankPage.scss";

const AdventureRankPage: React.FC = () => {
  const history = useHistory();

  const [teams, setTeams] = useState<Team[]>([]);
  const [prize, setPrize] = useState("");

  useEffect(() => {
    fetchTeams();
    fetchPrize();
  }, []);

  const fetchPrize = () => {
    firestore
      .collection("adventureMission")
      .doc("prize")
      .get()
      .then((doc) => {
        if (doc.exists && doc.data() && doc.data().info) {
          setPrize(doc.data().info);
        }
      });
  };

  const fetchTeams = async () => {
    const { docs } = await firestore
      .collection("adventure")
      .orderBy("score", "desc")
      .limit(10)
      .get();
    let temp: Team[] = [];

    const promises = docs.map(async (doc) => {
      const data = doc.data();
      if (data && data.isStarted && data.player && data.player.length > 0) {
        let tempPlayers: any[] = [];
        for (let player of data.player) {
          await getNameAndAvatarByUserId(player).then((playerInfo) => {
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
                <b>{prize ? prize : "... VNĐ"}</b>
              </IonNote>
            </IonItem>
          </div>
        </IonToolbar>
      </IonHeader>
      <IonContent className="">
        <RefresherItem
          handleRefresh={() => {
            fetchTeams();
          }}
        />

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
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
                    <IonText
                      color="dark"
                      style={{ fontSize: "x-large", textTransform: "none" }}
                    >
                      {team.name}
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
        </div>
      </IonContent>
    </IonPage>
  );
};

export default AdventureRankPage;
