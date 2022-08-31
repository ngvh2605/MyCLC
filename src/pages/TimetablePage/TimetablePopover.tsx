import { IonItem, IonList, IonListHeader, IonText } from "@ionic/react";
import { t } from "i18next";
import React from "react";

export const WeekPopover: React.FC<{
  list: String[];
  current: String;
  selected: String;
  onHide: () => void;
  onSelect: (item: String) => void;
}> = ({ list, current, selected, onHide, onSelect }) => (
  <IonList>
    <IonListHeader>{t("Select week")}</IonListHeader>
    {list &&
      list.map((item, index) => (
        <IonItem
          key={index}
          button
          onClick={() => {
            onSelect(item);
            onHide();
          }}
        >
          <IonText color={item === selected ? "primary" : "dark"}>
            {item === current || item === selected ? (
              <b>{item}</b>
            ) : (
              <>{item}</>
            )}
          </IonText>
        </IonItem>
      ))}
    <IonItem lines="none" detail={false} button onClick={() => onHide()}>
      <IonText color="danger">{t("Close")}</IonText>
    </IonItem>
  </IonList>
);
