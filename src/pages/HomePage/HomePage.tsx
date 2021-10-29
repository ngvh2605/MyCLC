import "moment/locale/vi";
import "./HomePage.scss";

import {
  add as addIcon,
  arrowUp,
  checkmark,
  chevronDown,
  close,
  mailOpenOutline,
  mailOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";

import { RefresherEventDetail } from "@ionic/core";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonViewWillEnter,
} from "@ionic/react";

import { auth as firebaseAuth, database, firestore } from "../../firebase";
import NewsCard from "./NewsCard";
import { deleteNews, getNew, getNextNews } from "./services";
import moment from "moment";
import { useAuth } from "../../auth";
import { Storage } from "@capacitor/storage";
import usePrevious from "../../common/usePrevious";
import { News } from "../../models";
import useCheckUserInfo from "../../common/useCheckUserInfo";

const LoadingNews = () => (
  <IonCard>
    <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
      <IonAvatar slot="start">
        <IonSkeletonText animated />
      </IonAvatar>
      <IonLabel text-wrap>
        <p>
          <IonSkeletonText animated style={{ width: "50%" }} />
        </p>
        <IonLabel>
          <IonNote>
            <IonSkeletonText animated style={{ width: "30%" }} />
          </IonNote>
        </IonLabel>
      </IonLabel>
    </IonItem>
    <IonCardContent style={{ paddingTop: 0 }}>
      <IonCardSubtitle style={{ paddingBottom: 10 }}>
        <IonSkeletonText animated style={{ width: "100%" }} />
      </IonCardSubtitle>
      <IonLabel text-wrap>
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "30%" }} />
      </IonLabel>
    </IonCardContent>
  </IonCard>
);

