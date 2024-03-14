import React, { useState } from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { BiLink, BiCopy } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import { toast } from "react-toastify";

import { moveItemToArchive } from "../../../services/archiveServices";
import HoverCard from "../HoverCard";

import { Button } from "../styledComponents";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import axios from "axios";
import { api_url } from "../../../httpCommon/httpCommon";
import { productName } from "../../../utils/helpers";
import { Modal } from 'react-bootstrap';
import { SetProcessDetail, setAllProcesses } from "../../../features/processes/processesSlice";
import { SetArrayofLinks, setDetailFetched, setLinksFetched, setShowGeneratedLinksPopup } from "../../../features/app/appSlice";

const ProcessCard = ({ cardItem, title }) => {
  const { allProcesses } = useSelector((state) => state.processes);
  const { userDetail } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [Process_id, setProcess_id] = useState();
  const [processLinkLoading, setProcessLinkLoading] = useState(false);
  const [copyprocessLoading, setcopyprocessLoading] = useState(false);
  const [processDetailLoading, setProcessDetailLoading] = useState(false);

  ///pop up
  const [isPopupVisible, setPopupVisibility] = useState(false);
  // // console.log(allProcesses)
  const handleProcessItemClick = async (item) => {
  //  console.log("urlforworkflow", `/workflows/new-set-workflow?id=${item._id}&state=${item.processing_state
  //     }${item.isFromLocalStorage ? "&local=true" : ""}`)
    // if (item.processing_state === "draft" && item.workflow_construct_ids) {
    //   navigate(
    //     `/workflows/new-set-workflow?id=${item._id}&state=${item.processing_state
    //     }${item.isFromLocalStorage ? "&local=true" : ""}`
    //   );
    //   return;
    // }
    // console.log("process_id", item._id, item.process_title, item.processing_state)
    getProcessDetail(item._id, item.process_title);
    console.log(item._id);
    console.log(item);
    // dispatch(setshowsProcessDetailPopup(true));
    setProcessDetailLoading(true);
  };

  function getProcessDetail(process_id, process_title) {
    axios
      .get(`https://100094.pythonanywhere.com/v2/processes/${process_id}/`)
      .then((response) => {
        dispatch(SetProcessDetail(response.data));
        setProcessDetailLoading(false);
        dispatch(setDetailFetched(true));
        navigate("/processes/processdetail");
      })
      .catch((error) => {
        // console.log(error);
        setProcessDetailLoading(false);
        toast.info(
          process_title
            ? `Failed to fetch details for ${process_title}`
            : "Failed to fetch process details"
        );
      });
  }

  const handleCopyProcess = async (item) => {
    getCopyProcess(item._id);
    setcopyprocessLoading(true);
  };

  async function getCopyProcess(process_id) {
    try {
      const response = await axios.post(
        `${api_url}processes/${process_id}/copies/`,
        {
          created_by: userDetail?.userinfo?.username,
          portfolio:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.portfolio_name
              : userDetail?.portfolio_info[0]?.portfolio_name,
        }
      );

      if (response.status === 201) {
        toast.info(response.data);

        setcopyprocessLoading(false);
      } else {
        // console.log("Post request failed. Status code:", response.status);
        setcopyprocessLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setcopyprocessLoading(false);
    }
  }

  const handleGetLinksClick = async (item) => {
    // console.log("the item is ", item);
    // createProcessLinks(item._id, item.created_by);
    setPopupVisibility(false)
    setProcessLinkLoading(true);
    await getProcessLinks(item._id);
    dispatch(setShowGeneratedLinksPopup(true));


  };

  // useEffect(() => {
  //   if (Process_id) {
  //     dispatch(setLinksFetched(true));
  //     getProcessLinks(Process_id);
  //   }
  // }, [Process_id]); // Added Process_id as dependency

  function createProcessLinks(process_id, created_by) {
    const requestBody = {
      user_name: created_by,
    };
    fetch(`${api_url}processes/${process_id}/user-link/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log("the response for fetching process is ", data);
        dispatch(SetArrayofLinks(data));
        dispatch(setLinksFetched(true));
        setProcessLinkLoading(false);
      })
      .catch((err) => {
        // console.log(err);
        setProcessLinkLoading(false);
        toast.info("Link fetching for process failed");
      });
  }
  async function getProcessLinks(process_id) {
    // console.log("the process id is ", process_id);
    try {
      // const response = await fetch(`${api_url}processes/${process_id}/all-links/`);
      // if (!response.ok) {
      //   throw new Error("Network response was not ok");
      // }
      // const data = await response.json();
      // // console.log("the response for fetching process is ", response);
      const data = [{ "Link 1": `https://ll04-finance-dowell.github.io/100018-dowellWorkflowAi-testing/#/processes/process-import/${process_id}` }]
      // console.log("the process link is ", data)
      dispatch(SetArrayofLinks(data));
      dispatch(setLinksFetched(true));
      setProcessLinkLoading(false);
    } catch (err) {
      console.error(err);
      setProcessLinkLoading(false);
      toast.info("Link fetching for process failed");
    }
  }


  const handleTrashProcess = async (cardItem) => {
    const copyOfAllProcesses = [...allProcesses];
    const foundProcessIndex = copyOfAllProcesses.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundProcessIndex === -1) return;

    if (cardItem.isFromLocalStorage) {
      const savedProcessesInLocalStorage = JSON.parse(
        localStorage.getItem("user-saved-processes")
      );
      localStorage.setItem(
        "user-saved-processes",
        JSON.stringify(
          savedProcessesInLocalStorage.filter(
            (process) => process._id !== cardItem._id
          )
        )
      );
      dispatch(
        setAllProcesses(
          copyOfAllProcesses.filter((process) => process._id !== cardItem._id)
        )
      );
      return;
    }

    const copyOfProcessToUpdate = { ...copyOfAllProcesses[foundProcessIndex] };
    copyOfProcessToUpdate.data_type = "Archive_Data";
    copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
    dispatch(setAllProcesses(copyOfAllProcesses));

    try {
      const response = await (
        await moveItemToArchive(cardItem._id, "process")
      ).data;
      toast.success(response);
    } catch (error) {
      // console.log(error.response ? error.response.data : error.message);
      toast.info(error.response ? error.response.data : error.message);
      copyOfProcessToUpdate.data_type = "Real_Data";
      copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
      dispatch(setAllProcesses(copyOfAllProcesses));
    }
  };

  const FrontSide = () => {
    return cardItem ? (
      <div style={{ wordWrap: "break-word", width: "100%" }}>
        {cardItem.process_kind === "clone" && (
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "14px",
              height: "calc(50% + 30px)",
              backgroundColor: "rgb(54, 109, 172)",
              transform: "rotate(37deg) translate(-26px, -28px)",
            }}
          >
            <span
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-51%, -145%) rotate(268deg)",
                color: "#fff",
                fontSize: "10px",
              }}
            >
              Copy
            </span>
          </div>
        )}
        {cardItem.process_title ? cardItem.process_title : "no item"}
      </div>
    ) : (
      "Loading..."
    );
  };

  const BackSide = () => {
    const [showModal, setShowModal] = useState(false);
    const [cardItemToDelete, setCardItemToDelete] = useState(null);

    const handleCloseModal = () => {
      setShowModal(false);
    };

    const handleDelete = () => {
      setShowModal(true);
    };

    return (
      <>
        {cardItem._id && !processDetailLoading ? (
          <Button onClick={() => handleProcessItemClick(cardItem)}>
            {"Open process"}
          </Button>
        ) : (
          <div
          // style={{
          //   position: 'absolute',
          //   right: '1%',
          //   top: '0',
          // }}
          >
            <LoadingSpinner width={"1rem"} height={"1rem"} />
          </div>
        )}

        {!cardItem.isFromLocalStorage &&
          cardItem.processing_state !== "draft" && (
            <>
              {!processLinkLoading ? (
                <>
                  <Tooltip id={`share-${cardItem._id}`} content="Share Process" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
                  <div
                    anchorId={cardItem._id}
                    data-tooltip-id={`share-${cardItem._id}`}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      right: "0",
                      top: "0",
                    }}
                    onClick={() => setPopupVisibility(true)}
                  >
                    <BiLink color="green" />
                  </div>
                </>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    right: "1%",
                    top: "0",
                  }}
                >
                  <LoadingSpinner width={"1rem"} height={"1rem"} />
                </div>
              )}
            </>
          )}
        <Tooltip id={`delete-${cardItem._id}`} content="Delete Process" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
        <div
          anchorId={cardItem._id}
          data-tooltip-id={`delete-${cardItem._id}`}
          style={{
            cursor: "pointer",
            position: "absolute",
            right: "0",
            bottom: "0",
          }}
          onClick={handleDelete}
        >
          <RiDeleteBin6Line color="red" />
        </div>
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
          </Modal.Header>
          <Modal.Body>Are you sure you want to delete this item?</Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleTrashProcess(cardItem)}>
              Delete
            </Button>
          </Modal.Footer>
        </Modal>

        {!cardItem.isFromLocalStorage &&
          cardItem.processing_state !== "processing" && (
            <>
              {!copyprocessLoading ? (
                <>
                  <Tooltip id={`copy-${cardItem._id}`} content="Copy Process" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
                  <div
                    anchorId={cardItem._id}
                    data-tooltip-id={`copy-${cardItem._id}`}
                    style={{
                      cursor: "pointer",
                      position: "absolute",
                      left: "0",
                      top: "0",
                    }}
                    onClick={() => handleCopyProcess(cardItem)}
                  >
                    <BiCopy color="black" />
                  </div>
                </>
              ) : (
                <div
                  style={{
                    position: "absolute",
                    left: "1%",
                    top: "0",
                  }}
                >
                  <LoadingSpinner width={"1rem"} height={"1rem"} />
                </div>
              )}
            </>
          )}
        <div>
          <div style={popupStyle}>
            <p>Are you sure you want to share your process?</p>
            <div style={{ display: "flex", justifyContent: "space-around" }}>
              <button onClick={() => handleGetLinksClick(cardItem)} style={{ marginLeft: "5px" }}>Yes</button>
              <button onClick={() => setPopupVisibility(false)}>No</button>
            </div>

          </div>
        </div>
      </>
    );
  };

  const popupStyle = {
    position: "absolute", // Set the popup to absolute
    top: "0",
    left: "0",
    width: "100%", // Fill the entire parent container width
    height: "100%", // Fill the entire parent container height
    background: "white",
    padding: "20px",
    borderRadius: "5px",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.2)",
    zIndex: "1000",
    display: isPopupVisible ? "block" : "none",
  };
  const parentContainerStyle = {
    position: "relative", // Set the parent container to relative
    width: "100vw", // Cover the entire viewport width
    height: "100vh", // Cover the entire viewport height
    border: "red 5px solid"
  };

  return (
    <HoverCard
      Front={FrontSide}
      Back={BackSide}
      loading={processLinkLoading || processDetailLoading}
    />
  );
};

export default ProcessCard;
