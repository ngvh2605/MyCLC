import { useEffect, useState } from "react";
import { database } from "../../firebase";

const useAdventureCheck = (userId: string) => {
  const [teamId, setTeamId] = useState("");

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

  return { teamId };
};

export default useAdventureCheck;
