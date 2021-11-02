import { RefresherEventDetail } from "@ionic/core";
import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonContent,
  IonHeader,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { chevronDown } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../../../auth";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import { firestore } from "../../../firebase";
import { Answer, toAnswer } from "../model";
import useAdventureCheck from "../useAdventureCheck";
import "./AdventureMarkPage.scss";

const AdventureMarkPage: React.FC = () => {
  const { userId } = useAuth();
  const { allowMark } = useAdventureCheck(userId);
  const [answers, setAnswers] = useState<Answer[]>();
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);

  useIonViewWillEnter(() => {
    if (!allowMark) return <Redirect to="/my/adventure" />;
  });

  useEffect(() => {
    fetchAnswers();
  }, []);

  const fetchAnswers = async () => {
    firestore
      .collection("adventureAnswer")
      .where("isMarked", "==", false)
      .limit(10)
      .get()
      .then(({ docs }) => {
        if (docs && docs.length > 0) {
          setAnswers(docs.map(toAnswer));
        }
      });
  };

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchAnswers();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const submitMark = async (answer: Answer, index: number) => {
    try {
      await firestore
        .doc(`adventureAnswer/${answer.teamId}_${answer.key}`)
        .update({
          score: answer.score,
          isMarked: true,
        });
      firestore
        .collection("adventure")
        .doc(answer.teamId)
        .get()
        .then(async (doc) => {
          const score = doc.data().score;
          await firestore
            .collection("adventure")
            .doc(answer.teamId)
            .update({
              score: score + answer.score,
            });
        });
      let temp = [...answers];
      temp[index] = { ...temp[index], isMarked: true };
      setAnswers(temp);
      setLoading(false);
    } catch (e: any) {
      presentToast({
        message: e,
        duration: 2000,
        color: "danger",
      });
    }
  };

  return (
    <IonPage id="adventure-mark">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Adventure Hunt</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>

        {answers &&
        answers.filter((answer) => {
          return !answer.isMarked;
        }).length > 0 ? (
          answers.map((answer, index) => (
            <IonCard key={index}>
              <IonCardContent>
                <IonLabel text-wrap color="dark">
                  Đội chơi:{" "}
                  <IonText color="primary">
                    <b>{answer.teamId}</b>
                  </IonText>
                  <br />
                  Thử thách:{" "}
                  <IonText color="primary">
                    <b>{answer.key}</b>
                  </IonText>
                  <br />
                  Thời gian nộp:{" "}
                  <IonText color="primary">
                    <b>
                      {moment(answer.timestamp).format("dddd, DD MMM, H:mm")}
                    </b>
                  </IonText>
                </IonLabel>
                <IonCardSubtitle color="primary" className="ion-margin-top">
                  Câu trả lời
                </IonCardSubtitle>
                {answer.text && (
                  <IonLabel color="dark" text-wrap>
                    {answer.text}
                  </IonLabel>
                )}
                {answer.image && <IonImg src={answer.image} />}
                <IonCardSubtitle color="primary" className="ion-margin-top">
                  Chấm điểm
                </IonCardSubtitle>
                <IonItem lines="none" className="ion-no-padding">
                  <IonInput
                    placeholder="Nhập số điểm"
                    type="number"
                    min="100"
                    value={answer.score === 0 ? undefined : answer.score}
                    onIonChange={(e) => {
                      let temp = [...answers];
                      temp[index] = {
                        ...temp[index],
                        score: parseInt(e.detail.value),
                      };
                      setAnswers(temp);
                    }}
                  />
                  <IonNote slot="end" className="ion-no-margin">
                    <IonButton
                      shape="round"
                      disabled={
                        !answer.score ||
                        typeof answer.score !== "number" ||
                        answer.score < 100 ||
                        answer.score > 1000
                      }
                      onClick={() => {
                        if (
                          !answer.score ||
                          typeof answer.score !== "number" ||
                          answer.score < 100 ||
                          answer.score > 1000
                        )
                          presentToast({
                            message: "Vui lòng nhập số điểm hợp lệ",
                            duration: 2000,
                            color: "danger",
                          });
                        else
                          presentAlert({
                            header: "Chấm điểm?",
                            message:
                              "Sau khi gửi điểm không thể sửa điểm số được nữa",
                            buttons: [
                              "Huỷ",
                              {
                                text: "Đồng ý",
                                handler: () => {
                                  setLoading(true);
                                  submitMark(answer, index);
                                },
                              },
                            ],
                          });
                      }}
                    >
                      Gửi
                    </IonButton>
                  </IonNote>
                </IonItem>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <EmptyUI />
        )}

        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default AdventureMarkPage;
