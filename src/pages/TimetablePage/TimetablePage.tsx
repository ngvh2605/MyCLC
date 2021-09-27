import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
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

interface DayItem {
  key: string;
  name: string;
  lessons?: LessonItem[];
}

interface LessonItem {
  key: string;
  start?: string;
  end?: string;
  title?: string;
  note?: string;
  class?: string;
  room?: string;
  day?: number;
}

const TimetablePage: React.FC = () => {
  const dayOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const [color, setColor] = useState([
    "lovewins1",
    "lovewins2",
    "lovewins3",
    "lovewins4",
    "lovewins5",
    "lovewins6",
  ]);
  const [showModal, setShowModal] = useState(false);
  const [chosenWeek, setChosenWeek] = useState<WeekItem>();
  const [chosenClassAM, setChosenClassAM] = useState<ClassItem[]>();
  const [chosenClassPM, setChosenClassPM] = useState<ClassItem[]>();
  const [data, setData] = useState<DayItem[]>();
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

  useEffect(() => {
    if (chosenClassAM && chosenClassAM.length > 0)
      chosenClassAM.forEach((item) => fetchLessonData(item));
  }, [chosenClassAM]);

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
            room: child.val().room,
          });
        });
      });
    setClassListAM(temp);
    console.log(temp);
  };

  const fetchLessonData = async (item: ClassItem) => {
    let temp: LessonItem[] = [];
    await database
      .ref()
      .child("timetableAM")
      .child(chosenWeek.key)
      .child("classList")
      .child(item.key)
      .child("lessons")
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (child) {
          //console.log(child.val());
          const list: any[] = child.val();

          list.forEach((item: any) => {
            //console.log(list.indexOf(item));
            temp.push({
              key: list.indexOf(item).toString(),
              day: list.indexOf(item),
              ...item,
            });
          });
        });
      });

    console.log("finlla", temp);
    setLessons(temp);
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
            options={{ slidesPerView: 3, spaceBetween: 50, loop: true }}
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
          style={{ width: "100%", height: "max-content" }}
          options={{ loop: true }}
        >
          <IonSlide>
            <IonList lines="none" style={{ width: "100%" }}>
              {lessons &&
                lessons.map((item) => (
                  <IonItem className={color[lessons.indexOf(item) % 6]}>
                    <IonNote slot="start">
                      <IonLabel>
                        <p>{item.start}</p>
                        <p>{item.end}</p>
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
                          <b>{item.title}</b>
                        </IonText>
                      </IonLabel>
                      <IonLabel text-wrap>
                        <p>{item.note}</p>
                      </IonLabel>
                      <IonChip
                        color="light"
                        outline={true}
                        className="ion-no-margin"
                      >
                        <IonAvatar>
                          <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                        </IonAvatar>
                        <IonLabel>Avatar Chip</IonLabel>
                      </IonChip>
                    </div>
                    <IonNote slot="end" color="light">
                      <IonLabel text-wrap></IonLabel>
                    </IonNote>
                  </IonItem>
                ))}
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

              <IonItem>
                <IonLabel position="floating">
                  Chọn lớp học buổi sáng (tối đa 2)
                </IonLabel>

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
            <IonList>
              <IonItem lines="none">
                <IonLabel>Chọn bảng màu</IonLabel>
              </IonItem>
              <IonItem lines="none">
                <div
                  style={{
                    width: 150,
                    height: 20,
                    borderRadius: 30,
                    background:
                      "linear-gradient(90deg, rgba(234,80,72,1) 0%, rgba(252,178,43,1) 20%, rgba(255,227,47,1) 40%, rgba(140,225,62,1) 60%, rgba(98,142,254,1) 80%, rgba(200,123,251,1) 100%)",
                  }}
                />
                <IonNote slot="end">Love Wins</IonNote>
                <IonCheckbox slot="end" />
              </IonItem>
              <IonItem lines="none">
                <div
                  style={{
                    width: 150,
                    height: 20,
                    borderRadius: 30,
                    background:
                      "linear-gradient(90deg, rgba(234,80,72,1) 0%, rgba(252,178,43,1) 20%, rgba(255,227,47,1) 40%, rgba(140,225,62,1) 60%, rgba(98,142,254,1) 80%, rgba(200,123,251,1) 100%)",
                  }}
                />
                <IonNote slot="end">Blue Ocean</IonNote>
                <IonCheckbox slot="end" />
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
