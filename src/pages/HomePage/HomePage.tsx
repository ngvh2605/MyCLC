import { FirebaseAnalytics } from "@capacitor-community/firebase-analytics";
import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import {
  add as addIcon,
  arrowUp,
  checkmark,
  close,
  mailOpenOutline,
  mailOutline,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../auth";
import useCheckUserPermission from "../../common/useCheckUserPermission";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { auth as firebaseAuth, database, firestore } from "../../firebase";
import i18next from "./../../i18n";
import "./HomePage.scss";
import NewsCard from "./NewsCard";
import { getNew, getNextNews } from "./services";

interface Mail {
  sender: string;
  message: string;
  timestamp: number;
}

interface Weather {
  realTemp: number;
  likeTemp: number;
  humidity: number;
  uv: number;
  chanceRain: number;
  windSpeed: number;
  visibility: number;
  icon: string;
  code: number;
  description: string;
}

function getUVdiv(uv: number) {
  const t = i18next.t;
  if (uv >= 11) return <IonText color="danger">[{t("Extreme")}]</IonText>;
  else if (uv >= 8) return <IonText color="danger">[{t("Very high")}]</IonText>;
  else if (uv >= 6) return <IonText color="warning">[{t("High")}]</IonText>;
  else if (uv >= 3) return <IonText color="warning">[{t("Moderate")}]</IonText>;
  else return <IonText color="success">[{t("Low")}]</IonText>;
}

const HomePage: React.FC = () => {
  const { t } = useTranslation();
  const { userId, userEmail } = useAuth();
  const { allowCreateNews } = useCheckUserPermission(userId);

  const [lastKey, setLastKey] = useState<string | number | null>(null);
  const [newsList, setNewsList] = useState<string[]>([]);
  const [hasNextNews, setHasNextNews] = useState<boolean>(true);

  const [lastRefresh, setLastRefresh] = useState(moment().valueOf());
  const [showRefresh, setShowRefresh] = useState<boolean>(false);

  const [mailbox, setMailbox] = useState<Mail[]>([]);
  const [showMailModal, setShowMailModal] = useState(false);
  const [presentAlert] = useIonAlert();

  //weather
  const [weatherData, setWeatherData] = useState<Weather>();

  useEffect(() => {
    //fetch weather data
    database
      .ref()
      .child("public")
      .child("weather")
      .once("value")
      .then(function (snapshot) {
        const firebaseData = snapshot.val();
        if (firebaseData)
          console.log(
            "last updated weather",
            moment().diff(moment(firebaseData.timestamp), "minutes")
          );
        if (
          moment().diff(moment(firebaseData.timestamp), "minutes") >= 30 ||
          moment().diff(moment(firebaseData.timestamp), "minutes") < 0 ||
          !firebaseData.timestamp
        ) {
          const axios = require("axios");
          const options = {
            method: "GET",
            url: "https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly",
            params: { lat: "22.457386", lon: "103.9882049" },
            headers: {
              "X-RapidAPI-Host": "weatherbit-v1-mashape.p.rapidapi.com",
              "X-RapidAPI-Key":
                "215481281amsh1c8a8021452f9ecp149b18jsn2e71712e8c32",
            },
          };
          axios
            .request(options)
            .then(function (response) {
              const data = response.data.data[0];
              console.log("weather", data);
              const temp: Weather = {
                realTemp: data.temp,
                likeTemp: data.app_temp,
                humidity: data.rh,
                uv: data.uv,
                chanceRain: data.pop,
                windSpeed: data.wind_spd,
                visibility: data.vis,
                icon: data.weather.icon,
                code: data.weather.code,
                description: data.weather.description,
              };
              setWeatherData(temp);
              database.ref().child("public").child("weather").update({
                weatherData: temp,
                timestamp: moment().valueOf(),
                datetime: moment().format(),
                user: userEmail,
              });
            })
            .catch(function (error) {
              console.error(error);
            });
        } else {
          setWeatherData(firebaseData.weatherData);
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

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

    //firebase analytics
    FirebaseAnalytics.logEvent({
      name: "view_HomePage",
      params: {
        page_title: "CLC News",
      },
    });
  }, [userId]);

  useEffect(() => {
    const snapshotNewNews = firestore
      .collection("news")
      .where("timestamp", ">", lastRefresh)
      .onSnapshot(({ docs }) => {
        if (docs.length > 0) setShowRefresh(true);
      });
    fetchNews();
    return snapshotNewNews;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNews = async () => {
    const news = await getNew(3);
    const newIds = news.map((p) => {
      return p.id;
    });
    setLastKey(news?.slice(-1)?.pop()?.timestamp || lastKey);
    setNewsList(newIds);
  };

  const fetchMore = async (ev: any) => {
    const news = await getNextNews(lastKey, 3);
    setTimeout(() => {
      if (news.length < 3) {
        setHasNextNews(false);
      } else {
        setLastKey(news?.slice(-1)?.pop()?.timestamp || lastKey);
        setNewsList([...newsList, ...news.map((p) => p.id)]);
      }
      ev.target.complete();
    }, 500);
  };

  const handleDelete = (id: string) => {
    setNewsList(newsList.filter((p) => p !== id));
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

      <IonContent className="">
        <RefresherItem
          handleRefresh={() => {
            fetchNews();
          }}
        />

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
            <IonLabel>{t("New news")}</IonLabel>
          </IonButton>
        </IonFab>

        {weatherData && (
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            <IonCard>
              <IonCardContent>
                <IonCardSubtitle color="primary">CLC Weather</IonCardSubtitle>

                <IonGrid className="ion-no-padding">
                  <IonRow>
                    <IonCol size="auto">
                      <IonImg
                        style={{
                          width: 54,
                          height: 54,
                          paddingTop: 0,
                          paddingBottom: 4,
                          marginRight: 8,
                        }}
                        src={`https://www.weatherbit.io/static/img/icons/${weatherData.icon}.png`}
                      />
                    </IonCol>
                    <IonCol>
                      <IonLabel text-wrap color="medium">
                        <IonText color="dark" style={{ fontSize: "large" }}>
                          <b>{weatherData.realTemp}°C</b>
                        </IonText>
                        <p>{weatherData.description}</p>
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol>
                      <IonLabel color="dark" text-wrap>
                        {t("Feels like")}: <b>{weatherData.likeTemp}°C</b>
                        <br />
                        {t("Humidity")}: <b>{weatherData.humidity}%</b>
                        <br />
                        {t("Precipitation")}: <b>{weatherData.chanceRain}%</b>
                        <br />
                      </IonLabel>
                    </IonCol>

                    <IonCol>
                      <IonLabel color="dark" text-wrap>
                        UV:{" "}
                        <b>
                          {Intl.NumberFormat("en", {
                            maximumFractionDigits: 1,
                            minimumFractionDigits: 0,
                          }).format(weatherData.uv)}{" "}
                          {getUVdiv(weatherData.uv)}
                        </b>
                        <br />
                        {t("Wind")}:{" "}
                        <b>
                          {Intl.NumberFormat("en", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 0,
                          }).format(weatherData.windSpeed * 3.6)}{" "}
                          km/s
                        </b>
                        <br />
                        {t("Visibility")}:{" "}
                        <b>
                          {Intl.NumberFormat("en", {
                            maximumFractionDigits: 2,
                            minimumFractionDigits: 0,
                          }).format(weatherData.visibility)}{" "}
                          km
                        </b>
                      </IonLabel>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonCardContent>
            </IonCard>
          </div>
        )}

        {newsList && newsList.length > 0 ? (
          newsList
            //.slice(0, newsCount)
            .map((item, index) => (
              <NewsCard newId={item} key={index} handleDelete={handleDelete} />
            ))
        ) : (
          <>
            <LoadingNews />
            <LoadingNews />
            <LoadingNews />
          </>
        )}

        {hasNextNews && (
          <IonInfiniteScroll threshold="100px" onIonInfinite={fetchMore}>
            <IonInfiniteScrollContent loadingSpinner="crescent" />
          </IonInfiniteScroll>
        )}

        {/* {hasNextNews && (
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
        )} */}

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
            <IonTitle>{t("Mailbox")}</IonTitle>
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
                  header: t("Are you sure?"),
                  message: t(
                    "All messages will be permanently deleted and you can’t recover them"
                  ),
                  buttons: [
                    t("Cancel"),
                    {
                      text: "OK",
                      handler: (d) => {
                        clearMailbox();
                      },
                    },
                  ],
                });
              }}
            >
              <IonButton shape="round" onClick={() => {}}>
                <IonIcon icon={checkmark} slot="start" />
                <IonLabel>{t("Empty the mailbox")}</IonLabel>
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
                      <i>{t("Mailbox is empty")}</i>
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

const LoadingNews = () => (
  <div style={{ maxWidth: 680, margin: "0 auto" }}>
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
  </div>
);

export default HomePage;
