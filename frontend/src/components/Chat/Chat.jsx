import React, { useState } from "react";
import { useEffect } from "react";

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

    fetch('https://100096.pythonanywhere.com/send/1/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message,
        product: modals.product,
        portfolio: modals.portfolio
      })
    })
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
    <div className="bg-white ">
      <div>
        <button
          className="fixed bottom-14 right-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 mx-5 rounded-full h-14 w-14"
          onClick={handleButtonClick}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            class="bi bi-chat-square-text h-6 w-6"
            viewBox="0 0 16 16"
          >
            {" "}
            <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z" />{" "}
            <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z" />{" "}
          </svg>
        </button>

        {isPopupOpen && (
          <div className="fixed inset-0 bg-gray-500 opacity-0">
            <div className="absolute inset-0" onClick={handlePopupClose}></div>
          </div>
        )}

        {isPopupOpen && (
          <div className="fixed bottom-36 right-20 bg-white w-96 h-80 rounded-lg shadow-lg p-4">
            <div className="h-full overflow-y-auto">
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4">
                  <h2 className="text-xl font-bold mb-4">
                    Chat with Customers Stories
                  </h2>
                  <p className="text-md font-normal mb-4">
                    Hi ! How Can I Help You !!!
                  </p>

                  <div className="mb-4">
                    <button
                      className="px-8 py-3 bg-blue-500 text-white rounded-full w-full hover:bg-blue-600 mt-16"
                      onClick={handleNestedButtonClick}
                    >
                      Chat Now
                    </button>
                  </div>
                  <h1 className="text-sm text-center font-bold mb-4">
                    Powered by Dowell
                  </h1>
                </div>
              </div>
            </div>
          </div>
        )}

        {isNestedPopupOpen && (
          <div
            className="fixed inset-0 bg-gray-500]"
            onClick={handleNestedPopupClose}
          ></div>

        )}

        {isNestedPopupOpen && (
          <div className="fixed bottom-36 right-20 bg-white w-96 h-96 rounded-lg shadow-lg p-4">
            <div className="h-full overflow-y-auto">
              <div className="h-full">
                <div className="h-10">
                  <h2 className="text-lg font-bold mb-4">Chat with us</h2>
                  <h2 className="text-lg font-bold mb-4">Product Name : {modals.product}</h2>
                  <h2 className="text-lg font-bold mb-4">Portfolio No : {modals.portfolio}</h2>
                  <div className="chat-messages">
                    {messages.map((msg, idx) => (
                      <div key={idx}>
                        <p
                          className={
                            msg.sender === ""
                              ? "text-end font-bold"
                              : "font-bold"
                          }
                        >
                          {msg.text}
                        </p>
                        <small className="font-bold text-md">
                          {msg.sender}
                        </small>
                      </div>
                    ))}
                  </div>
                  <div className="h-20 absolute bottom-0 left-0 w-full">
                    <div className="flex p-4">
                      <input
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        type="text"
                        className="flex-grow border-gray-400 border rounded-lg px-3 py-2 mr-2"
                        placeholder="Type your message here"
                      />
                      <button
                        onClick={handleMessageSend}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
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