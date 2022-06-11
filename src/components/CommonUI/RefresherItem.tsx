import { RefresherEventDetail } from "@ionic/core";
import { IonRefresher, IonRefresherContent } from "@ionic/react";
import { chevronDown } from "ionicons/icons";
import React from "react";
import { setTimeout } from "timers";

const RefresherItem: React.FC<{
  handleRefresh: () => void;
}> = (props) => {
  const { handleRefresh } = props;
  return (
    <IonRefresher
      slot="fixed"
      onIonRefresh={(event: CustomEvent<RefresherEventDetail>) => {
        handleRefresh();
        setTimeout(() => {
          event.detail.complete();
        }, 2000);
      }}
    >
      <IonRefresherContent
        style={{ marginTop: 10 }}
        pullingIcon={chevronDown}
        pullingText="Kéo xuống để làm mới"
      ></IonRefresherContent>
    </IonRefresher>
  );
};

export default RefresherItem;
