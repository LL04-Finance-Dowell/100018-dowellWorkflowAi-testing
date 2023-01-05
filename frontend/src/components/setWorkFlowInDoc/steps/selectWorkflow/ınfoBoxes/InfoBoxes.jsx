import { useState, useEffect, useRef, memo, useCallback } from "react";
import styles from "./infoBoxes.module.css";
import { v4 as uuidv4 } from "uuid";
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove } from "react-icons/md";
import { useScroll, useTransform } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { removeFromSelectedMembersForProcess, setSelectedMembersForProcess, setSelectedWorkflowsToDoc } from "../../../../../features/app/appSlice";
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

const InfoBoxes = () => {
  const { register, watch } = useForm();
  const { workflow } = watch();

  const ref = useRef(null);
  const dispatch = useDispatch();

  const { userDetail } = useSelector((state) => state.auth);
  const { currentDocToWfs, selectedWorkflowsToDoc, selectedMembersForProcess } = useSelector(
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
          : 
          item.title === "team" ? {
            ...item,
            contents: userDetail?.selected_product?.userportfolio.filter(user => user.member_type === "team_member"),
            status: "done"
          } :
          item.title === "guest" ? {
            ...item,
            contents: userDetail?.selected_product?.userportfolio.filter(user => user.member_type === "guest"),
            status: "done"
          } :
          item
      )
    );
  }, [savedWorkflowStatus, workflow, userDetail]);

  useEffect(() => {
    memorizedInfoBox();
  }, [memorizedInfoBox]);

  useEffect(() => {

    userDetail.selected_product?.userportfolio?.forEach(user => {

      if (selectedMembersForProcess.find(member => member.username === user.username)) return dispatch(removeFromSelectedMembersForProcess(user.username))
      dispatch(setSelectedMembersForProcess(user));

    })

  }, [currentDocToWfs])

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
    if (selectedWorkFlow.member_type && selectedWorkFlow.username) {
      return
      // if (selectedMembersForProcess.find(member => member.username === selectedWorkFlow.username)) return dispatch(removeFromSelectedMembersForProcess(selectedWorkFlow.username))
      // return dispatch(setSelectedMembersForProcess(selectedWorkFlow));
    }

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
        <InfoBoxContainer key={infoBox.id} className={styles.box}>
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
                {[...infoBox?.contents].reverse().map((item) => (
                  <InfoContentText
                    onClick={() => addToSelectedWorkFlows(item)}
                    key={item._id}
                    /* className={styles.content} */
                  >
                    <span style={
                      // item.username ? selectedMembersForProcess.find(member => member.username === item.username) ? { color: "#0048ff"} : {} : 
                      item.workflows && item._id ? selectedWorkflowsToDoc.find(addedWorkflow => addedWorkflow._id === item._id) ? { color: "#0048ff"} : {} :
                      {}}>
                      {item.workflows && item.workflows.workflow_title ? item.workflows.workflow_title : item.username}
                    </span>
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

export default memo(InfoBoxes);

export const infoBoxes = [
  {
    id: uuidv4(),
    title: "workflow",
    contents: [],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "team",
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
    title: "guest",
    contents: [
      /*   { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" },
      { _id: uuidv4(), content: "guest 1" }, */
    ],
    isOpen: true,
  },
];
