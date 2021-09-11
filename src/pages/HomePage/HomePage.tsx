import {
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  IonThumbnail,
  IonImg,
  IonButtons,
  IonMenuButton,
  IonMenu,
  IonButton,
  IonInfiniteScroll,
  IonCard,
  IonCardHeader,
  IonInfiniteScrollContent,
  useIonViewWillEnter,
  IonAlert,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent,
  IonAvatar,
  IonGrid,
  IonRow,
  IonCol,
  IonBadge,
  IonChip,
  IonLoading,
  IonProgressBar,
  IonSpinner,
  IonSkeletonText,
  IonNote,
  IonItemDivider,
  IonVirtualScroll,
  IonText,
} from "@ionic/react";
import {
  add as addIcon,
  chatbubbleEllipses,
  heart,
  heartCircle,
  heartOutline,
  mailOutline,
  mailUnreadOutline,
  notificationsOutline,
  pin,
  rocket,
  sparkles,
  star,
  walk,
  warning,
  wifi,
  wine,
} from "ionicons/icons";
import React, { useState, useEffect } from "react";
import { useAuth } from "../../auth";
import { formatDate } from "../../date";
import { firestore } from "../../firebase";
import { News, toNews, Comment, toComment } from "../../models";
import { auth as firebaseAuth } from "../../firebase";
import {
  getNew,
  getComment,
  getLikedNewByUserId,
  getLikedUserByNewId,
  likeNews,
  isNewLikedByUser,
  unlikeNews,
  getInfoByUserId,
  getNextNew,
} from "./services";
import "./HomePage.scss";
import moment from "moment";
import "moment/locale/vi";
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

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [lastKey, setLastKey] = useState(null);
  const [news, setNews] = useState<News[]>([]);
  const [isEnd, setIsEnd] = useState<boolean>(false);
  const [loadingNext, setLoadingNext] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []); //user id ko thay đổi trong suốt phiên làm việc nên ko cần cho vào đây

  const fetchNews = async () => {
    setLoading(true);
    const temp = await getNew();
    let array: News[] = [];
    for (const item of temp) {
      array.push({
        ...item,
        isLiked: await isNewLikedByUser(userId, item.id),
        authorInfo: await getInfoByUserId(item.author),
      });
    }
    setLastKey(() => temp.slice(-1).pop()?.timestamp);
    setNews(array);
    setLoading(false);

    //read size
    const size = (await firestore.collection("news").get()).size;
    console.log(size);
  };

  const fetchNextNews = async () => {
    setLoadingNext((p) => !p);
    const temp = await getNextNew(lastKey);
    console.log(temp);
    if (temp.length > 0) {
      let array: News[] = [];
      for (const item of temp) {
        array.push({
          ...item,
          isLiked: await isNewLikedByUser(userId, item.id),
          authorInfo: await getInfoByUserId(item.author),
        });
      }
      setLastKey(() => temp.slice(-1).pop()?.timestamp);
      setNews((old) => [...old, ...array]);
    } else {
      setIsEnd(true);
    }
    setLoadingNext((p) => !p);
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
      {!loading ? (
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
              Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và
              thực hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác
              của MyCLC nhé!
            </IonLabel>
          </IonChip>

          {news.map((item, index) => (
            <NewsCard newId={item.id} key={index} />
          ))}

          {loadingNext && <LoadingNews />}

          {!isEnd && (
            <IonCard>
              <IonButton
                color="primary"
                onClick={fetchNextNews}
                style={{ width: "100%" }}
              >
                Load
              </IonButton>
            </IonCard>
          )}

          {/* <SampleNews /> */}

          <IonFab vertical="bottom" horizontal="end" slot="fixed">
            <IonFabButton routerLink="/my/home/add">
              <IonIcon icon={addIcon} />
            </IonFabButton>
          </IonFab>
        </IonContent>
      ) : (
        <IonContent className="ion-padding">
          <LoadingNews />
        </IonContent>
      )}
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

export default HomePage;
