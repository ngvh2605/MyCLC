import moment from "moment";
import { auth, database, googleProvider } from "../../firebase";

export const handleGoogleLogin = async (onError: () => void) => {
  try {
    await auth.signInWithPopup(googleProvider).then(async ({ user }) => {
      if (
        moment().isSameOrBefore(
          moment(user.metadata.creationTime).add(15, "second")
        )
      ) {
        database.ref().child("mailbox").child(user.uid).push({
          sender: "CLC Multimedia",
          message:
            "Chúc mừng bạn đã đăng ký tài khoản thành công! Hãy vào Hồ sơ và thực hiện đủ 3 bước xác minh để có thể sử dụng các chức năng khác của MyCLC nhé!",
          timestamp: moment().valueOf(),
        });
      }
      const data = user.providerData.find((item) => {
        return item.providerId === "google.com";
      });
      if (data) {
        await database
          .ref()
          .child("users")
          .child(user.uid)
          .child("personal")
          .child("email")
          .once("value")
          .then((snapshot) => {
            if (!snapshot.exists()) {
              database
                .ref()
                .child("users")
                .child(user.uid)
                .child("personal")
                .update({
                  email: data.email,
                });
            }
          });

        await database
          .ref()
          .child("users")
          .child(user.uid)
          .child("personal")
          .child("fullName")
          .once("value")
          .then((snapshot) => {
            if (!snapshot.exists()) {
              database
                .ref()
                .child("users")
                .child(user.uid)
                .child("personal")
                .update({
                  fullName: data.displayName,
                });
            }
          });

        await database
          .ref()
          .child("users")
          .child(user.uid)
          .child("personal")
          .child("avatar")
          .once("value")
          .then((snapshot) => {
            if (!snapshot.exists()) {
              database
                .ref()

                .child("users")
                .child(user.uid)
                .child("personal")
                .update({
                  avatar: data.photoURL,
                });
            }
          });
      }
    });
  } catch (err) {
    console.log(err);
    onError();
  }
};
