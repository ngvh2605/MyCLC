import { alertController } from "@ionic/core";
import {
  IonAlert,
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
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleLogin = async () => {
    if (email.includes("@") === false || email.includes(".") === false) {
      setAlertHeader("Lỗi!");
      setAlertMessage("Định dạng email không hợp lệ");
      setShowAlert(true);
    } else if (password.length < 8) {
      setAlertHeader("Lỗi!");
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
        setAlertHeader("Lỗi!");
        setAlertMessage("Email hoặc mật khẩu không đúng");
        setShowAlert(true);
      }
    }
  };

  const handleForgotPassword = () => {
    getUserEmail().then((userEmail: string) => {
      console.log(userEmail);
      auth
        .sendPasswordResetEmail(userEmail)
        .then(function () {
          setAlertHeader("Đã gửi email đặt lại mặt khẩu!");
          setAlertMessage(
            "Vui lòng kiểm tra hộp thư đến hoặc hộp thư rác và làm theo hướng dẫn"
          );
          setShowAlert(true);
        })
        .catch(function (error) {
          setAlertHeader("Lỗi!");
          setAlertMessage(error);
          setShowAlert(true);
        });
    });
  };

  const getUserEmail = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập emaill của bạn",
        backdropDismiss: false,
        inputs: [
          {
            placeholder: "Email",
            name: "text",
            type: "email",
          },
        ],
        buttons: [
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
            <IonBackButton text="Quay lại" defaultHref="/index" />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonImg
          src="/assets/image/Logo.svg"
          style={{ width: "20%", marginLeft: "auto", marginRight: "auto" }}
        />
        <br />
        <br />
        <form>
          <IonList>
            <IonItem>
              <IonLabel position="floating">Email</IonLabel>
              <IonInput
                type="email"
                value={email}
                autocomplete="on"
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
              <IonLabel position="floating">Mật khẩu</IonLabel>
              <IonInput
                type={passwordType}
                value={password}
                autocomplete="on"
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
          </IonList>
        </form>
        <IonLoading isOpen={status.loading} />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
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
              Đăng nhập
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              fill="clear"
              routerLink="/login"
              style={{ marginTop: 10, marginBottom: 10 }}
              onClick={() => {
                handleForgotPassword();
              }}
            >
              Quên mật khẩu?
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
