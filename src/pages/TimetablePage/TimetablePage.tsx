import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonPicker,
  IonSelect,
  IonSelectOption,
  IonSlide,
  IonSlides,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  closeCircle,
  informationCircle,
  qrCodeOutline,
  settingsOutline,
  close,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import "./TimetablePage.scss";

interface WeekItem {
  key: string;
  name: string;
  startDate?: string;
  classList?: ClassItem[];
}

interface ClassItem {
  key: string;
  name: string;
  room?: string;
  lessons?: LessonItem[];
}

interface LessonItem {
  key: string;
  start: string;
  end: string;
  title: string;
  teacher?: string;
  note?: string;
}

const TimetablePage: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [chosenWeek, setChosenWeek] = useState<WeekItem>();
  const [chosenClassAM, setChosenClassAM] = useState<ClassItem[]>();
  const [chosenClassPM, setChosenClassPM] = useState<ClassItem[]>();
  const [lessons, setLessons] = useState<LessonItem[]>();

  const [weekList, setWeekList] = useState<WeekItem[]>([]);
  const [classListAM, setClassListAM] = useState<ClassItem[]>([]);
  const [classListPM, setClassListPM] = useState<ClassItem[]>([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    fetchWeekData();
  }, []);

  useEffect(() => {
    if (chosenWeek) fetchClassData(chosenWeek.key);
  }, [chosenWeek]);

  const fetchWeekData = async () => {
    //setChosenWeek({ key: "week1", name: "Tuần 1 Kì 1" });
    const temp: WeekItem[] = [];
    await database
      .ref()
      .child("timetableAM")
      .once("value")
      .then(function (snapshot) {
        console.log(snapshot.val());
        snapshot.forEach(function (child) {
          console.log(child.val().Name);
          //console.log(child.key);
          temp.push({
            key: child.key,
            name: child.val().name,
          });
        });
      });
    setWeekList(temp);
    console.log(temp);
  };

  const fetchClassData = async (week: string) => {
    const temp: ClassItem[] = [];
    await database
      .ref()
      .child("timetableAM")
      .child(week)
      .child("classList")
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (child) {
          temp.push({
            key: child.key,
            name: child.val().name,
          });
        });
      });
    setClassListAM(temp);
    console.log(temp);
  };

  const writeTimetable = () => {
    const timetableRef = database.ref().child("timetableAM");
    const newPostRef = timetableRef.push();
    newPostRef
      .set({
        week2: "none",
      })
      .then(() => {
        console.log("done");
      });
  };

  return (
    <IonPage id="timetable-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => console.log(chosenClassAM)}>
              Click
            </IonButton>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Thời khoá biểu</IonTitle>
          <IonButtons
            slot="end"
            onClick={() => {
              setShowModal(true);
            }}
          >
            <IonButton>
              <IonIcon icon={settingsOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar>
          <IonSlides
            style={{}}
            options={{ slidesPerView: 3, spaceBetween: 50 }}
          >
            <IonSlide>
              <IonLabel>Thứ Hai</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Thứ Ba</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Thứ Tư</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Thứ Năm</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Thứ Sáu</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Thứ Bảy</IonLabel>
            </IonSlide>
            <IonSlide>
              <IonLabel>Chủ nhật</IonLabel>
            </IonSlide>
          </IonSlides>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSlides
          style={{ width: "100%", height: "100%" }}
          options={{ loop: true }}
        >
          <IonSlide>
            <IonList lines="none" style={{ width: "100%" }}>
              <IonItem color="primary">
                <IonNote slot="start">
                  <IonLabel color="light">
                    <p>20:00</p>
                    <p>21:00</p>
                  </IonLabel>
                </IonNote>
                <div style={{ marginTop: 8, marginBottom: 8 }}>
                  <IonLabel text-wrap>
                    <IonText
                      style={{
                        fontSize: "x-large",
                        lineHeight: "90%",
                      }}
                    >
                      <b>
                        Nguyeenx Viet hoang day la mot day text rat la dai luon
                      </b>
                    </IonText>
                  </IonLabel>
                  <IonLabel text-wrap>
                    <p>Cô Hoá Toans tin su dia sinh van</p>
                  </IonLabel>
                  <IonChip
                    color="light"
                    outline={true}
                    className="ion-no-margin"
                  >
                    <IonAvatar>
                      <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                    </IonAvatar>
                    <IonLabel color="light">Avatar Chip</IonLabel>
                  </IonChip>
                </div>
                <IonNote slot="end" color="light">
                  <IonLabel text-wrap></IonLabel>
                </IonNote>
              </IonItem>
            </IonList>
          </IonSlide>
          <IonSlide>
            <IonList>
              <IonItem color="primary"></IonItem>
            </IonList>
          </IonSlide>
          <IonSlide>
            <IonList>
              <IonItem color="primary"></IonItem>
            </IonList>
          </IonSlide>
        </IonSlides>

        <IonModal
          isOpen={showModal}
          cssClass="my-custom-class"
          onDidDismiss={() => setShowModal(false)}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle>Thiết lập</IonTitle>
              <IonButtons slot="end" onClick={() => setShowModal(false)}>
                <IonButton>
                  <IonIcon icon={close} color="primary" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <IonList>
              <IonItem>
                <IonLabel position="floating">Chọn tuần học</IonLabel>

                <IonSelect
                  interface="action-sheet"
                  value={chosenWeek}
                  onIonChange={(e) => {
                    setChosenWeek(e.detail.value);
                  }}
                >
                  {weekList.map((week, index) => (
                    <IonSelectOption key={index} value={week}>
                      {week.name} (từ {moment(week.key).format("DD/M/YYYY")})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
            </IonList>

            <IonList>
              <IonItem>
                <IonLabel position="floating">Chọn lớp học (tối đa 2)</IonLabel>

                <IonSelect
                  value={chosenClassAM}
                  onIonChange={(e) => {
                    if (e.detail.value.length < 3)
                      setChosenClassAM(e.detail.value);
                    else setChosenClassAM([]);
                  }}
                  multiple={true}
                >
                  {classListAM.length > 0 &&
                    classListAM
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, index) => (
                        <IonSelectOption key={index} value={item}>
                          {item.name}
                        </IonSelectOption>
                      ))}
                </IonSelect>
              </IonItem>
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="my-custom-class"
        header={alertHeader}
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default TimetablePage;
