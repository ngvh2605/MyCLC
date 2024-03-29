/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonActionSheet,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonRow,
  IonSkeletonText,
  IonSpinner,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Autolinker from "autolinker";
import {
  brush,
  chatbubbleEllipses,
  checkmarkCircle,
  chevronDown,
  close,
  ellipsisHorizontal,
  heart,
  heartOutline,
  send,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../../auth";
import useCheckUserVerify from "../../../common/useCheckUserVerify";
import { firestore } from "../../../firebase";
import { deleteNews, getInfoByUserId, likeNews, unlikeNews } from "../services";
import { Comment, News, toComment } from "./../../../models";
interface stateType {
  news: News;
  authorInfo: any;
  isLiked: boolean;
}

interface RouteParams {
  id: string;
}

const ViewNewsPage: React.FC = () => {
  const { t } = useTranslation();
  const { userId } = useAuth();
  const { id } = useParams<RouteParams>();
  const { isVerify } = useCheckUserVerify(userId);

  const location = useLocation<stateType>();

  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });

  const [news, setNews] = useState<News>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<any[]>([]);

  const [text, setText] = useState("");
  const [chosenComment, setChosenComment] = useState<Comment>();
  const [limitComment, setLimitComment] = useState(3);

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [showNewsActionSheet, setShowNewsActionSheet] = useState(false);

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (location.state) {
      try {
        const temp = location.state["news"];
        setNews({
          ...temp,
          authorInfo: location.state["authorInfo"],
          isLiked: location.state["isLiked"],
        });

        //console.log("temp", temp);
        firestore
          .collection("news")
          .doc(temp.id)
          .collection("comment")
          .orderBy("timestamp", "desc")
          .onSnapshot(({ docs }) => {
            setComments(docs.map(toComment));
          });
      } catch (error) {
        console.log(error);
      }
    }
  }, [id]);

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      let tempInfo = [];
      for (let item of comments) {
        tempInfo.push(await getInfoByUserId(item.author));
      }
      setCommentAuthors(tempInfo);
    };
    if (comments.length > 0) {
      fetchAuthorInfo();
    }
  }, [comments]);

  const commentNews = async () => {
    setStatus({ loading: true, error: false });
    await firestore
      .collection("news")
      .doc(news.id)
      .update({
        totalComments: news.totalComments ? news.totalComments + 1 : 1,
        count: news.count ? news.count + 1 : 1,
      });
    await firestore
      .collection("news")
      .doc(news.id)
      .collection("comment")
      .add({
        body: encodeURI(text),
        author: userId,
        timestamp: moment().valueOf(),
        order: news.count ? news.count + 1 : 1,
      });

    setText("");
    setLimitComment(limitComment + 1);
    setNews({
      ...news,
      totalComments: news.totalComments ? news.totalComments + 1 : 1,
      count: news.count ? news.count + 1 : 1,
    });
    setStatus({ loading: false, error: false });
  };

  const handleReaction = (isLiked: boolean) => {
    let temp: News = { ...news };
    temp = {
      ...temp,
      isLiked: isLiked,
      totalLikes: isLiked
        ? temp.totalLikes
          ? temp.totalLikes + 1
          : 1
        : temp.totalLikes - 1,
    };
    setNews(temp);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/home" />
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
          <IonTitle>CLC News</IonTitle>
        </IonToolbar>
      </IonHeader>

      {news ? (
        <IonContent>
          <div style={{ maxWidth: 680, margin: "0 auto" }}>
            {news.pictureUrl && (
              <>
                {imgLoaded ? null : (
                  <IonSkeletonText
                    animated
                    style={{
                      width:
                        window.screen.width > 680 ? 680 : window.screen.width,
                      height:
                        window.screen.width > 680
                          ? 680 / news.pictureRatio
                          : window.screen.width / news.pictureRatio,
                    }}
                    className="ion-no-margin"
                  />
                )}

                <IonImg
                  src={news.pictureUrl}
                  hidden={!news.pictureUrl}
                  onIonImgDidLoad={() => setImgLoaded(true)}
                  style={!imgLoaded ? { opacity: 0 } : { opacity: 1 }}
                />
              </>
            )}

            <div>
              <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
                <IonAvatar
                  slot="start"
                  onClick={() => {
                    history.push(`/my/user/${news.author}`);
                  }}
                >
                  <IonImg
                    src={
                      news.authorInfo && news.authorInfo.avatar
                        ? news.authorInfo.avatar
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
                      setShowNewsActionSheet(true);
                    }}
                    hidden={news && news.author !== userId}
                    style={{ fontSize: "large", paddingLeft: 8 }}
                  />
                  <IonText
                    onClick={() => {
                      history.push(`/my/user/${news.author}`);
                    }}
                  >
                    <b>
                      {news.authorInfo && news.authorInfo.fullName
                        ? news.authorInfo.fullName
                        : ""}
                    </b>
                  </IonText>
                  <IonLabel>
                    <IonText color="primary">
                      <IonIcon
                        icon={checkmarkCircle}
                        style={{ fontSize: "small" }}
                      />
                      {news.authorInfo &&
                        news.authorInfo.title &&
                        " " + news.authorInfo.title}
                    </IonText>
                    <IonText color="medium">
                      {" · "}
                      <i>
                        {moment(news.timestamp)
                          .locale(localStorage.getItem("i18nLanguage") || "vi")
                          .format("Do MMM, H:mm")}
                      </i>
                    </IonText>
                  </IonLabel>
                </IonLabel>
              </IonItem>
              <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
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
                style={{
                  marginLeft: 0,
                  marginRight: 0,
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
                    >
                      <IonIcon
                        icon={chatbubbleEllipses}
                        color="primary"
                        style={{ fontSize: "large" }}
                        slot="start"
                      />

                      <IonLabel color="primary" style={{ fontSize: "small" }}>
                        {news.totalComments > 0 ? news.totalComments : ""}{" "}
                        {t("Comment")}
                      </IonLabel>
                    </IonButton>
                  </IonCol>
                  <IonCol
                    className="ion-align-self-center"
                    style={{ textAlign: "center" }}
                  >
                    {news.isLiked ? (
                      <IonButton
                        fill="clear"
                        expand="full"
                        style={{ height: "max-content" }}
                        onClick={() => {
                          unlikeNews(userId, news.id);
                          handleReaction(false);
                        }}
                      >
                        <IonIcon
                          icon={heart}
                          color="danger"
                          style={{ fontSize: "large" }}
                          slot="start"
                        />

                        <IonLabel color="danger" style={{ fontSize: "small" }}>
                          {news.totalLikes} {t("Love")}
                        </IonLabel>
                      </IonButton>
                    ) : (
                      <IonButton
                        fill="clear"
                        expand="full"
                        style={{ height: "max-content" }}
                        onClick={() => {
                          likeNews(userId, news.id);
                          handleReaction(true);
                        }}
                      >
                        <IonIcon
                          icon={heartOutline}
                          color="dark"
                          style={{ fontSize: "large" }}
                          slot="start"
                        />

                        <IonLabel color="dark" style={{ fontSize: "small" }}>
                          {news.totalLikes > 0 ? news.totalLikes : ""}{" "}
                          {t("Love")}
                        </IonLabel>
                      </IonButton>
                    )}
                  </IonCol>
                </IonRow>
              </IonGrid>

              <IonList>
                {comments &&
                  comments.slice(0, limitComment).map((comment, index) => (
                    <IonItem
                      key={index}
                      lines="none"
                      style={{ marginTop: 10, marginBottom: 10 }}
                    >
                      {commentAuthors[index] && commentAuthors[index].avatar ? (
                        <IonAvatar
                          slot="start"
                          onClick={() => {
                            history.push(`/my/user/${comments[index].author}`);
                          }}
                        >
                          <IonImg src={commentAuthors[index].avatar} />
                        </IonAvatar>
                      ) : (
                        <IonAvatar
                          slot="start"
                          onClick={() => {
                            history.push(`/my/user/${comments[index].author}`);
                          }}
                        >
                          <IonImg src={"assets/image/placeholder.png"} />
                        </IonAvatar>
                      )}
                      <div style={{ width: "100%" }}>
                        <IonChip
                          color="medium"
                          style={{ width: "100%", height: "max-content" }}
                        >
                          <IonLabel
                            text-wrap
                            color="dark"
                            style={{ whiteSpace: "pre-wrap", width: "100%" }}
                          >
                            <IonIcon
                              icon={ellipsisHorizontal}
                              className="ion-float-right"
                              color="medium"
                              onClick={() => {
                                setChosenComment(comment);
                                setShowActionSheet(true);
                              }}
                              hidden={comment.author !== userId}
                              style={{ fontSize: "large", paddingLeft: 8 }}
                            />
                            {commentAuthors[index] &&
                              commentAuthors[index].fullName && (
                                <IonText
                                  style={{ paddingBottom: 5 }}
                                  onClick={() => {
                                    history.push(
                                      `/my/user/${comments[index].author}`
                                    );
                                  }}
                                >
                                  <b>{commentAuthors[index].fullName}</b>
                                </IonText>
                              )}
                            <div
                              dangerouslySetInnerHTML={{
                                __html: Autolinker.link(
                                  decodeURI(comment.body),
                                  {
                                    truncate: { length: 50, location: "smart" },
                                  }
                                ),
                              }}
                            ></div>
                          </IonLabel>
                        </IonChip>
                        <IonNote>
                          <IonLabel
                            text-wrap
                            color="medium"
                            className="ion-float-right"
                          >
                            <b>#{comment.order}</b>
                            {" · "}
                            <i>
                              {moment(comment.timestamp)
                                .locale(
                                  localStorage.getItem("i18nLanguage") || "vi"
                                )
                                .fromNow()}
                            </i>
                          </IonLabel>
                        </IonNote>
                      </div>
                    </IonItem>
                  ))}
              </IonList>

              <IonButton
                fill="clear"
                color="primary"
                hidden={
                  news.totalComments
                    ? limitComment >= news.totalComments
                      ? true
                      : false
                    : true
                }
                onClick={() => setLimitComment(limitComment + 2)}
                style={{
                  display: "block",
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              >
                <IonLabel>
                  {t("Read more")}
                  <br />
                  <IonIcon icon={chevronDown} />
                </IonLabel>
              </IonButton>
            </div>
            <IonLoading isOpen={false} />

            <IonActionSheet
              isOpen={showActionSheet}
              onDidDismiss={() => setShowActionSheet(false)}
              cssClass="my-custom-class"
              buttons={[
                {
                  text: t("Edit"),
                  icon: brush,
                  handler: () => {
                    presentAlert({
                      header: t("Edit"),
                      inputs: [
                        {
                          placeholder: t("Enter text"),
                          name: "text",
                          type: "text",
                        },
                      ],
                      buttons: [
                        t("Cancel"),
                        {
                          text: t("Done"),
                          handler: async (d) => {
                            await firestore
                              .collection("news")
                              .doc(news.id)
                              .collection("comment")
                              .doc(chosenComment.id)
                              .update({
                                body: d.text,
                                order: parseFloat(
                                  (chosenComment.order + 0.01).toFixed(2)
                                ),
                                lastEdited: moment(moment.now()).format(),
                              });
                          },
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: t("Delete"),
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                    presentAlert({
                      header: t("Are you sure?"),
                      message: t("This will be permanently deleted"),
                      buttons: [
                        t("Cancel"),
                        {
                          text: t("Delete"),
                          handler: (d) => {
                            firestore
                              .collection("news")
                              .doc(news.id)
                              .collection("comment")
                              .doc(chosenComment.id)
                              .delete();
                            firestore
                              .collection("news")
                              .doc(news.id)
                              .update({
                                totalComments: news.totalComments - 1,
                              });
                            setNews({
                              ...news,
                              totalComments: news.totalComments - 1,
                            });
                          },
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: t("Cancel"),
                  icon: close,
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
              ]}
            ></IonActionSheet>

            <IonActionSheet
              isOpen={showNewsActionSheet}
              onDidDismiss={() => setShowNewsActionSheet(false)}
              cssClass="my-custom-class"
              buttons={[
                {
                  text: t("Edit"),
                  icon: brush,
                  handler: () => {
                    history.push({
                      pathname: `/my/home/add/${news.id}`,
                      state: news,
                    });
                  },
                },
                {
                  text: t("Delete"),
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                    presentAlert({
                      header: t("Are you sure?"),
                      message: t("This will be permanently deleted"),
                      buttons: [
                        t("Cancel"),
                        {
                          text: t("Delete"),
                          handler: (d) => {
                            setNews({ ...news, body: "" });
                            deleteNews(news);
                            history.goBack();
                          },
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: t("Cancel"),
                  icon: close,
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
              ]}
            ></IonActionSheet>
          </div>
        </IonContent>
      ) : (
        <IonContent></IonContent>
      )}
      <IonFooter>
        <IonToolbar>
          <IonItem
            lines="none"
            style={{ paddingTop: 10, paddingBottom: 10 }}
            hidden={!isVerify}
          >
            <IonChip
              color="medium"
              style={{
                width: "100%",
                height: "max-content",
              }}
            >
              <IonInput
                type="text"
                color="dark"
                placeholder={t("Enter text (minimum 30 characters)")}
                autocapitalize="sentences"
                minlength={30}
                value={text}
                onIonChange={(e) => {
                  setText(e.detail.value);
                  console.log(e.detail.value.length);
                }}
                onKeyPress={(event) => {
                  if (event.key === "Enter" && text.length >= 30) commentNews();
                }}
                disabled={status.loading}
              ></IonInput>
            </IonChip>
            <IonButton
              hidden={status.loading}
              fill="clear"
              style={
                text.length < 30
                  ? { width: "wrap-content", float: "right", opacity: 0.5 }
                  : { width: "wrap-content", float: "right", opacity: 1 }
              }
              onClick={() => {
                if (text.length >= 30) commentNews();
              }}
            >
              <IonIcon
                icon={send}
                color="primary"
                style={{ textAlign: "right" }}
              />
            </IonButton>
            <IonSpinner
              hidden={!status.loading}
              style={{ marginLeft: 5, marginRight: 5 }}
              name="lines-small"
              color="primary"
            />
          </IonItem>

          <IonChip
            color="primary"
            style={{ height: "max-content", marginBottom: 10 }}
            className="ion-margin"
            hidden={isVerify}
          >
            <IonLabel text-wrap className="ion-padding">
              {t(
                "You need to complete 3 verification steps to be able to comment!"
              )}
            </IonLabel>
          </IonChip>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ViewNewsPage;
