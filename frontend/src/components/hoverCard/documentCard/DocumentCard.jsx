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
import { timeZoneToCountryObj } from "../../../utils/timezonesObj";

import { AiFillStar, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { handleFavorites } from "../../../features/favorites/asyncThunks";
import { useAppContext } from "../../../contexts/AppContext";
import { MdFavorite } from "react-icons/md";
import { addNewFavoriteForUser, deleteFavoriteForUser } from "../../../services/favoritesServices";
import { RiDeleteBin6Line } from "react-icons/ri";
import { moveItemToArchive } from "../../../services/archiveServices";
import { setAllDocuments } from "../../../features/document/documentSlice";
import { BsBookmark, BsFillBookmarkFill } from "react-icons/bs";

const DocumentCard = ({ cardItem, title, hideFavoriteIcon, hideDeleteIcon }) => {
  const dispatch = useDispatch();
  const [dataLoading, setDataLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const { singleFavorite } = useSelector((state) => state.favorites);
  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } = useAppContext();
  const { allDocuments } = useSelector(state => state.document);

  const handleFavoritess = async (item, actionType) => {
    /*  const data = {
      id,
      type: "document",
    };
    dispatch(handleFavorites(data)); */

    if (actionType === "add") {
      addToFavoritesState("documents", {...item, 'favourited_by': userDetail?.userinfo?.username})
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            document_name: item.document_name,
          },
          item_type: "document",
          username: userDetail?.userinfo?.username,
        }
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response)
      } catch (error) {
        toast.info("Failed to add document to bookmarks")
        removeFromFavoritesState("documents", item._id)
      }
    }

    if (actionType === "remove") {
      removeFromFavoritesState("documents", item._id)
      try {
        const response = await (await deleteFavoriteForUser(item._id, 'document', userDetail?.userinfo?.username)).data;
        toast.success('Item removed from bookmarks')
      } catch (error) {
        toast.info("Failed to remove document from bookmarks")
        addToFavoritesState("documents", {...item, 'favourited_by': userDetail?.userinfo?.username})
      }
    }
    // console.log(favoriteItems)
  };

  const handleTrashDocument = async (cardItem) => {
    const copyOfAllDocuments = [...allDocuments];
    const foundDocumentIndex = copyOfAllDocuments.findIndex(item => item._id === cardItem._id);
    if (foundDocumentIndex === -1) return

    const copyOfDocumentToUpdate = { ...copyOfAllDocuments[foundDocumentIndex] };
    copyOfDocumentToUpdate.data_type = "Archive_Data";
    copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
    dispatch(setAllDocuments(copyOfAllDocuments));

    try {
      const response = await (await moveItemToArchive(cardItem._id, 'document')).data;
      toast.success(response)
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      copyOfDocumentToUpdate.data_type = "Real_Data";
      copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
      dispatch(setAllDocuments(copyOfAllDocuments));
    }
  }

  const handleDetailDocumnet = async (item) => {
    if (dataLoading) return;
    if (item.type === "sign-document") {
      setDataLoading(true);
      try {
        const dataToPost = {
          user_name: userDetail?.userinfo?.username,
          process_id: item.process_id,
        };
        const response = await (await getProcessLink(dataToPost)).data;

        /*  dispatch(setEditorLink(response)); */
        console.log("responseee", response);
        // setDataLoading(false);
        handleGoToEditor(response);
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

    dispatch(detailDocument(data.document_id));
  };

  const handleGoToEditor = async (link) => {
    if (!link) return;
    const token = link.split("verify/")[1];
    if (!token) return;

    const dataToPost = {
      token: token.slice(0, -1),
      user_name: userDetail?.userinfo?.username,
      portfolio: userDetail?.portfolio_info[0]?.portfolio_name,
      city: userDetail?.userinfo?.city,
      country: userDetail?.userinfo?.country,
      continent: userDetail?.userinfo?.timezone?.split("/")[0],
    };

    if (
      !dataToPost.continent ||
      !dataToPost.continent?.length < 1 ||
      !dataToPost.city ||
      dataToPost.city?.length < 1 ||
      !dataToPost.country ||
      dataToPost.country?.length < 1
    ) {
      const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

      dataToPost.city = userTimezone.split("/")[1];
      dataToPost.country = timeZoneToCountryObj[userTimezone]
        ? timeZoneToCountryObj[userTimezone]
        : "";
      dataToPost.continent = userTimezone.split("/")[0];
    }

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
        {!hideFavoriteIcon && <div style={{ 
          cursor: "pointer", 
          position: "absolute", 
          right: "0", 
          top: "0"
        }} onClick={() => handleFavoritess(cardItem, favoriteItems.documents.find(item => item._id === cardItem._id) ? "remove" : "add")}>
          {
            favoriteItems.documents.find(item => item._id === cardItem._id) ?
            <BsFillBookmarkFill /> :
            <BsBookmark />
          }
        </div>}
        {cardItem._id ? (
          <Button onClick={() => handleDetailDocumnet(cardItem)}>
            {dataLoading ? (
              <LoadingSpinner />
            ) : cardItem.type === "sign-document" ? (
              "Sign Here"
            ) : (
              "Open Document"
            )}
          </Button>
        ) : (
          "no item"
        )}
        {!hideDeleteIcon && <div style={{ 
          cursor: "pointer", 
          position: "absolute", 
          right: "0", 
          bottom: "0"
        }} onClick={() => handleTrashDocument(cardItem)}>
          <RiDeleteBin6Line color="red" />
        </div>}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} loading={dataLoading} />;
};

export default DocumentCard;
