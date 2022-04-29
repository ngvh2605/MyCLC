import { useEffect, useState } from "react";
import { database } from "../../firebase";
import { Match } from "./model";

const useIn2CLCCheck = (userId: string) => {
  const [matchInfo, setMatchInfo] = useState<Match>();

  useEffect(() => {
    const onCheckIn2CLCMatch = database
      .ref(`/in2clc/${userId}`)
      .on("value", (snapshot) => {
        console.log("match snapshot", snapshot.val());
        const data = snapshot.val();
        if (data) setMatchInfo(data);
        else setMatchInfo(undefined);
      });
    return () =>
      database.ref(`/in2clc/${userId}`).off("value", onCheckIn2CLCMatch);
  }, [userId]);

  return { matchInfo };
};

export default useIn2CLCCheck;
