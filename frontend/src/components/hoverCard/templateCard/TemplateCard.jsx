import React from "react";
import { useDispatch } from "react-redux";
import { detailTemplate } from "../../../features/template/asyncThunks";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const TemplateCard = ({ cardItem }) => {
  const dispatch = useDispatch();

  const handleTemplateDetail = (item) => {
    const data = {
      template_id: item._id,
      template_name: item.template_name,
    };

    dispatch(detailTemplate(data));
  };

  const FrontSide = () => {
    return (
      <div>{cardItem.template_name ? cardItem.template_name : "no item"}</div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        {cardItem.template_name ? (
          <Button onClick={() => handleTemplateDetail(cardItem)}>
            Open Template
          </Button>
        ) : (
          "no item"
        )}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default TemplateCard;
