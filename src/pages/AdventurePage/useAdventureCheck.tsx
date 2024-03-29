import { useEffect, useState } from "react";
import { database, firestore } from "../../firebase";
import { Answer, toAnswer } from "./model";

const useAdventureCheck = (userId: string) => {
  const [teamId, setTeamId] = useState("");
  const [teamInfo, setTeamInfo] = useState<any>();
  const [teamAnswers, setTeamAnswers] = useState<Answer[]>();

  const [allowMark, setAllowMark] = useState(false);

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
    database
      .ref(`/adventure/${userId}/allowMark`)
      .get()
      .then((snapshot) => {
        const data = snapshot.val();
        if (data) setAllowMark(true);
        else setAllowMark(false);
      });
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

  useEffect(() => {
    if (teamId && teamInfo && teamInfo.isStarted) {
      const onTeamAnswers = firestore
        .collection("adventureAnswer")
        .where("teamId", "==", teamId)
        .onSnapshot(({ docs }) => {
          if (docs && docs.length > 0) {
            setTeamAnswers(docs.map(toAnswer));
          }
        });
      return () => onTeamAnswers();
    }
  }, [teamId, teamInfo]);

  return { teamId, teamInfo, teamAnswers, allowMark };
};

export default useAdventureCheck;
