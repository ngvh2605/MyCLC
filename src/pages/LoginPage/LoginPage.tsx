import {
  IonButton,
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
  const [passwordIcon, setPasswordIcon] = useState(eye);
  const [status, setStatus] = useState({ loading: false, error: false });

  const handleLogin = async () => {
    try {
      setStatus({ loading: true, error: false });
      const credential = await auth.signInWithEmailAndPassword(email, password);
      console.log("credential:", credential);
    } catch (error) {
      setStatus({ loading: false, error: true });
      console.log("error:", error);
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/entries" />;
  }
  return (
    <IonPage id="login-page">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Login</IonTitle>
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

        <br />
        {status.error && <IonText color="danger">Invalid credentials</IonText>}
        <IonButton expand="block" onClick={handleLogin}>
          Login
        </IonButton>
        <IonButton expand="block" fill="clear" routerLink="/register">
          Don't have an account?
        </IonButton>

        <IonLoading isOpen={status.loading} />
      </IonContent>
    </IonPage>
  );
};

export default LoginPage;
