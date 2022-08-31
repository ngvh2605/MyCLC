/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
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
  IonListHeader,
  IonLoading,
  IonMenuButton,
  IonModal,
  IonNote,
  IonPage,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
  useIonPopover,
  useIonToast,
} from "@ionic/react";
import { add, caretDown, trashBin } from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAuth } from "../../auth";
import useCheckUserVerify from "../../common/useCheckUserVerify";
import useUploadFile from "../../common/useUploadFile";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import { database, storage } from "../../firebase";
import { getNameAndAvatarByUserId } from "../HomePage/services";
import "./TimetablePage.scss";
import { WeekPopover } from "./TimetablePopover";

interface DocumentItem {
  id: string;
  description: string;
  timestamp: number;
  url: string;
  userId: string;
  fullName?: string;
  avatar?: string;
}

interface EventItem {
  index?: number;
  id: string;
  start?: string;
  end?: string;
  title: string;
  description: string;
  location?: string;
  date: string;
  userId: string;
  fullName?: string;
  avatar?: string;
}

interface EventGroup {
  events: EventItem[];
  date: string;
}

function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const TimetablePage: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const { isVerify } = useCheckUserVerify(userId);
  const { t } = useTranslation();
  const history = useHistory();
  const { handleUploadFile } = useUploadFile();
  const fileInputRef = useRef<HTMLInputElement>();
  const [loading, setLoading] = useState(false);

  const [documentList, setDocumentList] = useState<DocumentItem[]>();
  const [eventList, setEventList] = useState<EventGroup[]>();

  const [chosenWeek, setChosenWeek] = useState<string>(
    moment().startOf("week").format("D/M") +
      " - " +
      moment().endOf("week").format("D/M/YYYY")
  );
  const [weekList, setWeekList] = useState<string[]>([]);
  const [presentAlert] = useIonAlert();
  const [presentToast] = useIonToast();
  const [showAddModal, setShowAddModal] = useState(false);

  const [presentWeekPopover, dismissWeek] = useIonPopover(WeekPopover, {
    onHide: () => dismissWeek(),
    list: weekList,
    current:
      moment().startOf("week").format("D/M") +
      " - " +
      moment().endOf("week").format("D/M/YYYY"),
    selected: chosenWeek,
    onSelect: (item: string) => {
      setChosenWeek(item);
    },
  });

  const [segmentValue, setSegmentValue] = useState("document");
  const [newDocument, setNewDocument] = useState<{
    week: string;
    description: string;
    file: File;
    url: string;
  }>({
    week:
      moment().startOf("week").format("D/M") +
      " - " +
      moment().endOf("week").format("D/M/YYYY"),
    description: "",
    file: undefined,
    url: "",
  });
  const [newEvent, setNewEvent] = useState<{
    start?: string;
    end?: string;
    title?: string;
    description?: string;
    location?: string;
    date?: string;
  }>({
    start: "",
    end: "",
    title: "",
    description: "",
    location: "",
    date: moment().format(),
  });
  const [color, setColor] = useState([
    "blue1",
    "blue2",
    "blue3",
    "blue4",
    "blue5",
    "blue6",
  ]);

  useEffect(() => {
    let list: string[] = [];
    //add future weeks
    for (let i = 3; i > 0; i--) {
      let start = moment().add(i, "week").startOf("week");
      let end = moment().add(i, "week").endOf("week");
      list.push(start.format("D/M") + " - " + end.format("D/M/YYYY"));
    }
    //add current week
    list.push(
      moment().startOf("week").format("D/M") +
        " - " +
        moment().endOf("week").format("D/M/YYYY")
    );
    //add past weeks
    for (let i = 1; i < 4; i++) {
      let start = moment().subtract(i, "week").startOf("week");
      let end = moment().subtract(i, "week").endOf("week");
      list.push(start.format("D/M") + " - " + end.format("D/M/YYYY"));
    }
    console.log(list);
    setWeekList(list);
  }, []);

  useEffect(() => {
    fetchData(chosenWeek);
  }, [chosenWeek]);

  const fetchData = async (chosenWeek: string) => {
    const week = chosenWeek
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    //fetch documents
    const data = (
      await database.ref().child("timetableDocument").child(week).get()
    ).val();
    if (data) {
      let temp: DocumentItem[] = [];
      for (let prop in data) {
        if (data.hasOwnProperty(prop)) {
          const userInfo = await getNameAndAvatarByUserId(data[prop].userId);
          temp.push({
            id: prop,
            ...data[prop],
            ...userInfo,
          });
        }
      }
      setDocumentList(temp);
    } else {
      setDocumentList(undefined);
    }
    //fetch events
    const events = (
      await database.ref().child("timetableEvent").child(week).get()
    ).val();
    if (events) {
      let list: EventItem[] = [];
      let temp: EventGroup[] = [];
      for (let prop in events) {
        if (events.hasOwnProperty(prop)) {
          const userInfo = await getNameAndAvatarByUserId(events[prop].userId);
          list.push({
            id: prop,
            ...events[prop],
            ...userInfo,
          } as EventItem);
        }
      }
      list = list
        .sort((a, b) => {
          if (a.start && b.start) return a.start.localeCompare(b.start);
          else if (a.start) return 1;
          else return -1;
        })
        .sort((a, b) => {
          return (
            moment(a.date, "D/M/YYYY").valueOf() -
            moment(b.date, "D/M/YYYY").valueOf()
          );
        });

      for (let i = 0; i < list.length; i++) {
        const index = temp.findIndex((item) => {
          return item.date === list[i].date;
        });
        if (index >= 0)
          temp[index] = {
            ...temp[index],
            events: [...temp[index].events, { ...list[i], index: i }],
          };
        else
          temp.push({
            events: [{ ...list[i], index: i }],
            date: list[i].date,
          });
      }
      console.log(temp);
      setEventList(temp);
    } else {
      setEventList(undefined);
    }
  };

  const saveDocument = async () => {
    setLoading(true);
    const week = chosenWeek
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    const uploadedUrl = await handleUploadFile(
      newDocument.url,
      newDocument.file,
      "document"
    );
    await database.ref().child("timetableDocument").child(week).push({
      userId: userId,
      url: uploadedUrl,
      timestamp: moment().valueOf(),
      description: newDocument.description,
    });
    fetchData(chosenWeek);
    presentToast({
      message: t("Uploaded successfully"),
      color: "success",
      duration: 3000,
    });
    setShowAddModal(false);
    setLoading(false);
  };

  const saveEvent = async () => {
    setLoading(true);
    const start = moment(newEvent.date).startOf("week");
    const end = moment(newEvent.date).endOf("week");
    const week = (start.format("D/M") + " - " + end.format("D/M/YYYY"))
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    await database
      .ref()
      .child("timetableEvent")
      .child(week)
      .push({
        userId: userId,
        title: newEvent.title,
        description: newEvent.description,
        location: newEvent.location,
        date: moment(newEvent.date).format("D/M/YYYY"),
        start: newEvent.start ? moment(newEvent.start).format("HH:mm") : "",
        end: newEvent.end ? moment(newEvent.end).format("HH:mm") : "",
      });
    fetchData(chosenWeek);
    presentToast({
      message: t("Uploaded successfully"),
      color: "success",
      duration: 3000,
    });
    setShowAddModal(false);
    setLoading(false);
  };

  const deleteDocument = async (document: DocumentItem) => {
    setLoading(true);
    const week = chosenWeek
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    await storage.refFromURL(document.url).delete();
    await database
      .ref()
      .child("timetableDocument")
      .child(week)
      .child(document.id)
      .remove();
    fetchData(chosenWeek);
    setLoading(false);
  };

  const deleteEvent = async (event: EventItem) => {
    setLoading(true);
    const week = chosenWeek
      .replace(/[^a-zA-Z0-9 ]/g, "")
      .replace(/\s/g, "")
      .toLowerCase();
    await database
      .ref()
      .child("timetableEvent")
      .child(week)
      .child(event.id)
      .remove();
    fetchData(chosenWeek);
    setLoading(false);
  };

  return (
    <IonPage id="timetable-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t("Timetable")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonListHeader>
          <span>
            {t("School week")}
            {": "}
            <IonText
              color="primary"
              onClick={(e) => {
                presentWeekPopover({
                  event: e.nativeEvent,
                });
              }}
            >
              {chosenWeek}{" "}
              <IonIcon icon={caretDown} style={{ verticalAlign: "middle" }} />
            </IonText>
          </span>
        </IonListHeader>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {documentList && documentList.length > 0 ? (
            documentList
              .sort((a, b) => {
                return b.timestamp - a.timestamp;
              })
              .map((document, index) => (
                <IonCard key={index}>
                  <IonItem lines="none" style={{ marginTop: 10 }}>
                    <IonAvatar
                      slot="start"
                      onClick={() => {
                        history.push(`/my/user/${document.userId}`);
                      }}
                    >
                      <IonImg
                        src={
                          document.avatar
                            ? document.avatar
                            : "/assets/image/placeholder.png"
                        }
                      />
                    </IonAvatar>
                    <IonLabel text-wrap color="dark">
                      <IonIcon
                        icon={trashBin}
                        className="ion-float-right"
                        color="medium"
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
                                  deleteDocument(document);
                                },
                              },
                            ],
                          });
                        }}
                        hidden={
                          userId !== document.userId &&
                          userEmail !== "clbclcmultimedia@gmail.com"
                        }
                        style={{ fontSize: "large", paddingLeft: 8 }}
                      />
                      <IonText color="dark">
                        <p
                          onClick={() => {
                            history.push(`/my/user/${document.userId}`);
                          }}
                        >
                          <b>{document.fullName}</b>
                        </p>
                      </IonText>
                      <IonLabel>
                        <IonText color="medium">
                          <i>
                            {moment(document.timestamp)
                              .locale(
                                localStorage.getItem("i18nLanguage") || "vi"
                              )
                              .format("Do MMM, H:mm")}
                          </i>
                        </IonText>
                      </IonLabel>
                    </IonLabel>
                  </IonItem>
                  <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
                    <IonLabel text-wrap color="dark">
                      {document.description}
                    </IonLabel>
                    <div style={{ marginTop: 16, marginBottom: 16 }}>
                      <IonButton
                        color="primary"
                        expand="block"
                        shape="round"
                        onClick={() => {
                          window.open(document.url, "_blank");
                        }}
                      >
                        {t("Visit link")}
                      </IonButton>
                    </div>
                  </IonCardContent>
                </IonCard>
              ))
          ) : (
            <EmptyUI />
          )}
        </div>

        <br />
        <hr />
        <IonListHeader>{t("Events")}</IonListHeader>
        {eventList && eventList.length > 0 ? (
          eventList.map((group, index) => (
            <div key={index} className="event-item">
              <IonCardSubtitle
                className="ion-margin"
                style={{ marginTop: 26 }}
                color="primary"
              >
                {moment(group.date, "D/M/YYYY")
                  .locale(localStorage.getItem("i18nLanguage") || "vi")
                  .format("dddd, D/M/YYYY")}
              </IonCardSubtitle>
              <IonList lines="none" style={{ width: "100%" }}>
                {group.events.map((item, index) => (
                  <IonItem className={`${color[item.index % 6]}`} key={index}>
                    <IonNote slot="start" style={{ width: 55 }}>
                      <IonLabel>
                        <IonText color="light">
                          {item.start || item.end ? (
                            <>
                              <p>{item.start}</p>
                              <p>{item.end}</p>
                            </>
                          ) : (
                            <p>{t("All day")}</p>
                          )}
                        </IonText>
                      </IonLabel>
                    </IonNote>
                    <div
                      style={{
                        marginTop: 16,
                        marginBottom: 16,
                        width: "100%",
                      }}
                    >
                      <IonLabel
                        text-wrap
                        style={{
                          paddingBottom: 5,
                          width: "100%",
                        }}
                      >
                        <IonIcon
                          icon={trashBin}
                          className="ion-float-right"
                          onClick={() => {
                            presentAlert({
                              header: t("Are you sure?"),
                              message: t("This will be permanently deleted"),
                              buttons: [
                                t("Cancel"),
                                {
                                  text: t("Delete"),
                                  handler: (d) => {
                                    deleteEvent(item);
                                  },
                                },
                              ],
                            });
                          }}
                          style={{ fontSize: "large" }}
                          hidden={
                            userId !== item.userId &&
                            userEmail !== "clbclcmultimedia@gmail.com"
                          }
                        />

                        <p
                          style={{
                            fontSize: "x-large",
                          }}
                        >
                          <b>{item.title}</b>
                        </p>
                      </IonLabel>
                      <IonLabel text-wrap>
                        {item.description && <p>• {item.description}</p>}
                        {item.location && <p>• {item.location}</p>}
                      </IonLabel>
                      <IonChip
                        className="ion-no-margin"
                        style={{ marginTop: 8 }}
                        onClick={() => {
                          history.push(`/my/user/${item.userId}`);
                        }}
                      >
                        <IonAvatar>
                          <IonImg
                            src={
                              item.avatar
                                ? item.avatar
                                : "/assets/image/placeholder.png"
                            }
                          />
                        </IonAvatar>
                        <IonLabel>
                          {item.fullName ? item.fullName : ""}
                        </IonLabel>
                      </IonChip>
                    </div>
                    <IonNote slot="end" color="light">
                      <IonLabel text-wrap></IonLabel>
                    </IonNote>
                  </IonItem>
                ))}
              </IonList>
            </div>
          ))
        ) : (
          <EmptyUI />
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              if (isVerify) {
                setSegmentValue("document");
                setNewDocument({
                  week:
                    moment().startOf("week").format("D/M") +
                    " - " +
                    moment().endOf("week").format("D/M/YYYY"),
                  description: "",
                  file: undefined,
                  url: "",
                });
                setNewEvent({
                  start: "",
                  end: "",
                  title: "",
                  description: "",
                  location: "",
                  date: moment().format(),
                });
                setShowAddModal(true);
              } else
                presentAlert({
                  header: t("Warning"),
                  message: t(
                    "You need to complete 3 verification steps to be able to use this feature!"
                  ),
                  buttons: [{ text: "OK" }],
                });
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
                    setShowAddModal(false);
                  }}
                >
                  {t("Cancel")}
                </IonButton>
              </IonButtons>
              <IonButtons slot="end">
                <IonButton
                  disabled={false}
                  onClick={() => {
                    if (segmentValue === "document") saveDocument();
                    else saveEvent();
                  }}
                >
                  <b>{t("Save")}</b>
                </IonButton>
              </IonButtons>
              <IonTitle>{t("Create")}</IonTitle>
            </IonToolbar>
          </IonHeader>
          <IonContent>
            <br />
            <IonButton hidden onClick={() => console.log(chosenWeek)}>
              Debug button
            </IonButton>

            <div className="ion-padding-horizontal ion-padding-bottom">
              <IonSegment
                color="primary"
                value={segmentValue}
                onIonChange={(e) => {
                  setSegmentValue(e.detail.value);
                }}
              >
                <IonSegmentButton value="document">
                  {t("Document")}
                </IonSegmentButton>
                <IonSegmentButton value="event">{t("Event")}</IonSegmentButton>
              </IonSegment>
            </div>

            {segmentValue === "document" ? (
              <IonList lines="full">
                <IonItem>
                  <IonLabel position="stacked">
                    {t("Select week")} <span style={{ color: "red" }}>*</span>
                  </IonLabel>

                  <IonSelect
                    interface="action-sheet"
                    value={newDocument.week}
                    onIonChange={(e) => {
                      setNewDocument({ ...newDocument, week: e.detail.value });
                    }}
                  >
                    {weekList
                      .filter((item) => {
                        const current =
                          moment().startOf("week").format("D/M") +
                          " - " +
                          moment().endOf("week").format("D/M/YYYY");
                        const index = weekList.indexOf(current);
                        return weekList.indexOf(item) <= index;
                      })
                      .map((item, index) => (
                        <IonSelectOption key={index}>{item}</IonSelectOption>
                      ))}
                  </IonSelect>
                </IonItem>

                <IonItem>
                  <IonLabel position="stacked">
                    {t("Description")} <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={newDocument.description}
                    onIonChange={(e) => {
                      setNewDocument({
                        ...newDocument,
                        description: e.detail.value,
                      });
                    }}
                    placeholder={t("Enter text")}
                  />
                </IonItem>
                <br />
                {newDocument && newDocument.file && (
                  <IonItem lines="none">
                    <div>
                      <IonCardSubtitle color="primary">
                        {t("Selected file")}
                      </IonCardSubtitle>
                      <IonLabel text-wrap>{newDocument.file.name}</IonLabel>
                      <IonLabel text-wrap>
                        {formatBytes(newDocument.file.size)}
                      </IonLabel>
                    </div>
                  </IonItem>
                )}

                <br />
                <input
                  type="file"
                  name="upload"
                  hidden
                  multiple={false}
                  ref={fileInputRef}
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const file = e.target.files.item(0);
                      if (file.size > 1024 * 1024)
                        presentAlert({
                          header: t("Warning"),
                          message: t("Please choose a file smaller than 1 MB"),
                          buttons: [{ text: "OK" }],
                        });
                      else {
                        const url = URL.createObjectURL(file);
                        setNewDocument({ ...newDocument, file, url });
                      }
                    }
                  }}
                />

                <IonButton
                  expand="block"
                  shape="round"
                  className="ion-margin"
                  onClick={() => {
                    fileInputRef.current.click();
                  }}
                >
                  {t("Select file")}
                </IonButton>
              </IonList>
            ) : (
              <IonList lines="full">
                <IonItem>
                  <IonLabel position="stacked">
                    {t("Title")} <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonInput
                    type="text"
                    value={newEvent.title}
                    onIonChange={(e) => {
                      setNewEvent({
                        ...newEvent,
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
                    value={newEvent.description}
                    onIonChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        description: e.detail.value,
                      });
                    }}
                    placeholder={t("Enter text")}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="stacked">{t("Location")}</IonLabel>
                  <IonInput
                    type="text"
                    value={newEvent.location}
                    onIonChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        location: e.detail.value,
                      });
                    }}
                    placeholder={t("Enter text")}
                  />
                </IonItem>

                <IonItem>
                  <IonLabel position="fixed">
                    {t("Date")} <span style={{ color: "red" }}>*</span>
                  </IonLabel>
                  <IonDatetime
                    displayFormat="D/M/YYYY"
                    value={newEvent.date}
                    onIonChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        date: e.detail.value,
                      });
                    }}
                    max={moment().add(3, "years").format("YYYY-MM-DD")}
                    min={moment().subtract(3, "months").format("YYYY-MM-DD")}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">{t("Start")}</IonLabel>
                  <IonDatetime
                    displayFormat="HH:mm"
                    minuteValues="00,05,10,15,20,25,30,35,40,45,50,55"
                    value={newEvent.start}
                    onIonChange={(e) => {
                      setNewEvent({
                        ...newEvent,
                        start: e.detail.value,
                      });
                    }}
                    placeholder="00:00"
                  />
                </IonItem>
                {newEvent && newEvent.start && (
                  <IonItem>
                    <IonLabel position="fixed">{t("End")}</IonLabel>
                    <IonDatetime
                      displayFormat="HH:mm"
                      minuteValues="00,05,10,15,20,25,30,35,40,45,50,55"
                      value={newEvent.end}
                      onIonChange={(e) => {
                        setNewEvent({
                          ...newEvent,
                          end: e.detail.value,
                        });
                      }}
                      placeholder="00:00"
                    />
                  </IonItem>
                )}
              </IonList>
            )}
          </IonContent>
        </IonModal>

        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default TimetablePage;
