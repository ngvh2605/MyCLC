import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, chevronBack, qrCode, ticket } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import HeaderToolbar from "../../../components/CommonUI/HeaderToolbar";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { getInfoByUserId } from "../../HomePage/services";

interface RouteParams {
  id: string;
}

const EventRegisterList: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const locationRef = useLocation<Events>();
  const slidingEl = useRef<(HTMLIonItemSlidingElement | null)[]>([]);

  const [events, setEvents] = useState<Events>();
  const [tickets, setTickets] = useState<
    {
      userId: string;
      status: string;
    }[]
  >();
  const [totalTickets, setTotalTickets] = useState(0);
  const [userInfo, setUserInfo] = useState<any[]>();
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (locationRef.state) {
      const temp: Events = { ...locationRef.state };
      setEvents(temp);
    }
  }, [locationRef]);

  useEffect(() => {
    const fetchTickets = firestore
      .collection("eventsTicket")
      .where("eventId", "==", id)
      .onSnapshot(({ docs }) => {
        let temp: any[] = [];
        docs.forEach((doc) => {
          temp.push({ userId: doc.data().userId, status: doc.data().status });
        });
        setTickets(temp);
      });

    return () => {
      fetchTickets();
    };
  }, [id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      console.log(tickets);

      let tempInfo = [];
      for (let item of tickets) {
        tempInfo.push(await getInfoByUserId(item.userId));
      }
      setUserInfo(tempInfo);
      setTotalTickets(tempInfo.length);
    };
    if (tickets && tickets.length > 0 && tickets.length > totalTickets) {
      fetchUserInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

  useEffect(() => {
    console.log(userInfo);
  }, [userInfo]);

  const handleCheckin = (index: number) => {
    slidingEl.current[index].close();
    firestore
      .collection("eventsTicket")
      .doc(`${id}_${tickets[index].userId}`)
      .update({ status: "checkin" });
  };

  const handleUnCheckin = (index: number) => {
    slidingEl.current[index].close();
    firestore
      .collection("eventsTicket")
      .doc(`${id}_${tickets[index].userId}`)
      .update({ status: "register" });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/manage" />
          </IonButtons>
          <IonTitle>{events && events.title}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <HeaderToolbar
        icon={ticket}
        text="Check in"
        note={
          tickets && tickets.length
            ? `${
                tickets.filter((item) => {
                  return item.status === "checkin";
                }).length
              } / ${tickets.length}`
            : "0 / 0"
        }
        color="primary"
      />
      <IonContent>
        <div>
          <IonSearchbar
            placeholder="Tìm kiếm"
            onIonChange={(e) => {
              setSearch(e.detail.value);
            }}
          ></IonSearchbar>
        </div>
        <IonList>
          {tickets &&
          tickets.length > 0 &&
          userInfo &&
          userInfo.length > 0 &&
          userInfo.filter(function (user) {
            return (
              user.fullName.toLowerCase().includes(search.toLowerCase()) ||
              user.email.toLowerCase().includes(search.toLowerCase())
            );
          }).length > 0 ? (
            userInfo
              .filter(function (user) {
                return (
                  user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map((user, index) => (
                <IonItemSliding
                  key={index}
                  ref={(ref) => {
                    slidingEl.current[index] = ref;
                  }}
                >
                  <IonItem lines="full" detail={true} detailIcon={chevronBack}>
                    <IonIcon
                      icon={checkmarkCircle}
                      color="success"
                      slot="start"
                      style={{
                        opacity: tickets[index].status === "checkin" ? 1 : 0,
                      }}
                    />
                    <IonLabel text-wrap>
                      <IonText>
                        <b>{user.fullName}</b>
                      </IonText>
                      <br />
                      <IonText>{user.email}</IonText>
                    </IonLabel>
                  </IonItem>

                  <IonItemOptions side="end">
                    <IonItemOption
                      color={
                        tickets[index].status === "checkin"
                          ? "danger"
                          : "success"
                      }
                      onClick={() => {
                        if (tickets[index].status === "checkin") {
                          handleUnCheckin(index);
                        } else handleCheckin(index);
                      }}
                    >
                      {tickets[index].status === "checkin"
                        ? "Huỷ check in"
                        : "Check in"}
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              ))
          ) : (
            <EmptyUI />
          )}
        </IonList>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {}}>
            <IonIcon icon={qrCode} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

export default EventRegisterList;
