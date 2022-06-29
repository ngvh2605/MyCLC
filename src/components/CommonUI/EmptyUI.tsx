import { IonIcon, IonLabel } from "@ionic/react";
import { t } from "i18next";
import { fileTray } from "ionicons/icons";
import React from "react";

export const EmptyUI = () => (
  <div style={{ marginTop: 10, marginBottom: 10 }}>
    <IonIcon
      icon={fileTray}
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: 100,
        height: 100,
        color: "#B5B5B5",
      }}
    />
    <IonLabel
      style={{
        display: "block",
        marginLeft: "auto",
        marginRight: "auto",
        width: "max-content",
      }}
      color="medium"
    >
      <p>{t("Empty")}</p>
    </IonLabel>
  </div>
);
