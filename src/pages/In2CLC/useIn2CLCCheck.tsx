import { useEffect, useState } from "react";
import { database, firestore } from "../../firebase";
import { Answer, Match, toAnswer } from "./model";

const useIn2CLCCheck = (userId: string, userEmail: string) => {
  const [matchInfo, setMatchInfo] = useState<Match>();
  const [userSubmission, setUserSubmission] = useState<Answer[]>();

  const updateMatchInfo = (match: Match) => {
    setMatchInfo(match);
  };

  const addSubmission = (submission: Answer) => {
    if (userSubmission && userSubmission.length > 0) {
      setUserSubmission([...userSubmission, submission]);
      // database
      //   .ref()
      //   .child("in2clc")
      //   .child(userId)
      //   .update({
      //     mentor_total: userSubmission.length + 1,
      //   });
    } else {
      setUserSubmission([{ ...submission }]);
      // database.ref().child("in2clc").child(userId).update({
      //   mentor_total: 1,
      // });
    }
  };

  useEffect(() => {
    const fetchInfo = async () => {
      const data = (await database.ref(`/in2clc/${userId}`).get()).val();
      if (data) setMatchInfo(data);
      else setMatchInfo(undefined);
    };
    fetchInfo();
  }, [userId]);

  useEffect(() => {
    const fetchInfo = async () => {
      await firestore
        .collection("in2clc")
        .where("email", "==", userEmail)
        .get()
        .then(({ docs }) => {
          if (docs && docs.length > 0) {
            setUserSubmission(docs.map(toAnswer));
          }
        });
    };
    fetchInfo();
  }, [userId]);

  return { matchInfo, updateMatchInfo, userSubmission, addSubmission };
};

export default useIn2CLCCheck;