interface Mail {
  sender: string;
  message: string;
  timestamp: number;
}

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const { allowCreateNews } = useCheckUserInfo(userId);

  const [lastKey, setLastKey] = useState<string | number | null>(null);
  const [newsList, setNewsList] = useState<string[]>([]);
  const [hasNextNews, setHasNextNews] = useState<boolean>(true);

  const [lastRefresh, setLastRefresh] = useState(moment().valueOf());
  const [showRefresh, setShowRefresh] = useState<boolean>(false);

  const [mailbox, setMailbox] = useState<Mail[]>([]);
  const [showMailModal, setShowMailModal] = useState(false);
  const [presentAlert] = useIonAlert();

  const handleDelete = (id: string) => {
    setNewsList(newsList.filter((p) => p !== id));
  };

  useEffect(() => {
    //read mail box
    const readMailbox = async () => {
      await database
        .ref()
        .child("mailbox")
        .child(userId)
        .once("value")
        .then(function (snapshot) {
          let temp: Mail[] = [];
          if (snapshot !== null) {
            snapshot.forEach((child) => {
              temp.push({ ...child.val() });
            });
          }
          setMailbox(temp);
        });
    };
    readMailbox();
    console.log(firebaseAuth.currentUser.metadata.lastSignInTime);
  }, []);

  useEffect(() => {
    console.log("news mounted");
    return () => console.log("news unmounted");
  }, []);

  useEffect(() => {
    const snapshotNewNews = firestore
      .collection("news")
      .where("timestamp", ">", lastRefresh)
      .onSnapshot(({ docs }) => {
        if (docs.length > 0) setShowRefresh(true);
      });
    fetchNews();
    return snapshotNewNews;
  }, []);

  const fetchNews = async () => {
    const news = await getNew(3);
    const newIds = news.map((p) => {
      return p.id;
    });
    setLastKey(news?.slice(-1)?.pop()?.timestamp || lastKey);
    setNewsList(newIds);
  };

  const fetchMore = async () => {
    const news = await getNextNews(lastKey, 3);
    if (news.length < 3) {
      setHasNextNews(false);
    } else {
      setLastKey(news?.slice(-1)?.pop()?.timestamp || lastKey);
      setNewsList([...newsList, ...news.map((p) => p.id)]);
    }
  };

  const refreshNews = (event: CustomEvent<RefresherEventDetail>) => {
    fetchNews();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const clearMailbox = () => {
    database.ref().child("mailbox").child(userId).remove();
    setMailbox([]);
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>CLC News</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setShowMailModal(true);
              }}
              className={mailbox && mailbox.length > 0 ? "mail-button" : ""}
            >
              <IonIcon icon={mailOutline} color="primary"></IonIcon>
              {mailbox && mailbox.length > 0 && (
                <IonBadge
                  color="danger"
                  style={{
                    paddingLeft: 5,
                    paddingRight: 5,
                    paddingTop: 1,
                    paddingBottom: 2,
                  }}
                >
                  <IonText style={{ fontSize: "x-small" }}>
                    {mailbox.length}
                  </IonText>
                </IonBadge>
              )}
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonRefresher slot="fixed" onIonRefresh={refreshNews}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>

        <IonFab
          hidden={!showRefresh}
          vertical="top"
          horizontal="center"
          slot="fixed"
          className="fab-center"
        >
          <IonButton
            shape="round"
            onClick={() => {
              //setNewsList([]);
              setShowRefresh(false);
              setLastRefresh(moment().valueOf());
              fetchNews();
            }}
          >
            <IonIcon icon={arrowUp} slot="start" />
            <IonLabel>Có tin mới</IonLabel>
          </IonButton>
        </IonFab>

        {newsList && newsList.length > 0 ? (
          newsList
            //.slice(0, newsCount)
            .map((item, index) => (
              <NewsCard newId={item} key={item} handleDelete={handleDelete} />
            ))
        ) : (
          <>
            <LoadingNews />
            <LoadingNews />
            <LoadingNews />
          </>
        )}

        {hasNextNews && (
          <IonButton
            style={{
              display: "block",
              marginLeft: "auto",
              marginRight: "auto",
            }}
            fill="clear"
            onClick={fetchMore}
          >
            <IonLabel>
              Đọc thêm
              <br />
              <IonIcon icon={chevronDown} />
            </IonLabel>
          </IonButton>
        )}

        {allowCreateNews && (
          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton routerLink="/my/home/add">
              <IonIcon icon={addIcon} />
            </IonFabButton>
          </IonFab>
        )}
      </IonContent>

      <IonModal
        isOpen={showMailModal}
        cssClass="my-custom-class"
        onDidDismiss={() => setShowMailModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end" onClick={() => setShowMailModal(false)}>
              <IonButton>
                <IonIcon icon={close} color="primary" />
              </IonButton>
            </IonButtons>
            <IonTitle>Hòm thư</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          {mailbox && mailbox.length > 0 && (
            <IonFab
              vertical="bottom"
              horizontal="center"
              slot="fixed"
              style={{ marginInlineStart: "-100px" }}
              onClick={() => {
                presentAlert({
                  header: "Bạn có chắc?",
                  message:
                    "Tất cả các thư sẽ bị xoá vĩnh viễn và bạn không thể xem lại chúng",
                  buttons: [
                    "Huỷ",
                    {
                      text: "Đồng ý",
                      handler: (d) => {
                        clearMailbox();
                      },
                    },
                  ],
                  onDidDismiss: (e) => console.log("did dismiss"),
                });
              }}
            >
              <IonButton shape="round" onClick={() => {}}>
                <IonIcon icon={checkmark} slot="start" />
                <IonLabel>Làm trống hòm thư</IonLabel>
              </IonButton>
            </IonFab>
          )}

          <IonList lines="full">
            {mailbox &&
              mailbox
                .sort((a, b) => a.timestamp - b.timestamp)
                .map((item, index) => (
                  <IonItem color="light" key={index}>
                    <IonIcon
                      icon={mailOpenOutline}
                      slot="start"
                      color="medium"
                    />
                    <div className="ion-padding-vertical">
                      <IonLabel text-wrap style={{ paddingBottom: 5 }}>
                        <b>{item.sender}</b>
                        <span className="ion-float-right">
                          <IonText color="medium">
                            {moment(item.timestamp).fromNow()}
                          </IonText>
                        </span>
                      </IonLabel>
                      <IonLabel text-wrap>{item.message}</IonLabel>
                    </div>
                  </IonItem>
                ))}

            {!mailbox ||
              (mailbox && mailbox.length === 0 && (
                <IonItem color="light">
                  <div className="ion-padding-vertical">
                    <IonLabel text-wrap>
                      <i>Hòm thư trống</i>
                    </IonLabel>
                  </div>
                </IonItem>
              ))}
          </IonList>
          <br />
          <br />
          <br />
          <br />
        </IonContent>
      </IonModal>
    </IonPage>
  );
};

export default HomePage;
