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

const WorkflowCard = ({ cardItem }) => {
  const dispatch = useDispatch();

  const handleUpdateWorkflow = (item) => {
    dispatch(setToggleManageFileForm(true));

    const data = { workflow_id: item._id };
    dispatch(detailWorkflow(data));
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
        {/*   <Button onClick={() => handleDetailWorkflow(cardItem)}>
          Click Here
        </Button> */}
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
                      <tr>
                        <th>{item.step_name}</th>
                        <th>{item.role}</th>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/*  <div key={item._id}>
                  <p>
                    {item.step_name} {item.role}
                  </p>
                </div> */}
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
