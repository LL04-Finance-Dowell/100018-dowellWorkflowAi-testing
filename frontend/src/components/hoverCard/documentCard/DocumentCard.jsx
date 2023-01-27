import React from "react";
import { useDispatch, useSelector } from "react-redux";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";
import { detailDocument } from "../../../features/document/asyncThunks";
import { useState } from "react";
import { toast } from "react-toastify";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import {
  getProcessLink,
  verifyProcess,
} from "../../../services/processServices";
import { setEditorLink } from "../../../features/app/appSlice";

const DocumentCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const [verificationLink, setVerificationLink] = useState(null);

  const handleDetailDocumnet = async (item) => {
    if (dataLoading) return;
    if (item.type === "sign-document") {
      setDataLoading(true);
      try {
        const dataToPost = {
          user_name: userDetail?.userinfo?.username,
          process_id: item.workflow_process,
        };
        const response = await (await getProcessLink(dataToPost)).data;

        /*  dispatch(setEditorLink(response)); */
        console.log("responseee", response);
        setVerificationLink(response);
        setDataLoading(false);
      } catch (error) {
        console.log(error.response ? error.response.data : error.message);
        setDataLoading(false);
        toast.info(
          error.response.status !== 500
            ? error.response
              ? error.response.data
              : error.message
            : "Could not get notification link"
        );
      }
      return;
    }

    const data = {
      document_name: item.document_name,
      document_id: item._id,
    };

    dispatch(detailDocument(data));
  };

  const handleGoToEditor = async () => {
    const token = verificationLink.split("verify/")[1];
    if (!token) return (window.location = verificationLink);

    const dataToPost = {
      token: token.slice(0, -1),
      user_name: userDetail?.userinfo?.username,
      portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
      location: userDetail?.userinfo?.city,
    };

    setDataLoading(true);

    try {
      const response = await (await verifyProcess(dataToPost)).data;
      setDataLoading(false);
      dispatch(setEditorLink(response));
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
      setDataLoading(false);
      toast.info(
        err.response
          ? err.response.status === 500
            ? "Process verification failed"
            : err.response.data
          : "Process verification failed"
      );
    }
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
          <Button
            onClick={
              verificationLink
                ? () => handleGoToEditor()
                : () => handleDetailDocumnet(cardItem)
            }
          >
            {dataLoading ? (
              <LoadingSpinner />
            ) : verificationLink ? (
              "Go to Editor"
            ) : (
              "Click Here"
            )}
          </Button>
        ) : (
          "no item"
        )}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} loading={dataLoading} />;
};

export default DocumentCard;
