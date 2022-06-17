import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { person } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { database } from "../../firebase";
import { getInfoByUserId } from "../HomePage/services";
import "./ClubPage.scss";

interface Club {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  intro: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  followers: number;
}

const ClubPage: React.FC = () => {
  const history = useHistory();
  const [clubs, setClubs] = useState<Club[]>([]);

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const data = (await database.ref().child("clubCode").get()).val();
    let temp: string[] = [];
    if (data) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop) && data[prop] !== "available") {
          temp.push(data[prop]);
        }
      }
    }
    let list: Club[] = [];

    for (let item in temp) {
      const count = (
        await database.ref().child("followersCount").child(temp[item]).get()
      ).val();
      list.push({
        ...(await getInfoByUserId(temp[item])),
        id: temp[item],
        followers: count ? count : 0,
      });
    }

    setClubs(list);
  };

  return (
    <IonPage id="club-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Câu lạc bộ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RefresherItem
          handleRefresh={() => {
            fetchClubs();
          }}
        />

        {clubs && clubs.length > 0 ? (
          clubs
            .filter((club) => {
              return !!club.fullName;
            })
            .sort((a, b) => {
              return a.followers - b.followers;
            })
            .map((club, index) => (
              <div style={{ maxWidth: 680, margin: "0 auto" }} key={index}>
                <IonCard
                  onClick={() => {
                    history.push(`/my/user/${club.id}`);
                  }}
                >
                  <IonCardContent>
                    <IonItem lines="none">
                      <IonAvatar slot="start" style={{ width: 50, height: 50 }}>
                        <IonImg
                          src={club.avatar || "/assets/image/placeholder.png"}
                        />
                      </IonAvatar>
                      <IonLabel className="ion-no-margin">
                        <b>{club.fullName || "Tên Câu lạc bộ"}</b>

                        {club.intro && (
                          <IonLabel text-wrap style={{ marginBottom: 3 }}>
                            {club.intro}
                          </IonLabel>
                        )}

                        <IonLabel text-wrap color="medium">
                          <IonIcon
                            icon={person}
                            style={{ verticalAlign: -2 }}
                          />{" "}
                          Người theo dõi: {club.followers}
                        </IonLabel>
                      </IonLabel>
                    </IonItem>
                  </IonCardContent>
                </IonCard>
              </div>
            ))
        ) : (
          <>
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

const ClubCardSkeleton = () => {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <IonCard>
        <IonCardContent>
          <IonItem lines="none">
            <IonAvatar slot="start" style={{ width: 50, height: 50 }}>
              <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <IonSkeletonText animated style={{ width: "50%" }} />

              <IonLabel text-wrap>
                <IonSkeletonText animated />
                <IonSkeletonText animated />
                <IonSkeletonText animated style={{ width: "30%" }} />
              </IonLabel>
            </IonLabel>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default ClubPage;
