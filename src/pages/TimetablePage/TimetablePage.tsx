/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
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
  IonMenuButton,
  IonModal,
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
} from "@ionic/react";
import {
  add,
  brush,
  caretDown,
  close,
  ellipsisHorizontal,
  trash,
} from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { auth } from "../../firebase";
import "./TimetablePage.scss";
import { WeekPopover } from "./TimetablePopover";
import { useEffect } from "react";
import useUploadFile from "../../common/useUploadFile";
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

const TimetablePage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const { handleUploadFile } = useUploadFile();

  const [chosenWeek, setChosenWeek] = useState<String>(
    moment().startOf("week").format("D/M") +
      " - " +
      moment().endOf("week").format("D/M/YYYY")
  );
  const [weekList, setWeekList] = useState<String[]>([]);
  const [presentAlert] = useIonAlert();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showActionSheet, setShowActionSheet] = useState(false);

  const [presentWeekPopover, dismissWeek] = useIonPopover(WeekPopover, {
    onHide: () => dismissWeek(),
    list: weekList,
    current:
      moment().startOf("week").format("D/M") +
      " - " +
      moment().endOf("week").format("D/M/YYYY"),
    selected: chosenWeek,
    onSelect: (item: String) => {
      setChosenWeek(item);
    },
  });

  const [segmentValue, setSegmentValue] = useState("document");

  useEffect(() => {
    let list: String[] = [];
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
          <IonCard>
            <IonItem lines="none" style={{ marginTop: 10 }}>
              <IonAvatar
                slot="start"
                onClick={() => {
                  history.push(`/my/user/`);
                }}
              >
                <IonImg src={"/assets/image/placeholder.png"} />
              </IonAvatar>
              <IonLabel text-wrap color="dark">
                <IonIcon
                  icon={ellipsisHorizontal}
                  className="ion-float-right"
                  color="medium"
                  onClick={() => {
                    setShowActionSheet(true);
                  }}
                  hidden={false}
                  style={{ fontSize: "large", paddingLeft: 8 }}
                />
                <IonText color="dark">
                  <p
                    onClick={() => {
                      history.push(`/my/user/`);
                    }}
                  >
                    <b>{auth.currentUser.displayName}</b>
                  </p>
                </IonText>
                <IonLabel>
                  <IonText color="medium">
                    <i>
                      {moment()
                        .locale(localStorage.getItem("i18nLanguage") || "vi")
                        .format("Do MMM, H:mm")}
                    </i>
                  </IonText>
                </IonLabel>
              </IonLabel>
            </IonItem>
            <IonCardContent style={{ paddingTop: 0, paddingBottom: 0 }}>
              <div style={{ marginBottom: 16 }}>
                <IonButton color="primary" expand="block" shape="round">
                  {t("Timetable")}
                </IonButton>
              </div>
            </IonCardContent>

            <IonActionSheet
              isOpen={showActionSheet}
              onDidDismiss={() => setShowActionSheet(false)}
              cssClass="my-custom-class"
              buttons={[
                {
                  text: t("Edit"),
                  icon: brush,
                  handler: () => {},
                },
                {
                  text: t("Delete"),
                  role: "destructive",
                  icon: trash,
                  handler: () => {
                    presentAlert({
                      header: t("Are you sure?"),
                      message: t("This will be permanently deleted"),
                      buttons: [
                        t("Cancel"),
                        {
                          text: t("Delete"),
                          handler: (d) => {},
                        },
                      ],
                      onDidDismiss: (e) => console.log("did dismiss"),
                    });
                  },
                },
                {
                  text: t("Cancel"),
                  icon: close,
                  role: "cancel",
                  handler: () => {
                    console.log("Cancel clicked");
                  },
                },
              ]}
            ></IonActionSheet>
          </IonCard>
        </div>

        <br />
        <hr />
        <IonListHeader>{t("Information")}</IonListHeader>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton
            onClick={() => {
              // for (let member in newLesson) newLesson[member] = "";
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
                    // let hasData = false;
                    // for (let member in newLesson) {
                    //   if (newLesson[member]) hasData = true;
                    // }
                    // if (hasData) {
                    //   presentAlert({
                    //     header: "Huỷ?",
                    //     message: "Những thay đổi của bạn sẽ không được lưu",
                    //     buttons: [
                    //       "Tiếp tục chỉnh sửa",
                    //       {
                    //         text: "Xoá thay đổi",
                    //         handler: (d) => {
                    //           for (let member in newLesson)
                    //             newLesson[member] = "";
                    //           setShowAddModal(false);
                    //         },
                    //       },
                    //     ],
                    //     onDidDismiss: (e) => console.log("did dismiss"),
                    //   });
                    // } else {
                    //   for (let member in newLesson) newLesson[member] = "";
                    //   setShowAddModal(false);
                    // }
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
                    // addNewLesson();
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
              Click
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

            <IonList lines="full">
              <IonItem>
                <IonLabel position="stacked">
                  {t("Select week")} <span style={{ color: "red" }}>*</span>
                </IonLabel>

                <IonSelect interface="action-sheet">
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
                  Mô tả <span style={{ color: "red" }}>*</span>
                </IonLabel>
                <IonInput
                  type="text"
                  value={""}
                  onIonChange={(e) => {}}
                  placeholder="Tối đa 80 chữ cái"
                  maxlength={80}
                />
              </IonItem>

              <IonItem>
                <IonLabel position="stacked">
                  Chọn file <span style={{ color: "red" }}>*</span>
                </IonLabel>
                <input
                  type="file"
                  name="upload"
                  onChange={(e) => {
                    if (e.target.files.length > 0) {
                      const file = e.target.files.item(0);
                      const url = URL.createObjectURL(file);
                      console.log(file);

                      handleUploadFile(url, file, "document");
                    }
                  }}
                />
              </IonItem>
              {/* <IonItem>
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
              </IonItem> */}
            </IonList>
          </IonContent>
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default TimetablePage;
