import React, { useState } from "react";
import { useEffect } from "react";
import styles from './Chat.module.css'
import axios from 'axios'

const Chat = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isNestedPopupOpen, setIsNestedPopupOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [modals, setModal] = useState([]);


  useEffect(() => {
    fetch('https://100096.pythonanywhere.com/send/1/')
      .then(res => res.json())
      .then(data => setModal(data))
  }, [])


  const handleMessageSend = () => {
    if (message.trim() === "") {
      return;
    }
    console.log(message)
    console.log(modals.product, modals.port)
    axios.post('https://100096.pythonanywhere.com/send/1/',
      {
        message,
        product: modals.product,
        portfolio: modals.portfolio
      }
    )

      .then(res => res.json())
      .then(data => {
        const newMessage = { text: message, sender: "" };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);

        // Clear the input field

        setMessage("");
      })
      .catch(err => console.log(err));
  }
  const handleButtonClick = () => {
    setIsPopupOpen(true);
  };

  const handleNestedButtonClick = () => {

    setIsNestedPopupOpen(true);
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleNestedPopupClose = () => {
    setIsNestedPopupOpen(false);
  };
  useEffect(() => {
    fetch('https://100096.pythonanywhere.com/send/1/')
      .then(res => res.json())
      .then(data => console.log(data))
  }, [])






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
          <div className={styles.First_popuo}>
            <div className={styles.First_inner} onClick={handlePopupClose}></div>
          </div>
        )}

        {isPopupOpen && (
          <div className={styles.Second_popuo}>
            <div className={styles.my_element}>
              <div className={styles.my_element_one}>
                <div className={styles.my_element_two}>
                  <div className={styles.Second_popuo}>
                    <button onClick={handlePopupClose} className={styles.close_button}>×</button>
                  </div>
                  <h2 className={styles.my_element_text}>
                    Chat with Customers Stories
                  </h2>
                  <p className={styles.First_p}>
                    Hi ! How Can I Help You !!!
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <button
                      className={styles.Chat_Now}
                      onClick={handleNestedButtonClick}
                    >
                      Chat Now
                    </button>
                  </div>
                  <h1 className={styles.Chat_h1}>
                    Powered by Dowell
                  </h1>
                </div>
              </div>
            </div>
          </div>
        )}

        {isNestedPopupOpen && (
          <div
            className={styles.Second_div}
            onClick={handleNestedPopupClose}
          ></div>

        )}

        {isNestedPopupOpen && (
          <div className={styles.Second_popuo_one}>
            <button onClick={handleNestedPopupClose} className={styles.close_button}>×</button>
            <div className={styles.my_element}>
              <div >
                <div style={{ height: "10%" }}>
                  <h2 className={styles.Text_Class}>Chat with us</h2>
                  <h2 className={styles.Text_Class}>Product Name : {modals.product}</h2>
                  <h2 className={styles.Text_Class}>Portfolio No : {modals.portfolio}</h2>
                  <div className={styles.chat - messages}>
                    {messages.map((msg, idx) => (
                      <div key={idx}>
                        <p
                          className={
                            msg.sender === ""
                              ? styles.Sender_sms
                              : styles.Text
                          }
                        >
                          {msg.text}
                        </p>
                        <small className={styles.Large_Text}>
                          {msg.sender}
                        </small>
                      </div>
                    ))}
                  </div>
                  <div className={styles.Chat_Container}>
                    <div className={styles.Another}>
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className={styles.Second_last}
                        placeholder="Type your message here"
                      />
                      <button
                        onClick={handleMessageSend}
                        className={styles.Last}
                      >
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;