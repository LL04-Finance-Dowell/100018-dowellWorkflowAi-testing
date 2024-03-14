// ? <span> used instead of <button> (style conflicts) or <a> (ESLint prompts)
import React, { useState, useEffect, useRef, memo, useCallback } from 'react';
import styles from './infoBoxes.module.css';
import { v4 as uuidv4 } from 'uuid';
import { GrAdd } from 'react-icons/gr';
import { MdOutlineRemove } from 'react-icons/md';
import { useScroll, useTransform } from 'framer-motion';
import { useSelector, useDispatch } from 'react-redux';
import { useAppContext } from '../../../../../contexts/AppContext';
import Collapse from '../../../../../layouts/collapse/Collapse';
import { LoadingSpinner } from '../../../../LoadingSpinner/LoadingSpinner';
import { useForm } from 'react-hook-form';
import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentText,
  InfoSearchbar,
  InfoTitleBox,
} from '../../../../infoBox/styledComponents';
import { allWorkflows } from '../../../../../features/workflow/asyncTHunks';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { productName } from '../../../../../utils/helpers';
import { FaSearch } from 'react-icons/fa';
import { AiOutlinePlus } from 'react-icons/ai';
import ManageFiles from '../../../../manageFiles/ManageFiles';
import CreateWorkflows from '../../../../manageFiles/files/workflows/createWorkflows/CreateWorkflow';

import { startConnecting } from '../../../../../features/processCopyReducer';
import { removeFromSelectedMembersForProcess,
  setMembersSetForProcess,
  setSelectedMembersForProcess,
  setSelectedWorkflowsToDoc,
} from '../../../../../features/processes/processesSlice';

