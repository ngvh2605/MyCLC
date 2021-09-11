import {
  IonActionSheet,
  IonAlert,
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
  IonSpinner,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import {
  brush,
  chatbubbleEllipses,
  chevronDown,
  close,
  ellipsisHorizontal,
  heart,
  heartOutline,
  send,
  star,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../../auth";
import { database, firestore } from "../../../firebase";
import {
  getInfoByUserId,
  isNewLikedByUser,
  likeNews,
  unlikeNews,
} from "../services";
import {
  Comment,
  News,
  toComment,
  toNews,
  VerifyStatus,
} from "./../../../models";

interface stateType {
  news: News;
  authorInfo: any;
  isLiked: boolean;
}

const ViewNewsPage: React.FC = () => {
  const { userId } = useAuth();
  const location = useLocation<stateType>();

  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: false,
    phoneVerify: false,
    personalInfo: false,
    hasAvatar: false,
  });

  const [news, setNews] = useState<News>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentAuthors, setCommentAuthors] = useState<any[]>([]);

  const [text, setText] = useState("");
  const [chosenComment, setChosenComment] = useState<Comment>();
  const [limitComment, setLimitComment] = useState(3);

  const [showActionSheet, setShowActionSheet] = useState(false);

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    readStatus();
    if (location.state) {
      const temp = location.state["news"];
      setNews({
        ...temp,
        authorInfo: location.state["authorInfo"],
        isLiked: location.state["isLiked"],
      });

      console.log("temp", temp);
      firestore
        .collection("news")
        .doc(temp.id)
        .collection("comment")
        .orderBy("timestamp", "desc")
        .onSnapshot(({ docs }) => {
          setComments(docs.map(toComment));
        });
    }
  }, [location]);

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

  const readStatus = () => {
    const userData = database.ref().child("users").child(userId);
    userData.child("verify").on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setVerifyStatus(data);
      } else {
        setVerifyStatus({
          emailVerify: false,
          phoneVerify: false,
          personalInfo: false,
          hasAvatar: false,
        });
        console.log("No data available");
      }
    });
  };

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
        body: text,
        author: userId,
        timestamp: moment(moment.now()).format(),
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
            <IonBackButton text="Huỷ" defaultHref="/my/home" />
          </IonButtons>
          <IonButtons slot="end"></IonButtons>
          <IonTitle>CLC News</IonTitle>
        </IonToolbar>
      </IonHeader>

      {news ? (
        <IonContent>
          {news.pictureUrl ? (
            <IonImg src={news.pictureUrl ? news.pictureUrl : ""} />
          ) : (
            <></>
          )}
          <div>
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
              <IonButton onClick={() => console.log(commentAuthors)}>
                Click
              </IonButton>
              <IonAvatar slot="start">
                <IonImg
                  src={
                    news.authorInfo && news.authorInfo.avatar
                      ? news.authorInfo.avatar
                      : "/assets/image/placeholder.png"
                  }
                />
              </IonAvatar>
              <IonLabel text-wrap color="dark">
                <p>
                  <b>
                    {news.authorInfo && news.authorInfo.fullName
                      ? news.authorInfo.fullName
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
                  </IonNote>
                  {" · "}
                  {moment(news.timestamp).locale("vi").format("Do MMM, H:mm")}
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
                {decodeURI(news.body)}
              </IonLabel>
            </IonCardContent>

            <hr
              className="ion-margin"
              style={{
                borderBottom: "1px solid",
                opacity: 0.2,
                marginBottom: 10,
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
                      {news.totalComments > 0 ? news.totalComments : ""} Bình
                      luận
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
                        {news.totalLikes > 0 ? news.totalLikes : ""} Yêu thích
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
                      <IonAvatar slot="start">
                        <IonImg src={commentAuthors[index].avatar} />
                      </IonAvatar>
                    ) : (
                      <IonAvatar slot="start">
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
                            hidden={comment.author != userId}
                          />
                          {commentAuthors[index] &&
                            commentAuthors[index].fullName && (
                              <p style={{ paddingBottom: 5 }}>
                                <b>{commentAuthors[index].fullName}</b>
                              </p>
                            )}
                          {decodeURI(comment.body)}
                        </IonLabel>
                      </IonChip>
                      <IonLabel
                        text-wrap
                        color="medium"
                        className="ion-float-right"
                      >
                        <b>#{comment.order}</b>
                        {" · "}
                        <i>
                          {moment(comment.timestamp).locale("vi").fromNow()}
                        </i>
                      </IonLabel>
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
                Đọc thêm
                <br />
                <IonIcon icon={chevronDown} />
              </IonLabel>
            </IonButton>
          </div>
          <IonLoading isOpen={false} />

          <IonAlert
            isOpen={showAlert}
            onDidDismiss={() => {
              setShowAlert(false);
              history.replace("/my/home");
            }}
            cssClass="my-custom-class"
            header={alertHeader}
            message={alertMessage}
            buttons={["OK"]}
          />

          <IonActionSheet
            isOpen={showActionSheet}
            onDidDismiss={() => setShowActionSheet(false)}
            cssClass="my-custom-class"
            buttons={[
              {
                text: "Chỉnh sửa",
                icon: brush,
                handler: () => {
                  presentAlert({
                    header: "Sửa bình luận",
                    inputs: [
                      {
                        placeholder: "Nhập bình luận mới",
                        name: "text",
                        type: "text",
                      },
                    ],
                    buttons: [
                      "Huỷ",
                      {
                        text: "Xong",
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
                text: "Xoá",
                role: "destructive",
                icon: trash,
                handler: () => {
                  presentAlert({
                    header: "Xoá bình luận",
                    message:
                      "Bạn có chắc chắn xoá vĩnh viễn bình luận này khỏi MyCLC không?",
                    buttons: [
                      "Huỷ",
                      {
                        text: "Xoá",
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
                text: "Cancel",
                icon: close,
                role: "cancel",
                handler: () => {
                  console.log("Cancel clicked");
                },
              },
            ]}
          ></IonActionSheet>
        </IonContent>
      ) : (
        <></>
      )}
      <IonFooter>
        <IonToolbar>
          <IonItem
            lines="none"
            style={{ paddingTop: 10, paddingBottom: 10 }}
            hidden={
              !(
                verifyStatus.emailVerify &&
                verifyStatus.phoneVerify &&
                verifyStatus.personalInfo
              )
            }
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
                placeholder="Nhập bình luận (tối thiểu 15 chữ cái)"
                autocapitalize="sentences"
                minlength={15}
                value={text}
                onIonChange={(e) => setText(e.detail.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter" && text.length >= 15) commentNews();
                }}
                disabled={status.loading}
              ></IonInput>
            </IonChip>
            <IonButton
              hidden={status.loading}
              fill="clear"
              style={{ width: "wrap-content", float: "right" }}
              disabled={text.length < 15}
              onClick={commentNews}
            >
              <IonIcon icon={send} style={{ textAlign: "right" }} />
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
            hidden={
              verifyStatus.emailVerify &&
              verifyStatus.phoneVerify &&
              verifyStatus.personalInfo
            }
          >
            <IonLabel text-wrap className="ion-padding">
              Bạn cần thực hiện đủ 3 bước xác minh để có thể bình luận!
            </IonLabel>
          </IonChip>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ViewNewsPage;
