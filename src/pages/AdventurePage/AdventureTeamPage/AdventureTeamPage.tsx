import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import {
  IonAvatar,
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
  IonListHeader,
  IonLoading,
  IonMenuButton,
  IonModal,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import {
  checkmarkCircle,
  close,
  closeCircle,
  copyOutline,
  helpCircleOutline,
  time,
  trophy,
  warning,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { copyToClipboard } from "../../../common/services";
import useCheckUserVerify from "../../../common/useCheckUserVerify";
import useUploadFile from "../../../common/useUploadFile";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import RefresherItem from "../../../components/CommonUI/RefresherItem";
import { UnAuth } from "../../../components/CommonUI/UnAuth";
import { firestore } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";
import { getNameAndAvatarByUserId } from "../../HomePage/services";
import { Answer, Mission } from "../model";
import useAdventureCheck from "../useAdventureCheck";

function shuffleArray(missions: Mission[]) {
  let array = [...missions];
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const AdventureTeamPage: React.FC = () => {
  const history = useHistory();
  const { userId } = useAuth();
  const { isVerify } = useCheckUserVerify(userId);
  const { teamId, teamInfo, teamAnswers } = useAdventureCheck(userId);
  const { handleUploadImage } = useUploadFile();

  const [playerInfo, setPlayerInfo] = useState<any[]>();

  const [data, setData] = useState<Mission[]>();
  const [missions, setMissons] = useState<Mission[]>();
  const [chosenMission, setChosenMission] = useState<Mission>({
    key: 0,
    title: "",
    body: "",
    point: 0,
  });
  const [answer, setAnswer] = useState<Answer>({
    text: "",
    image: "",
  });
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [missionModal, setMissionModal] = useState(false);
  const [segment, setSegment] = useState("remain");

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      if (teamInfo && teamInfo.player && teamInfo.player.length > 0) {
        if (teamInfo.isStarted) {
          fetchMissions();
        } else {
          let tempInfo = [];
          for (let player of teamInfo.player) {
            tempInfo.push({
              ...(await getNameAndAvatarByUserId(player)),
              id: player,
            });
          }
          setPlayerInfo(tempInfo);
        }
      }
    })();
  }, [teamInfo]);

  useEffect(() => {
    if (data && teamAnswers && teamAnswers.length > 0) {
      let temp = [...data];
      teamAnswers.forEach((answer) => {
        temp.forEach((mission) => {
          if (answer.key === mission.key) {
            mission.answer = answer;
          }
        });
      });
      setMissons(temp);
    } else setMissons(data);
  }, [data, teamAnswers]);

  const startGame = () => {
    firestore.collection("adventure").doc(teamId).update({
      isStarted: true,
    });
  };

  const fetchMissions = () => {
    firestore
      .collection("adventureMission")
      .doc("data")
      .get()
      .then((doc) => {
        if (doc.exists) {
          let temp: Mission[] = [];
          for (var prop in doc.data()) {
            if (doc.data().hasOwnProperty(prop)) {
              const propData: Mission[] = JSON.parse(doc.data()[prop]);
              const userId = prop;
              temp = temp.concat(
                propData.map((item) => Object.assign(item, { userId: userId }))
              );
            }
          }
          setData(shuffleArray(temp));
        }
      });
  };

  const handleAddImage = async () => {
    try {
      const photo = await Camera.getPhoto({
        resultType: CameraResultType.Uri,
        source: CameraSource.Photos,
        width: 600,
      });

      const resizeUrl = await (await resizeImage(photo.webPath, 800)).imageUrl;
      setAnswer({ ...answer, image: resizeUrl });
    } catch (error) {
      console.log("Camera error:", error);
    }
  };

  const submitAnswer = async () => {
    try {
      let image = "";
      if (answer.image) {
        image = await handleUploadImage(answer.image, "adventure");
      }
      await firestore
        .doc(`adventureAnswer/${teamId}_${chosenMission.key}`)
        .set({
          teamId,
          key: chosenMission.key,
          text: answer.text,
          image,
          isMarked: false,
          score: 0,
          timestamp: moment().valueOf(),
          userId: chosenMission.userId,
          teamName: teamInfo && teamInfo.name ? teamInfo.name : "",
        });

      presentToast({
        message: "Nộp câu trả lời thành công",
        duration: 2000,
        color: "success",
      });
    } catch (error) {
      presentToast({
        message: error,
        duration: 2000,
        color: "danger",
      });
    }
    setMissionModal(false);
    setLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          {teamInfo && teamInfo.isStarted && (
            <IonButtons slot="end">
              <IonButton
                onClick={() => {
                  presentAlert({
                    header: teamInfo && teamInfo.name ? teamInfo.name : "",
                    subHeader: `Tổng điểm: ${
                      teamInfo && teamInfo.score ? teamInfo.score : 0
                    }`,
                    message: `Người chơi: ${
                      teamInfo && teamInfo.player ? teamInfo.player.length : ""
                    }`,
                  });
                }}
              >
                <IonIcon icon={helpCircleOutline} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>Adventure Hunt</IonTitle>
        </IonToolbar>
      </IonHeader>
      {isVerify ? (
        teamInfo && teamInfo.isStarted ? (
          <IonContent>
            <RefresherItem
              handleRefresh={() => {
                fetchMissions();
              }}
            />
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div className="ion-padding">
                <IonSegment
                  color="primary"
                  value={segment}
                  onIonChange={(e) => setSegment(e.detail.value)}
                >
                  <IonSegmentButton value="remain">Chưa làm</IonSegmentButton>
                  <IonSegmentButton value="complete">Đã nộp</IonSegmentButton>
                </IonSegment>
              </div>

              {missions &&
                missions.length > 0 &&
                (segment === "remain" ? (
                  missions.filter((item) => {
                    return !!!item.answer;
                  }).length > 0 ? (
                    missions
                      .filter((item) => {
                        return !!!item.answer;
                      })
                      .map((mission, index) => (
                        <IonCard
                          key={index}
                          onClick={() => {
                            setAnswer({ text: "", image: "" });
                            setSubmitDisabled(false);
                            setChosenMission(mission);
                            setMissionModal(true);
                          }}
                        >
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
                  )
                ) : (
                  missions
                    .filter((item) => {
                      return !!item.answer;
                    })
                    .sort((a, b) => {
                      return a.answer.score - b.answer.score;
                    })
                    .map((mission, index) => (
                      <IonCard
                        key={index}
                        onClick={() => {
                          setAnswer({
                            ...mission.answer,
                          });
                          setSubmitDisabled(true);
                          setChosenMission(mission);
                          setMissionModal(true);
                        }}
                      >
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
                              <IonIcon icon={trophy} style={{ fontSize: 9 }} />
                            </IonText>
                            {mission.title}
                          </IonCardSubtitle>

                          <IonLabel text-wrap color="dark">
                            {mission.body}
                          </IonLabel>

                          {mission.answer && mission.answer.isMarked ? (
                            <IonCardSubtitle className="ion-no-margin ion-margin-top">
                              <IonText color="success">Đã chấm điểm</IonText>
                              <IonText
                                color="warning"
                                className="ion-float-right"
                              >
                                Điểm: {mission.answer.score}
                              </IonText>
                            </IonCardSubtitle>
                          ) : (
                            <IonCardSubtitle
                              color="danger"
                              className="ion-no-margin ion-margin-top"
                            >
                              Chưa chấm điểm
                            </IonCardSubtitle>
                          )}
                        </IonCardContent>
                      </IonCard>
                    ))
                ))}
            </div>
            <IonModal
              isOpen={missionModal}
              onDidDismiss={() => setMissionModal(false)}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Thử thách</IonTitle>
                  <IonButtons
                    slot="start"
                    onClick={() => setMissionModal(false)}
                  >
                    <IonButton>
                      <IonIcon icon={close} color="primary" />
                    </IonButton>
                  </IonButtons>
                  {!submitDisabled && (
                    <IonButtons slot="end">
                      <IonButton
                        disabled={!answer.image && !answer.text}
                        onClick={() => {
                          presentAlert({
                            header: "Nộp câu trả lời?",
                            message:
                              "Sau khi nộp thì đội chơi không thể sửa câu trả lời được nữa",
                            buttons: [
                              "Huỷ",
                              {
                                text: "Đồng ý",
                                handler: () => {
                                  setLoading(true);
                                  submitAnswer();
                                },
                              },
                            ],
                          });
                        }}
                      >
                        <b>Nộp</b>
                      </IonButton>
                    </IonButtons>
                  )}
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonList lines="none">
                  <IonListHeader>
                    <IonText color="primary">{chosenMission.title}</IonText>
                  </IonListHeader>
                  <IonListHeader>
                    <IonLabel className="ion-no-margin">
                      <IonText
                        color={
                          chosenMission.point < 400
                            ? "success"
                            : chosenMission.point < 800
                            ? "warning"
                            : "danger"
                        }
                      >
                        {chosenMission.point}
                      </IonText>{" "}
                      <IonIcon
                        color={
                          chosenMission.point < 400
                            ? "success"
                            : chosenMission.point < 800
                            ? "warning"
                            : "danger"
                        }
                        icon={trophy}
                        style={{ fontSize: 20, verticalAlign: -1 }}
                      />
                    </IonLabel>
                  </IonListHeader>
                  <br />
                  <IonItem>
                    <IonLabel text-wrap style={{ fontSize: 17 }}>
                      {chosenMission.body}
                    </IonLabel>
                  </IonItem>
                  {!submitDisabled && (
                    <>
                      <br />
                      <IonItem>
                        <IonChip
                          color="warning"
                          style={{ height: "max-content", marginBottom: 10 }}
                        >
                          <IonLabel text-wrap className="ion-padding">
                            Lưu ý: Sau khi một thành viên ấn nộp thì đội chơi
                            không thể sửa câu trả lời
                          </IonLabel>
                        </IonChip>
                      </IonItem>
                    </>
                  )}
                  <br />
                  <IonItem lines="inset">
                    <IonLabel position="stacked">Trả lời</IonLabel>
                    <IonInput
                      placeholder="Nhập câu trả lời"
                      value={answer.text}
                      onIonChange={(e) =>
                        setAnswer({ ...answer, text: e.detail.value })
                      }
                      disabled={submitDisabled}
                    />
                  </IonItem>

                  {!submitDisabled && (
                    <>
                      <br />
                      <IonButton
                        shape="round"
                        expand="full"
                        className="ion-margin-horizontal"
                        onClick={handleAddImage}
                      >
                        {!answer.image ? "Thêm hình ảnh" : "Đổi hình ảnh"}
                      </IonButton>
                    </>
                  )}

                  {answer.image && (
                    <IonCard>
                      <IonImg src={answer.image} />
                    </IonCard>
                  )}

                  {submitDisabled && answer.timestamp && (
                    <>
                      <IonItem>
                        <IonIcon icon={time} slot="start" />
                        <IonLabel>
                          Nộp lúc {moment(answer.timestamp).fromNow()}
                        </IonLabel>
                      </IonItem>
                      {answer.isMarked ? (
                        <>
                          <IonItem>
                            <IonIcon
                              icon={checkmarkCircle}
                              slot="start"
                              color="success"
                            />
                            <IonLabel color="success">Đã chấm điểm</IonLabel>
                          </IonItem>
                          <IonItem>
                            <IonIcon
                              icon={trophy}
                              slot="start"
                              color="warning"
                            />
                            <IonLabel color="warning">
                              Điểm: {answer.score}
                            </IonLabel>
                          </IonItem>
                        </>
                      ) : (
                        <>
                          <IonItem>
                            <IonIcon
                              icon={closeCircle}
                              slot="start"
                              color="danger"
                            />
                            <IonLabel color="danger">Chưa chấm điểm</IonLabel>
                          </IonItem>
                          <br />
                          <IonItem>
                            <IonChip
                              color="warning"
                              style={{
                                height: "max-content",
                                marginBottom: 10,
                              }}
                            >
                              <IonLabel text-wrap className="ion-padding">
                                Lưu ý: Trong vòng 48h sau khi nộp câu trả lời mà
                                đội bạn vẫn chưa được chấm điểm, vui lòng liên
                                hệ lại với BTC để được hỗ trợ
                              </IonLabel>
                            </IonChip>
                          </IonItem>
                        </>
                      )}
                    </>
                  )}
                </IonList>
              </IonContent>
            </IonModal>

            <IonLoading isOpen={loading} />
          </IonContent>
        ) : (
          <IonContent className="ion-padding">
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <div style={{ width: "100%", textAlign: "center" }}>
                <IonText color="primary" style={{ fontSize: "xx-large" }}>
                  <b>{teamInfo && teamInfo.name ? teamInfo.name : ""}</b>
                </IonText>

                <p>
                  Mã đội:{" "}
                  <IonChip
                    color="primary"
                    onClick={() => {
                      copyToClipboard(teamId);
                      presentToast({
                        message: "Đã sao chép mã đội",
                        duration: 3000,
                        color: "success",
                      });
                    }}
                  >
                    <IonIcon icon={copyOutline} />
                    <b>{teamId}</b>
                  </IonChip>
                </p>
              </div>

              <IonList lines="none">
                <IonListHeader>Danh sách người chơi</IonListHeader>
                {playerInfo &&
                  playerInfo.length > 0 &&
                  playerInfo.map((player, index) => (
                    <IonItem
                      key={index}
                      onClick={() => {
                        history.push(`/my/user/${player.id}`);
                      }}
                      className="ion-margin-vertical"
                    >
                      <IonAvatar slot="start">
                        <IonImg
                          src={player.avatar || "/assets/image/placeholder.png"}
                        />
                      </IonAvatar>
                      <IonLabel>{player.fullName || ""}</IonLabel>
                    </IonItem>
                  ))}
              </IonList>

              <IonChip
                color="warning"
                style={{ height: "max-content", marginBottom: 10 }}
              >
                <IonLabel text-wrap className="ion-padding">
                  <b>Lưu ý:</b>
                  <br />• Mỗi đội tối đa 4 người chơi
                  <br />• Chia sẻ mã đội cho bạn bè để cùng tham gia đội
                  <br />• Sau khi một thành viên bắt đầu trò chơi thì đội chơi
                  không thể thêm thành viên được nữa
                </IonLabel>
              </IonChip>

              <IonButton
                expand="block"
                shape="round"
                color="warning"
                onClick={() =>
                  presentAlert({
                    header: "Bắt đầu trò chơi?",
                    message:
                      "Sau khi bắt đầu thì đội chơi không thể thêm thành viên được nữa",
                    buttons: [
                      "Huỷ",
                      {
                        text: "Đồng ý",
                        handler: () => {
                          startGame();
                        },
                      },
                    ],
                  })
                }
              >
                <IonIcon icon={warning} slot="start" />
                <IonIcon icon={warning} slot="end" />
                Bắt đầu trò chơi
              </IonButton>
            </div>
          </IonContent>
        )
      ) : (
        <UnAuth />
      )}
    </IonPage>
  );
};

export default AdventureTeamPage;
