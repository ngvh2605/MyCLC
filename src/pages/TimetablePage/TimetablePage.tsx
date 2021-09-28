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
  IonImg,
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
  day?: string;
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
  const [chosenColor, setChosenColor] = useState("lovewins");
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
    //todo
  }, []);

  useEffect(() => {
    if (chosenWeek) {
      fetchAMClassData(chosenWeek.key);
      fetchPMClassData(chosenWeek.key);
    }
  }, [chosenWeek]);

  useEffect(() => {
    async function fetchData() {
      if (chosenClassAM && chosenClassPM) {
        let data: LessonItem[] = [];
        for (const item of chosenClassAM) {
          const temp = await fetchLessonData(item, "timetableAM");
          data = data.concat(temp);
          console.log("temp", temp);
        }
        for (const item of chosenClassPM) {
          const temp = await fetchLessonData(item, "timetablePM");
          data = data.concat(temp);
          console.log("temp", temp);
        }
        console.log("data", data);
        setLessons(data);
      }
    }
    fetchData();
  }, [chosenClassAM, chosenClassPM]);

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
          //console.log(child.val().Name);
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

  const fetchAMClassData = async (week: string) => {
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
    //console.log(temp);
  };

  const fetchPMClassData = async (week: string) => {
    const temp: ClassItem[] = [];
    await database
      .ref()
      .child("timetablePM")
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
    setClassListPM(temp);
  };

  const fetchLessonData = async (item: ClassItem, timetable: string) => {
    let temp: LessonItem[] = [];
    await database
      .ref()
      .child(timetable)
      .child(chosenWeek.key)
      .child("classList")
      .child(item.key)
      .child("lessons")
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (child) {
          //console.log(child.val());
          const list: any[] = child.val();
          //console.log("list", child.key);
          list.forEach((date: any) => {
            //console.log(list.indexOf(item));
            temp.push({
              key: list.indexOf(date).toString(),
              day: child.key,
              class: item.name,
              room: item.room,
              ...date,
            });
          });
        });
      });

    console.log("finlla", temp);
    //setLessons(temp);
    return temp;
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

  const displayDate = (title: string, index: number) => (
    <div className="ion-padding-horizontal">
      <IonLabel
        color="primary"
        className="ion-float-left"
        style={{ verticalAlign: "middle", lineHeight: "28px" }}
      >
        {chosenWeek && chosenWeek.name}
      </IonLabel>
      <IonLabel
        className="ion-text-center"
        style={{
          fontSize: "x-large",
          fontWeight: "bold",
        }}
      >
        {title}
      </IonLabel>
      <IonLabel
        color="primary"
        className="ion-float-right"
        style={{ verticalAlign: "middle", lineHeight: "28px" }}
      >
        {chosenWeek && moment(chosenWeek.key).day(index).format("Do MMMM")}
      </IonLabel>
    </div>
  );

  const displayList = (lessons: LessonItem[]) => (
    <IonList lines="none" style={{ width: "100%" }}>
      {lessons &&
        lessons.length > 0 &&
        lessons
          .sort((a, b) => a.start.localeCompare(b.start))
          .map((item, index) => (
            <IonItem
              className={`${color[lessons.indexOf(item) % 6]}`}
              key={index}
            >
              <IonNote slot="start">
                <IonLabel>
                  <p>{item.start}</p>
                  <p>{item.end}</p>
                </IonLabel>
              </IonNote>
              <div style={{ marginTop: 16, marginBottom: 16 }}>
                <IonLabel text-wrap style={{ paddingBottom: 5 }}>
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
                  <p>• {item.note}</p>
                  <p>
                    • {item.class} (P. {item.room})
                  </p>
                </IonLabel>
                <IonChip className="ion-no-margin" style={{ marginTop: 8 }}>
                  <IonAvatar>
                    <IonImg src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
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
  );

  return (
    <IonPage id="timetable-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton hidden onClick={() => console.log(chosenClassAM)}>
              Click
            </IonButton>
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Thời khoá biểu</IonTitle>
          <IonButtons
            slot="end"
            onClick={() => {
              fetchWeekData();
              setShowModal(true);
            }}
          >
            <IonButton>
              <IonIcon icon={settingsOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonSlides style={{ width: "100%", minHeight: "100%" }} options={{}}>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Hai", 1)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "0";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Ba", 2)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "1";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Tư", 3)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "2";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Năm", 4)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "3";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Sáu", 5)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "4";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Thứ Bảy", 6)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "5";
                })
              )}
          </IonSlide>
          <IonSlide>
            <IonToolbar>{displayDate("Chủ Nhật", 7)}</IonToolbar>
            {lessons &&
              lessons.length > 0 &&
              displayList(
                lessons.filter(function (item) {
                  return item.day === "6";
                })
              )}
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

              <IonItem>
                <IonLabel position="floating">
                  Chọn lớp học buổi chiều (tối đa 2)
                </IonLabel>

                <IonSelect
                  value={chosenClassPM}
                  onIonChange={(e) => {
                    if (e.detail.value.length < 3)
                      setChosenClassPM(e.detail.value);
                    else setChosenClassPM([]);
                  }}
                  multiple={true}
                >
                  {classListPM.length > 0 &&
                    classListPM
                      .sort((a, b) => a.name.localeCompare(b.name))
                      .map((item, index) => (
                        <IonSelectOption key={index} value={item}>
                          {item.name}
                        </IonSelectOption>
                      ))}
                </IonSelect>
              </IonItem>
            </IonList>
            <br />
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
                      "linear-gradient(90deg, rgba(202,50,49,1) 0%, rgba(243,154,62,1) 20%, rgba(249,202,71,1) 40%, rgba(113,195,51,1) 60%, rgba(64,116,225,1) 80%, rgba(170,98,224,1) 100%)",
                  }}
                />
                <IonNote slot="end">Love Wins</IonNote>
                <IonCheckbox
                  slot="end"
                  checked={chosenColor === "lovewins"}
                  onIonChange={(e) => {
                    console.log(e.detail.checked);
                    if (e.detail.checked) {
                      setChosenColor("lovewins");
                      setColor([
                        "lovewins1",
                        "lovewins2",
                        "lovewins3",
                        "lovewins4",
                        "lovewins5",
                        "lovewins6",
                      ]);
                    }
                  }}
                />
              </IonItem>
              <IonItem lines="none">
                <div
                  style={{
                    width: 150,
                    height: 20,
                    borderRadius: 30,
                    background:
                      "linear-gradient(90deg, rgba(77,185,255,1) 0%, rgba(19,164,255,1) 20%, rgba(0,132,225,1) 40%, rgba(0,103,193,1) 60%, rgba(0,78,158,1) 80%, rgba(0,55,121,1) 100%)",
                  }}
                />
                <IonNote slot="end">Ocean Breeze</IonNote>
                <IonCheckbox
                  slot="end"
                  checked={chosenColor === "blue"}
                  onIonChange={(e) => {
                    if (e.detail.checked) {
                      setChosenColor("blue");
                      setColor([
                        "blue1",
                        "blue2",
                        "blue3",
                        "blue4",
                        "blue5",
                        "blue6",
                      ]);
                    }
                  }}
                />
              </IonItem>
              <IonItem lines="none">
                <div
                  style={{
                    width: 150,
                    height: 20,
                    borderRadius: 30,
                    background:
                      "linear-gradient(90deg, rgba(131,214,77,1) 0%, rgba(96,202,51,1) 20%, rgba(79,171,42,1) 40%, rgba(61,136,31,1) 60%, rgba(43,99,20,1) 80%, rgba(21,56,7,1) 100%)",
                  }}
                />
                <IonNote slot="end">Lime Soda</IonNote>
                <IonCheckbox
                  slot="end"
                  checked={chosenColor === "green"}
                  onIonChange={(e) => {
                    if (e.detail.checked) {
                      setChosenColor("green");
                      setColor([
                        "green1",
                        "green2",
                        "green3",
                        "green4",
                        "green5",
                        "green6",
                      ]);
                    }
                  }}
                />
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
