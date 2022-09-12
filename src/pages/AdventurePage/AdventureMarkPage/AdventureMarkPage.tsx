import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRange,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
  useIonViewWillEnter,
} from "@ionic/react";
import { add, helpCircleOutline, trashBin, trophy } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { useAuth } from "../../../auth";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import RefresherItem from "../../../components/CommonUI/RefresherItem";
import { firestore } from "../../../firebase";

import { Answer, Mission } from "../model";
import useAdventureCheck from "../useAdventureCheck";
import "./AdventureMarkPage.scss";

const AdventureMarkPage: React.FC = () => {
  const { userId } = useAuth();
  const { allowMark } = useAdventureCheck(userId);
  const { t } = useTranslation();

  const [answers, setAnswers] = useState<Answer[]>();
  const [missions, setMissons] = useState<Mission[]>();
  const [newMission, setNewMission] = useState<Mission>({
    key: moment().valueOf(),
    title: "",
    body: "",
    point: 100,
  });

  const [showAddModal, setShowAddModal] = useState(false);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);

  const [segment, setSegment] = useState("mark");

  useIonViewWillEnter(() => {
    if (!allowMark) return <Redirect to="/my/adventure" />;
  });

  useEffect(() => {
    fetchMissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (missions && missions.length > 0) {
      fetchAnswers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [missions]);

  const fetchAnswers = async () => {
    firestore
      .collection("adventureAnswer")
      .where("userId", "==", userId)
      .where("isMarked", "==", false)
      .orderBy("timestamp", "asc")
      .limit(10)
      .get()
      .then(({ docs }) => {
        if (docs && docs.length > 0) {
          let temp: Answer[] = [];
          docs.forEach((doc) => {
            const item = doc.data() as Answer;
            temp.push({
              ...item,
              mission: missions.find((e) => {
                return e.key === item.key;
              }),
            });
          });

          setAnswers(temp);
        }
      });
  };

  const fetchMissions = async () => {
    firestore
      .collection("adventureMission")
      .doc("data")
      .get()
      .then((doc) => {
        if (doc.exists && doc.data() && doc.data()[userId]) {
          setMissons(JSON.parse(doc.data()[userId]));
        } else setMissons([]);
      });
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

  const handleAddMission = async () => {
    setLoading(true);
    let temp = [...missions];
    temp.push({ ...newMission });
    await firestore
      .collection("adventureMission")
      .doc("data")
      .update({
        [userId]: JSON.stringify(temp),
      });
    setMissons(temp);
    presentToast({
      message: t("Uploaded successfully"),
      color: "success",
      duration: 3000,
    });
    setShowAddModal(false);
    setLoading(false);
  };

  const deleteAnswer = async () => {};

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
        <RefresherItem
          handleRefresh={() => {
            fetchAnswers();
          }}
        />

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div className="ion-padding">
            <IonSegment
              color="primary"
              value={segment}
              onIonChange={(e) => setSegment(e.detail.value)}
            >
              <IonSegmentButton value="mark">Chấm điểm</IonSegmentButton>
              <IonSegmentButton value="mission">Nhiệm vụ</IonSegmentButton>
            </IonSegment>
          </div>

          {segment === "mark" ? (
            answers &&
            answers.filter((answer) => {
              return !answer.isMarked;
            }).length > 0 ? (
              answers.map((answer, index) => (
                <IonCard key={index} hidden={answer.isMarked}>
                  <IonCardContent>
                    <IonLabel text-wrap color="dark">
                      <IonIcon
                        icon={trashBin}
                        className="ion-float-right"
                        color="medium"
                        style={{ fontSize: "large", paddingLeft: 8 }}
                        onClick={() => {
                          //delete document
                          presentAlert({
                            header: t("Are you sure?"),
                            message: t("This will be permanently deleted"),
                            buttons: [
                              t("Cancel"),
                              {
                                text: t("Delete"),
                                handler: (d) => {
                                  deleteAnswer();
                                },
                              },
                            ],
                          });
                        }}
                      />
                      Đội:{" "}
                      <IonText color="primary">
                        <b>{answer.teamName}</b>
                      </IonText>
                      <br />
                      Nhiệm vụ:{" "}
                      <IonChip
                        color="primary"
                        onClick={() => {
                          presentAlert({
                            header: answer.mission.title,
                            subHeader: `Điểm tối đa: ${answer.mission.point}`,
                            message: answer.mission.body,
                            buttons: [{ text: "OK" }],
                          });
                        }}
                        style={{ marginBottom: 0 }}
                      >
                        <IonIcon icon={helpCircleOutline} />
                        <b>{answer.mission.title}</b>
                      </IonChip>
                      {/* <br />
                      Thời gian nộp:{" "}
                      <IonText color="primary">
                        <b>
                          {moment(answer.timestamp).format(
                            "dddd, DD MMM, H:mm"
                          )}
                        </b>
                      </IonText> */}
                    </IonLabel>
                    <IonCardSubtitle color="primary" className="ion-margin-top">
                      Câu trả lời
                    </IonCardSubtitle>
                    {answer.text && (
                      <IonLabel color="dark" text-wrap>
                        {answer.text}
                      </IonLabel>
                    )}
                    {answer.image && (
                      <IonThumbnail
                        style={{ width: "100%", height: "100%", marginTop: 8 }}
                      >
                        <IonImg
                          style={{ borderRadius: 8 }}
                          src={answer.image}
                        />
                      </IonThumbnail>
                    )}
                    <IonCardSubtitle
                      color="primary"
                      className="ion-margin-top"
                      style={{ marginBottom: 0 }}
                    >
                      Chấm điểm
                    </IonCardSubtitle>

                    <IonItem lines="none">
                      <IonLabel position="fixed">{answer.score}</IonLabel>
                      <IonRange
                        pin={false}
                        min={0}
                        max={answer.mission.point}
                        step={100}
                        value={answer.score}
                        onIonChange={(e) => {
                          let temp = [...answers];
                          temp[index] = {
                            ...temp[index],
                            score: parseInt(e.detail.value.valueOf() + ""),
                          };
                          setAnswers(temp);
                        }}
                        slot="end"
                      />
                    </IonItem>
                    <IonButton
                      expand="block"
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
                  </IonCardContent>
                </IonCard>
              ))
            ) : (
              <EmptyUI />
            )
          ) : (
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <IonButton
                expand="block"
                shape="round"
                className="ion-margin"
                onClick={() => {
                  setNewMission({
                    key: moment().valueOf(),
                    title: "",
                    body: "",
                    point: 100,
                  });
                  setShowAddModal(true);
                }}
              >
                <IonIcon icon={add} slot="start" />
                Thêm nhiệm vụ
              </IonButton>

              {missions && missions.length > 0 ? (
                missions.map((mission, index) => (
                  <IonCard key={index} onClick={() => {}}>
                    <IonCardContent>
                      <IonCardSubtitle color="primary">
                        <IonText
                          style={{ float: "right" }}
                          color={
                            mission.point < 400
                              ? "success"
                              : mission.point < 800
                              ? "warning"
                              : "danger"
                          }
                        >
                          {mission.point}{" "}
                          <IonIcon
                            icon={trophy}
                            style={{ fontSize: 11, verticalAlign: -1 }}
                          />
                        </IonText>
                        {mission.title}
                      </IonCardSubtitle>

                      <IonLabel text-wrap color="dark">
                        {mission.body}
                      </IonLabel>
                    </IonCardContent>
                  </IonCard>
                ))
              ) : (
                <EmptyUI />
              )}
            </div>
          )}
        </div>

        <IonModal
          isOpen={showAddModal}
          onDidDismiss={() => setShowAddModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Thêm nhiệm vụ</IonTitle>
              <IonButtons slot="start">
                <IonButton
                  onClick={() => {
                    setShowAddModal(false);
                  }}
                >
                  Huỷ
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  disabled={
                    !newMission.title || !newMission.body || !newMission.point
                  }
                  onClick={() => {
                    handleAddMission();
                  }}
                >
                  <b>Đăng</b>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="stacked">
                  {t("Title")} <span style={{ color: "red" }}>*</span>
                </IonLabel>
                <IonInput
                  type="text"
                  value={newMission.title}
                  onIonChange={(e) => {
                    setNewMission({
                      ...newMission,
                      title: e.detail.value,
                    });
                  }}
                  placeholder={t("Maximum 80 characters")}
                  maxlength={80}
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  {t("Description")} <span style={{ color: "red" }}>*</span>
                </IonLabel>
                <IonInput
                  type="text"
                  value={newMission.body}
                  onIonChange={(e) => {
                    setNewMission({
                      ...newMission,
                      body: e.detail.value,
                    });
                  }}
                  placeholder={t("Enter text")}
                />
              </IonItem>

              <IonItem>
                <IonLabel>
                  {t("Point")} <span style={{ color: "red" }}>*</span>
                  <p style={{ paddingTop: 4, fontSize: 17 }}>
                    <IonText
                      color={
                        newMission.point < 400
                          ? "success"
                          : newMission.point < 800
                          ? "warning"
                          : "danger"
                      }
                    >
                      {newMission.point}{" "}
                      <IonIcon
                        icon={trophy}
                        style={{ fontSize: 15, verticalAlign: -1 }}
                      />
                    </IonText>
                  </p>
                </IonLabel>
                <IonRange
                  slot="end"
                  max={1000}
                  min={100}
                  step={100}
                  pin={false}
                  value={newMission.point}
                  onIonChange={(e) => {
                    setNewMission({
                      ...newMission,
                      point: parseInt(e.detail.value.valueOf() + ""),
                    });
                  }}
                  color={
                    newMission.point < 400
                      ? "success"
                      : newMission.point < 800
                      ? "warning"
                      : "danger"
                  }
                />
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default AdventureMarkPage;
