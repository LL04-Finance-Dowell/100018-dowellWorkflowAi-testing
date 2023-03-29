import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { setAllProcesses } from "../../../features/app/appSlice";
import { moveItemToArchive } from "../../../services/archiveServices";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const ProcessCard = ({ cardItem, title }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { allProcesses } = useSelector(state => state.app);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleProcessItemClick = async (item) => {
    console.log(item)
    if (item.processing_state === "draft" && item.workflow_construct_ids) navigate(`/workflows/new-set-workflow?id=${item._id}&state=${item.processing_state}`)
  };

  const handleTrashProcess = async (cardItem) => {
    const copyOfAllProcesses = [...allProcesses];
    const foundProcessIndex = copyOfAllProcesses.findIndex(item => item._id === cardItem._id);
    if (foundProcessIndex === -1) return

    const copyOfProcessToUpdate = { ...copyOfAllProcesses[foundProcessIndex] };
    copyOfProcessToUpdate.data_type = "Archive_Data";
    copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
    dispatch(setAllProcesses(copyOfAllProcesses));

    try {
      const response = await (await moveItemToArchive(cardItem._id, 'process')).data;
      toast.success(response)
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info(error.response ? error.response.data : error.message);
      copyOfProcessToUpdate.data_type = "Real_Data";
      copyOfAllProcesses[foundProcessIndex] = copyOfProcessToUpdate;
      dispatch(setAllProcesses(copyOfAllProcesses));
    }
  }

  const FrontSide = () => {
    return (
      <div>{cardItem.process_title ? cardItem.process_title : "no item"}</div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        {cardItem._id ? (
          <Button onClick={() => handleProcessItemClick(cardItem)}>
            {"Open process"}
          </Button>
        ) : (
          "no item"
        )}
        <div style={{ 
          cursor: "pointer", 
          position: "absolute", 
          right: "0", 
          bottom: "0"
        }} onClick={() => handleTrashProcess(cardItem)}>
          <RiDeleteBin6Line color="red" />
        </div>
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default ProcessCard;
