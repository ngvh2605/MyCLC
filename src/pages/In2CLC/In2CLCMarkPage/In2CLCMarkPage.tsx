import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonImg,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import RefresherItem from "../../../components/CommonUI/RefresherItem";
import { auth, database, firestore } from "../../../firebase";
import { Answer, toAnswer } from "../model";

const In2CLCMarkPage: React.FC = () => {
  const history = useHistory();
  const [answers, setAnswers] = useState<Answer[]>();
  const [loading, setLoading] = useState(false);

  const [presentToast] = useIonToast();
  const [presentAlert] = useIonAlert();

  useEffect(() => {
    if (
      auth.currentUser.email === "clbclcmultimedia@gmail.com" ||
      auth.currentUser.email === "ngvh2605@gmail.com"
    )
      fetchAnswers();
    else history.push("/my/in2clc");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("answers", answers);
  }, [answers]);

  const fetchAnswers = async () => {
    firestore
      .collection("in2clc")
      .where("isMarked", "==", false)
      .limit(10)
      .get()
      .then(({ docs }) => {
        if (docs && docs.length > 0) {
          setAnswers(docs.map(toAnswer));
        }
      });
  };

  const submitMark = async (
    answer: Answer,
    index: number,
    approved: boolean
  ) => {
    try {
      await firestore.doc(`in2clc/${answer.code}_${answer.email}`).update({
        isMarked: true,
        isApproved: approved,
      });
      if (approved) {
        database
          .ref()
          .child("in2clc")
          .child(answer.userId)
          .child("total")
          .get()
          .then(async (data) => {
            if (data.exists) {
              await database
                .ref()
                .child("in2clc")
                .child(answer.userId)
                .update({
                  total: data.val() + 1,
                });
            } else
              await database.ref().child("in2clc").child(answer.userId).update({
                total: 1,
              });
          });
      }
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
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>In2CLC</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <RefresherItem
          handleRefresh={() => {
            fetchAnswers();
          }}
        />

        {answers &&
        answers.filter((answer) => {
          return !answer.isMarked;
        }).length > 0 ? (
          answers.map((answer, index) => (
            <IonCard key={index} hidden={answer.isMarked}>
              <IonCardContent style={{ paddingBottom: 0 }}>
                <IonLabel text-wrap color="dark">
                  Nhiệm vụ:{" "}
                  <IonText color="primary">
                    <b>{answer.code}</b>
                  </IonText>
                  <br />
                  Mentor:{" "}
                  <IonText color="primary">
                    <b>{answer.email}</b>
                  </IonText>
                  <IonCardSubtitle color="primary" className="ion-margin-top">
                    Câu trả lời
                  </IonCardSubtitle>
                  {answer.text && (
                    <IonLabel
                      color="dark"
                      text-wrap
                      style={{ whiteSpace: "pre-wrap" }}
                    >
                      {decodeURI(answer.text)}
                    </IonLabel>
                  )}
                </IonLabel>
              </IonCardContent>
              {answer.image && (
                <IonImg
                  src={answer.image}
                  style={{ borderRadius: 10 }}
                  className="ion-margin-vertical"
                />
              )}
              <IonCardContent style={{ paddingTop: 0 }}>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        color="success"
                        expand="block"
                        onClick={() => {
                          presentAlert({
                            header: "Duyệt?",
                            message: "Sau khi gửi thì không thể sửa được nữa",
                            buttons: [
                              "Huỷ",
                              {
                                text: "Đồng ý",
                                handler: () => {
                                  setLoading(true);
                                  submitMark(answer, index, true);
                                },
                              },
                            ],
                          });
                        }}
                      >
                        Duyệt
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        color="danger"
                        expand="block"
                        onClick={() => {
                          presentAlert({
                            header: "Không duyệt?",
                            message: "Sau khi gửi thì không thể sửa được nữa",
                            buttons: [
                              "Huỷ",
                              {
                                text: "Đồng ý",
                                handler: () => {
                                  setLoading(true);
                                  submitMark(answer, index, false);
                                },
                              },
                            ],
                          });
                        }}
                      >
                        Không duyệt
                      </IonButton>
                    </IonCol>
                  </IonRow>
                </IonGrid>
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

export default In2CLCMarkPage;
