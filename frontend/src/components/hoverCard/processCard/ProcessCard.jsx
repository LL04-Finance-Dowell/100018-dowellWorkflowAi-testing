import React from "react";
import { useSelector } from "react-redux";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const ProcessCard = ({ cardItem, title }) => {
  const { userDetail } = useSelector((state) => state.auth);

  const handleProcessItemClick = async (item) => {
    console.log(item)
  };

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
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default ProcessCard;
