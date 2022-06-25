import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonModal,
  IonPage,
  IonSpinner,
  IonText,
  IonTitle,
  IonToggle,
  IonToolbar,
} from "@ionic/react";
import {
  balloon,
  call,
  createOutline,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoYoutube,
  mail,
  person,
  personAdd,
  personRemoveOutline,
  school,
  settingsOutline,
} from "ionicons/icons";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { useAuth } from "../../auth";
import { database, firestore } from "../../firebase";
import NewsCard from "../HomePage/NewsCard";
import { getInfoByUserId, getNewByUserId } from "../HomePage/services";
import { followClub, unfollowClub } from "./services";
import "./UserPage.scss";

interface RouteParams {
  id: string;
}

interface User {
  fullName: string;
  birth: string;
  gender: string;
  role: string;
  avatar?: string;
  email?: string;
  studentClass?: string;
  studentStart?: string;
  studentEnd?: string;
  teacherSubject?: string;
  teacherClass?: string;
  clubContact?: string;
  childName?: string;
  childClass?: string;
  otherSpecify?: string;
  otherPurpose?: string;

  dialCode?: string;
  phoneNumber?: string;

  showEmail?: boolean;
  showPhoneNumber?: boolean;

  intro?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
  youtube?: string;
}

interface UserCustom {
  intro: string;
  facebook: string;
  instagram: string;
  linkedin: string;
  youtube: string;

  showEmail: boolean;
  showPhoneNumber: boolean;
}

