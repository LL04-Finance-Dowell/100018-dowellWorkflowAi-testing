import { useState, useEffect, useRef, memo, useCallback } from "react";
import styles from "./infoBoxes.module.css";
import { v4 as uuidv4 } from "uuid";
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove } from "react-icons/md";
import { useScroll, useTransform } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { setSelectedWorkflowsToDoc } from "../../../../../features/app/appSlice";
import Collapse from "../../../../../layouts/collapse/Collapse";
import { LoadingSpinner } from "../../../../LoadingSpinner/LoadingSpinner";
import { useForm } from "react-hook-form";
import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentText,
  InfoSearchbar,
  InfoTitleBox,
} from "../../../../infoBox/styledComponents";
import { savedWorkflows } from "../../../../../features/workflow/asyncTHunks";

const SelectWorkflowBoxes = () => {
  const { register, watch } = useForm();
  const { workflow } = watch();

  const ref = useRef(null);
  const dispatch = useDispatch();

  const { userDetail } = useSelector((state) => state.auth);
  const { currentDocToWfs, selectedWorkflowsToDoc } = useSelector(
    (state) => state.app
  );
  const { savedWorkflowItems, savedWorkflowStatus } = useSelector(
    (state) => state.workflow
  );

  const [compInfoBoxes, setCompInfoBoxes] = useState(infoBoxes);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    dispatch(savedWorkflows(data));
  }, []);

  const memorizedInfoBox = useCallback(() => {
    setCompInfoBoxes((prev) =>
      prev.map((item) =>
        item.title === "workflow"
          ? {
              ...item,
              contents: savedWorkflowItems?.filter((item) =>
                item.workflows?.workflow_title
                  .toLowerCase()
                  .includes(workflow?.toLowerCase())
              ),
              status: savedWorkflowStatus,
            }
          : item
      )
    );
  }, [savedWorkflowStatus, workflow]);

  useEffect(() => {
    memorizedInfoBox();
  }, [memorizedInfoBox]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["end end", "start start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["200px", "-200px"]);

  const handleTogleBox = (id) => {
    const updatedInfoBoxes = compInfoBoxes.map((item) =>
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    );

    setCompInfoBoxes(updatedInfoBoxes);
  };

  const addToSelectedWorkFlows = (selectedWorkFlow) => {
    if (currentDocToWfs) {
      const isInclude = selectedWorkflowsToDoc.find(
        (item) => item._id === selectedWorkFlow._id
      );
      if (!isInclude) {
        dispatch(setSelectedWorkflowsToDoc(selectedWorkFlow));
      }
    } else {
      alert("u have to pick document first");
    }
  };

  return (
    <div ref={ref} style={{ y: y }} className={styles.container}>
      {compInfoBoxes?.map((infoBox) => (
        <InfoBoxContainer key={infoBox.id}>
          <InfoTitleBox
            style={{ pointerEvents: infoBox?.status === "pending" && "none" }}
            onClick={() => handleTogleBox(infoBox.id)}
            /*  className={styles.title__box} */
          >
            {infoBox.status && infoBox.status === "pending" ? (
              <LoadingSpinner />
            ) : (
              <>
                <div
                  style={{
                    marginRight: "8px",
                    fontSize: "14px",
                  }}
                >
                  {infoBox.isOpen ? <MdOutlineRemove /> : <GrAdd />}
                </div>
                <a>{infoBox.title}</a>
              </>
            )}
          </InfoTitleBox>

          <Collapse open={!infoBox.isOpen}>
            <InfoContentContainer>
              <InfoSearchbar
                placeholder="Search"
                {...register(`${infoBox.title}`)}
              />

              <InfoContentBox className={styles.content__box}>
                {[...infoBox.contents].reverse().map((item) => (
                  <InfoContentText
                    onClick={() => addToSelectedWorkFlows(item)}
                    key={item._id}
                    /* className={styles.content} */
                  >
                    {item.workflows?.workflow_title}
                  </InfoContentText>
                ))}
              </InfoContentBox>
            </InfoContentContainer>
          </Collapse>
        </InfoBoxContainer>
      ))}
    </div>
  );
};

export default memo(SelectWorkflowBoxes);

export const infoBoxes = [
  {
    id: uuidv4(),
    title: "Select workflows by Name",
    contents: [],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "Select workflows created by Team Member",
    contents: [
      /*  { _id: uuidv4(), content: "member 1" },
      { _id: uuidv4(), content: "member 1" },
      { _id: uuidv4(), content: "member 1" },
      { _id: uuidv4(), content: "member 1" }, */
    ],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "Select workflows created by Users",
    contents: [
      /*   { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" }, */
    ],
    isOpen: true,
  },
];
