import { useEffect, useState } from "react";
import { database, firestore } from "../../firebase";

const useAdventureCheck = (userId: string) => {
  const [teamId, setTeamId] = useState("");
  const [teamInfo, setTeamInfo] = useState<any>();

  useEffect(() => {
    const onCheckUserTeam = database
      .ref(`/adventure/${userId}/teamId`)
      .on("value", (snapshot) => {
        const data = snapshot.val();
        if (data) setTeamId(data);
        else setTeamId("");
      });
    return () =>
      database.ref(`/adventure/${userId}/teamId`).off("value", onCheckUserTeam);
  }, [userId]);

  useEffect(() => {
    if (teamId) {
      const onTeamInfo = firestore
        .collection("adventure")
        .doc(teamId)
        .onSnapshot((doc) => {
          setTeamInfo(doc.data());
        });
      return () => onTeamInfo();
    }
  }, [teamId]);

  return { teamId, teamInfo };
};

export default useAdventureCheck;
