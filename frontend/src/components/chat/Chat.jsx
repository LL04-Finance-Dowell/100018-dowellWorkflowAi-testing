import { useState } from "react";
import style from "../chat/chat.module.css";
const Chat = () => {
  const [on, setOn] = useState(false);
  return (
    <>
      <div onClick={() => setOn(!on)} className={style.chat}>
        <span className={style.alert}>.</span>
        Chat
      </div>
      {on && (
        <div
          style={{
            border: "1px solid black",
            width: "220px",
            height: "220px",
            bottom: "0",
            right: "0",
            position: "fixed",
            zIndex: "1",
            marginBottom: "45px",
          }}
        >
          heloo
        </div>
      )}
    </>
  );
};

export default Chat;
