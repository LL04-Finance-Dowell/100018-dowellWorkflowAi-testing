import React from "react";
import { useDispatch } from "react-redux";
import { detailWorkflow } from "../../../features/workflow/asyncTHunks";
import HoverCard from "../HoverCard";
import { Button } from "../styledComponents";
import styles from "./workflowCard.module.css";

const WorkflowCard = ({ cardItem }) => {
  const dispatch = useDispatch();

  const handleDetailWorkflow = (item) => {
    const data = {
      workflow_id: item._id,
      workflow_title: item.workflow_title,
    };

    dispatch(detailWorkflow(data));
  };

  const FrontSide = () => {
    return (
      <div>{cardItem.workflow_title ? cardItem.workflow_title : "no item"}</div>
    );
  };

  const BackSide = () => {
    return (
      <div className={styles.back__container}>
        {/*   <Button onClick={() => handleDetailWorkflow(cardItem)}>
          Click Here
        </Button> */}
        {cardItem.workflow_title ? (
          <>
            <p>step-1 admin</p>
            <div className={styles.button__group}>
              <a className={styles.delete}>delete</a>
              <a
                onClick={() => handleDetailWorkflow(cardItem)}
                className={styles.update}
              >
                update
              </a>
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
