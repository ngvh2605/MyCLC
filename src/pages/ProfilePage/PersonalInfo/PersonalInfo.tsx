/* eslint-disable react-hooks/exhaustive-deps */
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonDatetime,
  IonFooter,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  useIonAlert,
} from "@ionic/react";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { database } from "../../../firebase";

const PersonalInfo: React.FC = () => {
  const { t } = useTranslation();
  const { userId, userEmail } = useAuth();
  const history = useHistory();

  const [presentAlert] = useIonAlert();
  const [loading, setLoading] = useState(false);

  const [userInfo, setUserInfo] = useState<any>();

  const [phone, setPhone] = useState("");

  const [fullName, setFullName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const [other, setOther] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");

  const [clubCode, setClubCode] = useState("");
  const [clubContact, setClubContact] = useState("");
  const [clubTeacher, setClubTeacher] = useState("");

  const [grade, setGrade] = useState("");
  const [gradeStart, setGradeStart] = useState("");
  const [gradeEnd, setGradeEnd] = useState("");
  const [gradeClass, setGradeClass] = useState("");

  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherClass, setTeacherClass] = useState("");

  const [childName, setChildName] = useState("");
  const [childClass, setChildClass] = useState("");

  useEffect(() => {
    readData();
  }, []);

  useEffect(() => {
    if (grade && gradeStart) {
      let gen = parseInt(gradeStart) - 2002;
      setGradeClass("CLC K" + gen);
    }
  }, [grade, gradeStart]);

  const isDisable = () => {
    if (!(fullName && birth && gender && role)) return true;
    switch (role) {
      case "student":
        return grade && gradeStart && gradeEnd ? false : true;
      case "teacher":
        return teacherSubject ? false : true;
      case "club":
        return clubCode && clubContact ? false : true;
      case "parent":
        return childName && childClass ? false : true;
      case "other":
      default:
        return other && otherPurpose ? false : true;
    }
  };

  const buttonDisabled = isDisable();

  const readData = async () => {
    const userData = database.ref();
    userData
      .child("users")
      .child(userId)
      .child("personal")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUserInfo({ ...data });

          setPhone("(" + data.dialCode + ") " + data.phoneNumber);

          setFullName(data.fullName);
          setBirth(data.birth);
          setGender(data.gender);
          setRole(data.role);

          switch (data.role) {
            case "student":
              setGrade(data.studentClass);
              setGradeStart(data.studentStart);
              setGradeEnd(data.studentEnd);
              break;
            case "teacher":
              setTeacherSubject(data.teacherSubject);
              if (data.teacherClass) setTeacherClass(data.teacherClass);
              break;
            case "club":
              setClubCode(data.clubCode);
              setClubContact(data.clubContact);
              setClubTeacher(data.clubTeacher);
              break;
            case "parent":
              setChildName(data.childName);
              setChildClass(data.childClass);
              break;
            case "other":
              setOther(data.otherSpecify);
              setOtherPurpose(data.otherPurpose);
              break;
            default:
              break;
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  async function checkCode() {
    let isAvailable = false;

    const data = await database
      .ref()
      .child("clubCode")
      .child(clubCode.toUpperCase())
      .once("value");

    if (
      data.exists() &&
      (data.val() === "available" || data.val() === userId)
    ) {
      isAvailable = true;
    }
    return isAvailable;
  }

  const successAlert = async () => {
    const userData = database.ref();

    await userData.child("users").child(userId).child("verify").update({
      personalInfo: true,
    });

    setLoading(false);

    presentAlert({
      header: t("Done"),
      message: t("Your information has been saved successfully"),
      buttons: [
        {
          text: "OK",
          handler: () => {
            history.push("/my/profile");
          },
        },
      ],
    });
  };

  const handleSaveInfo = async () => {
    setLoading(true);
    const userData = database.ref();
    await userData.child("users").child(userId).child("personal").update({
      fullName: fullName,
      birth: birth,
      gender: gender,
      role: role,
    });

    switch (role) {
      case "student":
        await userData.child("users").child(userId).child("personal").update({
          studentClass: grade,
          studentStart: gradeStart,
          studentEnd: gradeEnd,
        });

        successAlert();
        break;
      case "teacher":
        await userData.child("users").child(userId).child("personal").update({
          teacherSubject: teacherSubject,
          teacherClass: teacherClass,
        });

        successAlert();
        break;
      case "club":
        const isAvailable = await checkCode();
        if (isAvailable) {
          await userData.child("users").child(userId).child("personal").update({
            clubCode: clubCode,
            clubContact: clubContact,
            clubTeacher: clubTeacher,
          });

          await userData
            .child("clubCode")
            .child(clubCode.toUpperCase())
            .set(userId);

          //auto verify phone
          await userData.child("users").child(userId).child("verify").update({
            phoneVerify: true,
          });

          //allow create role and event
          await userData.child("auth").child(userId).update({
            createEvent: true,
            createNews: true,
          });

          successAlert();
        } else {
          presentAlert({
            header: t("Error"),
            message: t("The referral code is incorrect. Please try again"),
            buttons: [{ text: "OK" }],
          });
        }
        break;
      case "parent":
        await userData.child("users").child(userId).child("personal").update({
          childName: childName,
          childClass: childClass,
        });

        successAlert();
        break;
      case "other":
        await userData.child("users").child(userId).child("personal").update({
          otherSpecify: other,
          otherPurpose: otherPurpose,
        });

        successAlert();
        break;
      default:
        break;
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/profile" />
          </IonButtons>

          <IonTitle>{t("Personal information")}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem detail={false} lines="none">
          <IonLabel color="medium">Email: {userEmail}</IonLabel>
        </IonItem>
        <IonItem detail={false} lines="none">
          <IonLabel color="medium">
            {t("Phone number")}:{" "}
            {phone.includes("undefined") ? <i>{t("Unverified")}</i> : phone}
          </IonLabel>
        </IonItem>

        <IonChip
          color="danger"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            {t("You need to answer all the questions")}
          </IonLabel>
        </IonChip>

        <IonList>
          <IonItem>
            <IonLabel position="floating">{t("Full name")}</IonLabel>
            <IonInput
              autocapitalize="words"
              type="text"
              value={fullName}
              onIonChange={(e) => {
                setFullName(e.detail.value);
              }}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Date of birth")}</IonLabel>
            <IonDatetime
              displayFormat="DD/MM/YYYY"
              value={birth}
              onIonChange={(e) =>
                setBirth(moment(e.detail.value).format("YYYY-MM-DD"))
              }
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Gender")}</IonLabel>
            <IonSelect
              interface="action-sheet"
              value={gender}
              onIonChange={(e) => {
                setGender(e.detail.value);
              }}
            >
              <IonSelectOption value="Nam">{t("Male")}</IonSelectOption>
              <IonSelectOption value="Nữ">{t("Female")}</IonSelectOption>
              <IonSelectOption value="Khác">{t("Other")}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Select type")}</IonLabel>
            <IonSelect
              interface="action-sheet"
              value={role}
              onIonChange={(e) => {
                setRole(e.detail.value);
              }}
              disabled={userInfo && userInfo.role && userInfo.role === "club"}
            >
              <IonSelectOption value="student">
                {t("Student/Alumni")}
              </IonSelectOption>
              <IonSelectOption value="teacher">
                {t("Teacher/Staff")}
              </IonSelectOption>
              <IonSelectOption value="parent">
                {t("Parent/Guardian")}
              </IonSelectOption>
              <IonSelectOption value="club">
                {t("Club/Organization")}
              </IonSelectOption>
              <IonSelectOption value="other">{t("Other")}</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={role !== "other"}>
            <IonLabel position="floating">
              {t("Please state your type")}
            </IonLabel>
            <IonInput
              type="text"
              value={other}
              onIonChange={(e) => setOther(e.detail.value)}
            />
          </IonItem>
          <IonItem hidden={role !== "other"}>
            <IonLabel position="floating">
              {t("Your purpose when using this application")}
            </IonLabel>
            <IonInput
              type="text"
              value={otherPurpose}
              onIonChange={(e) => setOtherPurpose(e.detail.value)}
            />
          </IonItem>
        </IonList>

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={role !== "club"}
        >
          <IonLabel text-wrap className="ion-padding">
            {t("Create club warning message")}
          </IonLabel>
        </IonChip>

        {/* Câu lạc bộ */}
        <IonList hidden={role !== "club"}>
          <IonItem>
            <IonLabel position="floating">{t("Referral code")}</IonLabel>
            <IonInput
              type="text"
              value={clubCode}
              onIonChange={(e) => setClubCode(e.detail.value)}
              disabled={userInfo && userInfo.role && userInfo.role === "club"}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">{t("Contact phone number")}</IonLabel>
            <IonInput
              type="url"
              value={clubContact}
              onIonChange={(e) => {
                setClubContact(e.detail.value);
              }}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">{t("Teacher in charge")}</IonLabel>
            <IonInput
              type="text"
              value={clubTeacher}
              onIonChange={(e) => {
                setClubTeacher(e.detail.value);
              }}
            />
          </IonItem>
        </IonList>

        {/* Học sinh/Cựu học sinh */}
        <IonList hidden={role !== "student"}>
          <IonItem>
            <IonLabel position="floating">{t("Specialized grade")}</IonLabel>
            <IonSelect
              interface="action-sheet"
              value={grade}
              onIonChange={(e) => {
                setGrade(e.detail.value);
              }}
            >
              <IonSelectOption value="A1">A1</IonSelectOption>
              <IonSelectOption value="Anh">
                {t("English grade")}
              </IonSelectOption>
              <IonSelectOption value="Hoá">
                {t("Chemistry grade")}
              </IonSelectOption>
              <IonSelectOption value="Lý">{t("Physics grade")}</IonSelectOption>
              <IonSelectOption value="Sinh">
                {t("Biology grade")}
              </IonSelectOption>
              <IonSelectOption value="Sử Địa">
                {t("History Geography grade")}
              </IonSelectOption>
              <IonSelectOption value="Toán">
                {t("Mathematics grade")}
              </IonSelectOption>
              <IonSelectOption value="Toán Tin">
                {t("Mathematics Informatics grade")}
              </IonSelectOption>
              <IonSelectOption value="Trung">
                {t("Chinese grade")}
              </IonSelectOption>
              <IonSelectOption value="Văn">
                {t("Literature grade")}
              </IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Enrollment year")}</IonLabel>
            <IonDatetime
              min="2003"
              displayFormat="YYYY"
              value={gradeStart}
              onIonChange={(e) =>
                setGradeStart(moment(e.detail.value).format("YYYY"))
              }
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Graduation year")}</IonLabel>
            <IonDatetime
              displayFormat="YYYY"
              min={gradeStart ? (parseInt(gradeStart) + 1).toString() : "2004"}
              max={
                gradeStart
                  ? (parseInt(gradeStart) + 5).toString()
                  : moment().add(5, "years").format("YYYY")
              }
              value={gradeEnd}
              onIonChange={(e) =>
                setGradeEnd(moment(e.detail.value).format("YYYY"))
              }
            ></IonDatetime>
          </IonItem>
        </IonList>

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={!gradeClass || role !== "student"}
        >
          <IonLabel text-wrap className="ion-padding">
            {t("You are a student of") + " " + gradeClass}
          </IonLabel>
        </IonChip>

        {/* Giáo viên/Nhân viên */}
        <IonList hidden={role !== "teacher"}>
          <IonItem>
            <IonLabel position="floating">
              {t("Position/Title/Teaching Subjects")}
            </IonLabel>
            <IonInput
              type="text"
              value={teacherSubject}
              onIonChange={(e) => setTeacherSubject(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">
              {t("Homeroom class (if any)")}
            </IonLabel>
            <IonInput
              type="text"
              value={teacherClass}
              onIonChange={(e) => setTeacherClass(e.detail.value)}
            />
          </IonItem>
        </IonList>

        {/* Phụ huynh/Người giám hộ */}
        <IonList hidden={role !== "parent"}>
          <IonItem>
            <IonLabel position="floating">{t("Child's full name")}</IonLabel>
            <IonInput
              type="text"
              value={childName}
              onIonChange={(e) => setChildName(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">{t("Child's class")}</IonLabel>
            <IonInput
              type="text"
              value={childClass}
              onIonChange={(e) => setChildClass(e.detail.value)}
            />
          </IonItem>
        </IonList>

        <IonLoading isOpen={loading} />
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <div className="ion-margin">
            <IonButton
              className="ion-margin"
              expand="block"
              type="submit"
              shape="round"
              onClick={() => {
                handleSaveInfo();
              }}
              disabled={buttonDisabled}
            >
              {t("Save information")}
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default PersonalInfo;