const UserPage: React.FC = () => {
  const { userId } = useAuth();
  const { id } = useParams<RouteParams>();
  const history = useHistory();

  const [userInfo, setUserInfo] = useState<User>();
  const [badges, setBadges] = useState<String[]>([]);

  const [showModal, setShowModal] = useState(false);

  const [userCustom, setUserCustom] = useState<UserCustom>({
    intro: "",
    facebook: "",
    instagram: "",
    linkedin: "",
    youtube: "",
    showEmail: true,
    showPhoneNumber: true,
  });

  const [loading, setLoading] = useState(false);
  const locationRef = useLocation<{ isEdit: boolean }>();

  const [isFollow, setIsFollow] = useState<boolean | string>("undefined");
  const [newsList, setNewsList] = useState<string[]>([]);

  useEffect(() => {
    if (locationRef && locationRef.state && locationRef.state.isEdit) {
      setShowModal(true);
    }
  }, [locationRef]);

  useEffect(() => {
    if (id) {
      fetchUserInfo();
      readBadge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserInfo = async () => {
    const data = await getInfoByUserId(id);
    setUserInfo({ ...data });
    try {
      if (
        data.intro ||
        data.facebook ||
        data.instagram ||
        data.linkedin ||
        data.youtube ||
        data.showEmail ||
        data.showPhoneNumber
      )
        setUserCustom({
          intro: data.intro,
          facebook: data.facebook,
          instagram: data.instagram,
          linkedin: data.linkedin,
          youtube: data.youtube,
          showEmail: data.showEmail,
          showPhoneNumber: data.showPhoneNumber,
        });
    } catch (error) {}

    //fetch is Followed
    if (data && data.role && data.role === "club" && id !== userId) {
      const data = await firestore
        .collection("followers")
        .where("clubId", "==", id)
        .where("userId", "==", userId)
        .get();

      setIsFollow(!data.empty);
    }

    //fetch new list
    if (data && data.role && data.role === "club") {
      const news = await getNewByUserId(id, 3);
      console.log("news", news);
      const newIds = news.map((p) => {
        return p.id;
      });
      setNewsList(newIds);
    }
  };

  const readBadge = async () => {
    const data = (await database.ref().child("badge").child(id).get()).val();
    let temp: string[] = [];
    if (data) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop)) {
          temp.push(data[prop]);
        }
      }
    }

    setBadges(temp);
  };

  const handleSave = async () => {
    setLoading(true);
    const userData = database.ref();
    await userData
      .child("users")
      .child(userId)
      .child("personal")
      .update({ ...userCustom });
    setUserInfo({ ...userInfo, ...userCustom });
    setLoading(false);
    setShowModal(false);
  };

  const handleCancel = () => {
    if (userInfo)
      setUserCustom({
        intro: userInfo.intro,
        facebook: userInfo.facebook,
        instagram: userInfo.instagram,
        linkedin: userInfo.linkedin,
        youtube: userInfo.youtube,
        showEmail: userInfo.showEmail,
        showPhoneNumber: userInfo.showPhoneNumber,
      });
    else
      setUserCustom({
        intro: "",
        facebook: "",
        instagram: "",
        linkedin: "",
        youtube: "",
        showEmail: true,
        showPhoneNumber: true,
      });

    setShowModal(false);
  };

  return (
    <IonPage id="user-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/home" text="" />
          </IonButtons>
          {id === userId && (
            <IonButtons slot="end" onClick={() => setShowModal(true)}>
              <IonButton>
                <IonIcon icon={createOutline} />
              </IonButton>
            </IonButtons>
          )}
          <IonTitle>{userInfo && userInfo.fullName}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding-vertical">
        <div className="ion-padding-horizontal">
          <IonAvatar
            className="ion-margin"
            style={{
              width: 100,
              height: 100,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            <IonImg
              src={
                userInfo && userInfo.avatar
                  ? userInfo.avatar
                  : "/assets/image/placeholder.png"
              }
            />
          </IonAvatar>

          <p style={{ textAlign: "center", fontSize: "large" }}>
            <b>{userInfo && userInfo.fullName ? userInfo.fullName : ""}</b>
          </p>
        </div>

        {userInfo && userInfo.intro && (
          <div
            className="ion-padding-bottom ion-padding-horizontal"
            style={{ textAlign: "center" }}
          >
            <IonLabel text-wrap style={{ whiteSpace: "pre-wrap" }}>
              {userInfo.intro}
            </IonLabel>
          </div>
        )}

        {userInfo &&
          userInfo.role &&
          userInfo.role === "club" &&
          id !== userId && (
            <>
              {isFollow !== "undefined" ? (
                <>
                  {!!!isFollow && (
                    <IonButton
                      expand="block"
                      className="ion-padding-horizontal"
                      color="primary"
                      onClick={() => {
                        setIsFollow("undefined");
                        followClub(userId, id).then(() => {
                          setIsFollow(true);
                        });
                      }}
                    >
                      <IonIcon icon={personAdd} slot="start" />
                      Theo dõi
                    </IonButton>
                  )}
                  {!!isFollow && (
                    <IonButton
                      expand="block"
                      fill="outline"
                      className="ion-padding-horizontal"
                      color="primary"
                      onClick={() => {
                        setIsFollow("undefined");
                        unfollowClub(userId, id).then(() => {
                          setIsFollow(false);
                        });
                      }}
                    >
                      <IonIcon icon={personRemoveOutline} slot="start" />
                      Huỷ theo dõi
                    </IonButton>
                  )}
                </>
              ) : (
                <IonButton
                  expand="block"
                  fill="clear"
                  className="ion-padding-horizontal"
                >
                  <IonSpinner />
                </IonButton>
              )}

              <br />
            </>
          )}

        {userInfo && id === userId && (
          <>
            <IonButton
              expand="block"
              color="primary"
              fill="outline"
              className="ion-padding-horizontal"
              onClick={() => {
                history.push({
                  pathname: "/my/settings",
                  state: {
                    isBack: true,
                  },
                });
              }}
            >
              <IonIcon icon={settingsOutline} slot="start" />
              Cài đặt
            </IonButton>
            <br />
          </>
        )}

        {userInfo && (
          <>
            <hr />
            <IonListHeader>Thông tin</IonListHeader>
            <div className="ion-padding">
              <IonList lines="none">
                {userInfo.role && (
                  <IonItem>
                    <IonIcon icon={person} slot="start" color="medium" />
                    {userInfo.role === "student" && (
                      <IonLabel text-wrap>Học sinh / Cựu học sinh</IonLabel>
                    )}
                    {userInfo.role === "teacher" && (
                      <IonLabel text-wrap>Giáo viên / Nhân viên</IonLabel>
                    )}
                    {userInfo.role === "parent" && (
                      <IonLabel text-wrap>Phụ huynh / Người giám hộ</IonLabel>
                    )}
                    {userInfo.role === "club" && (
                      <IonLabel text-wrap>Câu lạc bộ / Tổ chức</IonLabel>
                    )}
                    {userInfo.role === "other" && (
                      <IonLabel text-wrap>Đối tượng khác</IonLabel>
                    )}
                  </IonItem>
                )}
                {userInfo.studentClass && userInfo.studentStart && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Lớp {userInfo.studentClass} Khoá{" "}
                      {parseInt(userInfo.studentStart) - 2002}
                    </IonLabel>
                  </IonItem>
                )}
                {userInfo.teacherSubject && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Chuyên môn: {userInfo.teacherSubject}
                    </IonLabel>
                  </IonItem>
                )}
                {userInfo.teacherClass && (
                  <IonItem>
                    <IonIcon icon={school} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      Chủ nhiệm: {userInfo.teacherClass}
                    </IonLabel>
                  </IonItem>
                )}
                {userInfo.birth && (
                  <IonItem>
                    <IonIcon icon={balloon} slot="start" color="medium" />
                    <IonLabel text-wrap>
                      {userInfo.role && userInfo.role === "club"
                        ? moment(userInfo.birth).format(
                            "[Thành lập] D [tháng] M, YYYY"
                          )
                        : moment(userInfo.birth).format(
                            "[Sinh ngày] D [tháng] M, YYYY"
                          )}
                    </IonLabel>
                  </IonItem>
                )}
                {((userInfo.showEmail && userInfo.email) ||
                  (userInfo.email && userInfo.showEmail === undefined)) && (
                  <IonItem>
                    <IonIcon icon={mail} slot="start" color="medium" />
                    <IonLabel text-wrap>{userInfo.email}</IonLabel>
                  </IonItem>
                )}

                {userInfo.role && userInfo.role === "club"
                  ? ((userInfo.showPhoneNumber && userInfo.clubContact) ||
                      (userInfo.clubContact &&
                        userInfo.showPhoneNumber === undefined)) && (
                      <IonItem>
                        <IonIcon icon={call} slot="start" color="medium" />
                        <IonLabel text-wrap>{userInfo.clubContact}</IonLabel>
                      </IonItem>
                    )
                  : ((userInfo.showPhoneNumber &&
                      userInfo.phoneNumber &&
                      userInfo.dialCode) ||
                      (userInfo.phoneNumber &&
                        userInfo.dialCode &&
                        userInfo.showPhoneNumber === undefined)) && (
                      <IonItem>
                        <IonIcon icon={call} slot="start" color="medium" />
                        <IonLabel text-wrap>
                          ({userInfo.dialCode}) {userInfo.phoneNumber}
                        </IonLabel>
                      </IonItem>
                    )}

                {(userInfo.facebook ||
                  userInfo.instagram ||
                  userInfo.linkedin ||
                  userInfo.youtube) && (
                  <>
                    <IonItem style={{ margin: 8, marginBottom: 0 }}>
                      <div style={{ textAlign: "center" }}>
                        {userInfo.facebook && (
                          <a
                            href={userInfo.facebook}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <IonChip color="primary">
                              <IonIcon icon={logoFacebook} />
                              <IonLabel>Facebook</IonLabel>
                            </IonChip>
                          </a>
                        )}
                        {userInfo.instagram && (
                          <a
                            href={userInfo.instagram}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <IonChip color="primary">
                              <IonIcon icon={logoInstagram} />
                              <IonLabel>Instagram</IonLabel>
                            </IonChip>
                          </a>
                        )}
                        {userInfo.youtube && (
                          <a
                            href={userInfo.youtube}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <IonChip color="primary">
                              <IonIcon icon={logoYoutube} />
                              <IonLabel>Youtube</IonLabel>
                            </IonChip>
                          </a>
                        )}
                        {userInfo.linkedin && (
                          <a
                            href={userInfo.linkedin}
                            target="_blank"
                            rel="noreferrer"
                            style={{ textDecoration: "none" }}
                          >
                            <IonChip color="primary">
                              <IonIcon icon={logoLinkedin} />
                              <IonLabel>LinkedIn</IonLabel>
                            </IonChip>
                          </a>
                        )}
                      </div>
                    </IonItem>
                  </>
                )}
              </IonList>
            </div>
          </>
        )}

        {badges && badges.length > 0 && badges[0] !== null && (
          <>
            <hr />
            <IonListHeader>Huy hiệu</IonListHeader>

            <div className="ion-padding">
              <IonList lines="none">
                {badges.length > 0 &&
                  badges.map((badge, index) => (
                    <IonChip className="badge-chip" color="medium" key={index}>
                      <IonText color="dark">
                        <b>{badge}</b>
                      </IonText>
                    </IonChip>
                  ))}
              </IonList>
            </div>
          </>
        )}

        {userInfo &&
          userInfo.role &&
          userInfo.role === "club" &&
          newsList &&
          newsList.length > 0 && (
            <>
              <hr />
              <IonListHeader>News gần đây</IonListHeader>
              {newsList.map((item, index) => (
                <NewsCard
                  newId={item}
                  key={index}
                  handleDelete={() => {
                    setNewsList(
                      newsList.filter((p) => {
                        return p !== item;
                      })
                    );
                  }}
                />
              ))}
            </>
          )}

        {id === userId && (
          <IonModal isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle>Trang cá nhân</IonTitle>
                <IonButtons slot="start" onClick={() => handleCancel()}>
                  <IonButton>Huỷ</IonButton>
                </IonButtons>
                <IonButtons slot="end" onClick={() => handleSave()}>
                  <IonButton>
                    <b>Lưu</b>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent>
              <IonButton
                hidden
                onClick={() => {
                  console.log("info", userInfo);
                  console.log("custom", userCustom);
                }}
              >
                Click
              </IonButton>
              <br />
              <IonList lines="full">
                <IonItem>
                  <IonLabel position="fixed">Giới thiệu</IonLabel>
                  <IonInput
                    placeholder="Tối đa 160 chữ cái"
                    value={userCustom.intro}
                    type="text"
                    autoCapitalize="sentences"
                    onIonChange={(e) => {
                      setUserCustom({ ...userCustom, intro: e.detail.value });
                    }}
                    maxlength={160}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Facebook</IonLabel>
                  <IonInput
                    placeholder="https://www.facebook.com/..."
                    value={userCustom.facebook}
                    type="url"
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        facebook: e.detail.value,
                      });
                    }}
                    clearInput={true}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Instagram</IonLabel>
                  <IonInput
                    placeholder="https://www.instagram.com/..."
                    value={userCustom.instagram}
                    type="url"
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        instagram: e.detail.value,
                      });
                    }}
                    clearInput={true}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">LinkedIn</IonLabel>
                  <IonInput
                    placeholder="https://www.linkedin.com/..."
                    value={userCustom.linkedin}
                    type="url"
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        linkedin: e.detail.value,
                      });
                    }}
                    clearInput={true}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Youtube</IonLabel>
                  <IonInput
                    placeholder="https://www.youtube.com/..."
                    value={userCustom.youtube}
                    type="url"
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        youtube: e.detail.value,
                      });
                    }}
                    clearInput={true}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Ẩn Email</IonLabel>
                  <IonToggle
                    checked={!userCustom.showEmail}
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        showEmail: !e.detail.checked,
                      });
                    }}
                  />
                </IonItem>
                <IonItem>
                  <IonLabel position="fixed">Ẩn SĐT</IonLabel>
                  <IonToggle
                    checked={!userCustom.showPhoneNumber}
                    onIonChange={(e) => {
                      setUserCustom({
                        ...userCustom,
                        showPhoneNumber: !e.detail.checked,
                      });
                    }}
                  />
                </IonItem>
              </IonList>
            </IonContent>
          </IonModal>
        )}

        <IonLoading isOpen={loading} />
      </IonContent>
    </IonPage>
  );
};

export default UserPage;
