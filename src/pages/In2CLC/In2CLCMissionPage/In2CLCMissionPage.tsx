import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { RefresherEventDetail } from "@ionic/core";
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
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSlide,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonToast,
} from "@ionic/react";
import Autolinker from "autolinker";
import { chevronDown, close, school, time } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { firestore } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";
import { Answer, Mission } from "../model";
import useIn2CLCCheck from "../useIn2CLCCheck";
import "./In2CLCMissionPage.scss";

const In2CLCMissionPage: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const { handleUploadImage } = useUploadFile();
  const { matchInfo, userSubmission, addSubmission } = useIn2CLCCheck(
    userId,
    userEmail
  );

  const [chosen, setChosen] = useState<Mission>({
    code: "",
    title: "",
    body: "",
    deadline: "",
  });
  const [data, setData] = useState<Mission[]>();
  const [missions, setMissions] = useState<Mission[]>();
  const [missionModal, setMissionModal] = useState(false);

  const [answer, setAnswer] = useState<Answer>({
    text: "",
    image: "",
  });

  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    try {
      if (data && userSubmission && userSubmission.length > 0) {
        let temp = [...data];
        userSubmission.forEach((answer) => {
          temp.forEach((mission) => {
            if (answer.code === mission.code) {
              mission.answer = answer;
            }
          });
        });
        setMissions(temp);
      } else setMissions(data);
    } catch (error) {}
  }, [data, userSubmission]);

  const fetchMissions = () => {
    firestore
      .collection("in2clc")
      .doc("mission")
      .get()
      .then((doc) => {
        setData(JSON.parse(doc.data().mission).reverse());
        // console.log(doc.data().mission);
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

  const handleRefresh = (event: CustomEvent<RefresherEventDetail>) => {
    fetchMissions();
    setTimeout(() => {
      event.detail.complete();
    }, 2000);
  };

  const submitAnswer = async () => {
    try {
      let image = "";
      if (answer.image) {
        image = await handleUploadImage(
          answer.image,
          "in2clc",
          `${chosen.code}_${userEmail}`
        );
      }
      await firestore.doc(`in2clc/${chosen.code}_${userEmail}`).set({
        code: chosen.code,
        email: userEmail,
        userId: userId,
        text: encodeURI(answer.text),
        image,
        isMarked: false,
        isApproved: true,
      });

      addSubmission({
        code: chosen.code,
        email: userEmail,
        userId: userId,
        text: encodeURI(answer.text),
        image,
        isMarked: false,
        isApproved: true,
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

  const calProgress = () => {
    let progress = 0;
    if (missions && missions.length > 0) {
      let answer = 0;
      missions.forEach((mission) => {
        if (
          mission.deadline &&
          mission.type !== "info" &&
          mission.answer &&
          mission.answer.isMarked &&
          mission.answer.isApproved
        )
          answer++;
      });
      progress =
        (answer /
          missions.filter((item) => {
            return !!item.deadline && item.type !== "info";
          }).length) *
        100;
    }
    return Intl.NumberFormat("en", {
      maximumFractionDigits: 2,
      minimumFractionDigits: 0,
    }).format(progress);
  };

  return (
    <IonPage id="in2clc-mission-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
            <IonButton
              hidden
              onClick={() => {
                console.log(matchInfo);
              }}
            >
              Test
            </IonButton>
          </IonButtons>
          <IonTitle>In2CLC</IonTitle>
        </IonToolbar>
      </IonHeader>
      {matchInfo ? (
        <>
          <IonHeader>
            <IonToolbar className="toolbar-prize ion-no-padding ion-no-margin">
              <div>
                <IonItem lines="none">
                  <IonIcon slot="start" icon={school} />
                  <IonLabel>
                    <b>Tiến độ</b>
                  </IonLabel>
                  <IonNote slot="end">
                    <b>{calProgress()}%</b>
                  </IonNote>
                </IonItem>
              </div>
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

            <IonList>
              {missions &&
                missions.length > 0 &&
                missions.map((mission, index) => (
                  <IonCard key={index}>
                    <IonCardContent>
                      <IonCardSubtitle color="primary">
                        {mission.title}
                      </IonCardSubtitle>
                      {mission.deadline && (
                        <IonLabel text-wrap color="danger">
                          <IonIcon
                            icon={time}
                            style={{ verticalAlign: "-2px" }}
                          />{" "}
                          Hạn nộp:{" "}
                          {moment(
                            mission.deadline.toString(),
                            "HH:mm DD/MM/YYYY"
                          ).fromNow()}{" "}
                          <IonText color="dark">
                            <i>
                              (
                              {moment(
                                mission.deadline.toString(),
                                "HH:mm DD/MM/YYYY"
                              ).format("H:mm, D/M/YYYY")}
                              )
                            </i>
                          </IonText>
                          <br />
                        </IonLabel>
                      )}
                      <IonLabel text-wrap color="dark">
                        <span
                          dangerouslySetInnerHTML={{
                            __html: Autolinker.link(mission.body.toString(), {
                              truncate: { length: 50, location: "smart" },
                            }),
                          }}
                        ></span>
                      </IonLabel>

                      {mission.deadline && mission.type !== "info" ? (
                        mission.answer ? (
                          mission.answer.isMarked ? (
                            <IonCardSubtitle
                              color="success"
                              className="ion-no-margin ion-margin-top"
                            >
                              Đã nộp
                              {mission.answer.isApproved ? (
                                <IonText
                                  color="success"
                                  className="ion-float-right"
                                >
                                  Đã duyệt
                                </IonText>
                              ) : (
                                <IonText
                                  color="danger"
                                  className="ion-float-right"
                                >
                                  Không duyệt
                                </IonText>
                              )}
                            </IonCardSubtitle>
                          ) : (
                            <IonCardSubtitle className="ion-no-margin ion-margin-top">
                              <IonText color="success">Đã nộp</IonText>
                              <IonText
                                color="warning"
                                className="ion-float-right"
                              >
                                Chưa xét duyệt
                              </IonText>
                            </IonCardSubtitle>
                          )
                        ) : moment(
                            mission.deadline.toString(),
                            "HH:mm DD/MM/YYYY"
                          ).isSameOrAfter(moment().format()) ? (
                          <IonButton
                            expand="block"
                            className="ion-margin-top"
                            onClick={() => {
                              setChosen(mission);
                              setMissionModal(true);
                            }}
                          >
                            Báo cáo
                          </IonButton>
                        ) : (
                          <IonCardSubtitle
                            color="danger"
                            className="ion-no-margin ion-margin-top"
                          >
                            Đã đóng
                            <IonText className="ion-float-right">
                              Chưa nộp
                            </IonText>
                          </IonCardSubtitle>
                        )
                      ) : (
                        <></>
                      )}
                    </IonCardContent>
                  </IonCard>
                ))}
            </IonList>

            <IonModal
              isOpen={missionModal}
              onDidDismiss={() => {
                setMissionModal(false);
                setAnswer({ text: "", image: "" });
              }}
            >
              <IonHeader>
                <IonToolbar>
                  <IonTitle>Nhiệm vụ</IonTitle>
                  <IonButtons
                    slot="start"
                    onClick={() => setMissionModal(false)}
                  >
                    <IonButton>
                      <IonIcon icon={close} color="primary" />
                    </IonButton>
                  </IonButtons>
                  <IonButtons slot="end">
                    <IonButton
                      disabled={!answer.image && !answer.text}
                      onClick={() => {
                        presentAlert({
                          header: "Nộp?",
                          message:
                            "Sau khi nộp thì bạn không thể sửa câu trả lời được nữa",
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
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonList lines="none">
                  <IonListHeader>
                    <IonText color="primary">{chosen.title}</IonText>
                  </IonListHeader>
                  <br />
                  <IonItem>
                    <IonLabel text-wrap color="dark" style={{ fontSize: 17 }}>
                      <span
                        dangerouslySetInnerHTML={{
                          __html: Autolinker.link(chosen.body.toString(), {
                            truncate: { length: 50, location: "smart" },
                          }),
                        }}
                      ></span>
                    </IonLabel>
                  </IonItem>
                  <br />
                  <IonItem>
                    <IonChip
                      color="warning"
                      style={{ height: "max-content", marginBottom: 10 }}
                    >
                      <IonLabel text-wrap className="ion-padding">
                        Lưu ý: Sau khi ấn nộp thì bạn không thể sửa câu trả lời
                        được nữa
                      </IonLabel>
                    </IonChip>
                  </IonItem>

                  <br />
                  <IonItem>
                    <IonLabel>Trả lời</IonLabel>
                  </IonItem>
                  <IonItem lines="inset">
                    <IonTextarea
                      placeholder="Nhập câu trả lời"
                      value={answer.text}
                      onIonChange={(e) =>
                        setAnswer({ ...answer, text: e.detail.value })
                      }
                      autoGrow={true}
                    />
                  </IonItem>

                  <br />
                  <br />
                  <IonButton
                    shape="round"
                    expand="full"
                    className="ion-margin-horizontal"
                    onClick={handleAddImage}
                  >
                    {!answer.image ? "Thêm hình ảnh" : "Đổi hình ảnh"}
                  </IonButton>

                  {answer.image && (
                    <IonCard>
                      <IonImg src={answer.image} />
                    </IonCard>
                  )}
                </IonList>
              </IonContent>
            </IonModal>

            <IonLoading isOpen={loading} />
          </IonContent>
        </>
      ) : (
        <IonContent className="ion-padding">
          <IonSlide>
            <div className="ion-margin">
              <IonImg
                src="/assets/image/security.svg"
                style={{ height: window.screen.height / 4, marginBottom: 10 }}
              />
              <IonLabel
                style={{
                  fontSize: "x-large",
                  margin: "auto",
                  lineHeight: "40px",
                }}
              >
                <b>Từ chối truy cập</b>
              </IonLabel>
              <br />
              <br />
              <br />
              <IonChip
                color="danger"
                style={{ height: "max-content", marginBottom: 10 }}
                className="ion-margin"
              >
                <IonLabel text-wrap className="ion-padding">
                  Bạn cần vào tab Trang chủ và ấn Tìm thông tin Mentee của mình
                  trước!
                </IonLabel>
              </IonChip>
            </div>
          </IonSlide>
        </IonContent>
      )}
    </IonPage>
  );
};

export default In2CLCMissionPage;
