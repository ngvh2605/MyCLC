import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonChip,
  IonContent,
  IonHeader,
  IonImg,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import useCheckUserInfo from "../../../common/useCheckUserInfo";
import useIn2CLCCheck from "../../In2CLC/useIn2CLCCheck";
import { UnAuth } from "./../../../components/CommonUI/UnAuth";

const ChatHomePage: React.FC = () => {
  const history = useHistory();
  const { userId, userEmail } = useAuth();
  const { isVerify } = useCheckUserInfo(userId);
  const { matchInfo } = useIn2CLCCheck(userId, userEmail);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Phòng chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      {isVerify ? (
        <IonContent>
          <IonButton hidden onClick={() => {}}>
            Debug
          </IonButton>

          <IonListHeader color="primary">Thử nghiệm</IonListHeader>
          <IonCard
            onClick={() => {
              history.push({
                pathname: `/my/chat/${"common"}`,
                state: {
                  from: "ChatHomePage",
                },
              });
            }}
          >
            <IonCardContent>
              <IonItem lines="none">
                <IonAvatar slot="start">
                  <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BCLCMulti%5D%20Logo%20Blue.png?alt=media&token=43d4c934-5db4-48f0-a9e5-cb5dc2143450" />
                </IonAvatar>
                <IonLabel>
                  Common Room
                  <p></p>
                </IonLabel>
              </IonItem>
            </IonCardContent>
          </IonCard>
          {!!matchInfo && (
            <IonCard
              onClick={() => {
                history.push({
                  pathname: `/my/chat/${"in2clc2022"}`,
                  state: {
                    from: "ChatHomePage",
                  },
                });
              }}
            >
              <IonCardContent>
                <IonItem lines="none">
                  <IonAvatar slot="start">
                    <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BIn2CLC%202022%5D%20Avatar.jpeg?alt=media&token=8c539497-05e7-4a0d-a78b-b57df7fd1f2a" />
                  </IonAvatar>
                  <IonLabel>
                    In2CLC Mentor 2022
                    <p></p>
                  </IonLabel>
                </IonItem>
              </IonCardContent>
            </IonCard>
          )}

          <div className="ion-padding">
            <IonChip
              color="warning"
              style={{ height: "max-content", marginBottom: 10 }}
            >
              <IonLabel text-wrap className="ion-padding">
                Lưu ý: Chức năng Chat đang trong quá trình thử nghiệm. Nếu bạn
                gặp bất kỳ lỗi gì vui lòng liên hệ với Facebook Page CLC
                Multimedia để đóng góp cho dự án. Xin chân thành cảm ơn!
              </IonLabel>
            </IonChip>
            <br />
            <br />
            <br />
            <IonImg
              src="/assets/image/construction.svg"
              style={{ width: "90%", maxWidth: 400, margin: "auto" }}
            />
          </div>
        </IonContent>
      ) : (
        <UnAuth />
      )}
    </IonPage>
  );
};

export default ChatHomePage;
