import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonGrid,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonSkeletonText,
  IonText,
  useIonAlert,
} from "@ionic/react";
import {
  brush,
  chatbubbleEllipses,
  close,
  ellipsisHorizontal,
  heart,
  heartOutline,
  star,
  trash,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth";
import { database, firestore, storage } from "../../../firebase";
import { News, toNews } from "../../../models";
import { deleteNews, likeNews, unlikeNews } from "./../services";
import "./NewsCard.scss";

const NewsCard: React.FC<any> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { newId } = props;

  const [news, setNews] = useState<News>();
  const [isLiked, setIsLiked] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<any>({});

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

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
      try {
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
      } catch (error) {
        console.log(error);
      }
    }
  }, [news]);

  return (
    <>
      {news ? (
        news.body && (
          <IonCard>
            {news.pictureUrl && (
              <IonImg
                hidden={!news.pictureUrl}
                src={news.pictureUrl || "/assets/image/placeholder.png"}
              />
            )}
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
              <IonAvatar slot="start">
                <IonImg
                  src={
                    authorInfo && authorInfo.avatar
                      ? authorInfo.avatar
                      : "/assets/image/placeholder.png"
                  }
                />
              </IonAvatar>
              <IonLabel text-wrap color="dark">
                <IonIcon
                  icon={ellipsisHorizontal}
                  className="ion-float-right"
                  color="medium"
                  onClick={() => {
                    setShowActionSheet(true);
                  }}
                  hidden={news.author != userId}
                />
                <p>
                  <b>
                    {authorInfo && authorInfo.fullName
                      ? authorInfo.fullName
                      : ""}
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
            <IonCardContent
              style={{ paddingTop: 0, paddingBottom: 0 }}
              onClick={() => {
                history.push({
                  pathname: `/my/home/view/${news.id}`,
                  state: {
                    news: news,
                    authorInfo: authorInfo,
                    isLiked: isLiked,
                  },
                });
              }}
            >
              <IonCardSubtitle color="primary">{news.title}</IonCardSubtitle>
              <IonLabel
                color="dark"
                text-wrap
                style={{ whiteSpace: "pre-wrap" }}
              >
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
                    onClick={() => {
                      history.push({
                        pathname: `/my/home/view/${news.id}`,
                        state: {
                          news: news,
                          authorInfo: authorInfo,
                          isLiked: isLiked,
                        },
                      });
                    }}
                  >
                    <IonIcon
                      icon={chatbubbleEllipses}
                      color="primary"
                      style={{ fontSize: "large" }}
                      slot="start"
                    />

                    <IonLabel color="primary" style={{ fontSize: "small" }}>
                      {news.totalComments > 0 ? news.totalComments : ""} Bình
                      luận
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

            <IonActionSheet
              isOpen={showActionSheet}
              onDidDismiss={() => setShowActionSheet(false)}
              cssClass="my-custom-class"
              buttons={[
                {
                  text: "Chỉnh sửa",
                  icon: brush,
                  handler: () => {
                    history.push({
                      pathname: `/my/home/add/${news.id}`,
                      state: news,
                    });
                  },
                },
                {
                  text: "Xoá",
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                    presentAlert({
                      header: "Xoá bài viết",
                      message:
                        "Bạn có chắc chắn xoá vĩnh viễn bài viết này khỏi MyCLC không?",
                      buttons: [
                        "Huỷ",
                        {
                          text: "Xoá",
                          handler: (d) => {
                            setNews({ ...news, body: "" });
                            deleteNews(news);
                          },
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: "Cancel",
                  icon: close,
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
              ]}
            ></IonActionSheet>
          </IonCard>
        )
      ) : (
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
      )}
    </>
  );
};

export default NewsCard;
