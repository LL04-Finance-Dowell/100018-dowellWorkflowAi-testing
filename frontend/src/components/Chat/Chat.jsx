
import React, { useState } from "react";
import { useEffect } from "react";
import styles from './Chat.module.css'
import { BiSend, BiMinimize } from "react-icons/bi";
import axios from 'axios'
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { t } = useTranslation();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [modals, setModal] = useState([]);

  useEffect(() => {
    fetch("https://100096.pythonanywhere.com/d-chat/Workflow-AI/?session_id=36ht78fmzfzgovk1lq5rqeozkpees1qi")
      .then((res) => res.json())
      .then((data) => setModal(data));
  }, []);

var room_id = modals.room_pk

const handleMessageSend = () => {
  if (message.trim() === "") {
    return;
  }
  console.log(room_id)
    console.log(message);
    console.log(modals.product, modals.user_id);
    axios
      .post(`https://100096.pythonanywhere.com/send_message/${room_id}/`, {
        message,
        user_id: modals.user_id
      })
      .then((res) => {
        const newMessage = { text: message, sender: "" };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Clear the input field
        setMessage("");
      })
      .catch((err) => console.log(err));
  };
  const handleButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handleNestedButtonClick = () => {

    setIsNestedPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  function handleMinimizePopup() {
    const storemessages = [...messages];
    console.log(storemessages)
    localStorage.setItem('messages', JSON.stringify(storemessages));
    setIsNestedPopupOpen(false);
  }

  function handleNestedPopupClose() {
    localStorage.removeItem('messages');
    setMessages([]);
    setIsNestedPopupOpen(false);
  }

  useEffect(() => {
    // const messages = localStorage.getItem('messages');
    // if (messages) {
    //   setMessages(JSON.parse(messages));
    // }
  }, []);

  // useEffect(() => {
  //   fetch('https://100096.pythonanywhere.com/send_message/692/')
  //     .then(res => res.json())
  //     .then(data => console.log(data))
  // }, [])




  return (
    <div className={styles.Main_div}>
      <div>
        <button
          className={styles.Chat_button}
          onClick={handleButtonClick}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class={styles.SVG_class}
            viewBox="0 -2 52 52"
          >
            {" "}
            <path color="black" d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />{" "}
            <path color="black" d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />{" "}
          </svg>
        </button>

        {isPopupOpen && (
          <div className={styles.First_popuopAuto_Close}>
            <div className={styles.FirstAutoClose_inner} onClick={handlePopupClose}></div>
          </div>
        )}

        {isPopupOpen && (
          <div className={styles.First_popuop}>


            <div className={styles.First_popuop_Parent}>

              <button onClick={handlePopupClose} className={styles.close_button}>×</button>


              <h2 className={styles.First_popuop_Stories}>
                {t("Chat with Dowell")} {<img style={{marginLeft:"10px"}} height='20px' width='20px' src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/cropped-Playstore_logo_2.png?resize=100%2C100&ssl=1"/>}
              </h2>
              <p className={styles.First_popuop_sms}>
                {t("Hi ! How Can I Help You !!!")}
              </p>


              <button
                className={styles.Chat_Now_Button}
                onClick={handleNestedButtonClick}
              >
                {t("Chat Now")}
              </button>

              <h1 className={styles.Powered_text}>
                {t("Powered by Dowell")}
              </h1>
            </div>


          </div>
        )}

        {isNestedPopupOpen && (
          <div
            className={styles.Second_popupAutoClose}
            onClick={handleNestedPopupClose}
          ></div>

        )}

        {isNestedPopupOpen && (
          <div className={styles.Second_Popup}>
            <button onClick={handleNestedPopupClose} className={styles.close_button}>×</button>
            <button onClick={handleMinimizePopup} className={styles.minimize_button}>-</button>
            <div className={styles.Second_Popup_Parent}>
              <h2 className={styles.Text_Class}>{t("Chat with us")}</h2>
              <h2 className={styles.Text_Class}>{t("Product Name")} : {modals.product}</h2>
            </div>
            {/* <h2 className={styles.Text_Class}>{t("Portfolio No")} : {modals.portfolio}</h2> */}
            <div className={styles.chat_messages}>
              {messages.map((msg, idx) => (

                <div key={idx}>
                  <p
                    className={
                      msg.sender === ""
                        ? styles.Sender_sms
                        : styles.Text
                    }
                  >
                    {msg.text.substring(0, 35)}{msg.text.length > 35 && <br />}{msg.text.substring(35)}
                  </p>
                  <small className={styles.Large_Text}>
                    {msg.sender}
                  </small>
                </div>
              ))}
            </div>

            <div className={styles.Input_Container}>
              <input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                type="text"
                className={styles.Text_input}
                placeholder={t("Type your message here")}
              />
              <button
                onClick={handleMessageSend}
                className={styles.Send_button}
              >
                <BiSend size={25} />
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;