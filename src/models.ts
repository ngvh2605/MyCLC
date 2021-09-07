import firebase from "firebase/app";

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
  timestamp?: string;
}

export function toComment(doc: firebase.firestore.DocumentSnapshot): Comment {
  return { id: doc.id, ...doc.data() } as Comment;
}

export interface News {
  id: string;
  author: string;
  timestamp: string;
  title?: string;
  body: string;
  pictureUrl?: string;
  reaction?: string[];
  comment?: Comment[];
  isLiked?: boolean;
  totalLikes?: number;
  totalComments?: number;
  authorInfo?: any;
}

export function toNews(doc: firebase.firestore.DocumentSnapshot): News {
  return { id: doc.id, ...doc.data() } as News;
}
