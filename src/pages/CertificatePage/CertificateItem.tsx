import {
  IonCard,
  IonCardContent,
  IonImg,
  IonItem,
  IonLabel,
  IonSkeletonText,
  IonThumbnail,
} from "@ionic/react";
import React, { useState } from "react";

import { Certificate } from "./CertificatePage";
interface Props {
  certi: Certificate;
}

const CertificateItem: React.FC<Props> = (props) => {
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
        style={{ padding: 16 }}
      >
        <IonThumbnail slot="start">
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

        <IonLabel style={{ fontSize: 14 }}>{certi.name}</IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default CertificateItem;
