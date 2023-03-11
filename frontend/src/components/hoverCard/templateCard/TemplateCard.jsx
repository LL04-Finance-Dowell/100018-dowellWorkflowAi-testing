import React from "react";
import { AiFillStar, AiOutlineHeart, AiOutlineStar } from "react-icons/ai";
import { MdFavorite } from "react-icons/md";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { useAppContext } from "../../../contexts/AppContext";
import { detailTemplate } from "../../../features/template/asyncThunks";
import { addNewFavoriteForUser, deleteFavoriteForUser } from "../../../services/favoritesServices";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";

const TemplateCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } = useAppContext();

  const handleTemplateDetail = (item) => {
    const data = {
      template_id: item._id,
      template_name: item.template_name,
    };

    dispatch(detailTemplate(data.template_id));
  };

  const handleFavoritess = async (item, actionType) => {
    if (actionType === "add") {
      addToFavoritesState("templates", item)
      try {
        const response = await addNewFavoriteForUser(item._id, 'template');
        console.log(response)
      } catch (error) {
        toast.info("Failed to add template to favorites")
        removeFromFavoritesState("templates", item._id)
      }
    }

    if (actionType === "remove") {
      removeFromFavoritesState("templates", item._id)
      try {
        const response = await deleteFavoriteForUser(item._id, 'template');
        console.log(response)
      } catch (error) {
        toast.info("Failed to remove template from favorites")
        removeFromFavoritesState("templates", item._id)
      }
    }
    // console.log(favoriteItems)
  };

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
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default TemplateCard;
