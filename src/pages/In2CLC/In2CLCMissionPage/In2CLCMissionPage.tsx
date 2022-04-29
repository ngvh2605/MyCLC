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
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenuButton,
  IonModal,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Autolinker from "autolinker";
import { chevronDown, time, close } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { firestore } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";
import { Answer, Mission } from "../model";

const In2CLCMissionPage: React.FC = () => {
  const [chosen, setChosen] = useState<Mission>({
    code: "",
    title: "",
    body: "",
    deadline: "",
  });
  const [missions, setMissions] = useState<Mission[]>();
  const [missionModal, setMissionModal] = useState(false);

  const [answer, setAnswer] = useState<Answer>({
    text: "",
    image: "",
  });

  const [presentAlert] = useIonAlert();

  useEffect(() => {
    fetchMissions();
  }, []);

  const fetchMissions = () => {
    firestore
      .collection("in2clc")
      .doc("mission")
      .get()
      .then((doc) => {
        setMissions(JSON.parse(doc.data().mission));
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
        <IonRefresher slot="fixed" onIonRefresh={handleRefresh}>
          <IonRefresherContent
            style={{ marginTop: 10 }}
            pullingIcon={chevronDown}
            pullingText="Kéo xuống để làm mới"
          ></IonRefresherContent>
        </IonRefresher>
        <IonButton
          onClick={() => {
            console.log(missions);
          }}
        >
          Test
        </IonButton>
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
                      <IonIcon icon={time} style={{ verticalAlign: "-2px" }} />{" "}
                      Hạn nộp:{" "}
                      {moment(
                        mission.deadline.toString(),
                        "HH:mm DD/MM/YYYY"
                      ).fromNow()}{" "}
                      <IonText color="dark">
                        (
                        {moment(
                          mission.deadline.toString(),
                          "HH:mm DD/MM/YYYY"
                        ).format("H:mm, DD/MM/YYYY")}
                        )
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

                  {mission.deadline ? (
                    moment(
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
                      <IonButton
                        expand="block"
                        className="ion-margin-top"
                        disabled
                        color="danger"
                      >
                        Đã đóng
                      </IonButton>
                    )
                  ) : (
                    <></>
                  )}

                  <IonButton
                    expand="block"
                    className="ion-margin-top"
                    disabled
                    color="success"
                  >
                    Đã nộp
                  </IonButton>
                </IonCardContent>
              </IonCard>
            ))}
        </IonList>

        <IonModal isOpen={missionModal}>
          <IonHeader>
            <IonToolbar>
              <IonTitle>Nhiệm vụ</IonTitle>
              <IonButtons slot="start" onClick={() => setMissionModal(false)}>
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
                            //  setLoading(true);
                            //  submitAnswer();
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
                    Lưu ý: Sau khi ấn nộp thì bạn không thể sửa câu trả lời được
                    nữa
                  </IonLabel>
                </IonChip>
              </IonItem>

              <br />
              <IonItem>
                <IonLabel position="fixed">Trả lời</IonLabel>
                <IonInput
                  placeholder="Nhập câu trả lời"
                  value={answer.text}
                  onIonChange={(e) =>
                    setAnswer({ ...answer, text: e.detail.value })
                  }
                />
              </IonItem>

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
      </IonContent>
    </IonPage>
  );
};

export default In2CLCMissionPage;
