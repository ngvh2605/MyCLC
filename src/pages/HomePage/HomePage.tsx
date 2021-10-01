import "moment/locale/vi";
import "./HomePage.scss";

import {
  add as addIcon,
  arrowUp,
  chevronDown,
  mailUnreadOutline,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";

import { RefresherEventDetail } from "@ionic/core";
import {
  IonAlert,
  IonAvatar,
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
  IonMenuButton,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import { auth as firebaseAuth, firestore } from "../../firebase";
import NewsCard from "./NewsCard";
import { getNew } from "./services";

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

const HomePage: React.FC = () => {
  const [newsList, setNewsList] = useState<string[]>([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [newsCount, setNewsCount] = useState(3);
  const [totalNews, setTotalNews] = useState(0);

  useEffect(() => {
    //read size
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
                setAlertHeader("Hòm thư");
                setAlertMessage(
                  "Cảm ơn bạn đã thử ấn vào đây! Chức năng này sẽ được ra mắt trong thời gian tới. Hãy cùng đón chờ nhé!"
                );
                setShowAlert(true);
              }}
            >
              <IonIcon icon={mailUnreadOutline} color="primary" />
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

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={
            !(
              firebaseAuth.currentUser.metadata.creationTime ===
              firebaseAuth.currentUser.metadata.lastSignInTime
            )
          }
        >
          <IonLabel text-wrap className="ion-padding">
            Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực
            hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của
            MyCLC nhé!
          </IonLabel>
        </IonChip>

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

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
