import {
  IonAlert,
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
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import firebase from "firebase";
import { closeCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { auth as firebaseAuth, database } from "../../../firebase";
import "./PhoneVerify.scss";

import country from "./country.json";

const PhoneVerify: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+84");

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    let list: any = [];
    for (var i in country) {
      list.push(country[i]["country"]);
    }
  }, []);

  function sendVerifyPhone() {
    let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "normal",
    });
    let number = dialCode + phone;
    console.log(number);
    let phoneAuth = new firebase.auth.PhoneAuthProvider();

    phoneAuth
      .verifyPhoneNumber(number, recaptcha)
      .then(function (verificationId) {
        var verificationCode = window.prompt(
          "Please enter the verification " +
            "code that was sent to your mobile device."
        );
        return firebase.auth.PhoneAuthProvider.credential(
          verificationId,
          verificationCode
        );
      })
      .then(function (phoneCredential) {
        return firebaseAuth.currentUser.linkWithCredential(phoneCredential);
      })
      .then(() => {
        writePhoneData();
        setAlertHeader("Chúc mừng!");
        setAlertMessage("Bạn đã xác minh số điện thoại thành công");
        setShowAlert(true);
      })
      .catch((error) => {
        setAlertHeader("Lỗi!");
        setAlertMessage("Mã xác thực không chính xác. Vui lòng thử lại sau");
        setShowAlert(true);

        console.log(error);
      });
  }

  const writePhoneData = async () => {
    const userData = database.ref();
    await userData.child("users").child(userId).child("personal").update({
      dialCode: dialCode,
      phoneNumber: phone,
    });
    await userData.child("users").child(userId).child("verify").update({
      phoneVerify: true,
    });
  };

  return (
    <IonPage id="phone-verify-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton />
          </IonButtons>
          <IonTitle>Xác minh Số điện thoại</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonSelect
          interface="popover"
          value={dialCode}
          onIonChange={(e) => {
            setDialCode(e.detail.value);
          }}
        >
          {country.country.map((item) => (
            <IonSelectOption value={item.dialCode} key={item.name}>
              <IonLabel>
                <p>
                  {item.dialCode} {item.name}
                </p>
              </IonLabel>
            </IonSelectOption>
          ))}
        </IonSelect>

        <IonList>
          <IonItem key="phone">
            <IonLabel position="floating">Số điện thoại</IonLabel>
            <IonInput
              type="number"
              required
              value={phone}
              onIonChange={(event) => setPhone(event.detail.value)}
            />
          </IonItem>
        </IonList>

        <div id="recaptcha" className="g-recaptcha"></div>
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={() => {
            sendVerifyPhone();
          }}
          disabled={phone.length < 9}
        >
          Gửi mã xác minh
        </IonButton>

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

export default PhoneVerify;
