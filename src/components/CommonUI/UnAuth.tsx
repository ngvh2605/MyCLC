import { IonChip, IonContent, IonImg, IonLabel, IonSlide } from "@ionic/react";
import React from "react";

export const UnAuth: React.FC = () => {
  return (
    <IonContent className="ion-padding">
      <IonChip
        color="danger"
        style={{ height: "max-content", marginBottom: 10 }}
        className="ion-margin"
      >
        <IonLabel text-wrap className="ion-padding">
          Bạn cần hoàn thành 3 bước xác minh để có thể sử dụng tính năng này!
        </IonLabel>
      </IonChip>
      <IonSlide style={{ height: "70%" }}>
        <div className="ion-margin">
          <IonImg
            src="/assets/image/security.svg"
            style={{ height: window.screen.height / 4, marginBottom: 10 }}
          />
          <IonLabel
            style={{
              fontSize: "x-large",
              margin: "auto",
              lineHeight: "40px",
            }}
          >
            <b>Từ chối truy cập</b>
          </IonLabel>
        </div>
      </IonSlide>
    </IonContent>
  );
};
