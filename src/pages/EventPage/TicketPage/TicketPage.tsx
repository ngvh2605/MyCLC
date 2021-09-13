import { Camera, CameraResultType, CameraSource } from "@capacitor/core";
import {
  IonAlert,
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonLabel,
  IonLoading,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { image } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useUploadFile from "../../../common/useUploadFile";
import { database } from "../../../firebase";
import { resizeImage } from "../../../utils/helpers/helpers";

const TicketPage: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="" defaultHref="/my/event" />
          </IonButtons>
          <IonTitle>Sự kiện của bạn</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
};

export default TicketPage;
