
import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from './Chat.module.css'
import { BiSend, BiMinimize } from "react-icons/bi";
import axios from 'axios'
import { useTranslation } from "react-i18next";

const Chat = () => {
  const { session_id } = useSelector((state) => state.auth);

  const { t } = useTranslation();
  const [apiMessages, setapiMessages] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [modals, setModal] = useState([]);
  const [hasChatStarted, setHasChatStarted] = useState(false);

  useEffect(() => {
    IntilizingRoom(session_id)
  }, [session_id]);

  const IntilizingRoom = async (session_id) => {
    try {
      const response = await fetch(`https://100096.pythonanywhere.com/d-chat/Workflow-AI/?session_id=${session_id}`);
      if (response.ok) {
        const data = await response.json();
        setModal(data);
      } else {
        throw new Error('Network response was not OK');
      }
    } catch (error) {
      // Perform any necessary error handling logic without logging the error
      // For example, you can show a user-friendly error message
      // or perform an alternative action.
      console.log('Initialising room failed: ', error)
    }
  };

  const handleMessageSend = () => {
    if (message.trim() === "") {
      return;
    }
    axios
      .post(`https://100096.pythonanywhere.com/send_message/${modals.room_pk}/`, {
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

    setHasChatStarted(true)

  };

  useEffect(() => {
    if (!modals.room_pk) return

    fetchMessages(modals.room_pk);
  }, [modals]);

  useEffect(() => {
    if (!modals.room_pk) return
    const interval = setInterval(() => {
      fetchMessages(modals.room_pk);
    }, 2000); // Repeat every 2 seconds

    return () => clearInterval(interval); // This is important, it clears the interval on unmount
  }, [modals]);

  async function fetchMessages(roomId) {
    const response = await fetch(`https://100096.pythonanywhere.com/send_message/${roomId}/`);

    if (!response.ok) {
      throw new Error(`Failed to fetch messages for room ${roomId}: ${response.statusText}`);
    }

    const data = await response.json();
    setapiMessages(data.messages);
  }





  const handleButtonClick = () => {

    if (hasChatStarted) {
      setIsNestedPopupOpen(true);
    }
    else {
      setIsPopupOpen(true);

    }
  };

  const handleNestedButtonClick = () => {
    if (!isNestedPopupOpen) {
      setIsNestedPopupOpen(true);
      IntilizingRoom(session_id)
    }
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  function handleMinimizePopup() {
    // const storemessages = [...messages];
    // console.log(storemessages)
    // localStorage.setItem('messages', JSON.stringify(storemessages));
    // setIsNestedPopupOpen(false);
  }



  function handleNestedPopupClose() {
    if (hasChatStarted) {
      setIsPopupOpen(false);
      setIsNestedPopupOpen(false);
      setapiMessages([]); // Clear the apiMessages state
    } else {
      setIsNestedPopupOpen(false);
      setapiMessages([]); // Clear the apiMessages state
    }
  }




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
            className={styles.SVG_class}
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
                {t("Chat with Dowell")}
                {<img style={{ marginLeft: "10px" }} height='20px' width='20px' src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/cropped-Playstore_logo_2.png?resize=100%2C100&ssl=1" />}
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
              <img style={{ marginLeft: "10px" }} height='20px' width='20px' src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/cropped-Playstore_logo_2.png?resize=100%2C100&ssl=1" />
              {/* <h2 className={styles.Text_Class}>{t("Chat with us")}</h2>
              <h2 className={styles.Text_Class}>{t("Product Name")} : {modals.product}</h2> */}
            </div>
            {/* <h2 className={styles.Text_Class}>{t("Portfolio No")} : {modals.portfolio}</h2> */}
            <div className={styles.chat_messages}>
              {apiMessages.map((msg, idx) => {
                // console.log("apiMessage in map:", msg); // Add this line
                return (
                  <div key={idx}>
                    <p
                      className={
                        msg.side === true
                          ? styles.Text
                          : styles.Sender_sms
                      }
                    >
                      {msg.message}
                    </p>
                    <small className={styles.Large_Text}>
                      {msg.sender}
                    </small>
                  </div>
                );
              })}

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
