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
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import { auth, database, googleProvider } from "../../firebase";
import "./LoginPage.scss";

const LoginPage: React.FC = () => {
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
        header: "Lỗi!",
        message: "Định dạng email không hợp lệ",
        buttons: ["OK"],
      });
    } else if (password.length < 8) {
      presentAlert({
        header: "Lỗi!",
        message: "Mật khẩu tối thiểu 8 ký tự",
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
          header: "Lỗi!",
          message: "Email hoặc mật khẩu không đúng",
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
              header: "Đã gửi email đặt lại mặt khẩu!",
              message:
                "Vui lòng kiểm tra hộp thư đến hoặc hộp thư rác và làm theo hướng dẫn",
              buttons: ["OK"],
            });
          })
          .catch(function (error) {
            presentAlert({
              header: "Lỗi!",
              message: error,
              buttons: ["OK"],
            });
          });
      } else {
        presentAlert({
          header: "Lỗi!",
          message: "Địa chỉ email không hợp lệ",
          buttons: ["OK"],
        });
      }
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
          { text: "Huỷ" },
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

  const handleGoogleLogin = async () => {
    setStatus({ loading: true, error: false });

    try {
      await auth.signInWithPopup(googleProvider).then(async ({ user }) => {
        await database
          .ref()
          .child("users")
          .child(user.uid)
          .child("personal")
          .child("email")
          .once("value")
          .then((snapshot) => {
            if (!snapshot.exists()) {
              database
                .ref()
                .child("users")
                .child(user.uid)
                .child("personal")
                .update({
                  email: user.providerData[0].email,
                  fullName: user.providerData[0].displayName,
                  avatar: user.providerData[0].photoURL,
                });
            }
          });
      });
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true });
      presentAlert({
        header: "Lỗi!",
        message:
          "Vui lòng thử lại sau hoặc liên hệ CLC Multimedia để được hỗ trợ",
        buttons: ["OK"],
      });
    }
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
          style={{
            maxWidth: 200,
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
                placeholder="Nhập email"
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
              <IonLabel position="stacked">Mật khẩu</IonLabel>
              <IonInput
                type={passwordType}
                value={password}
                autocomplete="on"
                placeholder="Nhập mật khẩu"
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
                  Quên mật khẩu?
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
              Đăng nhập
            </IonButton>
            <IonButton
              expand="block"
              shape="round"
              fill="clear"
              onClick={handleGoogleLogin}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              <IonIcon icon={logoGoogle} slot="start" /> Đăng nhập với Google
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default LoginPage;
