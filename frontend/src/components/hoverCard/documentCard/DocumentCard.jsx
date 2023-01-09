import React from "react";
import { useDispatch } from "react-redux";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";
import { detailDocument } from "../../../features/document/asyncThunks";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { getProcessLink } from "../../../services/processServices";

const DocumentCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const [ dataLoading, setDataLoading ] = useState(false);

  const handleDetailDocumnet = async (item) => {
    if (dataLoading) return
    if (item.type === "sign-document") {
      setDataLoading(true);
      try {
        const dataToPost = { document_id: item._id };
        const response = await (await getProcessLink(dataToPost));
        window.location = response;
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        setDataLoading(false);
        toast.info("Could not get notification link")
      }
      return
    }

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
        {cardItem._id ? (
          <Button onClick={() => handleDetailDocumnet(cardItem)}>
            { dataLoading ? <LoadingSpinner /> : "Click Here" }
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
