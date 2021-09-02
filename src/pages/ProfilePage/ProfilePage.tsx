import {
  IonAlert,
  IonAvatar,
  IonButton,
  IonButtons,
  IonCheckbox,
  IonChip,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonMenuButton,
  IonModal,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import { mailOutline, pencil } from 'ionicons/icons';
import React, { useEffect, useRef, useState } from 'react';
import { database } from '../../firebase';
import { useAuth } from '../../auth';
import { useHistory } from 'react-router';
import useUploadFile from '../../common/useUploadFile';

interface VerifyStatus {
  emailVerify: boolean;
  phoneVerify: boolean;
  personalInfo: boolean;
  hasAvatar: boolean;
}

const DEFAULT_AVATAR_URL = '/assets/image/placeholder.png';

const ProfilePage: React.FC = () => {
  const { userId, emailVerified } = useAuth();
  const history = useHistory();
  const [verifyStatus, setVerifyStatus] = useState<VerifyStatus>({
    emailVerify: true,
    phoneVerify: true,
    personalInfo: true,
    hasAvatar: true,
  });
  const [fullName, setFullName] = useState('');

  var QRCode = require('qrcode.react');

  const [QRvalue, setQRvalue] = useState(userId);

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { progress, url, handleUpload } = useUploadFile(userId);

  useEffect(() => {
    console.log('progress', progress);
  }, [progress]);

  useEffect(() => {
    readStatus();
  }, [history]);

  useEffect(() => {
    checkEmailVerify();
  }, [verifyStatus]);

  const readStatus = () => {
    const userData = database.ref().child('users').child(userId);
    userData
      .child('verify')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setVerifyStatus(data);
        } else {
          setVerifyStatus({
            emailVerify: false,
            phoneVerify: false,
            personalInfo: false,
            hasAvatar: false,
          });
          console.log('No data available');
        }
      })
      .catch((error) => {
        console.error(error);
      });

    userData
      .child('personal')
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          try {
            setFullName(data.fullName);
          } catch {}
        } else {
          console.log('No data available');
        }
      });
  };

  const checkEmailVerify = async () => {
    if (emailVerified && !verifyStatus?.emailVerify) {
      const userData = database.ref();
      await userData.child('users').child(userId).child('verify').update({
        emailVerify: true,
      });
    }
  };

  const handleUploadFile = (e) => {
    const { files } = e.target;
    console.log(files[0].name);
    handleUpload(files[0], 'avatar');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonMenuButton />
          </IonButtons>
          <IonButtons slot='end'>
            <IonButton onClick={() => history.push('/my/profile/personal')}>
              <IonIcon icon={pencil} color='primary' />
            </IonButton>
          </IonButtons>
          <IonTitle>Hồ sơ</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className='ion-padding'>
        <IonAvatar
          className='ion-margin'
          style={{
            width: 100,
            height: 100,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          <label>
            <img
              src={url || DEFAULT_AVATAR_URL}
              alt=''
              style={{
                borderRadius: 90,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
            <input
              type='file'
              id='upload'
              accept='image/png, image/gif, image/jpeg'
              style={{ display: 'none' }}
              multiple={false}
              onChange={handleUploadFile}
            />
          </label>
        </IonAvatar>
        <p style={{ textAlign: 'center', fontSize: 'large' }}>
          <b>{fullName}</b>
        </p>
        <br />
        <IonItemDivider color='primary'>
          <IonLabel>Xác minh 3 bước</IonLabel>
        </IonItemDivider>
        <IonChip
          color='primary'
          style={{ height: 'max-content', marginBottom: 10 }}
          className='ion-margin'
        >
          <IonLabel text-wrap className='ion-padding'>
            Để xây dựng một cộng đồng kết nối Chuyên Lào Cai - MyCLC an toàn và
            bền vững. Bạn cần thực hiện đủ 3 bước xác minh để có thể sử dụng
            được các chức năng khác!
          </IonLabel>
        </IonChip>
        <IonList lines='none'>
          <IonItem
            detail={!verifyStatus?.emailVerify}
            disabled={verifyStatus?.emailVerify}
            onClick={() => {
              history.push('/my/profile/email');
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.emailVerify}
              hidden={!verifyStatus?.emailVerify}
              slot='end'
            />
            <IonLabel>Xác minh Email</IonLabel>
          </IonItem>
          <IonItem
            detail={!verifyStatus?.phoneVerify}
            disabled={verifyStatus?.phoneVerify}
            onClick={() => {
              history.push('/my/profile/phone');
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.phoneVerify}
              hidden={!verifyStatus?.phoneVerify}
              slot='end'
            />
            <IonLabel>Xác minh Số điện thoại</IonLabel>
          </IonItem>
          <IonItem
            detail={!verifyStatus?.personalInfo}
            disabled={verifyStatus?.personalInfo}
            onClick={() => {
              history.push('/my/profile/personal');
            }}
          >
            <IonCheckbox
              checked={verifyStatus?.personalInfo}
              hidden={!verifyStatus?.personalInfo}
              slot='end'
            />
            <IonLabel>Xác thực danh tính</IonLabel>
          </IonItem>
        </IonList>
        <br />
        <IonItemDivider color='primary'>
          <IonLabel>Mã QR của bạn</IonLabel>
        </IonItemDivider>
        <IonChip
          color='primary'
          style={{ height: 'max-content', marginBottom: 10 }}
          className='ion-margin'
        >
          <IonLabel text-wrap className='ion-padding'>
            Mã QR này sử dụng cho các tính năng kết nối và check in khi tham gia
            các sự kiện sẽ được ra mắt trong thời gian tới
          </IonLabel>
        </IonChip>
        <br />
        <br />
        <div style={{ marginLeft: 'auto', marginRight: 'auto', width: 150 }}>
          <QRCode value={QRvalue} size={150} />
        </div>
        <br />
        <br />
        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
          }}
          cssClass='my-custom-class'
          header={alertHeader}
          message={alertMessage}
          buttons={['OK']}
        />
      </IonContent>
    </IonPage>
  );
};

export default ProfilePage;
