import {
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonCard,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  chatbubbleEllipses,
  heart,
  heartOutline,
  image,
  send,
  star,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import { useAuth } from "../../../auth";
import { firestore } from "../../../firebase";
import {
  getComment,
  getInfoByUserId,
  isNewLikedByUser,
  likeNews,
  unlikeNews,
} from "../services";
import { News, toNews, Comment } from "./../../../models";

interface RouteParams {
  id: string;
}

const ViewNewsPage: React.FC = () => {
  const { userId } = useAuth();
  const { id } = useParams<RouteParams>();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const [news, setNews] = useState<News>({
    id: "",
    author: "",
    timestamp: moment().format(),
    body: "",
    pictureUrl: "",
    authorInfo: {},
  });
  const [text, setText] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const temp = toNews(await firestore.collection("news").doc(id).get());
    let tempComment: Comment[] = await getComment(id);
    let array: Comment[] = [];
    for (const item of tempComment) {
      array.push({
        ...item,
        authorInfo: await getInfoByUserId(item.author),
      });
    }
    console.log(temp);
    setNews({
      ...temp,
      comment: array,
      isLiked: await isNewLikedByUser(userId, id),
      authorInfo: await getInfoByUserId(temp.author),
    });
    setLoading(false);
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
      {!loading ? (
        <IonContent>
          {news.pictureUrl ? (
            <IonImg src={news.pictureUrl ? news.pictureUrl : ""} />
          ) : (
            <></>
          )}

          <IonButton onClick={() => console.log(news)}>Click</IonButton>
          <div className="ion-padding">
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
              <IonAvatar slot="start">
                <IonImg src={news.authorInfo.avatar} />
              </IonAvatar>
              <IonLabel text-wrap color="dark">
                <p>
                  <b>{news.authorInfo.fullName}</b>
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
              {news.comment &&
                news.comment.map((comment, index) => (
                  <IonItem
                    key={index}
                    lines="none"
                    style={{ marginTop: 10, marginBottom: 10 }}
                  >
                    {comment.authorInfo.avatar && (
                      <IonAvatar slot="start">
                        <IonImg src={comment.authorInfo.avatar} />
                      </IonAvatar>
                    )}
                    <IonChip
                      color="medium"
                      style={{ width: "100%", height: "max-content" }}
                    >
                      <IonLabel
                        text-wrap
                        color="dark"
                        style={{ whiteSpace: "pre-wrap" }}
                      >
                        {comment.authorInfo.fullName && (
                          <p style={{ paddingBottom: 5 }}>
                            <b>{comment.authorInfo.fullName}</b>
                            {" · "}
                            <i>
                              {moment(comment.timestamp).locale("vi").fromNow()}
                            </i>
                          </p>
                        )}
                        {decodeURI(comment.body)}
                      </IonLabel>
                    </IonChip>
                  </IonItem>
                ))}
            </IonList>
          </div>
          <IonLoading isOpen={status.loading} />

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
        </IonContent>
      ) : (
        <IonContent className="ion-padding">
          <IonLabel>Loading</IonLabel>
        </IonContent>
      )}
      <IonFooter>
        <IonToolbar>
          <IonItem lines="none" style={{ paddingTop: 10, paddingBottom: 10 }}>
            <IonChip
              color="medium"
              style={{
                width: "100%",
                height: "max-content",
              }}
            >
              <IonInput
                type="text"
                placeholder="Nhập bình luận"
                autocapitalize="sentences"
                value={text}
                onIonChange={(e) => setText(e.detail.value)}
              ></IonInput>
            </IonChip>
            <IonButton
              fill="clear"
              style={{ width: "wrap-content", float: "right" }}
              disabled={!text}
            >
              <IonIcon icon={send} style={{ textAlign: "right" }} />
            </IonButton>
          </IonItem>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default ViewNewsPage;
