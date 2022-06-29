import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import { closeCircle, eye, eyeOff, logoGoogle } from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth, database } from "../../firebase";
import { handleGoogleLogin } from "../LoginPage/GoogleLogin";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
  const { t } = useTranslation();
  const { loggedIn } = useAuth();

  const [email, setEmail] = useState("");
  const [emailRe, setEmailRe] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState<any>("password");
  const [passwordIcon, setPasswordIcon] = useState(eye);

  const [passwordRe, setPasswordRe] = useState("");
  const [passwordTypeRe, setPasswordTypeRe] = useState<any>("password");
  const [passwordIconRe, setPasswordIconRe] = useState(eye);

  const [status, setStatus] = useState({ loading: false, error: false });

  const [presentAlert] = useIonAlert();

  const handleRegister = async () => {
    if (email.includes("@") === false || email.includes(".") === false) {
      presentAlert({
        header: t("Error"),
        message: t("Invalid email format"),
        buttons: ["OK"],
      });
    } else if (password.length < 8 || passwordRe.length < 8) {
      presentAlert({
        header: t("Error"),
        message: t("Password needs at least 8 characters"),
        buttons: ["OK"],
      });
    } else if (email.toLowerCase() !== emailRe.toLowerCase()) {
      presentAlert({
        header: t("Error"),
        message: t("Re-entered email does not match"),
        buttons: ["OK"],
      });
    } else if (password !== passwordRe) {
      presentAlert({
        header: t("Error"),
        message: t("Re-entered password does not match"),
        buttons: ["OK"],
      });
    } else {
      try {
        setStatus({ loading: true, error: false });

        const credential = await auth
          .createUserWithEmailAndPassword(email, password)
          .then((userInfo) => {
            //add welcome message to mailbox
            //console.log("userid", userInfo.user.uid);
            database
              .ref()
              .child("mailbox")
              .child(userInfo.user.uid)
              .push({
                sender: "CLC Multimedia",
                message: t("Register congratulations"),
                timestamp: moment().valueOf(),
              });
          });
        console.log("credential:", credential);
      } catch (error) {
        setStatus({ loading: false, error: true });
        console.log("error:", error);
        presentAlert({
          header: t("Error"),
          message:
            error.message ||
            t("Please try again later or contact CLC Multimedia for support"),
          buttons: ["OK"],
        });
      }
    }
  };

  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }
  return (
    <IonPage id="register-page">
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text={t("Back")} defaultHref="/index" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonImg
          src="/assets/image/Logo.svg"
          style={{
            width: "20%",
            maxWidth: 150,
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <br />
        <br />

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(event) => setEmail(event.detail.value)}
              placeholder={t("Enter your email")}
              autocomplete="off"
            />
            <IonIcon
              icon={closeCircle}
              className="ion-align-self-end"
              slot="end"
              size="small"
              color="medium"
              hidden={!email ? true : false}
              onClick={() => setEmail("")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">{t("Confirm email")}</IonLabel>
            <IonInput
              type="email"
              value={emailRe}
              onIonChange={(event) => setEmailRe(event.detail.value)}
              placeholder={t("Enter your email")}
              autocomplete="off"
            />
            <IonIcon
              icon={closeCircle}
              className="ion-align-self-end"
              slot="end"
              size="small"
              color="medium"
              hidden={!emailRe ? true : false}
              onClick={() => setEmailRe("")}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">{t("Password")}</IonLabel>
            <IonInput
              type={passwordType}
              value={password}
              onIonChange={(event) => setPassword(event.detail.value)}
              placeholder={t("At least 8 characters")}
              autocomplete="off"
            />
            <IonIcon
              icon={passwordIcon}
              className="ion-align-self-end"
              slot="end"
              size="small"
              color="medium"
              hidden={!password ? true : false}
              onClick={() => {
                if (passwordType === "password") {
                  setPasswordType("text");
                  setPasswordIcon(eye);
                } else {
                  setPasswordType("password");
                  setPasswordIcon(eyeOff);
                }
              }}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">{t("Confirm password")}</IonLabel>
            <IonInput
              type={passwordTypeRe}
              value={passwordRe}
              onIonChange={(event) => setPasswordRe(event.detail.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") handleRegister();
              }}
              placeholder={t("At least 8 characters")}
              autocomplete="off"
            />
            <IonIcon
              icon={passwordIconRe}
              className="ion-align-self-end"
              slot="end"
              size="small"
              color="medium"
              hidden={!passwordRe ? true : false}
              onClick={() => {
                if (passwordTypeRe === "password") {
                  setPasswordTypeRe("text");
                  setPasswordIconRe(eye);
                } else {
                  setPasswordTypeRe("password");
                  setPasswordIconRe(eyeOff);
                }
              }}
            />
          </IonItem>
        </IonList>

        <IonLoading isOpen={status.loading} />
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              expand="block"
              type="submit"
              shape="round"
              onClick={handleRegister}
              disabled={!(email && emailRe && password && passwordRe)}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              {t("Create account")}
            </IonButton>
            <IonButton
              expand="block"
              shape="round"
              fill="clear"
              onClick={async () => {
                setStatus({ loading: true, error: false });
                await handleGoogleLogin(() => {
                  setStatus({ loading: false, error: true });
                  presentAlert({
                    header: t("Error"),
                    message: t(
                      "Please try again later or contact CLC Multimedia for support"
                    ),
                    buttons: ["OK"],
                  });
                });
              }}
              style={{ marginTop: 10, marginBottom: 10, fontSize: 16 }}
            >
              <IonIcon icon={logoGoogle} slot="start" />{" "}
              {t("Continue with Google")}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default RegisterPage;
