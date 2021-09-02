import {
  IonAlert,
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
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
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
            <IonBackButton text="Huỷ" defaultHref="/my/profile" />
          </IonButtons>
          <IonTitle>Xác minh Email</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <br />
        <br />
        <p style={{ textAlign: "center" }}>
          Địa chỉ Email của bạn:
          <br />
          <br />
          <b>{userEmail}</b>
        </p>
        <br />
        <br />

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            Lưu ý: Sau khi đã xác minh email, bạn cần refresh lại trang ứng dụng
            để cập nhật trạng thái đã xác minh
          </IonLabel>
        </IonChip>

        <IonLoading isOpen={status.loading} />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            history.replace("/my/profile");
          }}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              className="ion-margin"
              expand="block"
              shape="round"
              onClick={() => {
                sendVerifyEmail();
              }}
            >
              Gửi mã xác minh
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default EmailVerify;
