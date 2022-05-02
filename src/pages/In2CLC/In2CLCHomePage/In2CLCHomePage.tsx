import {
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonLabel,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import Autolinker from "autolinker";
import { heart, searchOutline } from "ionicons/icons";
import React, { useState } from "react";
import { useAuth } from "../../../auth";
import useCheckUserInfo from "../../../common/useCheckUserInfo";
import { database, firestore } from "../../../firebase";
import { Match } from "../model";
import useIn2CLCCheck from "../useIn2CLCCheck";

const In2CLCHomePage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { userId, userEmail } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);
  const { matchInfo, updateMatchInfo } = useIn2CLCCheck(userId, userEmail);

  const [presentAlert] = useIonAlert();

  const searchMentee = async () => {
    console.log("Runing search mentee");
    setIsLoading(true);
    const data: Match[] = JSON.parse(
      (await firestore.collection("in2clc").doc("match").get()).data().match
    );
    const search = data.filter((a) => {
      return (
        a.mentor_mail.toLowerCase().replace(/ /g, "") ===
        userEmail.toLowerCase().replace(/ /g, "")
      );
    });

    console.log("Search", search);

    if (!!search && search.length > 0) {
      database
        .ref()
        .child("in2clc")
        .child(userId)
        .update({ matchInfo: JSON.stringify(search) });
      database
        .ref()
        .child("badge")
        .child(userId)
        .update({ in2clcMentor2022: "💛 In2CLC Mentor 2022" });
      updateMatchInfo([...search]);
    } else {
      presentAlert({
        header: "Không tìm thấy Mentee!",
        message:
          "Vui lòng liên hệ với facebook page CLC Multimedia để được hỗ trợ",
        buttons: [{ text: "OK" }],
      });
    }
    setIsLoading(false);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonButton
            hidden
            onClick={() => {
              console.log(matchInfo);
            }}
          >
            Test
          </IonButton>
          <IonTitle>In2CLC</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonCard>
          <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BIn2CLC%202022%5D%20Avatar.jpeg?alt=media&token=8c539497-05e7-4a0d-a78b-b57df7fd1f2a" />
        </IonCard>

        {!!matchInfo ? (
          matchInfo.map((match, index) => (
            <IonCard key={index}>
              <IonCardHeader>
                <IonCardTitle color="danger" style={{ textAlign: "center" }}>
                  <IonIcon icon={heart} style={{ verticalAlign: "-4px" }} />{" "}
                  It's a Match!
                </IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonCardSubtitle color="primary">MENTOR</IonCardSubtitle>
                <IonLabel color="dark">
                  <b>{match.mentor_name}</b>
                </IonLabel>
                <br />
                <br />
                <IonCardSubtitle color="primary">MENTEE</IonCardSubtitle>

                <IonLabel color="dark">
                  <b>{match.mentee_name}</b>
                </IonLabel>
                <br />
                <br />
                <IonCardSubtitle color="primary">THÔNG TIN</IonCardSubtitle>
                <IonLabel color="dark">
                  <div>
                    <b>Email:</b> {match.mentee_mail}
                    <br />
                    <b>SĐT:</b> {match.mentee_phone}
                    <br />
                    <b>Facebook:</b>{" "}
                    <span
                      dangerouslySetInnerHTML={{
                        __html: Autolinker.link(match.mentee_fb.toString(), {
                          truncate: { length: 50, location: "smart" },
                        }),
                      }}
                    ></span>
                    <br />
                    <b>Lớp:</b> {match.mentee_class}
                    <br />
                    <b>Trường:</b> {match.mentee_school}
                    <br />
                    <b>Môn chuyên NV1:</b> {match.mentee_subject}
                  </div>
                </IonLabel>
              </IonCardContent>
            </IonCard>
          ))
        ) : (
          <div className="ion-padding">
            <IonChip
              color="warning"
              style={{ height: "max-content", marginBottom: 10 }}
            >
              <IonLabel text-wrap className="ion-padding">
                Lưu ý: Bạn cần đăng nhập vào email trùng với email bạn đăng ký
                Mentor. Nếu bạn thay đổi email, vui lòng liên hệ facebook page
                CLC Multimedia để được hỗ trợ
              </IonLabel>
            </IonChip>
            <br />
            <br />

            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                if (isVerify) searchMentee();
                else
                  presentAlert({
                    header: "Lỗi!",
                    message:
                      "Vui lòng vào Hồ sơ và hoàn thành 3 bước xác minh trước",
                    buttons: [{ text: "OK" }],
                  });
              }}
            >
              <IonIcon icon={searchOutline} slot="start" />
              Tìm thông tin Mentee
            </IonButton>
          </div>
        )}

        <IonLoading isOpen={isLoading} />
      </IonContent>
    </IonPage>
  );
};

export default In2CLCHomePage;
