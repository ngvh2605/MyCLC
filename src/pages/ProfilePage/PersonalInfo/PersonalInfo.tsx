import {
  IonAlert,
  IonBackButton,
  IonButton,
  IonButtons,
  IonChip,
  IonContent,
  IonDatetime,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemDivider,
  IonLabel,
  IonList,
  IonLoading,
  IonNote,
  IonPage,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { chevronBack } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { useAuth } from "../../../auth";
import { auth as firebaseAuth, database } from "../../../firebase";

const PersonalInfo: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const history = useHistory();
  //const [buttonDisabled, setButtonDisabled] = useState(true);
  const [status, setStatus] = useState({ loading: false, error: false });

  const [showAlert, setShowAlert] = useState(false);
  const [alertHeader, setAlertHeader] = useState("");
  const [alertMessage, setAlertMessage] = useState("");

  const [phone, setPhone] = useState("");

  const [fullName, setFullName] = useState("");
  const [birth, setBirth] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  const [other, setOther] = useState("");
  const [otherPurpose, setOtherPurpose] = useState("");

  const [clubCode, setClubCode] = useState("");
  const [clubLink, setClubLink] = useState("");

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
      setGradeClass(grade + " K" + gen);
    }
  }, [grade, gradeStart]);

  useEffect(() => {
    if (role == "club") {
      getClubCode();
    }
  }, [role]);

  const isDisable = () => {
    if (!(fullName && birth && gender && role)) return true;
    switch (role) {
      case "student":
        return grade && gradeStart && gradeEnd ? false : true;
      case "teacher":
        return teacherSubject ? false : true;
      case "club":
        return clubCode && clubLink ? false : true;
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
          setPhone("(" + data.dialCode + ") " + data.phoneNumber);
          setFullName(data.fullName);
          setBirth(data.birth);
          setGender(data.gender);
          setRole(data.role);
          if (data.role == "student") {
            setGrade(data.studentClass);
            setGradeStart(data.studentStart);
            setGradeEnd(data.studentEnd);
          }
          if (data.role == "teacher") {
            setTeacherSubject(data.teacherSubject);
            if (data.teacherClass) setTeacherClass(data.teacherClass);
          }
          if (data.role == "club") {
            setClubCode(data.clubCode);
            setClubLink(data.clubLink);
          }
          if (data.role == "parent") {
            setChildName(data.childName);
            setChildClass(data.childClass);
          }
          if (data.role == "other") {
            setOther(data.otherSpecify);
            setOtherPurpose(data.otherPurpose);
          }
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  interface Code {
    code: string;
    value: string;
  }
  const [codeList, setCodeList] = useState<Code[]>();

  const getClubCode = () => {
    const userData = database.ref();
    userData
      .child("clubCode")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setCodeList(snapshot.val());
        } else {
          console.log("No data available");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  function checkCode() {
    var isAvailable = false;
    codeList.map((item) => {
      if (
        clubCode === item.code &&
        (item.value === "available" || item.value === userId)
      ) {
        isAvailable = true;
      }
    });
    return isAvailable;
  }

  function getCodeIndex() {
    var index;
    codeList.map((item) => {
      if (
        clubCode === item.code &&
        (item.value === "available" || item.value === userId)
      ) {
        index = codeList.indexOf(item);
      }
    });
    return index;
  }

  const handleSaveInfo = async () => {
    const userData = database.ref();
    await userData.child("users").child(userId).child("personal").update({
      fullName: fullName,
      birth: birth,
      gender: gender,
      role: role,
    });

    if (role == "student") {
      await userData.child("users").child(userId).child("personal").update({
        studentClass: grade,
        studentStart: gradeStart,
        studentEnd: gradeEnd,
      });
      await userData.child("users").child(userId).child("verify").update({
        personalInfo: true,
      });
      setAlertHeader("Hoàn thành!");
      setAlertMessage("Thông tin của bạn đã được lưu thành công");
      setShowAlert(true);
    }
    if (role == "teacher") {
      await userData.child("users").child(userId).child("personal").update({
        teacherSubject: teacherSubject,
        teacherClass: teacherClass,
      });
      await userData.child("users").child(userId).child("verify").update({
        personalInfo: true,
      });
      setAlertHeader("Hoàn thành!");
      setAlertMessage("Thông tin của bạn đã được lưu thành công");
      setShowAlert(true);
    }
    if (role == "club") {
      if (codeList) {
        if (checkCode()) {
          await userData.child("users").child(userId).child("personal").update({
            clubCode: clubCode,
            clubLink: clubLink,
          });
          await userData.child("users").child(userId).child("verify").update({
            personalInfo: true,
          });
          await userData.child("clubCode").child(getCodeIndex()).update({
            value: userId,
          });
          setAlertHeader("Hoàn thành!");
          setAlertMessage("Thông tin của bạn đã được lưu thành công");
          setShowAlert(true);
        } else {
          setAlertHeader("Lỗi!");
          setAlertMessage("Mã giới thiệu không chính xác. Vui lòng thử lại");
          setShowAlert(true);
        }
      }
    }
    if (role == "parent") {
      await userData.child("users").child(userId).child("personal").update({
        childName: childName,
        childClass: childClass,
      });
      await userData.child("users").child(userId).child("verify").update({
        personalInfo: true,
      });
      setAlertHeader("Hoàn thành!");
      setAlertMessage("Thông tin của bạn đã được lưu thành công");
      setShowAlert(true);
    }
    if (role == "other") {
      await userData.child("users").child(userId).child("personal").update({
        otherSpecify: other,
        otherPurpose: otherPurpose,
      });
      await userData.child("users").child(userId).child("verify").update({
        personalInfo: true,
      });
      setAlertHeader("Hoàn thành!");
      setAlertMessage("Thông tin của bạn đã được lưu thành công");
      setShowAlert(true);
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton text="Huỷ" defaultHref="/my/profile" />
          </IonButtons>

          <IonTitle>Thông tin cá nhân</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem detail={false} lines="none">
          <IonLabel color="medium">Email: {userEmail}</IonLabel>
        </IonItem>
        <IonItem detail={false} lines="none">
          <IonLabel color="medium">Số điện thoại: {phone}</IonLabel>
        </IonItem>

        <IonChip
          color="danger"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
        >
          <IonLabel text-wrap className="ion-padding">
            Bạn cần trả lời hết tất cả các câu hỏi
          </IonLabel>
        </IonChip>

        <IonList>
          <IonItem>
            <IonLabel position="floating">Họ và tên</IonLabel>
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
            <IonLabel position="floating">Ngày sinh</IonLabel>
            <IonDatetime
              displayFormat="DD MM YYYY"
              value={birth}
              onIonChange={(e) => setBirth(e.detail.value)}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Giới tính</IonLabel>
            <IonSelect
              interface="popover"
              value={gender}
              onIonChange={(e) => {
                setGender(e.detail.value);
              }}
            >
              <IonSelectOption value="Nam">Nam</IonSelectOption>
              <IonSelectOption value="Nữ">Nữ</IonSelectOption>
              <IonSelectOption value="Khác">Khác</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Chọn đối tượng</IonLabel>
            <IonSelect
              interface="action-sheet"
              value={role}
              onIonChange={(e) => {
                setRole(e.detail.value);
              }}
            >
              <IonSelectOption value="student">
                Học sinh/Cựu học sinh
              </IonSelectOption>
              <IonSelectOption value="teacher">
                Giáo viên/Nhân viên
              </IonSelectOption>
              <IonSelectOption value="parent">
                Phụ huynh/Người giám hộ
              </IonSelectOption>
              <IonSelectOption value="club">Câu lạc bộ/Tổ chức</IonSelectOption>
              <IonSelectOption value="other">Khác</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem hidden={role != "other"}>
            <IonLabel position="floating">Hãy nêu rõ bạn là ai</IonLabel>
            <IonInput
              type="text"
              value={other}
              onIonChange={(e) => setOther(e.detail.value)}
            />
          </IonItem>
          <IonItem hidden={role != "other"}>
            <IonLabel position="floating">
              Mục đích bạn sử dụng app này
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
          hidden={role != "club"}
        >
          <IonLabel text-wrap className="ion-padding">
            LƯU Ý: Để tạo tài khoản Câu lạc bộ/Tổ chức cần có mã giới thiệu từ
            CLC Multimedia. Nếu chưa có hãy liên hệ với CLB để được hỗ trợ!
          </IonLabel>
        </IonChip>

        {/* Câu lạc bộ */}
        <IonList hidden={role != "club"}>
          <IonItem>
            <IonLabel position="floating">Mã giới thiệu</IonLabel>
            <IonInput
              type="text"
              value={clubCode}
              onIonChange={(e) => setClubCode(e.detail.value)}
            />
          </IonItem>

          <IonItem>
            <IonLabel position="floating">Link trang Facebook</IonLabel>
            <IonInput
              type="url"
              value={clubLink}
              onIonChange={(e) => {
                setClubLink(e.detail.value);
              }}
            />
          </IonItem>
        </IonList>

        {/* Học sinh/Cựu học sinh */}
        <IonList hidden={role != "student"}>
          <IonItem>
            <IonLabel position="floating">Khối chuyên</IonLabel>
            <IonSelect
              interface="popover"
              value={grade}
              onIonChange={(e) => {
                setGrade(e.detail.value);
              }}
            >
              <IonSelectOption value="A1">A1</IonSelectOption>
              <IonSelectOption value="Anh">Anh</IonSelectOption>
              <IonSelectOption value="Hoá">Hoá</IonSelectOption>
              <IonSelectOption value="Lý">Lý</IonSelectOption>
              <IonSelectOption value="Sinh">Sinh</IonSelectOption>
              <IonSelectOption value="Sử Địa">Sử Địa</IonSelectOption>
              <IonSelectOption value="Toán">Toán</IonSelectOption>
              <IonSelectOption value="Toán Tin">Toán Tin</IonSelectOption>
              <IonSelectOption value="Trung">Trung</IonSelectOption>
              <IonSelectOption value="Văn">Văn</IonSelectOption>
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Năm vào trường</IonLabel>
            <IonDatetime
              min="2003"
              displayFormat="YYYY"
              value={gradeStart}
              onIonChange={(e) => setGradeStart(e.detail.value)}
            ></IonDatetime>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Năm ra trường</IonLabel>
            <IonDatetime
              displayFormat="YYYY"
              min={gradeStart ? gradeStart : "2004"}
              max={gradeStart ? (parseInt(gradeStart) + 3).toString() : "2050"}
              value={gradeEnd}
              onIonChange={(e) => setGradeEnd(e.detail.value)}
            ></IonDatetime>
          </IonItem>
        </IonList>

        <IonChip
          color="primary"
          style={{ height: "max-content", marginBottom: 10 }}
          className="ion-margin"
          hidden={!gradeClass || role != "student"}
        >
          <IonLabel text-wrap className="ion-padding">
            {"Bạn là học sinh lớp: " + gradeClass}
          </IonLabel>
        </IonChip>
        <IonLoading isOpen={status.loading} />

        {/* Giáo viên/Nhân viên */}
        <IonList hidden={role != "teacher"}>
          <IonItem>
            <IonLabel position="floating">
              Vị trí/Chức vụ/Môn học giảng dạy
            </IonLabel>
            <IonInput
              type="text"
              value={teacherSubject}
              onIonChange={(e) => setTeacherSubject(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Lớp chủ nhiệm (nếu có)</IonLabel>
            <IonInput
              type="text"
              value={teacherClass}
              onIonChange={(e) => setTeacherClass(e.detail.value)}
            />
          </IonItem>
        </IonList>

        {/* Phụ huynh/Người giám hộ */}
        <IonList hidden={role != "parent"}>
          <IonItem>
            <IonLabel position="floating">Họ và tên Con</IonLabel>
            <IonInput
              type="text"
              value={childName}
              onIonChange={(e) => setChildName(e.detail.value)}
            />
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Lớp của Con</IonLabel>
            <IonInput
              type="text"
              value={childClass}
              onIonChange={(e) => setChildClass(e.detail.value)}
            />
          </IonItem>
        </IonList>

        <IonAlert
          isOpen={showAlert}
          onDidDismiss={() => {
            setShowAlert(false);
            if (alertHeader != "Lỗi!") {
              history.replace("/my/profile");
            }
          }}
          cssClass="my-custom-class"
          header={alertHeader}
          message={alertMessage}
          buttons={["OK"]}
        />
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
              Lưu thông tin
            </IonButton>
          </div>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default PersonalInfo;
