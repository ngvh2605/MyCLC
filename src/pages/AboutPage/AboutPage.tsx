import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardSubtitle,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonListHeader,
  IonMenuButton,
  IonPage,
  IonSkeletonText,
  IonText,
  IonThumbnail,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import {
  globe,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
} from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { database } from "../../firebase";
import "./AboutPage.scss";

interface Sponsor {
  name: string;
  image: string;
  url?: string;
  intro?: string;
}

const AboutPage: React.FC = () => {
  const [sponsors, setSponsors] = useState<Sponsor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSponsors = async () => {
      setIsLoading(true);
      const data = (
        await database.ref().child("public").child("sponsor").get()
      ).val();
      let temp: Sponsor[] = [];
      if (data) {
        for (let prop in data) {
          if (data.hasOwnProperty(prop)) {
            temp.push(data[prop]);
          }
        }
      }
      setSponsors(temp);
      setIsLoading(false);
    };

    fetchSponsors();
  }, []);

  return (
    <IonPage id="about-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Giới thiệu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        {isLoading ? (
          <>
            <ItemSkeleton />
          </>
        ) : (
          <>
            {sponsors.length > 0 && (
              <>
                <br />
                <IonListHeader>Nhà tài trợ</IonListHeader>

                {sponsors
                  .sort((a, b) => {
                    return a.name.localeCompare(b.name);
                  })
                  .map((sponsor, index) => (
                    <div
                      style={{ maxWidth: 680, margin: "0 auto" }}
                      key={index}
                    >
                      <IonCard
                        onClick={() => {
                          if (sponsor.url) {
                            window.open(sponsor.url, "_blank");
                          }
                        }}
                      >
                        <IonCardContent style={{ paddingLeft: 0 }}>
                          <IonItem lines="none" className="item-no-inner">
                            <IonThumbnail slot="start">
                              <IonImg
                                src={sponsor.image}
                                style={{ borderRadius: 10 }}
                              />
                            </IonThumbnail>
                            <IonLabel text-wrap className="ion-no-margin">
                              <b>{sponsor.name}</b>
                              <IonLabel text-wrap>{sponsor.intro}</IonLabel>
                            </IonLabel>
                          </IonItem>
                        </IonCardContent>
                      </IonCard>
                    </div>
                  ))}
                <br />
                <hr />
              </>
            )}

            <IonListHeader>Về chúng tôi</IonListHeader>
            <div style={{ maxWidth: 680, margin: "0 auto" }}>
              <IonCard>
                <IonItem
                  lines="none"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <IonAvatar slot="start">
                    <IonImg src="/assets/image/Logo.svg" />
                  </IonAvatar>
                  <IonChip color="primary" slot="end">
                    <IonLabel style={{ verticalAlign: "middle" }}>
                      <span style={{ fontSize: "small" }}>Project</span>
                    </IonLabel>
                  </IonChip>
                  <IonLabel text-wrap color="dark">
                    <IonText color="dark">
                      <p>
                        <b>MyCLC</b>
                      </p>
                    </IonText>
                    <IonLabel color="medium">Mạng xã hội Cộng đồng</IonLabel>
                  </IonLabel>
                </IonItem>

                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    MyCLC là một dự án của CLC Multimedia với mong muốn xây dựng
                    một ứng dụng Cộng đồng dành riêng cho Trường THPT Chuyên Lào
                    Cai
                  </IonLabel>
                </IonCardContent>
                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Sứ mệnh</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    • Cập nhật những tin tức mới nhất tại Chuyên Lào Cai
                    <br />• Lịch hoạt động nhà trường và sự kiện các câu lạc bộ
                    <br />• Kết nối học sinh và cựu học sinh khắp nơi trên thế
                    giới
                  </IonLabel>
                  <br />
                  <br />
                  <a
                    href="https://myclcproject.web.app/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={globe} />
                      <IonLabel>Website</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://clcmultimedia.gitbook.io/myclc"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={globe} />
                      <IonLabel>Hướng dẫn sử dụng</IonLabel>
                    </IonChip>
                  </a>
                </IonCardContent>
              </IonCard>
              <IonCard>
                <IonItem
                  lines="none"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <IonAvatar slot="start">
                    <IonImg src="/assets/image/MultiLogo.png" />
                  </IonAvatar>
                  <IonChip color="primary" slot="end">
                    <IonLabel style={{ verticalAlign: "middle" }}>
                      <span style={{ fontSize: "small" }}>Club</span>
                    </IonLabel>
                  </IonChip>
                  <IonLabel text-wrap color="dark">
                    <IonText color="dark">
                      <p>
                        <b>CLC Multimedia</b>
                      </p>
                    </IonText>
                    <IonLabel color="medium">Câu lạc bộ Truyền Thông</IonLabel>
                  </IonLabel>
                </IonItem>

                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    • Câu lạc bộ Truyền thông đa phương tiện Chuyên Lào Cai được
                    thành lập vào ngày 20/3/2015
                    <br />• Qua nhiều thế hệ hoạt động và phát triển không ngừng
                    với trung bình gần 100 thành viên mỗi năm, đến nay CLC
                    Multimedia tự hào là một trong những câu lạc bộ hàng đầu ở
                    Chuyên Lào Cai
                  </IonLabel>
                </IonCardContent>
                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Liên hệ</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    • Email: CLBCLCMultimedia@gmail.com
                    <br />• GV phụ trách: Cô Bùi Thị Thanh Hoa 0988.669.331
                    <br />• Chủ nhiệm: Nguyễn Mai Anh VK18 0916.287.699
                    <br />• Phó chủ nhiệm: Nguyễn Linh Đan A1K18 0913.337.829
                  </IonLabel>
                  <br />
                  <br />
                  <a
                    href="https://www.clcmultimedia.com"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={globe} />
                      <IonLabel>Website</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://www.facebook.com/CLCMultimedia"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={logoFacebook} />
                      <IonLabel>Facebook Page</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://www.facebook.com/groups/ChuyenLaoCai"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={logoFacebook} />
                      <IonLabel>Facebook Group</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://www.instagram.com/clc_multimedia"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={logoInstagram} />
                      <IonLabel>Instagram CLB</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://www.instagram.com/chuyenlaocai_/"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={logoInstagram} />
                      <IonLabel>Instagram CLC</IonLabel>
                    </IonChip>
                  </a>
                  <a
                    href="https://www.youtube.com/c/CLCMultimedia"
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: "none" }}
                  >
                    <IonChip color="primary">
                      <IonIcon icon={logoYoutube} />
                      <IonLabel>Youtube</IonLabel>
                    </IonChip>
                  </a>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonItem
                  lines="none"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <IonAvatar slot="start">
                    <IonImg src="/assets/image/viet.jpg" />
                  </IonAvatar>
                  <IonChip color="primary" slot="end">
                    <IonLabel style={{ verticalAlign: "middle" }}>
                      <span style={{ fontSize: "small" }}>Admin</span>
                    </IonLabel>
                  </IonChip>
                  <IonLabel text-wrap color="dark">
                    <IonText color="dark">
                      <p>
                        <b>Nguyễn Việt Hoàng</b>
                      </p>
                    </IonText>
                    <IonLabel color="medium">Trưởng nhóm dự án</IonLabel>
                  </IonLabel>
                </IonItem>

                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    • Cựu học sinh Chuyên Lý K12
                    <br />• Founder & 1st President CLC Multimedia
                    <br />• Tốt nghiệp Cử nhân CNTT tại Đại học Wollongong, Úc
                    <br />• Hiện đang làm System Reporting and Analytics Officer
                    tại University of Wollongong, Úc
                  </IonLabel>
                </IonCardContent>
                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Liên hệ</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    Email: vhnguyen@uow.edu.au
                    <br />
                    <br />
                    <a
                      href="https://www.linkedin.com/in/vithong/"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoLinkedin} />
                        <IonLabel>Connect on LinkedIn</IonLabel>
                      </IonChip>
                    </a>
                    <a
                      href="https://www.facebook.com/ngvh2605/"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoFacebook} />
                        <IonLabel>Facebook</IonLabel>
                      </IonChip>
                    </a>
                    <a
                      href="https://www.instagram.com/vithong_au/"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoInstagram} />
                        <IonLabel>Instagram</IonLabel>
                      </IonChip>
                    </a>{" "}
                    <a
                      href="https://www.youtube.com/channel/UCWtgnKLCEFnL78dbv5oiaBw"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoYoutube} />
                        <IonLabel>Youtube</IonLabel>
                      </IonChip>
                    </a>
                  </IonLabel>
                </IonCardContent>
              </IonCard>

              <IonCard>
                <IonItem
                  lines="none"
                  style={{ marginTop: 10, marginBottom: 10 }}
                >
                  <IonAvatar slot="start">
                    <IonImg src="/assets/image/vuanh.jpg" />
                  </IonAvatar>
                  <IonChip color="primary" slot="end">
                    <IonLabel style={{ verticalAlign: "middle" }}>
                      <span style={{ fontSize: "small" }}>Admin</span>
                    </IonLabel>
                  </IonChip>
                  <IonLabel text-wrap color="dark">
                    <IonText color="dark">
                      <p>
                        <b>Bùi Vũ Anh</b>
                      </p>
                    </IonText>
                    <IonLabel color="medium">Thành viên dự án</IonLabel>
                  </IonLabel>
                </IonItem>

                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Giới thiệu</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    • Cựu học sinh Chuyên Lý K12
                    <br />• Tốt nghiệp Cử nhân CNTT tại Đại học Công nghệ - ĐHQG
                    Hà Nội
                    <br />• Hiện đang làm việc tại Công ty VNTravel Group
                  </IonLabel>
                </IonCardContent>
                <IonCardContent style={{ paddingTop: 0 }}>
                  <IonCardSubtitle color="primary">Liên hệ</IonCardSubtitle>
                  <IonLabel color="dark" text-wrap>
                    Email: anh.bv@tripi.vn
                    <br />
                    <br />
                    <a
                      href="https://www.linkedin.com/in/v%C5%A9-anh-0a76771ab/"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoLinkedin} />
                        <IonLabel>Connect on LinkedIn</IonLabel>
                      </IonChip>
                    </a>
                    <a
                      href="https://www.facebook.com/vuanh2999"
                      target="_blank"
                      rel="noreferrer"
                      style={{ textDecoration: "none" }}
                    >
                      <IonChip color="primary">
                        <IonIcon icon={logoFacebook} />
                        <IonLabel>Facebook</IonLabel>
                      </IonChip>
                    </a>
                  </IonLabel>
                </IonCardContent>
              </IonCard>
            </div>
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

const ItemSkeleton = () => {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <IonCard>
        <IonCardContent style={{ paddingLeft: 0 }}>
          <IonItem lines="none">
            <IonThumbnail slot="start">
              <IonSkeletonText animated style={{ borderRadius: 10 }} />
            </IonThumbnail>

            <div style={{ width: "100%" }} onClick={() => {}}>
              <IonLabel color="medium" text-wrap>
                <p>
                  <IonSkeletonText animated style={{ width: "30%" }} />
                </p>
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <IonSkeletonText animated style={{ width: "100%" }} />
              </IonLabel>
              <IonLabel color="medium" text-wrap>
                <IonSkeletonText animated style={{ width: "50%" }} />
              </IonLabel>
            </div>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default AboutPage;
