import {
  IonButton,
  IonContent,
  IonFooter,
  IonHeader,
  IonImg,
  IonLabel,
  IonPage,
  IonSlide,
  IonSlides,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef } from "react";
import { Redirect, useHistory } from "react-router";
import { useAuth } from "../../auth";

const SplashPage: React.FC = () => {
  const history = useHistory();
  const slidesRef = useRef<any>();

  const { loggedIn } = useAuth();
  if (loggedIn) {
    return <Redirect to="/my/home" />;
  }

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar>
          <IonImg
            src="/assets/image/Logo.svg"
            style={{ width: 150, marginLeft: "auto", marginRight: "auto" }}
          />
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonSlides
          style={{ height: "100%" }}
          pager={true}
          ref={slidesRef}
          options={{ loop: true, autoplay: { delay: 1800 } }}
        >
          <IonSlide>
            <div className="ion-margin" style={{}}>
              <IonImg
                src="/assets/image/slides1.svg"
                style={{ height: window.screen.height / 4, marginBottom: 10 }}
              />
              <IonLabel
                style={{
                  fontSize: "x-large",
                  margin: "auto",
                  lineHeight: "40px",
                }}
              >
                <b>Cập nhập những tin tức mới nhất tại Chuyên Lào Cai</b>
              </IonLabel>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="ion-margin" style={{}}>
              <IonImg
                src="/assets/image/slides2.svg"
                style={{ height: window.screen.height / 4, marginBottom: 10 }}
              />
              <IonLabel
                style={{
                  fontSize: "x-large",
                  margin: "auto",
                  lineHeight: "40px",
                }}
              >
                <b>Lịch hoạt động nhà trường và sự kiện các câu lạc bộ</b>
              </IonLabel>
            </div>
          </IonSlide>
          <IonSlide>
            <div className="ion-margin" style={{}}>
              <IonImg
                src="/assets/image/slides3.svg"
                style={{ height: window.screen.height / 4, marginBottom: 10 }}
              />
              <IonLabel
                style={{
                  fontSize: "x-large",
                  margin: "auto",
                  lineHeight: "40px",
                }}
              >
                <b>Kết nối học sinh và cựu học sinh khắp nơi trên thế giới</b>
              </IonLabel>
            </div>
          </IonSlide>
        </IonSlides>
      </IonContent>
      <IonFooter className="ion-no-border">
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              expand="block"
              shape="round"
              onClick={() => {
                history.push("/register");
              }}
            >
              Đăng ký
            </IonButton>

            <IonButton
              expand="block"
              shape="round"
              fill="outline"
              style={{ marginTop: 20, marginBottom: 20 }}
              onClick={() => {
                history.push("/login");
              }}
            >
              Đăng nhập
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default SplashPage;
