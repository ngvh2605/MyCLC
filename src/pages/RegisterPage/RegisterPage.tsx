import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFabButton,
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
import { closeCircle, eye, eyeOff, logoGoogle } from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { Redirect } from "react-router";
import { useAuth } from "../../auth";
import {
  auth,
  database,
  facebookProvider,
  googleProvider,
} from "../../firebase";
import "./RegisterPage.scss";

const RegisterPage: React.FC = () => {
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

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const handleRegister = async () => {
    if (email.includes("@") === false || email.includes(".") === false) {
      setAlertHeader("Lỗi!");
      setAlertMessage("Định dạng email không hợp lệ");
      setShowAlert(true);
    } else if (password.length < 8 || passwordRe.length < 8) {
      setAlertHeader("Lỗi!");
      setAlertMessage("Mật khẩu tối thiểu 8 ký tự");
      setShowAlert(true);
    } else if (email.toLowerCase() !== emailRe.toLowerCase()) {
      setAlertHeader("Lỗi!");
      setAlertMessage("Email nhập lại không khớp");
      setShowAlert(true);
    } else if (password !== passwordRe) {
      setAlertHeader("Lỗi!");
      setAlertMessage("Mật khẩu nhập lại không khớp");
      setShowAlert(true);
    } else {
      try {
        setStatus({ loading: true, error: false });

        const credential = await auth
          .createUserWithEmailAndPassword(email, password)
          .then((userInfo) => {
            //add welcome message to mailbox
            //console.log("userid", userInfo.user.uid);
            database.ref().child("mailbox").child(userInfo.user.uid).push({
              sender: "CLC Multimedia",
              message:
                "Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của MyCLC nhé!",
              timestamp: moment().valueOf(),
            });
          });
        console.log("credential:", credential);
      } catch (error) {
        setStatus({ loading: false, error: true });
        console.log("error:", error);
        if (
          error.message ===
          "The email address is already in use by another account."
        ) {
          setAlertHeader("Lỗi!");
          setAlertMessage("Email này đã được sử dụng");
          setShowAlert(true);
        } else {
          setAlertHeader("Lỗi!");
          setAlertMessage(
            "Vui lòng thử lại sau hoặc liên hệ CLC Multimedia để được hỗ trợ"
          );
          setShowAlert(true);
        }
      }
    }
  };

  const handleGoogleLogin = async () => {
    setStatus({ loading: true, error: false });

    try {
      await auth.signInWithPopup(googleProvider).then(({ user }) => {
        console.log(user);
      });
    } catch (err) {
      console.log(err);
      setStatus({ loading: false, error: true });
      setAlertHeader("Lỗi!");
      setAlertMessage(
        "Vui lòng thử lại sau hoặc liên hệ CLC Multimedia để được hỗ trợ"
      );
      setShowAlert(true);
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

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput
              type="email"
              value={email}
              onIonChange={(event) => setEmail(event.detail.value)}
              placeholder="clbclcmultimedia@gmail.com"
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
            <IonLabel position="stacked">Nhập lại Email</IonLabel>
            <IonInput
              type="email"
              value={emailRe}
              onIonChange={(event) => setEmailRe(event.detail.value)}
              placeholder="clbclcmultimedia@gmail.com"
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
            <IonLabel position="stacked">Mật khẩu</IonLabel>
            <IonInput
              type={passwordType}
              value={password}
              onIonChange={(event) => setPassword(event.detail.value)}
              placeholder="Tối thiểu 8 ký tự"
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
            <IonLabel position="stacked">Nhập lại mật khẩu</IonLabel>
            <IonInput
              type={passwordTypeRe}
              value={passwordRe}
              onIonChange={(event) => setPasswordRe(event.detail.value)}
              onKeyPress={(event) => {
                if (event.key === "Enter") handleRegister();
              }}
              placeholder="Tối thiểu 8 ký tự"
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
              onClick={handleRegister}
              disabled={!(email && emailRe && password && passwordRe)}
              style={{ marginTop: 10, marginBottom: 10 }}
            >
              Tạo tài khoản
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

export default RegisterPage;
