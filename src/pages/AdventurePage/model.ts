import firebase from "firebase/app";

export interface Team {
  id: string;
  isStarted?: boolean;
  player?: string[];
  score?: number;
  total?: number;
  playerInfo?: any[];
}

export interface Player {
  avatar: string;
  fullName: string;
}

export interface Mission {
  key: string;
  title: string;
  body: string;
  point: number;
  answer?: Answer;
}

export interface Answer {
  teamId?: string;
  key?: string;
  text: string;
  image: string;
  score?: number;
  isMarked?: boolean;
  timestamp?: number;
}

export function toAnswer(doc: firebase.firestore.DocumentSnapshot): Answer {
  return { ...doc.data() } as Answer;
}
