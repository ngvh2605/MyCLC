import { firestore } from '../../firebase';
import { News, toNews, Comment, toComment } from '../../models';

export const getComment = async (id: string) => {
  const { docs } = await firestore
    .collection('news')
    .doc(id)
    .collection('comment')
    .get();
  return docs.map(toComment);
};

export const getPost = async () => {
  const newsRef = firestore.collection('news');
  const { docs } = await newsRef.orderBy('timestamp', 'desc').limit(7).get();
  return docs.map(toNews);
};
