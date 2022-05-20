import { useState, useEffect } from "react";
import { AvatarProps, getWholeChar } from "stream-chat-react";
import { DefaultStreamChatGenerics } from "stream-chat-react/dist/types/types";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../../auth";

const CustomAvatar = <
  StreamChatGenerics extends DefaultStreamChatGenerics = DefaultStreamChatGenerics
>(
  props: AvatarProps<StreamChatGenerics>
) => {
  const {
    image,
    name,
    onClick = () => undefined,
    onMouseOver = () => undefined,
    shape = "circle",
    size = 32,
  } = props;

  const { userId } = useAuth();
  const history = useHistory();
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setError(false);
    setLoaded(false);
  }, [image]);

  const nameStr = name?.toString() || "";
  const initials = getWholeChar(nameStr, 0);

  return (
    <div
      className={`str-chat__avatar str-chat__avatar--${shape}`}
      data-testid="avatar"
      onClick={() => {
        // console.log(props);
        if (userId !== props.user.id && (!props.size || props.size === 32))
          history.push(`/my/user/${props.user.id}`);
      }}
      onMouseOver={onMouseOver}
      style={{
        flexBasis: `${size}px`,
        fontSize: `${size / 2}px`,
        height: `${size}px`,
        lineHeight: `${size}px`,
        width: `${size}px`,
      }}
      title={name}
    >
      {image && !error ? (
        <img
          alt={initials}
          className={`str-chat__avatar-image${
            loaded ? " str-chat__avatar-image--loaded" : ""
          }`}
          data-testid="avatar-img"
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
          src={image}
          style={{
            flexBasis: `${size}px`,
            height: `${size}px`,
            objectFit: "cover",
            width: `${size}px`,
          }}
        />
      ) : (
        <div
          className="str-chat__avatar-fallback"
          data-testid="avatar-fallback"
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default CustomAvatar;
