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
import { auth as firebaseAuth } from "../../../firebase";
import "./PhoneVerify.scss";

import country from "./country.json";

interface Country {
  name: string;
  dialCode: string;
  isoCode: string;
  flag: string;
}

const PhoneVerify: React.FC = () => {
  const { userEmail, emailVerified } = useAuth();
  const history = useHistory();
  const [status, setStatus] = useState({ loading: false, error: false });
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+84");

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    console.log(country);
    let list: any = [];
    for (var i in country) {
      list.push(country[i]["country"]);
    }

    console.log("list", list);
  }, []);

  function sendVerifyPhone() {
    //setStatus({ loading: true, error: false });

    let recaptcha = new firebase.auth.RecaptchaVerifier("recaptcha", {
      size: "invisible",
    });
    let number = "+61406908552";
    firebaseAuth
      .signInWithPhoneNumber(number, recaptcha)
      .then(function (e) {
        let code = prompt("Enter the OTP", "");
        if (code == null) return;

        e.confirm(code)
          .then(function (result) {
            console.log(result.user, "user");
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch(function (error) {
        console.error(error);
      });
  }

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
              value={phone}
              onIonChange={(event) => setPhone(event.detail.value)}
            />
          </IonItem>
        </IonList>

        <div id="recaptcha" hidden></div>
        <IonButton
          className="ion-margin"
          expand="block"
          onClick={() => {
            sendVerifyPhone();
          }}
        >
          Gửi mã xác minh
        </IonButton>

        <IonLoading isOpen={status.loading} />

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
