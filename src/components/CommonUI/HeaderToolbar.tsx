import {
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonNote,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import "./HeaderToolbar.scss";

const HeaderToolbar: React.FC<{
  icon: string;
  text: string;
  note: string | number;
  color?: string;
}> = (props) => {
  const { icon, text, note, color = "primary" } = props;
  return (
    <IonHeader id="header-toolbar">
      <IonToolbar className="ion-no-padding ion-no-margin">
        <div style={{ backgroundColor: `var(--ion-color-${color})` }}>
          <IonItem lines="none">
            <IonIcon slot="start" icon={icon} />
            <IonLabel>
              <b>{text}</b>
            </IonLabel>
            <IonNote slot="end">
              <b>{note}</b>
            </IonNote>
          </IonItem>
        </div>
      </IonToolbar>
    </IonHeader>
  );
};

export default HeaderToolbar;
