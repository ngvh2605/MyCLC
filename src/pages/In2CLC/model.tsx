import firebase from "firebase/app";

export interface Match {
  mentor_mail: string;
  mentor_name: string;
  mentee_mail: string;
  mentee_name: string;
  mentee_phone: string | number;
  mentee_fb: string;
  mentee_class: string;
  mentee_school: string;
  mentee_subject: string;
  mentee_wish: string;
}

export interface Mission {
  code: string;
  title: string;
  body: string;
  type?: string;
  deadline?: string;
  answer?: Answer;
}

export interface Answer {
  email?: string;
  userId?: string;
  code?: string;
  text: string;
  image: string;
  isMarked?: boolean;
  isApproved?: boolean;
}

export function toAnswer(doc: firebase.firestore.DocumentSnapshot): Answer {
  return { ...doc.data() } as Answer;
}
