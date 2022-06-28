import { alertController } from "@ionic/core";
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
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth } from "../../firebase";
import { handleGoogleLogin } from "./GoogleLogin";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { loggedIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordType, setPasswordType] = useState<any>("password");
  const [passwordIcon, setPasswordIcon] = useState(eyeOff);
  const [status, setStatus] = useState({ loading: false, error: false });

  const [presentAlert] = useIonAlert();

  const handleLogin = async () => {
    if (email.includes("@") === false || email.includes(".") === false) {
      presentAlert({
        header: t("Error"),
        message: t("Invalid email format"),
        buttons: ["OK"],
      });
    } else if (password.length < 8) {
      presentAlert({
        header: t("Error"),
        message: t("Password needs at least 8 characters"),
        buttons: ["OK"],
      });
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

        presentAlert({
          header: t("Error"),
          message: error.message || t("Email or password is incorrect"),
          buttons: ["OK"],
        });
      }
    }
  };

  const handleForgotPassword = () => {
    getUserEmail().then((userEmail: string) => {
      console.log(userEmail);

      let re = /\S+@\S+\.\S+/;
      if (!!re.test(userEmail)) {
        auth
          .sendPasswordResetEmail(userEmail)
          .then(function () {
            presentAlert({
              header: t("Password reset email is sent!"),
              message: t(
                "Please check your inbox or spam and follow the instructions"
              ),
              buttons: ["OK"],
            });
          })
          .catch(function (error) {
            presentAlert({
              header: t("Error"),
              message: error,
              buttons: ["OK"],
            });
          });
      } else {
        presentAlert({
          header: t("Error"),
          message: t("Invalid email format"),
          buttons: ["OK"],
        });
      }
    });
  };

  const getUserEmail = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: t("Enter your email"),
        backdropDismiss: false,
        inputs: [
          {
            placeholder: "Email",
            name: "text",
            type: "email",
          },
        ],
        buttons: [
          { text: t("Cancel") },
          {
            text: "OK",
            handler: (data) => {
              return resolve(data.text);
            },
          },
        ],
      });

      await confirm.present();
    });
  };

  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }

  return (
    <IonPage id="login-page">
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
            maxWidth: 150,
            width: "20%",
            marginLeft: "auto",
            marginRight: "auto",
          }}
        />
        <br />
        <br />
        <form>
          <IonList>
            <IonItem>
              <IonLabel position="stacked">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                autocomplete="on"
                placeholder={t("Enter your email")}
                onIonChange={(event) => setEmail(event.detail.value)}
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
              <IonLabel position="stacked">{t("Password")}</IonLabel>
              <IonInput
                type={passwordType}
                value={password}
                autocomplete="on"
                placeholder={t("Enter your password")}
                onIonChange={(event) => setPassword(event.detail.value)}
                onKeyPress={(event) => {
                  if (event.key === "Enter") handleLogin();
                }}
              />
              <IonIcon
                icon={passwordIcon}
                className="ion-align-self-end"
                slot="end"
                size="small"
                color="medium"
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
            <IonItem lines="none" style={{ marginTop: 16, marginBottom: 10 }}>
              <div
                style={{
                  textAlign: "right",
                  width: "100%",
                  fontSize: "small",
                }}
              >
                <IonLabel
                  color="primary"
                  onClick={() => {
                    handleForgotPassword();
                  }}
                >
                  {t("Forgot password?")}
                </IonLabel>
              </div>
            </IonItem>
          </IonList>
        </form>
        <IonLoading isOpen={status.loading} />
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              expand="block"
              type="submit"
              shape="round"
              onClick={handleLogin}
              disabled={email && password ? false : true}
            >
              {t("Log in")}
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

export default LoginPage;
