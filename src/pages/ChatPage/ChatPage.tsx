import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { StreamChat } from "stream-chat";
import {
  Chat,
  Channel,
  ChannelHeader,
  MessageInput,
  MessageList,
  Thread,
  Window,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import "stream-chat-react/dist/css/index.css";
import { useAuth } from "../../auth";
import useCheckUserInfo from "../../common/useCheckUserInfo";

const api_key = "up3dxa5vata5";

const client = StreamChat.getInstance(api_key);

const ChatPage: React.FC = () => {
  const { userId, userEmail } = useAuth();
  const { isVerify, avatarVerify, fullName, avatarUrl, allowCreateEvent } =
    useCheckUserInfo(userId);

  const [channel, setChannel] = useState<any>();

  useEffect(() => {
    if (fullName) {
      client
        .connectUser(
          {
            id: userId,
            name: fullName,
            image: avatarUrl || "",
          },
          client.devToken(userId)
        )
        .then(async () => {
          // const temp = client.channel("messaging", "travel", {
          //   name: "Awesome channel about traveling",
          // });
          // setChannel(temp);
          // await temp.watch();
        });
    }
  }, [fullName]);

  return (
    <IonPage>
      <IonContent>
        {!!client && !!channel && (
          <Chat client={client} theme="messaging light">
            <Channel channel={channel}>
              <Window>
                <ChannelHeader />
                <MessageList />
                <MessageInput />
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
