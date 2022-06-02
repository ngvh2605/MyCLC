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

function calImgScale() {
  const width = window.screen.width - 52 > 648 ? 648 : window.screen.width - 52;
  const height = (width * 9) / 16;
  return { width: width / 2, height: height / 2 };
}

const CertificateCard: React.FC<Props> = (props) => {
  const { certi } = props;
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <IonCard className="ion-no-margin" style={{ margin: 8 }}>
      <IonThumbnail
        style={{
          height: calImgScale().height,
          width: calImgScale().width,
        }}
      >
        {imgLoaded ? null : (
          <IonSkeletonText
            animated
            style={{
              height: calImgScale().height,
              width: calImgScale().width,
              margin: 0,
            }}
          />
        )}
        <IonImg
          src={certi.image}
          style={!imgLoaded ? { opacity: 0 } : { opacity: 1 }}
          onIonImgDidLoad={() => setImgLoaded(true)}
          onClick={() => {}}
        />
      </IonThumbnail>
      <IonCardContent style={{ padding: "0px 16px" }}>
        <IonItem
          lines="none"
          className="ion-no-margin ion-no-padding"
          style={{ height: 200 }}
        >
          <IonLabel
            className="ion-no-margin ion-no-padding"
            style={{ fontSize: 14, height: "100%" }}
          >
            {certi.name}
          </IonLabel>
        </IonItem>
      </IonCardContent>
    </IonCard>
  );
};

export default CertificateCard;
