import firebase from "firebase/app";

export interface Team {
  id: string;
  isStarted?: boolean;
  player?: string[];
  score?: number;
  total?: number;
  playerInfo?: any[];
  name?: string;
}

export interface Player {
  avatar: string;
  fullName: string;
}

export interface Mission {
  key: number;
  title: string;
  body: string;
  point: number;
  answer?: Answer;
  userId?: string;
}

export interface Answer {
  teamId?: string;
  teamName?: string;
  userId?: string;
  key?: number;
  text: string;
  image: string;
  score?: number;
  isMarked?: boolean;
  timestamp?: number;
  mission?: Mission;
}

export function toAnswer(doc: firebase.firestore.DocumentSnapshot): Answer {
  return { ...doc.data() } as Answer;
}
