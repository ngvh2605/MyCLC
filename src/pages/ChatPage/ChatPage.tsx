import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonLoading,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React, { useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router";
import { DefaultGenerics, StreamChat } from "stream-chat";
import {
  Channel,
  ChannelHeader,
  Chat,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { useAuth } from "../../auth";
import { auth } from "../../firebase";
import { chatAPI } from "./ChatCustom/ChatAPI";
import CustomAvatar from "./ChatCustom/CustomAvatar";
import "./ChatPage.scss";

interface RouteParams {
  id: string;
}

interface stateType {
  from: string;
}

const ChatPage: React.FC = () => {
  const location = useLocation<stateType>();
  const history = useHistory();
  const contentRef = useRef<any>();
  const { userId, userEmail } = useAuth();
  const { id } = useParams<RouteParams>();

  const [client, setClient] = useState<StreamChat<DefaultGenerics>>(null);
  const [channel, setChannel] = useState(null);

  useEffect(() => {
    console.log("id", id);
  }, [id]);

  useEffect(() => {
    async function init() {
      const chatClient = StreamChat.getInstance(chatAPI);

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

      // await chatClient.partialUpdateUser({
      //   id: userId,
      //   set: { role: "admin" },
      // });

      setChannel(chatChannel);
      setClient(chatClient);
    }

    if (userId && location.state && location.state.from === "ChatHomePage")
      init().then(() => {
        scrollToBottomOnInit();
      });
    else history.goBack();

    return () => {
      try {
        client.disconnectUser();
      } catch (err) {}
    };
  }, [userId]);

  function scrollToBottomOnInit() {
    setTimeout(() => {
      contentRef.current.scrollToBottom(0);
    }, 100);
  }
  return (
    <IonPage id="chat-page">
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/my/chat" text="" />
          </IonButtons>
          <IonTitle>Phòng chat</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent ref={contentRef} scrollY={false}>
        <IonButton
          hidden
          onClick={() => {
            scrollToBottomOnInit();
          }}
        >
          Debug
        </IonButton>
        {!!client && !!channel && (
          <Chat client={client} theme="messaging light" customStyles={{}}>
            <Channel
              channel={channel}
              Avatar={CustomAvatar}
              EmojiPicker={() => {
                return <></>;
              }}
            >
              <Window>
                <ChannelHeader
                  MenuIcon={() => {
                    return <></>;
                  }}
                />
                <MessageList />
                <MessageInput />
              </Window>
              <Thread />
            </Channel>
          </Chat>
        )}
        <IonLoading isOpen={!client || !channel} />
      </IonContent>
      {/* {!!client && !!channel && (
        <IonFooter id="chat-footer">
          <IonToolbar className="ion-no-padding" style={{}}>
            <Chat client={client} theme="messaging light" customStyles={{}}>
              <Channel
                channel={channel}
                EmojiPicker={() => {
                  return <></>;
                }}
              >
                <MessageInput />
              </Channel>
            </Chat>
          </IonToolbar>
        </IonFooter>
      )} */}
    </IonPage>
  );
};

export default ChatPage;
