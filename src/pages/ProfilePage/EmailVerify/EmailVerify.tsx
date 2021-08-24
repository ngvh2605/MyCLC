import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { auth as firebaseAuth } from "../../../firebase";

const EmailVerify: React.FC = () => {
  const { userEmail, emailVerified } = useAuth();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  function sendVerifyEmail() {
    setStatus({ loading: true, error: false });

    firebaseAuth.onAuthStateChanged((firebaseUser) => {
      firebaseUser
        .sendEmailVerification()
        .then(() => {
          setStatus({ loading: false, error: false });
          setAlertHeader("Đã gửi email xác minh!");
          setAlertMessage(
            "Vui lòng kiểm tra hộp thư đến hoặc hộp thư rác và làm theo hướng dẫn"
          );
          setShowAlert(true);
        })
        .catch((error) => {
          setStatus({ loading: false, error: true });

          console.log(error);
          setAlertHeader("Lỗi!");
          setAlertMessage("Vui lòng thử lại sau hoặc liên hệ bộ phận hỗ trợ");
          setShowAlert(true);
        });
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Xác minh Email</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <p style={{ textAlign: "center" }}>
          Địa chỉ Email của bạn:
          <br />
          <br />
          <b>{userEmail}</b>
        </p>
        <br />
        <br />
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={() => {
            sendVerifyEmail();
          }}
        >
          Gửi mã xác minh
        </IonButton>

        <IonLoading isOpen={status.loading} />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            history.goBack();
          }}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default EmailVerify;
