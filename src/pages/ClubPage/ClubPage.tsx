import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonMenuButton,
  IonPage,
  IonSearchbar,
  IonSkeletonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { person } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { EmptyUI } from "../../components/CommonUI/EmptyUI";
import RefresherItem from "../../components/CommonUI/RefresherItem";
import { database } from "../../firebase";
import { getInfoByUserId } from "../HomePage/services";
import "./ClubPage.scss";

interface Club {
  id: string;
  fullName: string;
  avatar: string;
  email: string;
  intro: string;
  facebook: string;
  instagram: string;
  youtube: string;
  linkedin: string;
  followers: number;
}

const ClubPage: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const [clubs, setClubs] = useState<Club[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const data = (await database.ref().child("clubCode").get()).val();
    let temp: string[] = [];
    if (data) {
      for (var prop in data) {
        if (data.hasOwnProperty(prop) && data[prop] !== "available") {
          temp.push(data[prop]);
        }
      }
    }
    let list: Club[] = [];

    for (let item in temp) {
      const count = (
        await database.ref().child("followersCount").child(temp[item]).get()
      ).val();
      list.push({
        ...(await getInfoByUserId(temp[item])),
        id: temp[item],
        followers: count ? count : 0,
      });
    }

    setClubs(list);
  };

  const filterClubs = () => {
    return clubs.filter((club) => {
      return !search
        ? club.fullName
        : (club.fullName &&
            removeVietnamese(club.fullName).includes(
              removeVietnamese(search)
            )) ||
            (club.intro &&
              removeVietnamese(club.intro).includes(removeVietnamese(search)));
    });
  };

  return (
    <IonPage id="club-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{t("Clubs")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <RefresherItem
          handleRefresh={() => {
            fetchClubs();
          }}
        />

        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <IonSearchbar
            placeholder={t("Search")}
            style={{ paddingBottom: 0 }}
            onIonChange={(e) => {
              setSearch(e.detail.value);
            }}
          />
        </div>

        {clubs && clubs.length > 0 ? (
          filterClubs().length > 0 ? (
            filterClubs()
              .sort((a, b) => {
                return a.followers - b.followers;
              })
              .map((club, index) => (
                <div style={{ maxWidth: 680, margin: "0 auto" }} key={index}>
                  <IonCard
                    onClick={() => {
                      history.push(`/my/user/${club.id}`);
                    }}
                  >
                    <IonCardContent>
                      <IonItem lines="none">
                        <IonAvatar
                          slot="start"
                          style={{ width: 50, height: 50 }}
                        >
                          <IonImg
                            src={club.avatar || "/assets/image/placeholder.png"}
                          />
                        </IonAvatar>
                        <IonLabel className="ion-no-margin">
                          <b>{club.fullName || t("Club's name")}</b>

                          {club.intro && (
                            <IonLabel text-wrap style={{ marginBottom: 3 }}>
                              {club.intro}
                            </IonLabel>
                          )}

                          <IonLabel text-wrap color="medium">
                            <IonIcon
                              icon={person}
                              style={{ verticalAlign: -2 }}
                            />{" "}
                            {t("Followers")}: {club.followers}
                          </IonLabel>
                        </IonLabel>
                      </IonItem>
                    </IonCardContent>
                  </IonCard>
                </div>
              ))
          ) : (
            <EmptyUI />
          )
        ) : (
          <>
            <ClubCardSkeleton />
            <ClubCardSkeleton />
            <ClubCardSkeleton />
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

const ClubCardSkeleton = () => {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto" }}>
      <IonCard>
        <IonCardContent>
          <IonItem lines="none">
            <IonAvatar slot="start" style={{ width: 50, height: 50 }}>
              <IonSkeletonText animated />
            </IonAvatar>
            <IonLabel className="ion-no-margin">
              <IonSkeletonText animated style={{ width: "50%" }} />

              <IonLabel text-wrap>
                <IonSkeletonText animated />
                <IonSkeletonText animated />
                <IonSkeletonText animated style={{ width: "30%" }} />
              </IonLabel>
            </IonLabel>
          </IonItem>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export function removeVietnamese(str: string) {
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, "a");
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, "e");
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, "i");
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, "o");
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, "u");
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, "y");
  str = str.replace(/đ/g, "d");
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, "A");
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, "E");
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, "I");
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, "O");
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, "U");
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, "Y");
  str = str.replace(/Đ/g, "D");
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str.replace(/ + /g, " ");
  str = str.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str.replace(
    // eslint-disable-next-line no-useless-escape
    /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
    " "
  );
  return str.toLowerCase();
}

export default ClubPage;
