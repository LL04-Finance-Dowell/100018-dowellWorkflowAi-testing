import React from "react";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useSelector } from "react-redux";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const ProcessCard = ({ cardItem, title }) => {
  const { userDetail } = useSelector((state) => state.auth);

  const handleProcessItemClick = async (item) => {
    console.log(item)
  };

  const handleTrashProcess = (item) => {

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
