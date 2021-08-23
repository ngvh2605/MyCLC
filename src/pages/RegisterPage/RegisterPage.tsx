import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
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
import { eye, closeCircle, eyeOff } from "ionicons/icons";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth } from "../../firebase";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState<any>("password");
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [status, setStatus] = useState({ loading: false, error: false });

  const handleRegister = async () => {
    try {
      setStatus({ loading: true, error: false });
      const credential = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      console.log("credential:", credential);
    } catch (error) {
      setStatus({ loading: false, error: true });
      console.log("error:", error);
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }
  return (
    <IonPage id="register-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Đăng ký</IonTitle>
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
              hidden={email == "" ? true : false}
              onClick={() => setEmail("")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Password</IonLabel>
            <IonInput
              type={passwordType}
              value={password}
              onIonChange={(event) => setPassword(event.detail.value)}
            />
            <IonIcon
              icon={passwordIcon}
              className="passwordIcon"
              slot="end"
              size="small"
              color="medium"
              hidden={password == "" ? true : false}
              onClick={() => {
                if (passwordType == "password") {
                  setPasswordType("text");
                  setPasswordIcon(eyeOff);
                } else {
                  setPasswordType("password");
                  setPasswordIcon(eye);
                }
              }}
            />
          </IonItem>
        </IonList>
        {status.error && <IonText color="danger">Registration failed</IonText>}
        <IonButton expand="block" onClick={handleRegister}>
          Create Account
        </IonButton>
        <IonButton expand="block" fill="clear" routerLink="/login">
          Already have an account?
        </IonButton>
        <IonLoading isOpen={status.loading} />
      </IonContent>
    </IonPage>
  );
};

export default RegisterPage;
