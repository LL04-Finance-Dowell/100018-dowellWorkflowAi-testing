import React, { useState } from 'react';
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
  SetProcessDetail,
  setshowsProcessDetailPopup,
  setDetailFetched,
  SetArrayofLinks,
  setLinksFetched,
} from '../../../features/app/appSlice';

import { Button } from '../styledComponents';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import axios from 'axios';
import { api_url } from '../../../httpCommon/httpCommon';
import { productName } from '../../../utils/helpers';

const ProcessCard = ({ cardItem, title }) => {
  const { allProcesses } = useSelector((state) => state.app);
  const { userDetail } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [Process_id, setProcess_id] = useState();
  const [processLinkLoading, setProcessLinkLoading] = useState(false);
  const [copyprocessLoading, setcopyprocessLoading] = useState(false);
  const [processDetailLoading, setProcessDetailLoading] = useState(false);

  console.log(allProcesses)
  const handleProcessItemClick = async (item) => {
    if (item.processing_state === 'draft' && item.workflow_construct_ids) {
      navigate(
        `/workflows/new-set-workflow?id=${item._id}&state=${item.processing_state
        }${item.isFromLocalStorage ? '&local=true' : ''}`
      );
      return
    }

    getProcessDetail(item._id, item.process_title)
    dispatch(setshowsProcessDetailPopup(true));
    setProcessDetailLoading(true);
  };

  function getProcessDetail(process_id, process_title) {

    axios
      .get(`https://100094.pythonanywhere.com/v1/processes/${process_id}/`)
      .then((response) => {


        dispatch(SetProcessDetail(response.data));
        setProcessDetailLoading(false);
        dispatch(setDetailFetched(true));
      })
      .catch((error) => {
        console.log(error);
        setProcessDetailLoading(false);
        toast.info(
          process_title ?
            `Failed to fetch details for ${process_title}` :
            'Failed to fetch process details'
        )
      });
  }




  const handleCopyProcess = async (item) => {

    getCopyProcess(item._id)
    setcopyprocessLoading(true);

  };

  async function getCopyProcess(process_id) {

    try {
      const response = await axios.post(`${api_url}processes/${process_id}/copies/`, {
        created_by: userDetail?.userinfo?.username,
        portfolio: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0]?.portfolio_name,
      });

      if (response.status === 201) {
        toast.info(response.data);


        setcopyprocessLoading(false);


      } else {
        console.log("Post request failed. Status code:", response.status);
        setcopyprocessLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setcopyprocessLoading(false);
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
      `${api_url}processes/${process_id}/all-links/`
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
        {cardItem._id && !processDetailLoading ? (
          <Button onClick={() => handleProcessItemClick(cardItem)}>
            {'Open process'}
          </Button>
        ) : (
          <div
          // style={{
          //   position: 'absolute',
          //   right: '1%',
          //   top: '0',
          // }}
          >
            <LoadingSpinner width={'1rem'} height={'1rem'} />
          </div>
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
    <HoverCard Front={FrontSide} Back={BackSide} loading={processLinkLoading || processDetailLoading} />
  );
};

export default ProcessCard;
