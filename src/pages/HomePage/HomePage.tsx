import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonNote,
  IonPage,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { add as addIcon, chevronDown, mailUnreadOutline } from "ionicons/icons";
import "moment/locale/vi";
import React, { useEffect, useState } from "react";
import { useAuth } from "../../auth";
import { auth as firebaseAuth, firestore } from "../../firebase";
import { toNewsId } from "../../models";
import "./HomePage.scss";
import NewsCard from "./NewsCard";

const SampleNews = () => (
  <IonCard>
    <IonImg src="https://firebasestorage.googleapis.com/v0/b/myclcproject.appspot.com/o/public%2F%5BMyCLC%5D-Post1%20(1).png?alt=media&token=8c5a4ac1-81a9-4990-b632-30456a8e0156" />

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
        <IonLabel color="medium">28/08/2021 • 11:20</IonLabel>
      </IonLabel>
    </IonItem>
    <IonCardContent style={{ paddingTop: 0 }}>
      <IonCardSubtitle color="primary">Mở đăng ký sớm MyCLC</IonCardSubtitle>
      <IonLabel color="dark" text-wrap>
        🌐 Trước sự thay đổi chóng mặt của thời đại công nghệ 4.0, CLC
        Multimedia đã phối hợp với các anh chị cựu học sinh đang là sinh viên
        ngành CNTT trong và ngoài nước để phát triển một ứng dụng dành riêng cho
        Cộng đồng THPT Chuyên Lào Cai - MyCLC
        <br />
        👉 Sau một thời gian dài nghiên cứu và xây dựng, hôm nay MyCLC chính
        thức ra mắt và mở đăng ký tài khoản
        <br />
        💎 Nhóm dự án rất mong nhận được sự ủng hộ đông đảo của các thế hệ học
        sinh CLCer bằng cách đăng ký tham gia và gửi những phản hồi, góp ý và
        báo lỗi về cho CLC Multimedia. Bạn mong muốn MyCLC sẽ có những tính năng
        gì trong thời gian sắp tới, hãy cho chúng mình biết nhé 😘
        <br />
        💥 Lưu ý: Trong đợt đăng kí sớm lần này MyCLC sẽ chỉ phát hành trên nền
        tảng web. Sau khi hoàn thiện đầy đủ các tính năng, thuận lợi hơn trong
        việc sử dụng, MyCLC sẽ được đăng tải lên App Store và CH Play
      </IonLabel>
    </IonCardContent>
  </IonCard>
);

const LoadingNews = () => (
  <IonCard>
    <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
      <IonAvatar slot="start">
        <IonSkeletonText animated />
      </IonAvatar>
      <IonLabel text-wrap>
        <p>
          <IonSkeletonText animated style={{ width: "50%" }} />
        </p>
        <IonLabel>
          <IonNote>
            <IonSkeletonText animated style={{ width: "30%" }} />
          </IonNote>
        </IonLabel>
      </IonLabel>
    </IonItem>
    <IonCardContent style={{ paddingTop: 0 }}>
      <IonCardSubtitle style={{ paddingBottom: 10 }}>
        <IonSkeletonText animated style={{ width: "100%" }} />
      </IonCardSubtitle>
      <IonLabel text-wrap>
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "100%" }} />
        <IonSkeletonText animated style={{ width: "30%" }} />
      </IonLabel>
    </IonCardContent>
  </IonCard>
);

const HomePage: React.FC = () => {
  const { userId } = useAuth();
  const [newsList, setNewsList] = useState<String[]>([]);

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [newsCount, setNewsCount] = useState(3);

  useEffect(() => {
    fetchNews();
  }, []); //user id ko thay đổi trong suốt phiên làm việc nên ko cần cho vào đây

  const fetchNews = async () => {
    //read size
    const size = (await firestore.collection("news").get()).size;
    console.log(size);

    const { docs } = await firestore
      .collection("news")
      .orderBy("timestamp", "desc")
      .limit(100)
      .get();
    setNewsList(docs.map(toNewsId));
    console.log(docs.map(toNewsId));
  };

  return (
    <IonPage id="home-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>CLC News</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                setAlertHeader("Hòm thư");
                setAlertMessage(
                  "Cảm ơn bạn đã thử ấn vào đây! Chức năng này sẽ được ra mắt trong thời gian tới. Hãy cùng đón chờ nhé!"
                );
                setShowAlert(true);
              }}
            >
              <IonIcon icon={mailUnreadOutline} color="primary" />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={
            !(
              firebaseAuth.currentUser.metadata.creationTime ===
              firebaseAuth.currentUser.metadata.lastSignInTime
            )
          }
        >
          <IonLabel text-wrap className="ion-padding">
            Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực
            hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của
            MyCLC nhé!
          </IonLabel>
        </IonChip>

        {newsList.slice(0, newsCount).map((item, index) => (
          <NewsCard newId={item} key={index} />
        ))}

        {/* <SampleNews /> */}
        <IonButton
          style={{ display: "block", marginLeft: "auto", marginRight: "auto" }}
          fill="clear"
          hidden={newsCount >= newsList.length}
          onClick={() => setNewsCount(newsCount + 1)}
        >
          <IonLabel>
            Đọc thêm
            <br />
            <IonIcon icon={chevronDown} />
          </IonLabel>
        </IonButton>

        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/my/home/add">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => setShowAlert(false)}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
      </IonContent>
    </IonPage>
  );
};

export default HomePage;