const InfoBoxes = ({ savedDoc, handleRemove }) => {
  const { register, watch } = useForm();
  const { workflow, team } = watch();

  const ref = useRef(null);
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const { userDetail } = useSelector((state) => state.auth);
  const {
    currentDocToWfs,
    selectedWorkflowsToDoc,
    selectedMembersForProcess,
    membersSetForProcess,
  } = useSelector((state) => state.processes);
  const { allWorkflows: allWorkflowsArray, allWorkflowsStatus } = useSelector(
    (state) => state.workflow
  );
  const {  isMobile } =useAppContext();
  const [compInfoBoxes, setCompInfoBoxes] = useState(infoBoxes);
  const [openWF, setOpenWF] = useState(false)

    ////copied workflow
    const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);
    // const startConnectingingWF = useSelector((state)=> state.copyProcess.startConnectWorkflow)
    const startCopyingWF = useSelector((state)=> state.copyProcess.startSelectWorkflow)

    useEffect(()=>{
      // // console.log('entered to pick the wf to connect it with doc ')
      
      if (currentDocToWfs && copiedWorkflow !==null && startCopyingWF) {
        // // console.log('started picking wf')
          dispatch(setSelectedWorkflowsToDoc(copiedWorkflow));
          // dispatch(startConnecting())
          // // console.log('finished picking wf')
      }}
      
    ,[copiedWorkflow, currentDocToWfs, startCopyingWF])

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
    };

    dispatch(allWorkflows(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const memorizedInfoBox = useCallback(() => {
    setCompInfoBoxes((prev) =>
      prev.map((item) =>
        item.title === 'workflow'
          ? {
              ...item,
              contents:
                team?.length > 1
                  ? allWorkflowsArray?.filter((item) =>
                      item.created_by
                        .toLocaleLowerCase()
                        .includes(team?.toLocaleLowerCase())
                    )
                  : allWorkflowsArray?.filter((item) =>
                      item?.workflows?.workflow_title
                        .toLowerCase()
                        .includes(workflow?.toLowerCase())
                    ),
              status: allWorkflowsStatus,
            }
          : item.title === 'team'
          ? {
              ...item,
              contents:
                team?.length > 1
                  ? userDetail?.userportfolio
                    ? userDetail?.userportfolio
                        .filter((user) => user.member_type === 'team_member')
                        .filter((user) =>
                          Array.isArray(user.username) &&
                          user.username?.length > 0
                            ? user.username[0]
                                .toLocaleLowerCase()
                                .includes(team.toLocaleLowerCase())
                            : user.username
                                .toLocaleLowerCase()
                                .includes(team.toLocaleLowerCase())
                        )
                    : userDetail?.selected_product?.userportfolio
                        .filter((user) => user.member_type === 'team_member')
                        .filter((user) =>
                          Array.isArray(user.username) &&
                          user.username?.length > 0
                            ? user.username[0]
                                .toLocaleLowerCase()
                                .includes(team.toLocaleLowerCase())
                            : user.username
                                .toLocaleLowerCase()
                                .includes(team.toLocaleLowerCase())
                        )
                  : userDetail?.userportfolio
                  ? userDetail?.userportfolio.filter(
                      (user) => user.member_type === 'team_member'
                    )
                  : userDetail?.selected_product?.userportfolio.filter(
                      (user) => user.member_type === 'team_member'
                    ),
              status: 'done',
            }
          : item.title === 'user'
          ? {
              ...item,
              contents: userDetail?.userportfolio
                ? userDetail?.userportfolio.filter(
                    (user) => user.member_type === 'public'
                  )
                : userDetail?.selected_product?.userportfolio.filter(
                    (user) => user.member_type === 'public'
                  ),
              status: 'done',
            }
          : item
      )
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allWorkflowsStatus, workflow, team, userDetail]);

  useEffect(() => {
    memorizedInfoBox();
  }, [memorizedInfoBox]);

  useEffect(() => {
    if (membersSetForProcess) return;

    if (userDetail.userportfolio) {
      userDetail.userportfolio?.forEach((user) => {
        if (Array.isArray(user.username) && user.username?.length > 0) {
          user.username.forEach((arrUsername) => {
            const copyOfUser = { ...user };
            copyOfUser.username = arrUsername;

            if (
              selectedMembersForProcess.find(
                (member) => member.username === copyOfUser.username
              )
            )
              return dispatch(
                removeFromSelectedMembersForProcess(copyOfUser.username)
              );
            dispatch(setSelectedMembersForProcess(copyOfUser));
          });

          return;
        }

        if (
          selectedMembersForProcess.find((member) =>
            member.username === Array.isArray(user.username) &&
            user.username.length > 0
              ? user.username[0]
              : user.username
          )
        )
          return dispatch(
            removeFromSelectedMembersForProcess(
              Array.isArray(user.username) && user.username?.length > 0
                ? user.username[0]
                : user.username
            )
          );
        dispatch(setSelectedMembersForProcess(user));
      });

      dispatch(setMembersSetForProcess(true));
      return;
    }

    userDetail.selected_product?.userportfolio?.forEach((user) => {
      if (Array.isArray(user.username) && user.username?.length > 0) {
        user.username.forEach((arrUsername) => {
          const copyOfUser = { ...user };
          copyOfUser.username = arrUsername;

          if (
            selectedMembersForProcess.find(
              (member) => member.username === copyOfUser.username
            )
          )
            return dispatch(
              removeFromSelectedMembersForProcess(copyOfUser.username)
            );
          dispatch(setSelectedMembersForProcess(copyOfUser));
        });

        return;
      }

      if (
        selectedMembersForProcess.find((member) =>
          member.username === Array.isArray(user.username) &&
          user.username?.length > 0
            ? user.username[0]
            : user.username
        )
      )
        return dispatch(
          removeFromSelectedMembersForProcess(
            Array.isArray(user.username) && user.username?.length > 0
              ? user.username[0]
              : user.username
          )
        );
      dispatch(setSelectedMembersForProcess(user));
    });

    dispatch(setMembersSetForProcess(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetail, currentDocToWfs, membersSetForProcess]);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['end end', 'start start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], ['200px', '-200px']);

  const handleTogleBox = (id) => {
    // console.log("compInfoBoxes ", compInfoBoxes)
    const updatedInfoBoxes = compInfoBoxes.map((item) =>
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    );

    setCompInfoBoxes(updatedInfoBoxes);
  };

  const addToSelectedWorkFlows = (selectedWorkFlow) => {
    if (selectedWorkFlow.member_type && selectedWorkFlow.username) {
      return;
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
      else {
        // Item is already present, remove it
        // const updatedWorkflows = selectedWorkflowsToDoc.filter(
        //   (item) => item._id !== selectedWorkFlow._id
        // );
        dispatch(setSelectedWorkflowsToDoc(selectedWorkFlow));
        handleRemove()
        // dispatch(setSelectedWorkflowsToDoc(updatedWorkflows));
      }
    } else {
      toast.info('Please pick a document first.');
      // alert("u have to pick document first");
    }
  };

  const handleToggleOverlayBtn = async ()=>{
    const data = {
      company_id: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type,
    };

    await dispatch(allWorkflows(data));
    await setOpenWF(!openWF)
  }

  return (
    <div ref={ref} style={{ y: y }} className={styles.container}>
      {React.Children.toArray(
        compInfoBoxes?.map((infoBox) => (
          <InfoBoxContainer className={styles.box}>
            <InfoTitleBox
              style={{
                pointerEvents: infoBox?.status === 'pending' && 'none',
                cursor: savedDoc ? 'not-allowed' : 'initial',
              }}
              onClick={
                currentDocToWfs
                  ? savedDoc
                    ? () => {}
                    : () => handleTogleBox(infoBox.id)
                  : () => toast.info('Please select a document first.')
              }
              /*  className={styles.title__box} */
            >
              {infoBox.status && infoBox.status === 'pending' ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div
                    style={{
                      marginRight: '8px',
                      fontSize: '14px',
                    }}
                  >
                    {infoBox.isOpen ? <MdOutlineRemove /> : <GrAdd />}
                  </div>
                  <span style={{ cursor: 'pointer' }}>{t(infoBox.title)}</span>
                </>
              )}
            </InfoTitleBox>

            <Collapse open={infoBox.isOpen}>
              <InfoContentContainer>
                <div style={{display:'flex',borderBottom: "1px solid var(--e-global-color-text)"}}>
                  <div style={{marginTop:'5px', marginLeft:'5px'}}><FaSearch /></div>
                  <InfoSearchbar
                    placeholder='Search'
                    {...register(`${infoBox.title}`)}
                    fullWidth={true}
                  />
                  {
                    infoBox.title == 'workflow' ? 
                    <button 
                      onClick={()=>setOpenWF(!openWF)}
                      style={{marginTop:'3px', marginRight:'5px', paddingLeft:'5px', paddingRight:'5px', backgroundColor:'green'}}
                    >
                    <AiOutlinePlus color='white' />
                  </button> :""
                  }     
                </div>
                {
                  openWF ?  <div style={{position:'relative', marginLeft:'20%', background:'none'}}>
                    <CreateWorkflows handleToggleOverlay={()=>handleToggleOverlayBtn()}/>
                  </div> : ""
                }
              
                <InfoContentBox className={styles.content__box}>
                  
                  {infoBox &&
                  infoBox.contents &&
                  infoBox.contents?.length > 0 ? (
                    [...infoBox?.contents].reverse().map((item, index) =>
                      item.username ? (
                        Array.isArray(item.username) ? (
                          <>
                            {React.Children.toArray(
                              item.username.map((user, userIndex) => {
                                return (
                                  <InfoContentText
                                    key={user + crypto.randomUUID()}
                                    /* className={styles.content} */
                                  >
                                    <span>
                                      {userIndex + 1 === 1
                                        ? index + 1
                                        : userIndex + 1}
                                      . {user}
                                    </span>
                                  </InfoContentText>
                                );
                              })
                            )}
                          </>
                        ) : (
                          <InfoContentText
                            key={item.username + crypto.randomUUID()}
                            /* className={styles.content} */
                          >
                            <span>
                              {index + 1}. {item.username}
                            </span>
                          </InfoContentText>
                        )
                      ) : (
                        <InfoContentText
                          onClick={() => addToSelectedWorkFlows(item)}
                          key={item._id}
                          className={styles.content__text}
                        >
                          <div
                            style={
                              // item.username ? selectedMembersForProcess.find(member => member.username === item.username) ? { color: "#0048ff"} : {} :
                              item.workflows && item._id
                                ? selectedWorkflowsToDoc.find(
                                    (addedWorkflow) =>
                                      addedWorkflow._id === item._id
                                  )
                                  ? {
                                      backgroundColor: '#0048ff',
                                      color: '#fff',
                                      padding: '2% 3%',
                                      borderRadius: '5px',
                                      width: '100%',
                                      cursor: 'pointer',
                                    }
                                  : {
                                      cursor: 'pointer',
                                    }
                                : {}
                            }
                          >
                            {index + 1}.{' '}
                            {item.workflows &&
                              item.workflows.workflow_title &&
                              item.workflows.workflow_title}
                          </div>
                        </InfoContentText>
                      )
                    )
                  ) : (
                    <></>
                  )}
                </InfoContentBox>
              </InfoContentContainer>
            </Collapse>
          </InfoBoxContainer>
        ))
      )}
    </div>
  );
};

export default memo(InfoBoxes);

export const infoBoxes = [
  {
    id: uuidv4(),
    title: 'workflow',
    contents: [],
    isOpen: false,
  },
  {
    id: uuidv4(),
    title: 'team',
    contents: [],
    isOpen: false,
  },
  {
    id: uuidv4(),
    title: 'user',
    contents: [],
    isOpen: false,
  },
];
