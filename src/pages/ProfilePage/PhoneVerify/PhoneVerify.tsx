import { alertController } from "@ionic/core";
import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import firebase from "firebase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { auth as firebaseAuth, database } from "../../../firebase";
import country from "./country.json";
import "./PhoneVerify.scss";

const PhoneVerify: React.FC = () => {
  const { userId } = useAuth();
  const history = useHistory();
  const [phone, setPhone] = useState("");
  const [dialCode, setDialCode] = useState("+84");
  const [pin, setPin] = useState("");

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [changeDisabled, setChangeDisabled] = useState(false);
  const [present] = useIonAlert();

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
        getPinCode()
          .then((verificationCode) => {
            return firebase.auth.PhoneAuthProvider.credential(
              verificationId,
              verificationCode + ""
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
            setAlertMessage(
              "Mã xác thực không chính xác. Vui lòng thử lại sau"
            );
            setShowAlert(true);

            console.log(error);
          });
      });
  }

  const getPinCode = async () => {
    return new Promise(async (resolve) => {
      const confirm = await alertController.create({
        header: "Nhập mã OTP",
        backdropDismiss: false,
        inputs: [
          {
            placeholder: "6 chữ số",
            name: "text",
            type: "number",
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
            <IonBackButton text="Huỷ" defaultHref="/my/profile" />
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
          disabled={changeDisabled}
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
              disabled={changeDisabled}
            />
          </IonItem>
        </IonList>

        <br />
        <br />
        <div id="recaptcha" className="g-recaptcha"></div>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            history.replace("/my/profile");
          }}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              className="ion-margin"
              expand="block"
              type="submit"
              shape="round"
              onClick={() => {
                sendVerifyPhone();
                setChangeDisabled(true);
              }}
              disabled={phone.length < 9 || changeDisabled}
            >
              Gửi mã xác minh
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default PhoneVerify;
