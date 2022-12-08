import React from "react";
import { useDispatch } from "react-redux";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";
import { detailDocument } from "../../../features/document/asyncThunks";

const DocumentCard = ({ cardItem }) => {
  const dispatch = useDispatch();

  const handleDetailDocumnet = (item) => {
    const data = {
      document_name: item.document_name,
      document_id: item._id,
    };

    dispatch(detailDocument(data));
  };

  const FrontSide = () => {
    return (
      <div>{cardItem.document_name ? cardItem.document_name : "no item"}</div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        {cardItem.document_name ? (
          <Button onClick={() => handleDetailDocumnet(cardItem)}>
            Click Here
          </Button>
        ) : (
          "no item"
        )}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default DocumentCard;
