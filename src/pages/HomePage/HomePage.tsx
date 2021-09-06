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
} from "@ionic/react";
import {
  add as addIcon,
  mailOutline,
  mailUnreadOutline,
  notificationsOutline,
  pin,
  sparkles,
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
} from "./services";
const HomePage: React.FC = () => {
  const { userId } = useAuth();

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [news, setNews] = useState<News[]>([]);

  const test = async () => {
    const a = await getLikedNewByUserId(userId); //lấy ra những bài đã like của user hiện tại
    const b = await getLikedUserByNewId("HCtGShJ3gaSJ8n1x2VuW"); //lấy ra danh sách những người đã like bài viết này
    console.log(a, b);
    likeNews(userId, "HCtGShJ3gaSJ8n1x2VuW"); //like bài viết
    b.forEach((post) => {
      if (post.id === userId) console.log(true);
    });
  };

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      const temp = await getNew();
      let array: News[] = [];
      for (const item of temp) {
        array.push({ ...item, comment: await getComment(item.id) });
      }
      setLoading(false);
      setNews(array);

      // test here
      test();
    };
    fetchNews();
  }, []); //user id ko thay đổi trong suốt phiên làm việc nên ko cần cho vào đây

  return (
    <IonPage>
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

          <IonButton onClick={() => console.log(news)}>Why</IonButton>
          {news.map((item, index) => (
            <IonLabel key={index}>Here</IonLabel>
          ))}
          {news.map((item, index) => (
            <IonCard key={index}>
              <IonButton onClick={() => console.log(item)}>Why</IonButton>
              <IonImg src={item.pictureUrl} />

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
                  <IonLabel color="medium">
                    {item.timestamp.toString()}
                  </IonLabel>
                </IonLabel>
              </IonItem>
              <IonCardContent style={{ paddingTop: 0 }}>
                <IonCardSubtitle color="primary">{item.title}</IonCardSubtitle>
                <IonLabel color="dark" text-wrap>
                  {item.body}
                </IonLabel>
              </IonCardContent>
              <IonList>
                {item.comment &&
                  item.comment.map((comment, index) => (
                    <IonItem key={index}>
                      <IonLabel>{comment.body}</IonLabel>
                    </IonItem>
                  ))}
              </IonList>
            </IonCard>
          ))}

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
              <IonCardSubtitle color="primary">
                Mở đăng ký sớm MyCLC
              </IonCardSubtitle>
              <IonLabel color="dark" text-wrap>
                🌐 Trước sự thay đổi chóng mặt của thời đại công nghệ 4.0, CLC
                Multimedia đã phối hợp với các anh chị cựu học sinh đang là sinh
                viên ngành CNTT trong và ngoài nước để phát triển một ứng dụng
                dành riêng cho Cộng đồng THPT Chuyên Lào Cai - MyCLC
                <br />
                👉 Sau một thời gian dài nghiên cứu và xây dựng, hôm nay MyCLC
                chính thức ra mắt và mở đăng ký tài khoản
                <br />
                💎 Nhóm dự án rất mong nhận được sự ủng hộ đông đảo của các thế
                hệ học sinh CLCer bằng cách đăng ký tham gia và gửi những phản
                hồi, góp ý và báo lỗi về cho CLC Multimedia. Bạn mong muốn MyCLC
                sẽ có những tính năng gì trong thời gian sắp tới, hãy cho chúng
                mình biết nhé 😘
                <br />
                💥 Lưu ý: Trong đợt đăng kí sớm lần này MyCLC sẽ chỉ phát hành
                trên nền tảng web. Sau khi hoàn thiện đầy đủ các tính năng,
                thuận lợi hơn trong việc sử dụng, MyCLC sẽ được đăng tải lên App
                Store và CH Play
              </IonLabel>
            </IonCardContent>
          </IonCard>

          {/*  
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton routerLink="/my/entries/add">
            <IonIcon icon={addIcon} />
          </IonFabButton>
        </IonFab>
        */}
        </IonContent>
      ) : (
        <IonContent>
          <IonCard>
            <IonItem lines="none" style={{ marginTop: 10, marginBottom: 10 }}>
              <IonAvatar slot="start">
                <IonSkeletonText animated />
              </IonAvatar>
              <IonChip color="primary" slot="end">
                <IonLabel style={{ verticalAlign: "middle" }}>...</IonLabel>
              </IonChip>
              <IonLabel text-wrap color="dark">
                <p>
                  <IonSkeletonText animated style={{ width: "50%" }} />
                </p>
                <IonLabel color="medium">
                  <IonSkeletonText animated style={{ width: "30%" }} />
                </IonLabel>
              </IonLabel>
            </IonItem>
            <IonCardContent style={{ paddingTop: 0 }}>
              <IonCardSubtitle color="primary">
                <IonSkeletonText animated style={{ width: "100%" }} />
              </IonCardSubtitle>
              <IonLabel color="dark" text-wrap>
                <IonSkeletonText animated style={{ width: "100%" }} />
                <IonSkeletonText animated style={{ width: "100%" }} />
                <IonSkeletonText animated style={{ width: "100%" }} />
                <IonSkeletonText animated style={{ width: "100%" }} />
              </IonLabel>
            </IonCardContent>
          </IonCard>
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
