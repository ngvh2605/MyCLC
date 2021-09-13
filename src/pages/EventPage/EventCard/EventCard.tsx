import {
  IonActionSheet,
  IonAvatar,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonNote,
  IonRow,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from '@ionic/react';
import {
  brush,
  chatbubbleEllipses,
  close,
  ellipsisHorizontal,
  heart,
  heartOutline,
  star,
  trash,
} from 'ionicons/icons';
import moment from 'moment';
import 'moment/locale/vi';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useAuth } from '../../../auth';
import { database, firestore } from '../../../firebase';
import { Events } from '../../../models';
import './EventCard.scss';

const Skeleton = () => (
  <IonCard>
    <div>
      <IonSkeletonText
        animated
        style={{ height: 200, width: '100%', margin: 0 }}
      />
    </div>
    <IonCardContent>
      <IonSkeletonText animated style={{ width: '100%', height: 16 }} />
      <IonSkeletonText animated style={{ width: '100%', height: 16 }} />
      <IonSkeletonText animated style={{ width: '100%', height: 16 }} />
      <IonSkeletonText animated style={{ width: '30%', height: 16 }} />
    </IonCardContent>
  </IonCard>
);

interface Props {
  event: Events;
}

const EventCard: React.FC<Props> = (props) => {
  const history = useHistory();
  const { userId } = useAuth();

  const { event } = props;

  const [isLiked, setIsLiked] = useState(false);
  const [authorInfo, setAuthorInfo] = useState<any>({});

  const [showActionSheet, setShowActionSheet] = useState(false);
  const [presentAlert] = useIonAlert();

  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  return (
    <>
      {true ? (
        event.body && (
          <IonCard>
            {event.pictureUrl && (
              <div>
                {imgLoaded ? null : (
                  <IonSkeletonText
                    animated
                    style={{ height: 200, width: '100%', margin: 0 }}
                  />
                )}
                <img
                  src={event.pictureUrl}
                  alt={''}
                  style={
                    !imgLoaded
                      ? { display: 'none' }
                      : { objectFit: 'cover', height: 200, width: '100%' }
                  }
                  onLoad={() => setImgLoaded(true)}
                />
              </div>
            )}

            <IonCardContent
              style={{
                paddingTop: 0,
                paddingBottom: 0,
                marginTop: 8,
                display: 'flex',
                justifyContent: 'space-between',
              }}
              onClick={() => {}}
            >
              <div>
                <IonCardTitle style={{ color: '#FF6991', fontSize: 16 }}>
                  {moment(event.eventDate).locale('vi').format('Do MMM, H:mm')}
                </IonCardTitle>
                <IonCardTitle style={{ marginTop: 4 }}>
                  {event.title}
                </IonCardTitle>
                <IonCardSubtitle style={{ color: '#BCC4D2', marginTop: 4 }}>
                  {event.location}
                </IonCardSubtitle>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <img
                    src='/assets/image/placeholder.png'
                    alt=''
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      objectFit: 'cover',
                    }}
                  />
                  <IonCardSubtitle style={{ color: '#BCC4D2', marginLeft: 8 }}>
                    {event.club}
                  </IonCardSubtitle>
                </div>
              </div>
              <IonButton color='light'>
                <IonIcon icon={heartOutline} />
              </IonButton>
            </IonCardContent>
          </IonCard>
        )
      ) : (
        <Skeleton />
      )}
    </>
  );
};

export default EventCard;
