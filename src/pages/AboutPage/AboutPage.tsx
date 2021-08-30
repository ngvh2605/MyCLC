import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonPage,
  IonTitle,
  IonToolbar,
  IonImg,
  IonButtons,
  IonMenuButton,
  IonButton,
  IonCard,
  IonAlert,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonChip,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
} from "@ionic/react";
import {
  globe,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  mail,
  mailUnreadOutline,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { auth as firebaseAuth } from "../../firebase";

const AboutPage: React.FC = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Về chúng tôi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonCard>
          <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
            <IonAvatar slot="start">
              <IonImg src="/assets/image/Logo.svg" />
            </IonAvatar>
            <IonChip color="primary" slot="end">
              <IonLabel style={{ verticalAlign: "middle" }}>
                <span style={{ fontSize: "small" }}>Project</span>
              </IonLabel>
            </IonChip>
            <IonLabel text-wrap color="dark">
              <p>
                <b>MyCLC</b>
              </p>
              <IonLabel color="medium">Mạng xã hội Cộng đồng</IonLabel>
            </IonLabel>
          </IonItem>

          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
            <IonLabel color="dark">
              MyCLC là một dự án của CLC Multimedia với mong muốn xây dựng một
              ứng dụng Cộng đồng dành riêng cho Trường THPT Chuyên Lào Cai
            </IonLabel>
          </IonCardContent>
          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Sứ mệnh</IonCardSubtitle>
            <IonLabel color="dark">
              • Cập nhật những tin tức mới nhất tại Chuyên Lào Cai
              <br />• Lịch hoạt động nhà trường và sự kiện các câu lạc bộ
              <br />• Kết nối học sinh và cựu học sinh khắp nơi trên thế giới
            </IonLabel>
          </IonCardContent>
        </IonCard>
        <IonCard>
          <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
            <IonAvatar slot="start">
              <IonImg src="/assets/image/MultiLogo.png" />
            </IonAvatar>
            <IonChip color="primary" slot="end">
              <IonLabel style={{ verticalAlign: "middle" }}>
                <span style={{ fontSize: "small" }}>Club</span>
              </IonLabel>
            </IonChip>
            <IonLabel text-wrap color="dark">
              <p>
                <b>CLC Multimedia</b>
              </p>
              <IonLabel color="medium">Câu lạc bộ Truyền thông</IonLabel>
            </IonLabel>
          </IonItem>

          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
            <IonLabel color="dark">
              • Câu lạc bộ Truyền thông đa phương tiện Chuyên Lào Cai được thành
              lập vào ngày 20/3/2015
              <br />• Qua 6 năm hoạt động và phát triển không ngừng với trung
              bình gần 100 thành viên mỗi năm, đến nay CLC Multimedia tự hào là
              một trong những câu lạc bộ hàng đầu ở Chuyên Lào Cai
            </IonLabel>
          </IonCardContent>
          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Liên hệ</IonCardSubtitle>
            <IonLabel color="dark">
              • Email: CLBCLCMultimedia@gmail.com
              <br />• GV phụ trách: Cô Bùi Thị Thanh Hoa 0988.669.331
              <br />• Chủ nhiệm: Trần Quang Huy TK17 0865.505.899
              <br />• Phó chủ nhiệm: Vũ Thuỳ Linh EK17 0362.073.327
            </IonLabel>
            <br />
            <a
              href="https://www.clcmultimedia.com"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={globe} />
                <IonLabel>Website</IonLabel>
              </IonChip>
            </a>
            <a
              href="https://www.facebook.com/CLCMultimedia"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={logoFacebook} />
                <IonLabel>Facebook Page</IonLabel>
              </IonChip>
            </a>
            <a
              href="https://www.facebook.com/groups/ChuyenLaoCai"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={logoFacebook} />
                <IonLabel>Facebook Group</IonLabel>
              </IonChip>
            </a>
            <a
              href="https://www.instagram.com/clc_multimedia"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={logoInstagram} />
                <IonLabel>Instagram CLB</IonLabel>
              </IonChip>
            </a>
            <a
              href="https://www.instagram.com/chuyenlaocai_/"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={logoInstagram} />
                <IonLabel>Instagram CLC</IonLabel>
              </IonChip>
            </a>
            <a
              href="https://www.youtube.com/c/CLCMultimedia"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              <IonChip color="secondary">
                <IonIcon icon={logoYoutube} />
                <IonLabel>Youtube</IonLabel>
              </IonChip>
            </a>
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
            <IonAvatar slot="start">
              <IonImg src="/assets/image/viet.jpg" />
            </IonAvatar>
            <IonChip color="primary" slot="end">
              <IonLabel style={{ verticalAlign: "middle" }}>
                <span style={{ fontSize: "small" }}>Admin</span>
              </IonLabel>
            </IonChip>
            <IonLabel text-wrap color="dark">
              <p>
                <b>Nguyễn Việt Hoàng</b>
              </p>
              <IonLabel color="medium">Trưởng nhóm dự án</IonLabel>
            </IonLabel>
          </IonItem>

          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
            <IonLabel color="dark">
              • Cựu học sinh Chuyên Lý K12
              <br />• Founder & 1st President CLC Multimedia
              <br />• Tốt nghiệp Cử nhân CNTT tại Đại học Wollongong, Úc
              <br />• Hiện đang làm Front End Developer tại công ty 152HQ Pty
              Ltd, Úc
            </IonLabel>
          </IonCardContent>
          <IonCardContent style={{ paddingTop: 0 }}>
            <IonCardSubtitle color="primary">Liên hệ</IonCardSubtitle>
            <IonLabel color="dark">
              Email: viet@152hq.com
              <a
                href="https://www.linkedin.com/in/vithong/"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <IonChip color="secondary">
                  <IonIcon icon={logoLinkedin} />
                  <IonLabel>Connect on LinkedIn</IonLabel>
                </IonChip>
              </a>
              <a
                href="https://www.facebook.com/ngvh2605/"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <IonChip color="secondary">
                  <IonIcon icon={logoFacebook} />
                  <IonLabel>Facebook</IonLabel>
                </IonChip>
              </a>
              <a
                href="https://www.instagram.com/vithong_au/"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <IonChip color="secondary">
                  <IonIcon icon={logoInstagram} />
                  <IonLabel>Instagram</IonLabel>
                </IonChip>
              </a>{" "}
              <a
                href="https://www.youtube.com/channel/UCWtgnKLCEFnL78dbv5oiaBw"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                <IonChip color="secondary">
                  <IonIcon icon={logoYoutube} />
                  <IonLabel>Youtube</IonLabel>
                </IonChip>
              </a>
            </IonLabel>
          </IonCardContent>
        </IonCard>
      </IonContent>

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="my-custom-class"
        header={alertHeader}
        message={alertMessage}
        buttons={["OK"]}
      />
    </IonPage>
  );
};

export default AboutPage;
