import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  IonImg,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonInfiniteScroll,
  IonCard,
  IonCardHeader,
  IonInfiniteScrollContent,
  useIonViewWillEnter,
  IonAlert,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonChip,
  IonLoading,
  IonProgressBar,
  IonSpinner,
  IonSkeletonText,
  IonNote,
  IonItemDivider,
  IonVirtualScroll,
  IonText,
} from "@ionic/react";
import {
  add as addIcon,
  chatbubbleEllipses,
  heart,
  heartCircle,
  heartOutline,
  mailOutline,
  mailUnreadOutline,
  notificationsOutline,
  pin,
  rocket,
  sparkles,
  star,
  walk,
  warning,
  wifi,
  wine,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../../auth";
import { formatDate } from "../../../date";
import { database, firestore } from "../../../firebase";
import { News, toNews, Comment, toComment } from "../../../models";
import { auth as firebaseAuth } from "../../../firebase";
import {
  getNew,
  getComment,
  getLikedNewByUserId,
  getLikedUserByNewId,
  likeNews,
  isNewLikedByUser,
  unlikeNews,
  getInfoByUserId,
  getNextNew,
} from "./../services";
import "./NewsCard.scss";
import moment from "moment";
import "moment/locale/vi";

const NewsCard: React.FC<any> = (props) => {
  const { userId } = useAuth();

  const { newId } = props;

  const [news, setNews] = useState<News>();
  const [isLiked, setIsLiked] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<any>({});

  useEffect(() => {
    firestore
      .collection("news")
      .doc(newId)
      .onSnapshot((doc) => {
        setNews(toNews(doc));
      });
  }, []);

  useEffect(() => {
    if (news) {
      database
        .ref()
        .child("users")
        .child(news.author)
        .child("personal")
        .on("value", (snapshot) => {
          if (snapshot.exists) {
            setAuthorInfo(snapshot.val());
          }
        });
      firestore
        .collection("newsReaction")
        .where("newId", "==", newId)
        .where("userId", "==", userId)
        .onSnapshot((doc) => {
          if (doc.empty) setIsLiked(false);
          else setIsLiked(true);
        });
    }
  }, [news]);

  return (
    <>
      {news ? (
        <IonCard>
          {news.pictureUrl && (
            <IonImg
              hidden={!news.pictureUrl}
              src={news.pictureUrl || "assets/image/placeholder.png"}
            />
          )}
          <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
            <IonAvatar slot="start">
              <IonImg
                src={
                  authorInfo && authorInfo.avatar
                    ? authorInfo.avatar
                    : "assets/image/placeholder.png"
                }
              />
            </IonAvatar>
            <IonLabel text-wrap color="dark">
              <p>
                <b>
                  {authorInfo && authorInfo.fullName ? authorInfo.fullName : ""}
                </b>
              </p>
              <IonLabel color="medium">
                <IonNote color="primary">
                  <IonIcon
                    icon={star}
                    style={{
                      fontSize: "x-small",
                      verticalAlign: "baseline",
                    }}
                  />{" "}
                  Club
                  <IonText color="medium">
                    {" · "}
                    <i>
                      {moment(news.timestamp)
                        .locale("vi")
                        .format("Do MMM, H:mm")}
                    </i>
                  </IonText>
                </IonNote>
              </IonLabel>
            </IonLabel>
          </IonItem>
          <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
            <IonCardSubtitle color="primary">{news.title}</IonCardSubtitle>
            <IonLabel color="dark" text-wrap style={{ whiteSpace: "pre-wrap" }}>
              {decodeURI(news.body)}
            </IonLabel>
          </IonCardContent>

          <hr
            className="ion-margin"
            style={{
              borderBottom: "1px solid",
              opacity: 0.2,
              marginBottom: 10,
            }}
          />
          <IonGrid className="ion-no-padding" style={{ paddingBottom: 10 }}>
            <IonRow className="ion-align-items-center">
              <IonCol
                className="ion-align-self-center"
                style={{ textAlign: "center" }}
              >
                <IonButton
                  fill="clear"
                  expand="full"
                  style={{ height: "max-content" }}
                  routerLink={`/my/home/view/${news.id}`}
                >
                  <IonIcon
                    icon={chatbubbleEllipses}
                    color="primary"
                    style={{ fontSize: "large" }}
                    slot="start"
                  />

                  <IonLabel color="primary" style={{ fontSize: "small" }}>
                    {news.count > 0 ? news.count : ""} Bình luận
                  </IonLabel>
                </IonButton>
              </IonCol>
              <IonCol
                className="ion-align-self-center"
                style={{ textAlign: "center" }}
              >
                {isLiked ? (
                  <IonButton
                    fill="clear"
                    expand="full"
                    style={{ height: "max-content" }}
                    onClick={() => {
                      unlikeNews(userId, news.id);
                    }}
                  >
                    <IonIcon
                      icon={heart}
                      color="danger"
                      style={{ fontSize: "large" }}
                      slot="start"
                    />

                    <IonLabel color="danger" style={{ fontSize: "small" }}>
                      {news.totalLikes} Yêu thích
                    </IonLabel>
                  </IonButton>
                ) : (
                  <IonButton
                    fill="clear"
                    expand="full"
                    style={{ height: "max-content" }}
                    onClick={() => {
                      likeNews(userId, news.id);
                    }}
                  >
                    <IonIcon
                      icon={heartOutline}
                      color="dark"
                      style={{ fontSize: "large" }}
                      slot="start"
                    />

                    <IonLabel color="dark" style={{ fontSize: "small" }}>
                      {news.totalLikes > 0 ? news.totalLikes : ""} Yêu thích
                    </IonLabel>
                  </IonButton>
                )}
              </IonCol>
            </IonRow>
          </IonGrid>
          {/* 
              <IonList>
                {item.comment &&
                  item.comment.map((comment, index) => (
                    <IonItem key={index}>
                      <IonLabel>{comment.body}</IonLabel>
                    </IonItem>
                  ))}
              </IonList>
              */}
        </IonCard>
      ) : (
        <></>
      )}
    </>
  );
};

export default NewsCard;
