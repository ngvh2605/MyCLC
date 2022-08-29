import {
  IonCard,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonText,
  IonThumbnail,
} from "@ionic/react";
import { calendar, document, person } from "ionicons/icons";
import moment from "moment";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";

import { Certificate } from "./CertificatePage";
interface Props {
  certi: Certificate;
}

const CertificateItem: React.FC<Props> = (props) => {
  const { t } = useTranslation();
  const { certi } = props;
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <IonCard
      style={{ margin: 18 }}
      onClick={() => {
        window.open(certi.url, "_blank");
      }}
    >
      <IonItem
        lines="none"
        className="ion-no-padding ion-no-margin"
        style={{ padding: 20 }}
      >
        <IonThumbnail slot="start" style={{ width: 100, height: 56 }}>
          {imgLoaded ? null : (
            <IonSkeletonText animated style={{ borderRadius: 10 }} />
          )}
          <IonImg
            src={certi.image}
            style={
              !imgLoaded
                ? { opacity: 0, borderRadius: 10 }
                : {
                    opacity: 1,
                    borderRadius: 10,
                  }
            }
            onIonImgDidLoad={() => setImgLoaded(true)}
            onClick={() => {}}
          />
        </IonThumbnail>

        <IonLabel style={{ fontSize: 14, margin: 0 }}>
          <IonLabel text-wrap style={{ marginBottom: 3 }}>
            {certi.name}
          </IonLabel>
          <IonLabel text-wrap color="medium">
            <IonIcon icon={document} style={{ verticalAlign: -2 }} />{" "}
            {t("Date of issue")}: {moment(certi.timestamp).format("DD/MM/YYYY")}
          </IonLabel>
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};

export const CertificateItemSkeleton = () => (
  <IonCard style={{ margin: 18 }}>
    <IonItem
      lines="none"
      className="ion-no-padding ion-no-margin"
      style={{ padding: 20 }}
    >
      <IonThumbnail slot="start" style={{ width: 100, height: 56 }}>
        <IonSkeletonText animated style={{ borderRadius: 10 }} />
      </IonThumbnail>
      <IonLabel text-wrap style={{ margin: 0 }}>
        <IonSkeletonText animated style={{ width: "70%", marginBottom: 3 }} />
        <IonSkeletonText animated style={{ width: "40%" }} />
      </IonLabel>
    </IonItem>
  </IonCard>
);
export default CertificateItem;
