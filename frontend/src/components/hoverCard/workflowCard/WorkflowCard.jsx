import React from "react";
import { useDispatch } from "react-redux";
import {
  setCurrentWorkflow,
  setToggleManageFileForm,
} from "../../../features/app/appSlice";
import { detailWorkflow } from "../../../features/workflow/asyncTHunks";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";
import styles from "./workflowCard.module.css";
import { RxUpdate } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useAppContext } from "../../../contexts/AppContext";
import { toast } from "react-toastify";
import { addNewFavoriteForUser, deleteFavoriteForUser } from "../../../services/favoritesServices";
import { MdFavorite } from "react-icons/md";
import { AiOutlineHeart } from "react-icons/ai";

const WorkflowCard = ({ cardItem }) => {
  const dispatch = useDispatch();
  const { favoriteItems, addToFavoritesState, removeFromFavoritesState } = useAppContext();

  const handleUpdateWorkflow = (item) => {
    dispatch(setToggleManageFileForm(true));

    const data = { workflow_id: item._id };
    dispatch(detailWorkflow(data.workflow_id));
  };

  const handleFavoritess = async (item, actionType) => {
    if (actionType === "add") {
      addToFavoritesState("workflows", item)
      try {
        const response = await addNewFavoriteForUser(item._id, 'workflow');
        console.log(response)
      } catch (error) {
        toast.info("Failed to add workflow to favorites")
        removeFromFavoritesState("workflows", item._id)
      }
    }

    if (actionType === "remove") {
      removeFromFavoritesState("workflows", item._id)
      try {
        const response = await deleteFavoriteForUser(item._id, 'workflow');
        console.log(response)
      } catch (error) {
        toast.info("Failed to remove workflow from favorites")
        removeFromFavoritesState("workflows", item._id)
      }
    }
    // console.log(favoriteItems)
  };

  const FrontSide = () => {
    return (
      <div>
        {cardItem.workflows?.workflow_title
          ? cardItem.workflows?.workflow_title
          : "no item"}
      </div>
    );
  };

  const BackSide = () => {
    return (
      <div className={styles.back__container}>
        {cardItem.workflows?.workflow_title ? (
          <>
            <>
              <div className={styles.test}>
                <table>
                  <thead>
                    <tr>
                      <th>Step Name</th>
                      <th>Role</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cardItem.workflows?.steps.map((item) => (
                      <tr key={item._id}>
                        <th>{item.step_name}</th>
                        <th>{item.role}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
            <div className={styles.button__group}>
              <a className={styles.delete}>
                <RiDeleteBin6Line color="red" />
              </a>
              <a
                onClick={() => handleUpdateWorkflow(cardItem)}
                className={styles.update}
              >
                <i>
                  <RxUpdate color="green" />
                </i>
              </a>
              <div style={{ 
                cursor: "pointer",
              }} onClick={() => handleFavoritess(cardItem, favoriteItems.workflows.find(item => item._id === cardItem._id) ? "remove" : "add")}>
                {
                  favoriteItems.workflows.find(item => item._id === cardItem._id) ?
                  <MdFavorite /> :
                  <AiOutlineHeart />
                }
              </div>      
            </div>
          </>
        ) : (
          <div style={{ margin: "auto" }}>no item</div>
        )}
      </div>
    );
  };
  return <HoverCard Front={FrontSide} Back={BackSide} />;
};

export default WorkflowCard;
