/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonContent,
  IonDatetime,
  IonFab,
  IonFabButton,
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
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonSlide,
  IonSlides,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonPopover,
} from "@ionic/react";
import {
  add,
  brush,
  close,
  ellipsisHorizontal,
  settingsOutline,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import useCheckUserVerify from "../../common/useCheckUserVerify";
import { database } from "../../firebase";
import { getInfoByUserId } from "../HomePage/services";
import { UnAuth } from "../../components/CommonUI/UnAuth";
import "./OldTimeTablePage.scss";
import { DatePopover, WeekPopover } from "./TimetablePopover";
export interface WeekItem {
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
  start?: string;
  end?: string;
  title?: string;
  note?: string;
  class?: string;
  room?: string;
  day?: string;
  author?: string;
}

function findUserInfo(userId: string, list: any[]) {
  const temp = list.find(function (a) {
    return a.userId === userId;
  });
  return temp;
}

const OldTimeTablePage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const { isVerify } = useCheckUserVerify(userId);

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
  const [showAddModal, setShowAddModal] = useState(false);
  const [chosenWeek, setChosenWeek] = useState<WeekItem>();
  const [chosenClassAM, setChosenClassAM] = useState<ClassItem[]>();
  const [chosenClassPM, setChosenClassPM] = useState<ClassItem[]>();
  const [lessons, setLessons] = useState<LessonItem[]>();
  const [userLessons, setUserLessons] = useState<LessonItem[]>();
  const [newLesson, setNewLesson] = useState<LessonItem>({
    key: "",
    start: "",
    end: "",
    title: "",
    note: "",
    class: "",
    room: "",
    day: "",
  });

  const [weekList, setWeekList] = useState<WeekItem[]>([]);
  const [classListAM, setClassListAM] = useState<ClassItem[]>([]);
  const [classListPM, setClassListPM] = useState<ClassItem[]>([]);

  const [authors, setAuthors] = useState<any[]>([]);

  const slideRef = useRef<any>();
  const [currentSlide, setCurrentSlide] = useState(
    moment().day() === 0 ? 6 : moment().day() - 1
  );
  const [status, setStatus] = useState({ loading: false, error: false });
  const [presentAlert] = useIonAlert();
  const [showNewsActionSheet, setShowNewsActionSheet] = useState(false);

  const [presentWeekPopover, dismissWeek] = useIonPopover(WeekPopover, {
    onHide: () => dismissWeek(),
    list: weekList,
    onSelect: (item: WeekItem) => {
      setChosenWeek(item);
    },
  });

  const [presentDatePopover, dismissDate] = useIonPopover(DatePopover, {
    onHide: () => dismissDate(),
    selected: chosenWeek,
    onSelect: (slide: number) => {
      slideRef.current.slideTo(slide);
    },
  });

  useEffect(() => {
    const readCurrentWeek = async () => {
      if (moment().day() === 0) {
        await database
          .ref()
          .child("timetableAM")
          .child(moment().add(-1, "days").day(1).format("YYYY-MM-DD"))
          .once("value")
          .then(function (snapshot) {
            if (snapshot !== null) {
              const data = snapshot.val();
              setChosenWeek({
                key: moment().add(-1, "days").day(1).format("YYYY-MM-DD"),
                name: data && data.name ? data.name : "Tuần ... Kì ...",
              });
            }
          });
      } else {
        await database
          .ref()
          .child("timetableAM")
          .child(moment().day(1).format("YYYY-MM-DD"))
          .once("value")
          .then(function (snapshot) {
            if (snapshot !== null) {
              const data = snapshot.val();
              setChosenWeek({
                key: moment().day(1).format("YYYY-MM-DD"),
                name: data && data.name ? data.name : "Tuần ... Kì ...",
              });
            }
          });
      }
    };

    const readSetting = async () => {
      await database
        .ref()
        .child("usersTimetable")
        .child(userId)
        .child("setting")
        .once("value")
        .then(function (snapshot) {
          if (snapshot.val() !== null) {
            const data = snapshot.val();
            if (
              data.chosenWeek &&
              data.chosenWeek.key === moment().day(1).format("YYYY-MM-DD")
            )
              setChosenWeek(data.chosenWeek);
            else readCurrentWeek();
            if (data.chosenClassAM) setChosenClassAM(data.chosenClassAM);
            if (data.chosenClassPM) setChosenClassPM(data.chosenClassPM);
            if (data.chosenColor) {
              setChosenColor(data.chosenColor);
              switch (data.chosenColor) {
                case "lovewins":
                  setColor([
                    "lovewins1",
                    "lovewins2",
                    "lovewins3",
                    "lovewins4",
                    "lovewins5",
                    "lovewins6",
                  ]);
                  break;
                case "blue":
                  setColor([
                    "blue1",
                    "blue2",
                    "blue3",
                    "blue4",
                    "blue5",
                    "blue6",
                  ]);
                  break;
                case "green":
                  setColor([
                    "green1",
                    "green2",
                    "green3",
                    "green4",
                    "green5",
                    "green6",
                  ]);
                  break;
                default:
                //nothing
              }
            }
          } else readCurrentWeek();
        });
    };
    if (isVerify) {
      if (moment().day() === 0) slideRef.current.slideTo(6);
      else slideRef.current.slideTo(moment().day() - 1);
      readSetting();
    }
  }, [isVerify]);

  useEffect(() => {
    console.log("chosenWeek", chosenWeek);
    if (chosenWeek && chosenWeek.key) fetchUserLessons(chosenWeek.key);
  }, [chosenWeek]);

  useEffect(() => {
    if (chosenWeek && showModal) {
      fetchAMClassData(chosenWeek.key);
      fetchPMClassData(chosenWeek.key);
    }
  }, [chosenWeek, showModal]);

  useEffect(() => {
    async function fetchData() {
      if (chosenWeek && chosenClassAM && chosenClassPM) {
        let data: LessonItem[] = [];
        for (const item of chosenClassAM) {
          const temp = await fetchLessonData(item, "timetableAM");
          data = data.concat(temp);
          //console.log("temp", temp);
        }
        for (const item of chosenClassPM) {
          const temp = await fetchLessonData(item, "timetablePM");
          data = data.concat(temp);
          //console.log("temp", temp);
        }
        //console.log("data", data);
        setLessons(data);
      }
    }
    fetchData();
  }, [chosenWeek, chosenClassAM, chosenClassPM]);

  useEffect(() => {
    const fetchAuthorInfo = async () => {
      let tempInfo = [];
      if (userLessons && userLessons.length > 0) {
        for (let item of userLessons) {
          if (item.author && !findUserInfo(item.author, tempInfo))
            tempInfo.push({
              ...(await getInfoByUserId(item.author)),
              userId: item.author,
            });
        }
      }
      if (lessons && lessons.length > 0) {
        for (let item of lessons) {
          if (item.author && !findUserInfo(item.author, tempInfo))
            tempInfo.push({
              ...(await getInfoByUserId(item.author)),
              userId: item.author,
            });
        }
      }
      console.log(tempInfo);
      setAuthors(tempInfo);
    };
    fetchAuthorInfo();
  }, [lessons, userLessons]);

  const fetchWeekData = async () => {
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

  const fetchUserLessons = async (week: string) => {
    const temp: LessonItem[] = [];
    await database
      .ref()
      .child("usersTimetable")
      .child(userId)
      .child("lessons")
      .child(week)
      .once("value")
      .then(function (snapshot) {
        snapshot.forEach(function (child) {
          if (child.val().title) {
            temp.push({ ...child.val() });
          }
        });
      });
    console.log(temp);
    setUserLessons(temp);
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
    //console.log("finlla", temp);
    //setLessons(temp);
    return temp;
  };

  const addNewLesson = () => {
    setStatus({ loading: true, error: false });
    const temp = {
      key: newLesson.key ? newLesson.key : moment().valueOf().toString(),
      title: newLesson.title,
      start: moment(newLesson.start).format("HH:mm"),
      end: newLesson.end ? moment(newLesson.end).format("HH:mm") : "",
      note: newLesson.note,
      class: newLesson.class,
      day:
        moment(newLesson.day).day() === 0
          ? "6"
          : (moment(newLesson.day).day() - 1).toString(),
      author: userId,
    };
    const dataRef = database
      .ref()
      .child("usersTimetable")
      .child(userId)
      .child("lessons")
      .child(
        moment(newLesson.day).day() === 0
          ? moment(newLesson.day).add(-1, "days").day(1).format("YYYY-MM-DD")
          : moment(newLesson.day).day(1).format("YYYY-MM-DD")
      )
      .child(temp.key);
    dataRef
      .set({
        ...temp,
      })
      .then(() => {
        setStatus({ loading: false, error: false });
        if (
          moment(newLesson.day).day(1).format("YYYY-MM-DD") ===
            chosenWeek.key ||
          (moment(newLesson.day).day() === 0 &&
            moment(newLesson.day)
              .add(-1, "days")
              .day(1)
              .format("YYYY-MM-DD") === chosenWeek.key)
        )
          setUserLessons((userLessons) => [
            ...userLessons.filter((item) => {
              return item.key !== temp.key;
            }),
            { ...temp },
          ]);
      })
      .then(() => {
        for (let member in newLesson) newLesson[member] = "";
        setShowAddModal(false);
      });
  };

  const deleteLesson = () => {
    database
      .ref()
      .child("usersTimetable")
      .child(userId)
      .child("lessons")
      .child(chosenWeek.key)
      .child(newLesson.key)
      .remove()
      .then(() => {
        setUserLessons((userLessons) => [
          ...userLessons.filter((item) => {
            return item.key !== newLesson.key;
          }),
        ]);
      })
      .then(() => {
        for (let member in newLesson) newLesson[member] = "";
      });
  };

  const doneSettings = () => {
    const dataRef = database.ref().child("usersTimetable");
    dataRef.child(userId).child("setting").set({
      chosenWeek,
      chosenClassAM,
      chosenClassPM,
      chosenColor,
    });
  };

  const displayDate = (title: string, index: number) => (
    <div className="ion-padding-horizontal">
      <IonLabel
        color="primary"
        className="ion-float-left"
        style={{ verticalAlign: "middle", lineHeight: "28px" }}
        onClick={(e) => {
          //open week selection
          console.log(weekList);
          if (!weekList || weekList.length === 0) fetchWeekData();
          presentWeekPopover({
            event: e.nativeEvent,
          });
        }}
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
        onClick={(e) => {
          presentDatePopover({
            event: e.nativeEvent,
          });
        }}
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
              <div style={{ marginTop: 16, marginBottom: 16, width: "100%" }}>
                <IonLabel
                  text-wrap
                  style={{
                    paddingBottom: 5,
                    width: "100%",
                  }}
                >
                  {item && item.author === userId && (
                    <IonIcon
                      icon={ellipsisHorizontal}
                      className="ion-float-right"
                      onClick={() => {
                        setNewLesson({
                          ...item,
                          day: moment(chosenWeek.key)
                            .day(currentSlide + 1)
                            .format(),
                          start: moment(item.start, "HH:mm").format(),
                          end: item.end
                            ? moment(item.end, "HH:mm").format()
                            : "",
                        });
                        setShowNewsActionSheet(true);
                      }}
                      style={{ fontSize: "large" }}
                    />
                  )}
                  <p
                    style={{
                      fontSize: "x-large",
                    }}
                  >
                    <b>{item.title}</b>
                  </p>
                </IonLabel>
                <IonLabel text-wrap>
                  {item.note && <p>• {item.note}</p>}
                  {item.class && (
                    <p>
                      • {item.class}{" "}
                      {item.room && <span>(P. {item.room})</span>}
                    </p>
                  )}
                </IonLabel>
                {item.author && (
                  <IonChip
                    className="ion-no-margin"
                    style={{ marginTop: 8 }}
                    onClick={() => {
                      history.push(`/my/user/${item.author}`);
                    }}
                  >
                    <IonAvatar>
                      <IonImg
                        src={
                          findUserInfo(item.author, authors) &&
                          findUserInfo(item.author, authors).avatar
                            ? findUserInfo(item.author, authors).avatar
                            : "/assets/image/placeholder.png"
                        }
                      />
                    </IonAvatar>
                    <IonLabel>
                      {findUserInfo(item.author, authors) &&
                      findUserInfo(item.author, authors).fullName
                        ? findUserInfo(item.author, authors).fullName
                        : ""}
                    </IonLabel>
                  </IonChip>
                )}
              </div>
              <IonNote slot="end" color="light">
                <IonLabel text-wrap></IonLabel>
              </IonNote>
            </IonItem>
          ))}
    </IonList>
  );

  const getSlideIndex = async () => {
    const data = await slideRef.current.getActiveIndex();
    console.log(data);
    setCurrentSlide(data);
  };

  return (
    <IonPage id="old-timetable-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Thời khoá biểu</IonTitle>
          {isVerify && (
            <IonButtons
              slot="end"
              onClick={() => {
                if (!weekList || weekList.length === 0) fetchWeekData();
                setShowModal(true);
              }}
            >
              <IonButton>
                <IonIcon icon={settingsOutline} color="primary" />
              </IonButton>
            </IonButtons>
          )}
        </IonToolbar>
      </IonHeader>
      {isVerify ? (
        <IonContent className="content">
          <IonSlides
            style={{ width: "100%", minHeight: "100%" }}
            options={{}}
            ref={slideRef}
            onIonSlideDidChange={(e) => {
              getSlideIndex();
            }}
          >
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Hai", 1)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "0";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Ba", 2)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "1";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Tư", 3)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "2";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Năm", 4)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "3";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Sáu", 5)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "4";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Thứ Bảy", 6)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
                  return item.day === "5";
                })
              )}
            </IonSlide>
            <IonSlide>
              <IonToolbar>{displayDate("Chủ Nhật", 7)}</IonToolbar>
              {displayList(
                lessons?.concat(userLessons).filter(function (item) {
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
                <IonButtons slot="end">
                  <IonButton
                    disabled={
                      !chosenWeek ||
                      !chosenClassAM ||
                      (chosenClassAM && chosenClassAM.length === 0) ||
                      !chosenClassPM ||
                      (chosenClassPM && chosenClassPM.length === 0) ||
                      !chosenColor
                    }
                    onClick={() => {
                      setShowModal(false);
                      doneSettings();
                    }}
                  >
                    <b>Xong</b>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonList>
                {/*
              <IonItem>
                <IonLabel position="stacked">Chọn tuần học</IonLabel>
                <IonSelect
                  placeholder={"Tuần ... Kì ..."}
                  value={chosenWeek}
                  compareWith={function compareWeek(a: WeekItem, b: WeekItem) {
                    if (a && b && a.key === b.key) return true;
                    else return false;
                  }}
                  onIonChange={(e) => {
                    console.log("change", e.detail.value);
                    setChosenWeek(e.detail.value);
                  }}
                >
                  {weekList.map((week, index) => (
                    <IonSelectOption key={index} value={week}>
                      {week.name} (từ {moment(week.key).format("D/M/YYYY")})
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              */}

                <IonItem>
                  <IonLabel position="stacked">Chọn lớp học buổi sáng</IonLabel>
                  <IonSelect
                    placeholder={"Tối đa 2 lớp"}
                    value={chosenClassAM}
                    compareWith={function compareWeek(
                      a: ClassItem,
                      b: ClassItem
                    ) {
                      if (a && b && a.name === b.name) return true;
                      else return false;
                    }}
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
                  <IonLabel position="stacked">
                    Chọn lớp học buổi chiều
                  </IonLabel>

                  <IonSelect
                    placeholder={"Tối đa 2 lớp"}
                    value={chosenClassPM}
                    compareWith={function compareWeek(
                      a: ClassItem,
                      b: ClassItem
                    ) {
                      if (a && b && a.name === b.name) return true;
                      else return false;
                    }}
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

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton
              onClick={() => {
                for (let member in newLesson) newLesson[member] = "";
                setShowAddModal(true);
              }}
            >
              <IonIcon icon={add} />
            </IonFabButton>
          </IonFab>

          <IonModal
            isOpen={showAddModal}
            cssClass="my-custom-class"
            onDidDismiss={() => setShowAddModal(false)}
          >
            <IonHeader>
              <IonToolbar>
                <IonButtons slot="start">
                  <IonButton
                    onClick={() => {
                      let hasData = false;
                      for (let member in newLesson) {
                        if (newLesson[member]) hasData = true;
                      }
                      if (hasData) {
                        presentAlert({
                          header: "Huỷ?",
                          message: "Những thay đổi của bạn sẽ không được lưu",
                          buttons: [
                            "Tiếp tục chỉnh sửa",
                            {
                              text: "Xoá thay đổi",
                              handler: (d) => {
                                for (let member in newLesson)
                                  newLesson[member] = "";
                                setShowAddModal(false);
                              },
                            },
                          ],
                          onDidDismiss: (e) => console.log("did dismiss"),
                        });
                      } else {
                        for (let member in newLesson) newLesson[member] = "";
                        setShowAddModal(false);
                      }
                    }}
                  >
                    Huỷ
                  </IonButton>
                </IonButtons>
                <IonButtons slot="end">
                  <IonButton
                    disabled={
                      !newLesson.title || !newLesson.day || !newLesson.start
                    }
                    onClick={() => {
                      addNewLesson();
                    }}
                  >
                    <b>Lưu</b>
                  </IonButton>
                </IonButtons>
                <IonTitle>Tác vụ</IonTitle>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <br />
              <IonButton hidden onClick={() => console.log(chosenWeek)}>
                Click
              </IonButton>
              <IonList lines="full">
                <IonItem>
                  <IonLabel position="fixed">
                    Tiêu đề <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={newLesson.title}
                    onIonChange={(e) => {
                      setNewLesson({ ...newLesson, title: e.detail.value });
                    }}
                    placeholder="Tối đa 80 chữ cái"
                    maxlength={80}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">
                    Ngày <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonDatetime
                    displayFormat="DD/MM/YYYY"
                    value={newLesson.day}
                    onIonChange={(e) => {
                      setNewLesson({
                        ...newLesson,
                        day: e.detail.value,
                      });
                    }}
                    max={moment().add(3, "months").format("YYYY-MM-DD")}
                    min={moment().format("YYYY-MM-DD")}
                    placeholder={moment().format("DD/MM/YYYY")}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">
                    Bắt đầu <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonDatetime
                    displayFormat="HH:mm"
                    minuteValues="0,05,10,15,20,25,30,35,40,45,50,55"
                    value={newLesson.start}
                    onIonChange={(e) => {
                      setNewLesson({
                        ...newLesson,
                        start: e.detail.value,
                      });
                    }}
                    max={moment().add(3, "months").format("YYYY-MM-DD")}
                    placeholder="00:00"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Kết thúc</IonLabel>
                  <IonDatetime
                    displayFormat="HH:mm"
                    minuteValues="0,05,10,15,20,25,30,35,40,45,50,55"
                    value={newLesson.end}
                    onIonChange={(e) => {
                      setNewLesson({
                        ...newLesson,
                        end: e.detail.value,
                      });
                    }}
                    max={moment().add(3, "months").format("YYYY-MM-DD")}
                    placeholder="00:00"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Ghi chú</IonLabel>
                  <IonInput
                    type="text"
                    value={newLesson.note}
                    onIonChange={(e) => {
                      setNewLesson({ ...newLesson, note: e.detail.value });
                    }}
                    clearInput={true}
                    placeholder="Nhập ghi chú"
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Địa điểm</IonLabel>
                  <IonInput
                    type="text"
                    value={newLesson.class}
                    onIonChange={(e) => {
                      setNewLesson({ ...newLesson, class: e.detail.value });
                    }}
                    clearInput={true}
                    placeholder="Nhập địa điểm"
                  />
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>

          <IonLoading isOpen={status.loading} />

          <IonActionSheet
            isOpen={showNewsActionSheet}
            onDidDismiss={() => setShowNewsActionSheet(false)}
            cssClass="my-custom-class"
            buttons={[
              {
                text: "Chỉnh sửa",
                icon: brush,
                handler: () => {
                  setShowAddModal(true);
                },
              },
              {
                text: "Xoá",
                role: "destructive",
                icon: trash,
                handler: () => {
                  presentAlert({
                    header: "Xoá",
                    message: "Bạn có chắc chắn xoá vĩnh viễn tác vụ này không?",
                    buttons: [
                      "Huỷ",
                      {
                        text: "Xoá",
                        handler: (d) => {
                          deleteLesson();
                        },
                      },
                    ],
                    onDidDismiss: (e) => console.log("did dismiss"),
                  });
                },
              },
              {
                text: "Cancel",
                icon: close,
                role: "cancel",
                handler: () => {
                  console.log("Cancel clicked");
                },
              },
            ]}
          ></IonActionSheet>
        </IonContent>
      ) : (
        <UnAuth />
      )}
    </IonPage>
  );
};

export default OldTimeTablePage;
