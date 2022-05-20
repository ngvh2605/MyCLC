import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonLoading,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
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
interface RouteParams {
  id: string;
}

const ChatPage: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const { id } = useParams<RouteParams>();

  const [client, setClient] = useState<StreamChat<DefaultGenerics>>(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    console.log("id", id);
  }, [id]);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(api_key);

      const connectionId = chatClient._getConnectionID();
      if (!connectionId) {
        await chatClient.connectUser(
          {
            id: userId,
            name: auth.currentUser.displayName,
            image: auth.currentUser.photoURL,
          },
          chatClient.devToken(userId)
        );
      }

      const chatChannel = chatClient.channel("messaging", id, {});

      await chatChannel.watch();
      await chatChannel.addMembers([{ user_id: userId }]);

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
            <IonBackButton defaultHref="/my/chat" text="" />
          </IonButtons>

          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent scroll-y="false">
        {!!client && !!channel && (
          <Chat client={client} theme="messaging light" customStyles={{}}>
            <Channel channel={channel}>
              <Window>
                {/* <ChannelHeader
                  MenuIcon={() => {
                    return <></>;
                  }}
                /> */}
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
        <IonLoading isOpen={!client || !channel} />
      </IonContent>
      {!!client && !!channel && (
        <Chat client={client} theme="messaging light" customStyles={{}}>
          <Channel channel={channel}>
            <MessageInput />
          </Channel>
        </Chat>
      )}
    </IonPage>
  );
};

export default ChatPage;
