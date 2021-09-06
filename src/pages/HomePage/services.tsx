import { firestore, database } from "../../firebase";
import { News, toNews, Comment, toComment } from "../../models";

export const getComment = async (id: string) => {
  const { docs } = await firestore
    .collection("news")
    .doc(id)
    .collection("comment")
    .get();
  return docs.map(toComment);
};

export const getNew = async () => {
  const newsRef = firestore.collection("news");
  const { docs } = await newsRef.orderBy("timestamp", "desc").limit(7).get();
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

export const likeNews = async (userId: string, newId: string) => {
  const junctionRef = firestore.doc(`newsReaction/${newId}_${userId}`);
  await junctionRef.set({ newId, userId });
};

export const isNewLikedByUser = async (userId: string, newId: string) => {
  const junctions = await firestore
    .collection("newsReaction")
    .where("newId", "==", newId)
    .where("userId", "==", userId)
    .get();
  return !junctions.empty;
};
