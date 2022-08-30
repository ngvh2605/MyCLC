import { IonItem, IonList, IonListHeader, IonText } from "@ionic/react";
import moment from "moment";
import React from "react";
import { WeekItem } from "./OldTimeTablePage";

export const WeekPopover: React.FC<{
  list: WeekItem[];
  selected?: WeekItem;
  onHide: () => void;
  onSelect: (item: WeekItem) => void;
}> = ({ list, selected, onHide, onSelect }) => (
  <IonList>
    <IonListHeader>Chọn tuần học</IonListHeader>
    {list &&
      list
        .sort((a, b) => a.key.localeCompare(b.key))
        .map((item, index) => (
          <IonItem
            key={index}
            button
            onClick={() => {
              onSelect(item);
              onHide();
            }}
          >
            {item.name}
          </IonItem>
        ))}
    <IonItem lines="none" detail={false} button onClick={() => onHide()}>
      <IonText color="danger">Đóng</IonText>
    </IonItem>
  </IonList>
);

export const DatePopover: React.FC<{
  selected: WeekItem;
  onHide: () => void;
  onSelect: (slide: number) => void;
}> = ({ selected, onHide, onSelect }) => (
  <IonList>
    <IonListHeader>Ngày trong tuần</IonListHeader>
    {selected && (
      <>
        <IonItem
          button
          onClick={() => {
            onSelect(0);
            onHide();
          }}
        >
          T2, {moment(selected.key).day(1).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(1);
            onHide();
          }}
        >
          T3, {moment(selected.key).day(2).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(2);
            onHide();
          }}
        >
          T4, {moment(selected.key).day(3).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(3);
            onHide();
          }}
        >
          T5, {moment(selected.key).day(4).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(4);
            onHide();
          }}
        >
          T6, {moment(selected.key).day(5).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(5);
            onHide();
          }}
        >
          T7, {moment(selected.key).day(6).format("Do MMMM")}
        </IonItem>
        <IonItem
          button
          onClick={() => {
            onSelect(6);
            onHide();
          }}
        >
          CN, {moment(selected.key).day(7).format("Do MMMM")}
        </IonItem>
      </>
    )}
    <IonItem lines="none" detail={false} button onClick={() => onHide()}>
      <IonText color="danger">Đóng</IonText>
    </IonItem>
  </IonList>
);
