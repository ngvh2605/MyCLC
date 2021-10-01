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
} from "@ionic/react";

import { auth as firebaseAuth, database, firestore } from "../../firebase";
import NewsCard from "./NewsCard";
import { getNew } from "./services";
import moment from "moment";
import { useAuth } from "../../auth";

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
  const [newsList, setNewsList] = useState<string[]>([]);

  const [newsCount, setNewsCount] = useState(3);
  const [totalNews, setTotalNews] = useState(0);

  const [mailbox, setMailbox] = useState<Mail[]>([]);
  const [showMailModal, setShowMailModal] = useState(false);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    //first login
    if (
      firebaseAuth.currentUser.metadata.creationTime ===
      firebaseAuth.currentUser.metadata.lastSignInTime
    )
      firstLogin();
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
    //read total news length
    firestore.collection("news").onSnapshot(({ docs }) => {
      setTotalNews(docs.length);
    });
    fetchNews();
  }, []); //user id ko thay đổi trong suốt phiên làm việc nên ko cần cho vào đây

  const fetchNews = async () => {
    const news = await getNew(100);
    const newIds = news.map((p) => {
      return p.id;
    });
    setNewsList(newIds);
  };

  const refreshNews = (event: CustomEvent<RefresherEventDetail>) => {
    fetchNews();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const firstLogin = () => {
    const temp: Mail = {
      sender: "CLC Multimedia",
      message:
        "Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của MyCLC nhé!",
      timestamp: moment().valueOf(),
    };
    database
      .ref()
      .child("mailbox")
      .child(userId)
      .push({
        ...temp,
      });
    setMailbox([temp]);
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
          hidden={newsList.length > 0 ? newsList.length >= totalNews : true}
          vertical="top"
          horizontal="center"
          slot="fixed"
          className="fab-center"
        >
          <IonButton
            shape="round"
            onClick={() => {
              //setNewsList([]);
              fetchNews();
            }}
          >
            <IonIcon icon={arrowUp} slot="start" />
            <IonLabel>Có tin mới</IonLabel>
          </IonButton>
        </IonFab>

        {totalNews ? (
          newsList
            .slice(0, newsCount)
            .map((item, index) => <NewsCard newId={item} key={index} />)
        ) : (
          <>
            <LoadingNews />
            <LoadingNews />
            <LoadingNews />
          </>
        )}

        {/* <SampleNews /> */}
        <IonButton
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          fill="clear"
          hidden={newsCount >= newsList.length}
          onClick={() => setNewsCount(newsCount + 1)}
        >
          <IonLabel>
            Đọc thêm
            <br />
            <IonIcon icon={chevronDown} />
          </IonLabel>
        </IonButton>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/my/home/add">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
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
