import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { closeCircle, eye, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth } from "../../firebase";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState<any>("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [status, setStatus] = useState({ loading: false, error: false });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    if (email.includes("@") == false || email.includes(".") == false) {
      setAlertMessage("Định dạng email không hợp lệ");
      setShowAlert(true);
    } else if (password.length < 8) {
      setAlertMessage("Mật khẩu tối thiểu 8 ký tự");
      setShowAlert(true);
    } else {
      try {
        setStatus({ loading: true, error: false });
        const credential = await auth.signInWithEmailAndPassword(
          email,
          password
        );
        console.log("credential:", credential);
      } catch (error) {
        setStatus({ loading: false, error: true });
        console.log("error:", error);
        setAlertMessage("Email hoặc mật khẩu không đúng");
        setShowAlert(true);
      }
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }
  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Đăng nhập</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonList>
          <IonItem>
            <IonLabel position="floating">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(event) => setEmail(event.detail.value)}
            />
            <IonIcon
              icon={closeCircle}
              className="passwordIcon"
              slot="end"
              size="small"
              color="medium"
              hidden={!email ? true : false}
              onClick={() => setEmail("")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Mật khẩu</IonLabel>
            <IonInput
              type={passwordType}
              value={password}
              onIonChange={(event) => setPassword(event.detail.value)}
              onKeyPress={(event) => {
                if (event.key == "Enter") handleLogin();
              }}
            />
            <IonIcon
              icon={passwordIcon}
              className="passwordIcon"
              slot="end"
              size="small"
              color="medium"
              hidden={!password ? true : false}
              onClick={() => {
                if (passwordType == "password") {
                  setPasswordType("text");
                  setPasswordIcon(eye);
                } else {
                  setPasswordType("password");
                  setPasswordIcon(eyeOff);
                }
              }}
            />
          </IonItem>
        </IonList>

        <br />
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={handleLogin}
          disabled={email && password ? false : true}
        >
          Đăng nhập
        </IonButton>
        <br />
        <br />
        <IonButton expand="block" fill="clear" routerLink="/register">
          Quên mật khẩu?
        </IonButton>

        <IonLoading isOpen={status.loading} />

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={"Lỗi"}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
