/* eslint-disable react-hooks/exhaustive-deps */
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
import Autolinker from "autolinker";
import {
  brush,
  chatbubbleEllipses,
  checkmarkCircle,
  close,
  ellipsisHorizontal,
  heart,
  heartOutline,
  trash,
} from "ionicons/icons";
import moment from "moment";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import { News, toNews } from "../../../models";
import {
  deleteNews,
  getInfoByUserId,
  likeNews,
  unlikeNews,
} from "./../services";
import "./NewsCard.scss";

const NewsCard: React.FC<any> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { newId, handleDelete } = props;

  const [news, setNews] = useState<News | undefined>(undefined);
  const [isLiked, setIsLiked] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<any>({});
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    const onNews = firestore
      .collection("news")
      .doc(newId)
      .onSnapshot((doc) => {
        doc.exists && setNews(toNews(doc));
      });
    const onLike = firestore
      .collection("newsReaction")
      .where("newId", "==", newId)
      .where("userId", "==", userId)
      .onSnapshot((doc) => {
        if (doc.empty) setIsLiked(false);
        else setIsLiked(true);
      });
    return () => {
      onNews();
      onLike();
    };
  }, [newId]);

  useEffect(() => {
    const getAuthor = async () => {
      setAuthorInfo(await getInfoByUserId(news.author));
    };
    if (news) getAuthor();
  }, [news]);

  return (
    <>
      {news ? (
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <IonCard>
            {news.pictureUrl && news.pictureRatio && (
              <>
                {imgLoaded ? null : (
                  <IonSkeletonText
                    animated
                    style={{
                      width:
                        window.screen.width - 32 > 648
                          ? 648
                          : window.screen.width - 32,
                      height:
                        window.screen.width - 32 > 648
                          ? 648 / news.pictureRatio
                          : (window.screen.width - 32) / news.pictureRatio,
                      margin: 0,
                    }}
                  />
                )}
                <IonImg
                  hidden={!news.pictureUrl}
                  src={news.pictureUrl}
                  onIonImgDidLoad={(event) => {
                    setImgLoaded(true);
                  }}
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
                  style={
                    !imgLoaded
                      ? { opacity: 0, width: 0, height: 0 }
                      : { opacity: 1 }
                  }
                />
              </>
            )}
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
              <IonAvatar
                slot="start"
                onClick={() => {
                  history.push(`/my/user/${news.author}`);
                }}
              >
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
                  hidden={news.author !== userId}
                  style={{ fontSize: "large", paddingLeft: 8 }}
                />
                <IonText color="dark">
                  <p
                    onClick={() => {
                      history.push(`/my/user/${news.author}`);
                    }}
                  >
                    <b>
                      {authorInfo && authorInfo.fullName
                        ? authorInfo.fullName
                        : ""}
                    </b>
                  </p>
                </IonText>
                <IonLabel>
                  <IonText color="primary">
                    <IonIcon
                      icon={checkmarkCircle}
                      style={{ fontSize: "small" }}
                    />
                    {authorInfo && authorInfo.title && " " + authorInfo.title}
                  </IonText>
                  <IonText color="medium">
                    {" · "}
                    <i>
                      {moment(news.timestamp)
                        .locale("vi")
                        .format("Do MMM, H:mm")}
                    </i>
                  </IonText>
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
                <div
                  dangerouslySetInnerHTML={{
                    __html: Autolinker.link(decodeURI(news.body), {
                      truncate: { length: 50, location: "smart" },
                    }),
                  }}
                ></div>
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
                            // setNews(undefined);
                            handleDelete(news.id);
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
        </div>
      ) : (
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
      )}
    </>
  );
};

export default NewsCard;
