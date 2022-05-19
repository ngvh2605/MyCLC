import {
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { DefaultGenerics, StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
  ChannelList,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import "stream-chat-react/dist/css/index.css";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";
import { auth } from "../../firebase";
import "./ChatPage.scss";

const api_key = "u6nz6buysmyr";

const ChatPage: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const { isVerify, avatarVerify, fullName, avatarUrl, allowCreateEvent } =
    useCheckUserInfo(userId);

  const [client, setClient] = useState<StreamChat<DefaultGenerics>>(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(api_key);
      await chatClient.connectUser(
        {
          id: userId,
          name: auth.currentUser.displayName,
          image: auth.currentUser.photoURL,
        },
        chatClient.devToken(userId)
      );

      const chatChannel = chatClient.channel("messaging", "travel", {
        name: "Awesome channel about traveling",
        members: [userId],
      });

      await chatChannel.watch();

      setChannel(chatChannel);
      setClient(chatClient);
    }

    if (userId) init();

    return () => {
      try {
        client.disconnectUser();
      } catch (err) {}
    };
  }, [userId]);

  return (
    <IonPage id="chat-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>

          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scroll-y="false">
        {!!client && !!channel && (
          <Chat client={client} theme="messaging light" customStyles={{}}>
            <Channel channel={channel}>
              <Window>
                <MessageInput />
                {/* <ChannelHeader
                  MenuIcon={() => {
                    return <></>;
                  }}
                /> */}
                <MessageList />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
      </IonContent>
    </IonPage>
  );
};

export default ChatPage;
