import React, { useState, useEffect } from 'react';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { BiLink } from 'react-icons/bi';
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

const ProcessCard = ({ cardItem, title }) => {
  const { allProcesses } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [Process_id, setProcess_id] = useState();
  const [processLinkLoading, setProcessLinkLoading] = useState(false);

  const handleProcessItemClick = async (item) => {
    if (item.processing_state === 'draft' && item.workflow_construct_ids)
      navigate(
        `/workflows/new-set-workflow?id=${item._id}&state=${
          item.processing_state
        }${item.isFromLocalStorage ? '&local=true' : ''}`
      );
  };

  const handleGetLinksClick = async (item) => {
    getProcessLinks(item._id);
    dispatch(setShowGeneratedLinksPopup(true));
    setProcessLinkLoading(true);
  };

  useEffect(() => {
    if (Process_id) {
      dispatch(setLinksFetched(true));
      getProcessLinks(Process_id);
    }
  }, [Process_id]); // Added Process_id as dependency

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
      <div>{cardItem.process_title ? cardItem.process_title : 'no item'}</div>
    ) : (
      'Loading...'
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
      </>
    );
  };
  return (
    <HoverCard Front={FrontSide} Back={BackSide} loading={processLinkLoading} />
  );
};

export default ProcessCard;
