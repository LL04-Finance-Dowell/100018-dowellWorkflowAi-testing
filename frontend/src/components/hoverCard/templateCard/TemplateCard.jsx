import React from "react";
import { AiFillStar, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useAppContext } from "../../../contexts/AppContext";
import { detailTemplate } from "../../../features/template/asyncThunks";
import { setAllTemplates } from "../../../features/template/templateSlice";
import { moveItemToArchive } from "../../../services/archiveServices";
import { addNewFavoriteForUser, deleteFavoriteForUser } from "../../../services/favoritesServices";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const TemplateCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } = useAppContext();
  const { userDetail } = useSelector((state) => state.auth);
  const { allTemplates } = useSelector(state => state.template);

  const handleTemplateDetail = (item) => {
    const data = {
      template_id: item._id,
      template_name: item.template_name,
    };

    dispatch(detailTemplate(data.template_id));
  };

  const handleFavoritess = async (item, actionType) => {
    if (actionType === "add") {
      addToFavoritesState("templates", {...item, 'favourited_by': userDetail?.userinfo?.username})
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            template_name: item.template_name,
          },
          item_type: "template",
          username: userDetail?.userinfo?.username,
        }
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response)
      } catch (error) {
        toast.info("Failed to add template to favorites")
        removeFromFavoritesState("templates", item._id)
      }
    }

    if (actionType === "remove") {
      removeFromFavoritesState("templates", item._id)
      try {
        const response = await (await deleteFavoriteForUser(item._id, 'template', userDetail?.userinfo?.username)).data;
        toast.success(response)
      } catch (error) {
        toast.info("Failed to remove template from favorites")
        addToFavoritesState("templates", {...item, 'favourited_by': userDetail?.userinfo?.username})
      }
    }
    // console.log(favoriteItems)
  };

  const handleTrashTemplate = async (cardItem) => {
    const copyOfAllTemplates = [...allTemplates];
    const foundTemplateIndex = copyOfAllTemplates.findIndex(item => item._id === cardItem._id);
    if (foundTemplateIndex === -1) return

    const copyOfTemplateToUpdate = { ...copyOfAllTemplates[foundTemplateIndex] };
    copyOfTemplateToUpdate.data_type = "Archive_Data";
    copyOfAllTemplates[foundTemplateIndex] = copyOfTemplateToUpdate;
    dispatch(setAllTemplates(copyOfAllTemplates));

    try {
      const response = await (await moveItemToArchive(cardItem._id, 'template')).data;
      toast.success(response)
    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      toast.info(error.response ? error.response.data : error.message);
      copyOfTemplateToUpdate.data_type = "Real_Data";
      copyOfAllTemplates[foundTemplateIndex] = copyOfTemplateToUpdate;
      dispatch(setAllTemplates(copyOfAllTemplates));
    }
  }

  const FrontSide = () => {
    return (
      <div>{cardItem.template_name ? cardItem.template_name : "no item"}</div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        <div style={{ 
          cursor: "pointer", 
          position: "absolute", 
          right: "0", 
          top: "0"
        }} onClick={() => handleFavoritess(cardItem, favoriteItems.templates.find(item => item._id === cardItem._id) ? "remove" : "add")}>
          {
            favoriteItems.templates.find(item => item._id === cardItem._id) ?
            <AiFillStar /> :
            <AiOutlineStar />
          }
        </div>
        {cardItem.template_name ? (
          <Button onClick={() => handleTemplateDetail(cardItem)}>
            Open Template
          </Button>
        ) : (
          "no item"
        )}
        <div style={{ 
          cursor: "pointer", 
          position: "absolute", 
          right: "0", 
          bottom: "0"
        }} onClick={() => handleTrashTemplate(cardItem)}>
          <RiDeleteBin6Line color="red" />
        </div>
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default TemplateCard;
