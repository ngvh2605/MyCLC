import moment from "moment";
import { database, firestore, storage } from "../../firebase";
import { News, toComment, toEvents, toNews } from "../../models";

export const getEvent = async (limit: number) => {
  const eventsRef = firestore.collection("events");
  const { docs } = await eventsRef
    .where("endDate", ">=", moment().valueOf() - 86400000 * 3)
    .orderBy("endDate", "desc")
    .limit(limit)
    .get();
  return docs.map(toEvents);
};

export const getNextEvent = async (key: any, limit: number = 3) => {
  const eventsRef = firestore.collection("events");
  const { docs } = await eventsRef
    .where("endDate", ">=", moment().valueOf() - 86400000 * 3)
    .orderBy("endDate", "desc")
    .startAfter(key)
    .limit(limit)
    .get();
  return docs.map(toEvents);
};
