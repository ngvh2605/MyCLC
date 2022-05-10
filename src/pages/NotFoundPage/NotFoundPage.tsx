import {
  IonButton,
  IonContent,
  IonImg,
  IonLabel,
  IonPage,
  IonSlide,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";

const NotFoundPage: React.FC = () => {
  const history = useHistory();
  return (
    <IonPage>
      <IonContent className="ion-padding">
        <IonSlide>
          <div className="ion-margin">
            <IonImg
              src="/assets/image/construction.svg"
              style={{ height: window.screen.height / 4, marginBottom: 10 }}
            />
            <IonLabel
              style={{
                fontSize: "x-large",
                margin: "auto",
                lineHeight: "40px",
              }}
            >
              <b>Trang này không tồn tại</b>
            </IonLabel>
            <br />
            <br />
            <br />
            <IonButton
              shape="round"
              expand="block"
              onClick={() => history.replace("/my/home")}
            >
              Quay lại trang chủ
            </IonButton>
          </div>
        </IonSlide>
      </IonContent>
    </IonPage>
  );
};

export default NotFoundPage;
