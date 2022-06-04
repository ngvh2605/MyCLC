import {
  IonCard,
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
  const width = window.screen.width - 62;
  const height = (width * 9) / 16;
  return { width: width / 2, height: height / 2 };
}

const CertificateCard: React.FC<Props> = (props) => {
  const { certi } = props;
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <IonCard
      className="ion-no-margin"
      style={{ margin: 8 }}
      onClick={() => {
        window.open(certi.url, "_blank");
      }}
    >
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
      <IonItem lines="none">
        <IonLabel style={{ fontSize: 14, textAlign: "center" }}>
          {certi.name}
        </IonLabel>
      </IonItem>
    </IonCard>
  );
};

export default CertificateCard;
