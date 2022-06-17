import { database, firestore } from "../../firebase";

export const followClub = async (userId: string, clubId: string) => {
  const currentFollow = (
    await database.ref().child("followersCount").child(clubId).get()
  ).val();
  if (!!currentFollow) {
    database
      .ref()
      .child("followersCount")
      .child(clubId)
      .set(currentFollow + 1);
  } else database.ref().child("followersCount").child(clubId).set(1);

  await firestore.doc(`followers/${clubId}_${userId}`).set({ clubId, userId });
};

export const unfollowClub = async (userId: string, clubId: string) => {
  const currentFollow = (
    await database.ref().child("followersCount").child(clubId).get()
  ).val();
  database
    .ref()
    .child("followersCount")
    .child(clubId)
    .set(currentFollow - 1);
  await firestore.doc(`followers/${clubId}_${userId}`).delete();
};
