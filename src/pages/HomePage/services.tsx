import { database, firestore, storage } from "../../firebase";
import { News, toComment, toEvents, toNews } from "../../models";

export const getComment = async (id: string) => {
  const { docs } = await firestore
    .collection("news")
    .doc(id)
    .collection("comment")
    .orderBy("timestamp", "desc")
    .get();
  return docs.map(toComment);
};

export const getNew = async (limit: number) => {
  const newsRef = firestore.collection("news");
  const { docs } = await newsRef
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();
  return docs.map(toNews);
};

export const getNewByUserId = async (userId: string, limit: number) => {
  const newsRef = firestore.collection("news");
  const { docs } = await newsRef
    .where("author", "==", userId)
    .orderBy("timestamp", "desc")
    .limit(limit)
    .get();
  return docs.map(toNews);
};

export const getNextNews = async (key: any, limit: number = 3) => {
  const eventsRef = firestore.collection("news");
  const { docs } = await eventsRef
    .orderBy("timestamp", "desc")
    .startAfter(key)
    .limit(limit)
    .get();
  return docs.map(toNews);
};

export const getLikedNewByUserId = async (id: string) => {
  const junctions = await firestore
    .collection("newsReaction")
    .where("userId", "==", id)
    .get();

  const news = await Promise.all(
    junctions.docs
      .filter((doc) => doc.exists)
      .map((doc) => firestore.doc(`news/${doc.data().newId}`).get())
  );
  return news
    .filter((doc) => doc.exists)
    .map((doc) => ({ id: doc.id, ...doc.data() }));
};

export const getLikedUserByNewId = async (id: string) => {
  const junctions = await firestore
    .collection("newsReaction")
    .where("newId", "==", id)
    .get();

  const userIds = await Promise.all(
    junctions.docs.filter((doc) => doc.exists).map((doc) => doc.data().userId)
  );
  const users = await Promise.all(
    userIds.map(async (userId) => {
      const user = (
        await database
          .ref()
          .child("users")
          .child(userId)
          .child("personal")
          .get()
      ).val();
      return { id: userId, ...user };
    })
  );
  return users;
};

export const getInfoByUserId = async (id: string) => {
  const info = await database
    .ref()
    .child("users")
    .child(id)
    .child("personal")
    .get();
  return info.val();
};

export const likeNews = async (userId: string, newId: string) => {
  const currentLikes = (
    await firestore.collection("news").doc(newId).get()
  ).data().totalLikes;
  if (currentLikes)
    firestore
      .collection("news")
      .doc(newId)
      .update({ totalLikes: currentLikes + 1 });
  else firestore.collection("news").doc(newId).update({ totalLikes: 1 });
  await firestore.doc(`newsReaction/${newId}_${userId}`).set({ newId, userId });
};

export const unlikeNews = async (userId: string, newId: string) => {
  const currentLikes = (
    await firestore.collection("news").doc(newId).get()
  ).data().totalLikes;
  firestore
    .collection("news")
    .doc(newId)
    .update({ totalLikes: currentLikes - 1 });
  await firestore
    .collection("newsReaction")
    .where("newId", "==", newId)
    .where("userId", "==", userId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
};

export const isNewLikedByUser = async (userId: string, newId: string) => {
  const junctions = await firestore
    .collection("newsReaction")
    .where("newId", "==", newId)
    .where("userId", "==", userId)
    .get();
  return !junctions.empty;
};

export const deleteNews = async (news: News) => {
  const task: Promise<void>[] = [];
  //delete picture from storage
  if (news.pictureUrl) task.push(storage.refFromURL(news.pictureUrl).delete());
  //delete reaction
  const { docs: reaction } = await firestore
    .collection("newsReaction")
    .where("newId", "==", news.id)
    .get();

  task.push(
    ...reaction
      .filter((doc) => doc.exists)
      .map((doc) => firestore.collection("newsReaction").doc(doc.id).delete())
  );

  //delete comment
  const { docs } = await firestore
    .collection("news")
    .doc(news.id)
    .collection("comment")
    .get();

  task.push(
    ...docs
      .filter((doc) => doc.exists)
      .map((doc) =>
        firestore
          .collection("news")
          .doc(news.id)
          .collection("comment")
          .doc(doc.id)
          .delete()
      )
  );

  //delete news
  task.push(firestore.collection("news").doc(news.id).delete());
  return Promise.all(task);
};

export const buyTicket = async (userId: string, eventId: string) => {
  const data = (await firestore.collection("events").doc(eventId).get()).data();
  if (data.totalBuy) {
    if (data.totalBuy < data.totalTicket) {
      firestore
        .collection("events")
        .doc(eventId)
        .update({ totalBuy: data.totalBuy + 1 });
      await firestore
        .doc(`eventsTicket/${eventId}_${userId}`)
        .set({ eventId, userId, status: "register" });
    } else {
      firestore
        .collection("events")
        .doc(eventId)
        .update({ totalBuy: data.totalBuy + 1 });
      await firestore
        .doc(`eventsTicket/${eventId}_${userId}`)
        .set({ eventId, userId, status: "wishlist" });
    }
  } else {
    firestore.collection("events").doc(eventId).update({ totalBuy: 1 });
    await firestore
      .doc(`eventsTicket/${eventId}_${userId}`)
      .set({ eventId, userId, status: "register" });
  }
};

export const cancelTicket = async (userId: string, eventId: string) => {
  const currentBuy = (
    await firestore.collection("events").doc(eventId).get()
  ).data().totalBuy;
  firestore
    .collection("events")
    .doc(eventId)
    .update({ totalBuy: currentBuy - 1 });
  await firestore
    .collection("eventsTicket")
    .where("eventId", "==", eventId)
    .where("userId", "==", userId)
    .get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(function (doc) {
        doc.ref.delete();
      });
    });
};

export const getEventTicketByUserId = async (id: string) => {
  const junctions = await firestore
    .collection("eventsTicket")
    .where("userId", "==", id)
    .get();

  const events = await Promise.all(
    junctions.docs
      .filter((doc) => doc.exists)
      .map((doc) => firestore.doc(`events/${doc.data().eventId}`).get())
  );
  return {
    tickets: junctions.docs
      .filter((doc) => doc.exists)
      .map((doc) => doc.data()),
    events: events.filter((doc) => doc.exists).map((doc) => toEvents(doc)),
  };
};
