import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiLink, BiCopy } from 'react-icons/bi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setAllProcesses } from '../../../features/app/appSlice';
import { moveItemToArchive } from '../../../services/archiveServices';
import HoverCard from '../HoverCard';
import {
  setShowGeneratedLinksPopup,
  SetArrayofLinks,
  setLinksFetched,
} from '../../../features/app/appSlice';

import { Button } from '../styledComponents';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import axios from 'axios';

const ProcessCard = ({ cardItem, title }) => {
  const { allProcesses } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [Process_id, setProcess_id] = useState();
  const [processLinkLoading, setProcessLinkLoading] = useState(false);
  const [copyprocessLoading, setcopyprocessLoading] = useState(false);


  const handleProcessItemClick = async (item) => {
    if (item.processing_state === 'draft' && item.workflow_construct_ids)
      navigate(
        `/workflows/new-set-workflow?id=${item._id}&state=${item.processing_state
        }${item.isFromLocalStorage ? '&local=true' : ''}`
      );
  };




  const handleCopyProcess = async (item) => {
    console.log(item)
    getCopyProcess(item._id)
    setcopyprocessLoading(true);

  };

  async function getCopyProcess(process_id) {

    try {
      const response = await axios.post(`https://100094.pythonanywhere.com/v1/processes/${process_id}/copies/`, {
        created_by: userDetail?.userinfo?.username,
        portfolio: "portfolioofuser"
      });

      if (response.status === 201) {
        toast.info(response.data);
        console.log(response.data);

        setcopyprocessLoading(false);


      } else {
        console.log("Post request failed. Status code:", response.status);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  }





  const handleGetLinksClick = async (item) => {
    getProcessLinks(item._id);
    dispatch(setShowGeneratedLinksPopup(true));
    setProcessLinkLoading(true);
  };

  // useEffect(() => {
  //   if (Process_id) {
  //     dispatch(setLinksFetched(true));
  //     getProcessLinks(Process_id);
  //   }
  // }, [Process_id]); // Added Process_id as dependency

  function getProcessLinks(process_id) {
    fetch(
      `https://100094.pythonanywhere.com/v1/processes/${process_id}/all-links/`
    )
      .then((res) => res.json())
      .then((data) => {
        dispatch(SetArrayofLinks(data));
        dispatch(setLinksFetched(true));
        setProcessLinkLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setProcessLinkLoading(false);
        toast.info('Link fetching for process failed');
      });
  }

  const handleTrashProcess = async (cardItem) => {
    const copyOfAllProcesses = [...allProcesses];
    const foundProcessIndex = copyOfAllProcesses.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundProcessIndex === -1) return;

    if (cardItem.isFromLocalStorage) {
      const savedProcessesInLocalStorage = JSON.parse(
        localStorage.getItem('user-saved-processes')
      );
      localStorage.setItem(
        'user-saved-processes',
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
    copyOfProcessToUpdate.data_type = 'Archive_Data';
    copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
    dispatch(setAllProcesses(copyOfAllProcesses));

    try {
      const response = await (
        await moveItemToArchive(cardItem._id, 'process')
      ).data;
      toast.success(response);
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info(error.response ? error.response.data : error.message);
      copyOfProcessToUpdate.data_type = 'Real_Data';
      copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
      dispatch(setAllProcesses(copyOfAllProcesses));
    }
  };

  const FrontSide = () => {
    return cardItem ? (
      <div >
        {cardItem.process_kind === "clone" && <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '14px',
          height: 'calc(50% + 30px)',
          backgroundColor: 'rgb(54, 109, 172)',
          transform: 'rotate(37deg) translate(-26px, -28px)'
        }}>
          <span style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-51%, -145%) rotate(268deg)',
            color: '#fff',
            fontSize: '10px'
          }}>Copy</span>
        </div>}
        {cardItem.process_title ? cardItem.process_title : "no item"}
      </div>
    ) : (
      "Loading..."
    );
  };

  const BackSide = () => {
    return (
      <>
        {cardItem._id ? (
          <Button onClick={() => handleProcessItemClick(cardItem)}>
            {'Open process'}
          </Button>
        ) : (
          'no item'
        )}

        {!cardItem.isFromLocalStorage &&
          cardItem.processing_state !== 'draft' && (
            <>
              {!processLinkLoading ? (
                <div
                  style={{
                    cursor: 'pointer',
                    position: 'absolute',
                    right: '0',
                    top: '0',
                  }}
                  onClick={() => handleGetLinksClick(cardItem)}
                >
                  <BiLink color='green' />
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    right: '1%',
                    top: '0',
                  }}
                >
                  <LoadingSpinner width={'1rem'} height={'1rem'} />
                </div>
              )}
            </>
          )}

        <div
          style={{
            cursor: 'pointer',
            position: 'absolute',
            right: '0',
            bottom: '0',
          }}
          onClick={() => handleTrashProcess(cardItem)}
        >
          <RiDeleteBin6Line color='red' />
        </div>

        {!cardItem.isFromLocalStorage &&
          cardItem.processing_state !== "processing" && (
            <>
              {!copyprocessLoading ? (
                <div style={{
                  cursor: "pointer",
                  position: "absolute",
                  left: "0",
                  top: "0"
                }} onClick={() => handleCopyProcess(cardItem)}>
                  <BiCopy color="black" />
                </div>
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    left: '1%',
                    top: '0',
                  }}
                >
                  <LoadingSpinner width={'1rem'} height={'1rem'} />
                </div>
              )}
            </>
          )}


      </>


    );
  };
  return (
    <HoverCard Front={FrontSide} Back={BackSide} loading={processLinkLoading} />
  );
};

export default ProcessCard;
