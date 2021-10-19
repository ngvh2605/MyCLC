import { useEffect, useState } from 'react';
import { database } from '../firebase';

const useCheckUserInfo = (userId?: string) => {
  const [isVerify, setIsVerify] = useState<boolean>(false);
  const [avatarVerify, setAvatarVerify] = useState<boolean>(false);

  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');

  const [allowCreateNews, setAllowCreateNews] = useState<boolean>(false);
  const [allowCreateEvent, setAllowCreateEvent] = useState<boolean>(false);

  const [status, setStatus] = useState<{
    isLoading: boolean;
    allowCreateNews: boolean;
    allowCreateEvent: boolean;
  }>({
    isLoading: false,
    allowCreateNews: false,
    allowCreateEvent: false,
  });

  useEffect(() => {
    if (userId) {
      const onVerifyStatus = database
        .ref(`/users/${userId}/verify`)
        .on('value', (snapshot) => {
          const data = snapshot.val();
          console.log('data', data);
          if (data && data.emailVerify && data.phoneVerify && data.personalInfo)
            setIsVerify(true);
          else setIsVerify(false);
          if (data && data.avatarVerify) setAvatarVerify(true);
          else setAvatarVerify(false);
        });
      return () =>
        database.ref(`/users/${userId}/verify`).off('value', onVerifyStatus);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      const onUserFullName = database
        .ref(`/users/${userId}/personal/fullName`)
        .on('value', (snapshot) => {
          if (snapshot.exists) setFullName(snapshot.val());
          else setFullName('');
        });
      const onUserAvatar = database
        .ref(`/users/${userId}/personal/avatar`)
        .on('value', (snapshot) => {
          if (snapshot.exists) setAvatarUrl(snapshot.val());
          else setAvatarUrl('');
        });
      return () => {
        database
          .ref(`/users/${userId}/personal/fullName`)
          .off('value', onUserFullName);
        database
          .ref(`/users/${userId}/personal/avatar`)
          .off('value', onUserAvatar);
      };
    }
  }, [userId]);

  useEffect(() => {
    if (userId) {
      database
        .ref()
        .child('auth')
        .child(userId)
        .once('value')
        .then((snapshot) => {
          const data = snapshot.val();

          setStatus({
            isLoading: true,
            allowCreateEvent: data && data.createEvent,
            allowCreateNews: data && data.createNews,
          });
        });
    }
  }, [userId]);

  return {
    isVerify,
    avatarVerify,
    fullName,
    avatarUrl,
    // allowCreateEvent: status.allowCreateEvent,
    // allowCreateNews: status.allowCreateNews,
    // isLoading: status.isLoading,
    ...status,
  };
};

export default useCheckUserInfo;
