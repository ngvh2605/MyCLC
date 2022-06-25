import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { checkmarkCircle, chevronBack, qrCode, ticket } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { EmptyUI } from "../../../components/CommonUI/EmptyUI";
import HeaderToolbar from "../../../components/CommonUI/HeaderToolbar";
import { firestore } from "../../../firebase";
import { Events } from "../../../models";
import { getNameAndMailByUserId } from "../../HomePage/services";

interface RouteParams {
  id: string;
}

const EventRegisterList: React.FC = () => {
  const { id } = useParams<RouteParams>();
  const history = useHistory();
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

  const [limit, setLimit] = useState(20);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (locationRef.state) {
      const temp: Events = { ...locationRef.state };
      setEvents(temp);
    }
  }, [locationRef]);

  useEffect(() => {
    setIsLoading(true);
    const fetchTickets = firestore
      .collection("eventsTicket")
      .where("eventId", "==", id)
      .onSnapshot(({ docs }) => {
        let temp: any[] = [];
        docs.forEach((doc) => {
          temp.push({ userId: doc.data().userId, status: doc.data().status });
        });
        setTickets(temp);
        if (temp.length === 0) setIsLoading(false);
      });

    return () => {
      fetchTickets();
    };
  }, [id]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      let tempInfo = [];
      for (let item of tickets) {
        tempInfo.push({
          ...(await getNameAndMailByUserId(item.userId)),
          userId: item.userId,
        });
      }

      setUserInfo(tempInfo);
      setTotalTickets(tempInfo.length);
    };
    if (tickets && tickets.length > 0 && tickets.length > totalTickets) {
      fetchUserInfo().then(() => {
        setIsLoading(false);
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tickets]);

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
              setLimit(20);
            }}
          ></IonSearchbar>
        </div>

        {isLoading ? (
          <IonList>
            <ItemSkeleton />
            <ItemSkeleton />
            <ItemSkeleton />
          </IonList>
        ) : (
          <IonList>
            {tickets &&
            tickets.length > 0 &&
            userInfo &&
            userInfo.length > 0 &&
            userInfo.filter((user) => {
              if (!!search) {
                return (
                  user.fullName.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
                );
              } else return user;
            }).length > 0 ? (
              userInfo
                .slice(0, limit)
                .filter(function (user) {
                  return (
                    user.fullName
                      .toLowerCase()
                      .includes(search.toLowerCase()) ||
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
                    <IonItem
                      lines="full"
                      detail={true}
                      detailIcon={chevronBack}
                    >
                      <IonIcon
                        icon={checkmarkCircle}
                        color="success"
                        slot="start"
                        style={{
                          opacity: tickets[index].status === "checkin" ? 1 : 0,
                        }}
                      />
                      <IonLabel
                        text-wrap
                        onClick={() => {
                          history.push(`/my/user/${user.userId}`);
                        }}
                      >
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

            {tickets && tickets.length > 0 && tickets.length >= limit && (
              <IonInfiniteScroll
                threshold="100px"
                onIonInfinite={(ev: any) => {
                  setTimeout(() => {
                    setLimit(limit + 10);
                    ev.target.complete();
                  }, 500);
                }}
              >
                <IonInfiniteScrollContent loadingSpinner="crescent" />
              </IonInfiniteScroll>
            )}
          </IonList>
        )}

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => {}}>
            <IonIcon icon={qrCode} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonPage>
  );
};

const ItemSkeleton = () => {
  return (
    <IonItem lines="full" detail={true} detailIcon={chevronBack}>
      <IonIcon
        icon={checkmarkCircle}
        color="success"
        slot="start"
        style={{
          opacity: 0,
        }}
      />
      <IonLabel>
        <IonSkeletonText animated style={{ width: "50%" }} />
        <IonSkeletonText animated style={{ width: "70%" }} />
      </IonLabel>
    </IonItem>
  );
};

export default EventRegisterList;
