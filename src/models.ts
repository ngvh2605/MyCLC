import firebase from "firebase/app";

export interface VerifyStatus {
  emailVerify: boolean;
  phoneVerify: boolean;
  personalInfo: boolean;
  hasAvatar: boolean;
}
export interface Entry {
  id: string;
  date: string;
  title: string;
  pictureUrl: string;
  description: string;
}

export function toEntry(doc: firebase.firestore.DocumentSnapshot): Entry {
  return { id: doc.id, ...doc.data() } as Entry;
}

export interface Comment {
  id: string;
  author: string;
  body: string;
  order?: number;
  timestamp?: string;
  authorInfo?: any;
}

export function toComment(doc: firebase.firestore.DocumentSnapshot): Comment {
  return { id: doc.id, ...doc.data() } as Comment;
}

export interface News {
  id: string;
  author: string;
  timestamp: string | number;
  title?: string;
  body: string;
  pictureUrl?: string;
  reaction?: string[];
  comment?: Comment[];
  isLiked?: boolean;
  totalLikes?: number;
  totalComments?: number;
  count?: number;
  authorInfo?: any;
}

export function toNews(doc: firebase.firestore.DocumentSnapshot): News {
  return { id: doc.id, ...doc.data() } as News;
}

export function toNewsId(doc: firebase.firestore.DocumentSnapshot): String {
  return doc.id;
}
