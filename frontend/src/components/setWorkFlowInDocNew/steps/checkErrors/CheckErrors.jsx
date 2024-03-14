import styles from './checkErrors.module.css';
import Select from '../../select/Select';
import SelectDoc from '../selectDoc/SelectDoc';
import { v4 as uuidv4 } from 'uuid';
import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { PrimaryButton } from '../../../styledComponents/styledComponents';
import InfoBox from '../../../infoBox/InfoBox';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '../../../progressBar/ProgressBar';
import { toast } from 'react-toastify';
import Popup from '../../../Popup/Popup';
import React from 'react';
import {
  limitTaskTo,
  rights,
  taskType,
} from '../connectWebflowToDoc/contents/selectMembersToAssign/assignTask/AssignTask';
import { useTranslation } from 'react-i18next';

import { extractProcessObjChecker } from './utils';
import { selectedGroupMembers } from '../../../../features/groups/groupsSlice';
import { setErrorsCheckedInNewProcess } from '../../../../features/processes/processesSlice';

const CheckErrors = () => {
  const { t } = useTranslation();

  const { register, watch } = useForm();
  const { userDetail } = useSelector((state) => state.auth);
  const {
    currentDocToWfs,
    docCurrentWorkflow,
    selectedWorkflowsToDoc,
    processSteps,
    teamMembersSelectedForProcess,
    userMembersSelectedForProcess,
    publicMembersSelectedForProcess,
    tableOfContentForStep,
    allowErrorChecksStatusUpdateForNewProcess,
    newProcessErrorMessage,
  } = useSelector((state) => state.processes);
  const {
    popupIsOpen,
  } = useSelector((state) => state.app);
  const [workflowItemsToDisplay, setWorkflowItemsToDisplay] = useState([]);
  const [sortItemActive, setSortItemActive] = useState(null);
  const [sortLoading, setSortLoading] = useState(false);
  const { processOption } = watch();
  const dispatch = useDispatch();
  const selectedGroupMem = useSelector(selectedGroupMembers)
  

  useEffect(() => {
    setWorkflowItemsToDisplay([]);
    setSortItemActive(null);
  }, []);

  useEffect(() => {
    if (!docCurrentWorkflow) return;

    let currentDataMapItem = selectedWorkflowsToDoc.map((workflowItem) => {
      let copyOfWorkflowObj = { ...workflowItem };
      let copyOfNestedWorkflowObjWithSteps = { ...copyOfWorkflowObj.workflows };
      const foundProcessSteps = processSteps.find(
        (process) => process.workflow === docCurrentWorkflow._id
      );

      copyOfNestedWorkflowObjWithSteps.steps = foundProcessSteps
        ? foundProcessSteps.steps.map((step, currentIndex) => {
          let copyOfCurrentStep = { ...step };
          if (copyOfCurrentStep.toggleContent)
            delete copyOfCurrentStep.toggleContent;
          if (copyOfCurrentStep.stepRights === 'add_edit')
            copyOfCurrentStep.stepRightsToDisplay = 'Add/Edit';
          if (!copyOfCurrentStep.stepLocation)
            copyOfCurrentStep.stepLocation = 'any';

          if (copyOfCurrentStep.step_name) {
            copyOfCurrentStep.stepName = copyOfCurrentStep.step_name;
            delete copyOfCurrentStep.step_name;
          }

          if (copyOfCurrentStep.role) {
            copyOfCurrentStep.stepRole = copyOfCurrentStep.role;
            delete copyOfCurrentStep.role;
          }

          copyOfCurrentStep.stepPublicMembers = [
            ...new Map(
              publicMembersSelectedForProcess.map((member) => [
                member['member'],
                member,
              ])
            ).values(),
          ]
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepTeamMembers = [
            ...new Map(
              teamMembersSelectedForProcess.map((member) => [
                member['member'],
                member,
              ])
            ).values(),
          ]
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepUserMembers = [
            ...new Map(
              userMembersSelectedForProcess.map((member) => [
                member['member'],
                member,
              ])
            ).values(),
          ]
            .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
            .map((user) => {
              const copyOfUserItem = { ...user };
              if (Array.isArray(copyOfUserItem.member))
                copyOfUserItem.member = copyOfUserItem.member[0];
              delete copyOfUserItem.stepIndex;

              return copyOfUserItem;
            });

          copyOfCurrentStep.stepNumber = currentIndex + 1;

          return copyOfCurrentStep;
        })
        : [];

      copyOfWorkflowObj.workflows = copyOfNestedWorkflowObjWithSteps;

      return copyOfWorkflowObj;
    });

    

    setWorkflowItemsToDisplay(currentDataMapItem);
  }, [
    docCurrentWorkflow,
    selectedWorkflowsToDoc,
    processSteps,
    publicMembersSelectedForProcess,
    teamMembersSelectedForProcess,
    userMembersSelectedForProcess,
    tableOfContentForStep,

  ]);
// console.log('the process steps: ', processSteps)
  const handleSortProcess = async() => {
    if (!userDetail) return;
    if (!currentDocToWfs) {
      document.querySelector("#select-doc")?.scrollIntoView({ block: "center" });
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage('You have not selected a document'))

      return toast.info("You have not selected a document");
    }
    if (!docCurrentWorkflow) {
      document.querySelector("#step-title")?.scrollIntoView({ block: "center" });
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage('You have not selected a workflow'))

      return toast.info("You have not selected any workflow");
    }
    if (processSteps.length < 1) {
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage('You have not configured steps for any workflow'))

      return toast.info("You have not configured steps for any workflow");
    }
    if (!docCurrentWorkflow) {
      document.querySelector('#select-doc').scrollIntoView({ block: 'center' })
      // dispatch(setPopupIsOpen(true)); 
      // dispatch( setCurrentMessage('You have not selecteda document'))
      return toast.info('Please select a document')
    };
    if (selectedWorkflowsToDoc.length < 1) {
      document.querySelector('#h2__Doc__Title').scrollIntoView({ block: 'center' })
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage('Please select at least one workflow first.'))
      return toast.info('Please select at least one workflow first.');
    }
    if (!allowErrorChecksStatusUpdateForNewProcess && newProcessErrorMessage) {
      document.querySelector('#h2__Doc__Title').scrollIntoView({ block: 'center' })
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage(newProcessErrorMessage))
      return toast.info(newProcessErrorMessage);
    }
   
    const processObjToPost = extractProcessObjChecker(
      userDetail,
      currentDocToWfs,
      docCurrentWorkflow,
      processSteps,
      tableOfContentForStep,
      teamMembersSelectedForProcess,
      publicMembersSelectedForProcess,
      userMembersSelectedForProcess,
      selectedGroupMem
    );


    if (processObjToPost.error) {
      // dispatch(setNewProcessErrorMessage(processObjToPost.error));
      // document
      //   .querySelector("#h2__Doc__Title")
      //   ?.scrollIntoView({ block: "center" });
      // dispatch(setPopupIsOpen(true));
      // dispatch( setCurrentMessage(processObjToPost.error))

      return toast.info(processObjToPost.error);
    }

    dispatch(setErrorsCheckedInNewProcess(true));
    setSortLoading(true);

    setTimeout(() => {
      setSortLoading(false);
      setSortItemActive(true);
    }, 2000);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.h2__Doc__Title}>
        4. {t('Check errors before processing')}
      </h2>
      <div className={styles.content__box}>
        <Select
          register={register}
          options={processOptions.map((item) => item.selectItem)}
          name='processOption'
          takeNormalValue={true}
          currentValue={processOption}
        />
        <div
          className={styles.info__container}
          style={{ alignItems: 'center' }}
        >
          <PrimaryButton
            className={styles.primarybttn}
            hoverBg='success'
            onClick={handleSortProcess}
          >
            {t('Show Process')}
          </PrimaryButton>
          {sortLoading ? (
            <ProgressBar
              durationInMS={1000}
              style={{ width: '50%', height: '2.2rem' }}
            />
          ) : (
            <></>
          )}
           {/* {
               popupIsOpen && <Popup/>
            } */}
        </div>
        {sortItemActive ? (
          <div className={styles.proccess__container}>
            {processOption && processOption === 'timeWise'
              ? React.Children.toArray(
                [
                  ...new Set(
                    workflowItemsToDisplay
                      .map((item) =>
                        item.workflows.steps.map((step) => step.stepTime)
                      )
                      .flat()
                  ),
                ].map((time) => {
                  return (
                    <div className={styles.proccess__box}>
                      <div
                        className={styles.first__box}
                        style={{
                          backgroundColor:
                            colorsDictForOptionType[processOption],
                        }}
                      >
                        <h3 className={styles.box__header}>
                          {'End time wise Process flow'}
                        </h3>
                        <h3 className={styles.box__info}>
                          {time === 'no_time_limit' ? 'No limit' : time}
                        </h3>
                      </div>
                      {React.Children.toArray(
                        workflowItemsToDisplay
                          .filter((step) => step?.stepTime === time)
                          .map((item) => {
                            return React.Children.toArray(
                              item.workflows.steps.map((step, index) => {
                                return (
                                  <div className={styles.box}>
                                    <p>
                                      {item.workflows.workflow_title},{' '}
                                      {step?.stepName}
                                    </p>
                                    <InfoBox
                                      boxType='dark'
                                      title={`Step ${index + 1} (${step?.stepName
                                        })`}
                                      type='list'
                                      items={[
                                        {
                                          _id: item?.workflows?.steps[index]
                                            ?._id,
                                          contentDisplay: true,
                                          displayNoContent: item?.workflows
                                            ?.steps[index]?.stepSkipped
                                            ? true
                                            : false,
                                          contentsToDisplay: [
                                            {
                                              header: 'Members',
                                              content:
                                                item?.workflows?.steps[
                                                  index
                                                ]?.stepPublicMembers
                                                  .map((m) => m.member)
                                                  .join(', ') +
                                                item?.workflows?.steps[
                                                  index
                                                ]?.stepTeamMembers
                                                  .map((m) => m.member)
                                                  .join(', ') +
                                                item?.workflows?.steps[
                                                  index
                                                ]?.stepPublicMembers
                                                  .map((m) => m.member)
                                                  .join(', '),
                                            },
                                            {
                                              header: 'Task type',
                                              content: item?.workflows?.steps[
                                                index
                                              ]?.stepTaskType
                                                ? taskType?.find(
                                                  (task) =>
                                                    task.normalValue ===
                                                    item?.workflows?.steps[
                                                      index
                                                    ]?.stepTaskType
                                                )?.option
                                                : '',
                                            },
                                            {
                                              header: 'Rights',
                                              content: item?.workflows?.steps[
                                                index
                                              ]?.stepRights
                                                ? rights?.find(
                                                  (right) =>
                                                    right.normalValue ===
                                                    item?.workflows?.steps[
                                                      index
                                                    ]?.stepRights
                                                )?.option
                                                : '',
                                            },
                                            {
                                              header: 'Activity type',
                                              content: item?.workflows?.steps[
                                                index
                                              ]?.stepTaskLimitation
                                                ? limitTaskTo?.find(
                                                  (option) =>
                                                    option.normalValue ===
                                                    item?.workflows?.steps[
                                                      index
                                                    ]?.stepTaskLimitation
                                                )?.option
                                                : '',
                                            },
                                            {
                                              header: 'Location',
                                              content:
                                                item?.workflows?.steps[index]
                                                  ?.stepLocation,
                                            },
                                            {
                                              header: 'Time limit',
                                              content:
                                                item?.workflows?.steps[index]
                                                  ?.stepTime,
                                            },
                                          ],
                                        },
                                      ]}
                                    />
                                  </div>
                                );
                              })
                            );
                          })
                      )}
                    </div>
                  );
                })
              )
              : processOption && processOption === 'locationWise'
                ? React.Children.toArray(
                  [
                    ...new Set(
                      workflowItemsToDisplay
                        .map((item) =>
                          item.workflows.steps.map((step) => step.stepLocation)
                        )
                        .flat()
                    ),
                  ].map((location) => {
                    return (
                      <div className={styles.proccess__box}>
                        <div
                          className={styles.first__box}
                          style={{
                            backgroundColor:
                              colorsDictForOptionType[processOption],
                          }}
                        >
                          <h3 className={styles.box__header}>
                            {'Location wise Process flow'}
                          </h3>
                          <h3 className={styles.box__info}>{location}</h3>
                        </div>
                        {React.Children.toArray(
                          workflowItemsToDisplay
                            .filter((step) => step?.stepLocation === location)
                            .map((item) => {
                              return React.Children.toArray(
                                item.workflows.steps.map((step, index) => {
                                  return (
                                    <div className={styles.box}>
                                      <p>
                                        {item.workflows.workflow_title},{' '}
                                        {step?.stepName}
                                      </p>
                                      <InfoBox
                                        boxType='dark'
                                        title={`Step ${index + 1} (${step?.stepName
                                          })`}
                                        type='list'
                                        items={[
                                          {
                                            _id: item?.workflows?.steps[index]
                                              ?._id,
                                            contentDisplay: true,
                                            displayNoContent: item?.workflows
                                              ?.steps[index]?.stepSkipped
                                              ? true
                                              : false,
                                            contentsToDisplay: [
                                              {
                                                header: 'Members',
                                                content:
                                                  item?.workflows?.steps[
                                                    index
                                                  ]?.stepPublicMembers
                                                    .map((m) => m.member)
                                                    .join(', ') +
                                                  item?.workflows?.steps[
                                                    index
                                                  ]?.stepTeamMembers
                                                    .map((m) => m.member)
                                                    .join(', ') +
                                                  item?.workflows?.steps[
                                                    index
                                                  ]?.stepPublicMembers
                                                    .map((m) => m.member)
                                                    .join(', '),
                                              },
                                              {
                                                header: 'Task type',
                                                content: item?.workflows?.steps[
                                                  index
                                                ]?.stepTaskType
                                                  ? taskType?.find(
                                                    (task) =>
                                                      task.normalValue ===
                                                      item?.workflows?.steps[
                                                        index
                                                      ]?.stepTaskType
                                                  )?.option
                                                  : '',
                                              },
                                              {
                                                header: 'Rights',
                                                content: item?.workflows?.steps[
                                                  index
                                                ]?.stepRights
                                                  ? rights?.find(
                                                    (right) =>
                                                      right.normalValue ===
                                                      item?.workflows?.steps[
                                                        index
                                                      ]?.stepRights
                                                  )?.option
                                                  : '',
                                              },
                                              {
                                                header: 'Activity type',
                                                content: item?.workflows?.steps[
                                                  index
                                                ]?.stepTaskLimitation
                                                  ? limitTaskTo?.find(
                                                    (option) =>
                                                      option.normalValue ===
                                                      item?.workflows?.steps[
                                                        index
                                                      ]?.stepTaskLimitation
                                                  )?.option
                                                  : '',
                                              },
                                              {
                                                header: 'Location',
                                                content:
                                                  item?.workflows?.steps[index]
                                                    ?.stepLocation,
                                              },
                                              {
                                                header: 'Time limit',
                                                content:
                                                  item?.workflows?.steps[index]
                                                    ?.stepTime,
                                              },
                                            ],
                                          },
                                        ]}
                                      />
                                    </div>
                                  );
                                })
                              );
                            })
                        )}
                      </div>
                    );
                  })
                )
                : processOption && processOption === 'workflowStepWise'
                  ? React.Children.toArray(
                    workflowItemsToDisplay.map((item) => {
                      return React.Children.toArray(
                        item.workflows.steps.map((parentStep, parentIndex) => {
                          return (
                            <div className={styles.proccess__box}>
                              <div
                                className={styles.first__box}
                                style={{
                                  backgroundColor:
                                    colorsDictForOptionType[processOption],
                                }}
                              >
                                <h3 className={styles.box__header}>
                                  {'Step wise Process flow'}
                                </h3>
                                <h3 className={styles.box__info}>
                                  {parentStep?.stepName}
                                </h3>
                              </div>
                              {React.Children.toArray(
                                item.workflows.steps
                                  .filter(
                                    (step) =>
                                      step?.stepName === parentStep?.stepName
                                  )
                                  .map((step) => {
                                    return (
                                      <div className={styles.box}>
                                        <p>
                                          {item.workflows.workflow_title},{' '}
                                          {step?.stepName}
                                        </p>
                                        <InfoBox
                                          boxType='dark'
                                          title={`Step ${parentIndex + 1} (${step?.stepName
                                            })`}
                                          type='list'
                                          items={[
                                            {
                                              _id: item?.workflows?.steps[
                                                parentIndex
                                              ]?._id,
                                              contentDisplay: true,
                                              displayNoContent: item?.workflows
                                                ?.steps[parentIndex]?.stepSkipped
                                                ? true
                                                : false,
                                              contentsToDisplay: [
                                                {
                                                  header: 'Members',
                                                  content:
                                                    item?.workflows?.steps[
                                                      parentIndex
                                                    ]?.stepPublicMembers
                                                      .map((m) => m.member)
                                                      .join(', ') +
                                                    item?.workflows?.steps[
                                                      parentIndex
                                                    ]?.stepTeamMembers
                                                      .map((m) => m.member)
                                                      .join(', ') +
                                                    item?.workflows?.steps[
                                                      parentIndex
                                                    ]?.stepPublicMembers
                                                      .map((m) => m.member)
                                                      .join(', '),
                                                },
                                                {
                                                  header: 'Task type',
                                                  content: item?.workflows?.steps[
                                                    parentIndex
                                                  ]?.stepTaskType
                                                    ? taskType?.find(
                                                      (task) =>
                                                        task.normalValue ===
                                                        item?.workflows?.steps[
                                                          parentIndex
                                                        ]?.stepTaskType
                                                    )?.option
                                                    : '',
                                                },
                                                {
                                                  header: 'Rights',
                                                  content: item?.workflows?.steps[
                                                    parentIndex
                                                  ]?.stepRights
                                                    ? rights?.find(
                                                      (right) =>
                                                        right.normalValue ===
                                                        item?.workflows?.steps[
                                                          parentIndex
                                                        ]?.stepRights
                                                    )?.option
                                                    : '',
                                                },
                                                {
                                                  header: 'Activity type',
                                                  content: item?.workflows?.steps[
                                                    parentIndex
                                                  ]?.stepTaskLimitation
                                                    ? limitTaskTo?.find(
                                                      (option) =>
                                                        option.normalValue ===
                                                        item?.workflows?.steps[
                                                          parentIndex
                                                        ]?.stepTaskLimitation
                                                    )?.option
                                                    : '',
                                                },
                                                {
                                                  header: 'Location',
                                                  content:
                                                    item?.workflows?.steps[
                                                      parentIndex
                                                    ]?.stepLocation,
                                                },
                                                {
                                                  header: 'Time limit',
                                                  content:
                                                    item?.workflows?.steps[
                                                      parentIndex
                                                    ]?.stepTime,
                                                },
                                              ],
                                            },
                                          ]}
                                        />
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          );
                        })
                      );
                    })
                  )
                  : processOption && processOption === 'contentWise'
                    ? React.Children.toArray(
                      workflowItemsToDisplay.map((item) => {
                        return (
                          <div className={styles.proccess__box}>
                            <div
                              className={styles.first__box}
                              style={{
                                backgroundColor:
                                  colorsDictForOptionType[processOption],
                              }}
                            >
                              <h3 className={styles.box__header}>
                                {'Content wise Process flow in a workflow step'}
                              </h3>
                              <h3 className={styles.box__info}>
                                {item.workflows.workflow_title}
                              </h3>
                            </div>
                            {React.Children.toArray(
                              item.workflows.steps.map((step, index) => {
                                return (
                                  <div className={styles.box}>
                                    <p>
                                      {item.workflows.workflow_title},{' '}
                                      {step?.stepName}
                                    </p>
                                    <>
                                      {React.Children.toArray(
                                        [
                                          ...new Map(
                                            tableOfContentForStep
                                              .filter(
                                                (content) =>
                                                  content.stepIndex === index
                                              )
                                              .map((content) => [
                                                content['id'],
                                                content,
                                              ])
                                          ).values(),
                                        ].map((content, contentIndex) => {
                                          return (
                                            <InfoBox
                                              boxType='dark'
                                              title={`Content ${contentIndex + 1
                                                } (${content.id})`}
                                              type='list'
                                              items={[
                                                {
                                                  _id: item?.workflows?.steps[
                                                    contentIndex
                                                  ]?._id,
                                                  contentDisplay: true,
                                                  displayNoContent: item?.workflows
                                                    ?.steps[contentIndex]
                                                    ?.stepSkipped
                                                    ? true
                                                    : false,
                                                  contentsToDisplay: [
                                                    {
                                                      header: 'Members',
                                                      content:
                                                        item?.workflows?.steps[
                                                          contentIndex
                                                        ]?.stepPublicMembers
                                                          .map((m) => m.member)
                                                          .join(', ') +
                                                        item?.workflows?.steps[
                                                          contentIndex
                                                        ]?.stepTeamMembers
                                                          .map((m) => m.member)
                                                          .join(', ') +
                                                        item?.workflows?.steps[
                                                          contentIndex
                                                        ]?.stepPublicMembers
                                                          .map((m) => m.member)
                                                          .join(', '),
                                                    },
                                                    {
                                                      header: 'Task type',
                                                      content: item?.workflows
                                                        ?.steps[contentIndex]
                                                        ?.stepTaskType
                                                        ? taskType?.find(
                                                          (task) =>
                                                            task.normalValue ===
                                                            item?.workflows
                                                              ?.steps[
                                                              contentIndex
                                                            ]?.stepTaskType
                                                        )?.option
                                                        : '',
                                                    },
                                                    {
                                                      header: 'Rights',
                                                      content: item?.workflows
                                                        ?.steps[contentIndex]
                                                        ?.stepRights
                                                        ? rights?.find(
                                                          (right) =>
                                                            right.normalValue ===
                                                            item?.workflows
                                                              ?.steps[
                                                              contentIndex
                                                            ]?.stepRights
                                                        )?.option
                                                        : '',
                                                    },
                                                    {
                                                      header: 'Activity type',
                                                      content: item?.workflows
                                                        ?.steps[contentIndex]
                                                        ?.stepTaskLimitation
                                                        ? limitTaskTo?.find(
                                                          (option) =>
                                                            option.normalValue ===
                                                            item?.workflows
                                                              ?.steps[
                                                              contentIndex
                                                            ]?.stepTaskLimitation
                                                        )?.option
                                                        : '',
                                                    },
                                                    {
                                                      header: 'Location',
                                                      content:
                                                        item?.workflows?.steps[
                                                          contentIndex
                                                        ]?.stepLocation,
                                                    },
                                                    {
                                                      header: 'Time limit',
                                                      content:
                                                        item?.workflows?.steps[
                                                          contentIndex
                                                        ]?.stepTime,
                                                    },
                                                  ],
                                                },
                                              ]}
                                            />
                                          );
                                        })
                                      )}
                                    </>
                                  </div>
                                );
                              })
                            )}
                          </div>
                        );
                      })
                    )
                    : processOption && processOption === 'memberWise'
                      ? React.Children.toArray(
                        workflowItemsToDisplay.map((item) => {
                          return React.Children.toArray(
                            memberTypes.map((memberType) => {
                              return (
                                <div className={styles.proccess__box}>
                                  <div
                                    className={styles.first__box}
                                    style={{
                                      backgroundColor:
                                        colorsDictForOptionType[processOption],
                                    }}
                                  >
                                    <h3 className={styles.box__header}>
                                      {'Member wise Process flow in a workflow step'}
                                    </h3>
                                    <h3 className={styles.box__info}>
                                      {item.workflows.workflow_title}
                                    </h3>
                                    <h3 className={styles.box__info}>{memberType}</h3>
                                  </div>
                                  {React.Children.toArray(
                                    item.workflows.steps.map((step, stepIndex) => {
                                      return (
                                        <div className={styles.box}>
                                          <p>
                                            {item.workflows.workflow_title},{' '}
                                            {step?.stepName}
                                          </p>
                                          <>
                                            {React.Children.toArray(
                                              [
                                                ...new Map(
                                                  memberType === 'Team Members'
                                                    ? teamMembersSelectedForProcess.map(
                                                      (member) => [
                                                        member['member'],
                                                        member,
                                                      ]
                                                    )
                                                    : memberType === 'Users'
                                                      ? userMembersSelectedForProcess.map(
                                                        (member) => [
                                                          member['member'],
                                                          member,
                                                        ]
                                                      )
                                                      : memberType === 'Public'
                                                        ? publicMembersSelectedForProcess.map(
                                                          (member) => [
                                                            member['member'],
                                                            member,
                                                          ]
                                                        )
                                                        : []
                                                ).values(),
                                              ]
                                                .filter(
                                                  (m) => m.stepIndex === stepIndex
                                                )
                                                .map((member, memberIndex) => {
                                                  return (
                                                    <InfoBox
                                                      boxType='dark'
                                                      title={`Member ${memberIndex + 1
                                                        } (${member.member
                                                        }) Portfolio(${member.portfolio
                                                        })`}
                                                      type='list'
                                                      items={[
                                                        {
                                                          _id: item?.workflows?.steps[
                                                            stepIndex
                                                          ]?._id,
                                                          contentDisplay: true,
                                                          displayNoContent: item
                                                            ?.workflows?.steps[
                                                            stepIndex
                                                          ]?.stepSkipped
                                                            ? true
                                                            : false,
                                                          contentsToDisplay: [
                                                            {
                                                              header: 'Members',
                                                              content:
                                                                item?.workflows?.steps[
                                                                  stepIndex
                                                                ]?.stepPublicMembers
                                                                  .map(
                                                                    (m) => m.member
                                                                  )
                                                                  .join(', ') +
                                                                item?.workflows?.steps[
                                                                  stepIndex
                                                                ]?.stepTeamMembers
                                                                  .map(
                                                                    (m) => m.member
                                                                  )
                                                                  .join(', ') +
                                                                item?.workflows?.steps[
                                                                  stepIndex
                                                                ]?.stepPublicMembers
                                                                  .map(
                                                                    (m) => m.member
                                                                  )
                                                                  .join(', '),
                                                            },
                                                            {
                                                              header: 'Task type',
                                                              content: item?.workflows
                                                                ?.steps[stepIndex]
                                                                ?.stepTaskType
                                                                ? taskType?.find(
                                                                  (task) =>
                                                                    task.normalValue ===
                                                                    item?.workflows
                                                                      ?.steps[
                                                                      stepIndex
                                                                    ]?.stepTaskType
                                                                )?.option
                                                                : '',
                                                            },
                                                            {
                                                              header: 'Rights',
                                                              content: item?.workflows
                                                                ?.steps[stepIndex]
                                                                ?.stepRights
                                                                ? rights?.find(
                                                                  (right) =>
                                                                    right.normalValue ===
                                                                    item?.workflows
                                                                      ?.steps[
                                                                      stepIndex
                                                                    ]?.stepRights
                                                                )?.option
                                                                : '',
                                                            },
                                                            {
                                                              header: 'Activity type',
                                                              content: item?.workflows
                                                                ?.steps[stepIndex]
                                                                ?.stepTaskLimitation
                                                                ? limitTaskTo?.find(
                                                                  (option) =>
                                                                    option.normalValue ===
                                                                    item?.workflows
                                                                      ?.steps[
                                                                      stepIndex
                                                                    ]
                                                                      ?.stepTaskLimitation
                                                                )?.option
                                                                : '',
                                                            },
                                                            {
                                                              header: 'Location',
                                                              content:
                                                                item?.workflows
                                                                  ?.steps[stepIndex]
                                                                  ?.stepLocation,
                                                            },
                                                            {
                                                              header: 'Time limit',
                                                              content:
                                                                item?.workflows
                                                                  ?.steps[stepIndex]
                                                                  ?.stepTime,
                                                            },
                                                          ],
                                                        },
                                                      ]}
                                                    />
                                                  );
                                                })
                                            )}
                                          </>
                                        </div>
                                      );
                                    })
                                  )}
                                </div>
                              );
                            })
                          );
                        })
                      )
                      : React.Children.toArray(
                        workflowItemsToDisplay.map((item) => (
                          <div className={styles.proccess__box}>
                            <div
                              className={styles.first__box}
                              style={{
                                backgroundColor:
                                  !processOption ||
                                    !colorsDictForOptionType[processOption]
                                    ? '#FFF3005E'
                                    : colorsDictForOptionType[processOption],
                              }}
                            >
                              <h3 className={styles.box__header}>
                                {processOptions[0].selectItem.option}
                              </h3>
                              <h3 className={styles.box__info}>
                                {item.workflows.workflow_title}
                              </h3>
                            </div>
                            {React.Children.toArray(
                              item.workflows.steps.map((step, index) => (
                                <div className={styles.box}>
                                  <InfoBox
                                    boxType='dark'
                                    title={
                                      item.workflows.workflow_title +
                                      '-' +
                                      step?.stepName
                                    }
                                    type='list'
                                    items={[
                                      {
                                        _id: item?.workflows?.steps[index]?._id,
                                        contentDisplay: true,
                                        displayNoContent: item?.workflows?.steps[
                                          index
                                        ]?.stepSkipped
                                          ? true
                                          : false,
                                        contentsToDisplay: [
                                          {
                                            header: 'Members',
                                            content:
                                              item?.workflows?.steps[
                                                index
                                              ]?.stepPublicMembers
                                                .map((m) => m.member)
                                                .join(', ') +
                                              item?.workflows?.steps[
                                                index
                                              ]?.stepTeamMembers
                                                .map((m) => m.member)
                                                .join(', ') +
                                              item?.workflows?.steps[
                                                index
                                              ]?.stepPublicMembers
                                                .map((m) => m.member)
                                                .join(', '),
                                          },
                                          {
                                            header: 'Task type',
                                            content: item?.workflows?.steps[index]
                                              ?.stepTaskType
                                              ? taskType?.find(
                                                (task) =>
                                                  task.normalValue ===
                                                  item?.workflows?.steps[index]
                                                    ?.stepTaskType
                                              )?.option
                                              : '',
                                          },
                                          {
                                            header: 'Rights',
                                            content: item?.workflows?.steps[index]
                                              ?.stepRights
                                              ? rights?.find(
                                                (right) =>
                                                  right.normalValue ===
                                                  item?.workflows?.steps[index]
                                                    ?.stepRights
                                              )?.option
                                              : '',
                                          },
                                          {
                                            header: 'Activity type',
                                            content: item?.workflows?.steps[index]
                                              ?.stepTaskLimitation
                                              ? limitTaskTo?.find(
                                                (option) =>
                                                  option.normalValue ===
                                                  item?.workflows?.steps[index]
                                                    ?.stepTaskLimitation
                                              )?.option
                                              : '',
                                          },
                                          {
                                            header: 'Location',
                                            content:
                                              item?.workflows?.steps[index]
                                                ?.stepLocation,
                                          },
                                          {
                                            header: 'Time limit',
                                            content:
                                              item.workflows.steps[index]?.stepTime,
                                          },
                                        ],
                                      },
                                    ]}
                                  />
                                </div>
                              ))
                            )}
                          </div>
                        ))
                      )}
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default CheckErrors;

const colorsDictForOptionType = {
  workflowWise: '#FFF3005E',
  memberWise: '#61CE704A',
  contentWise: '#7A7A7A45',
  workflowStepWise: '#6EC1E45E',
  locationWise: '#FF000047',
  timeWise: '#0048FF26',
};

const memberTypes = ['Team Members', 'Users', 'Public'];
export const tableOfContents = [
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: 't1',
    pageNum: '1',
    _id: 'dc208cc5-00ea-4c1d-93f1-6cc2fad699f9',
  },
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: 't1',
    pageNum: '1',
    _id: 'dc208cc5-00ea-4c1d-93f1-6cc2fad699f9',
  },
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: 't1',
    pageNum: '1',
    _id: 'dc208cc5-00ea-4c1d-93f1-6cc2fad699f9',
  },
];

export const processOptions = [
  {
    color: '#FFF3005E',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: 'Workflow wise Process flow (Workflow 1>2>3...)',
      normalValue: 'workflowWise',
    },
    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: '#61CE704A;',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option:
        'Member wise Process flow in a workflow step (Team Member>User>Public)',
      normalValue: 'memberWise',
    },

    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: '#7A7A7A45',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option:
        'Content wise Process flow in a workflow step (Document content 1>2>3...)',
      normalValue: 'contentWise',
    },

    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: '#6EC1E45E',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: 'Workflow Step wise Process flow (Step1>Step2>Step3...)',
      normalValue: 'workflowStepWise',
    },

    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: '#FF000047',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: 'Location wise Process flow (Location 1>2>3...)',
      normalValue: 'locationWise',
    },

    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },

  {
    color: '#0048FF26',
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: 'Time wise Process flow (End date and time 1>2>3...)',
      normalValue: 'timeWise',
    },

    workflows: [
      {
        company_id: '6390b313d77dc467630713f2',
        created_by: 'workfloweric11',
        eventId: 'FB1010000000167446920554648428',
        _id: '63ce5f5adcc2a171957b080d',
        workflows: {
          data_type: 'Real_Data',
          workflow_title: 'Eric Work',
          steps: [
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
            {
              role: 'Fill and sign',
              step_name: '1',
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
];

// const rightsDict = {
//   add_edit: "Add/Edit",
// };
