
import { productName } from "../../../../utils/helpers";

const requiredProcessStepsKeys = {
  stepCloneCount: 'select copies of document for processing',
  stepDocumentMap: 'select at least one item from the table of contents',
  stepDisplay: 'configure a display',
  // stepProcessingOrder: "select a 'member order'",
  stepRights: "select a 'rights'",
  stepActivityType: "select a 'activity type'",
  stepLocation: 'configure a location',
};

export const extractProcessObjChecker = (
  currentUserDetails,
  documentToProcess,
  selectedDocumentWorkflow,
  documentProcessSteps,
  selectedDocumentContentMap,
  teamMembersSelected,
  publicMembersSelected,
  userMembersSelected,
  groupMembersSelected,
  skipDataChecks = false
) => {
/**
   * Extracts process object necessary for creating a new document process.
   * 
   * @param currentUserDetails The current logged-in user details.
   * @param ProcessName The name user gave to process.
   * @param documentToProcess The document you would like to process.
   * @param selectedDocumentWorkflow The workflow you would like to use to process the document.
   * @param documentProcessSteps The configured steps for all documents scheduled to be processed.
   * @param selectedDocumentContentMap The document map of the selected document.
   * @param teamMembersSelected The array of team members selected for the document to be processed.
   * @param publicMembersSelected The array of public members selected for the document to be processed.
   * @param groupMembersSelected The array of public members selected for the document to be processed.
   * @param userMembersSelected The array of user members selected for the document to be processed.
   * @param skipDataChecks Specifies whether or not to check the process object for necessary details needed for successful process creation.
   * 
   * @returns object
   */

  const processObj = {
    company_id: currentUserDetails?.portfolio_info?.length > 1 ? currentUserDetails?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id : currentUserDetails?.portfolio_info[0]?.org_id,
    created_by: currentUserDetails?.userinfo?.username,
    creator_portfolio: currentUserDetails?.portfolio_info?.length > 1 ? currentUserDetails?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name : currentUserDetails?.portfolio_info[0]?.portfolio_name,
    data_type: currentUserDetails?.portfolio_info?.length > 1 ? currentUserDetails?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : currentUserDetails?.portfolio_info[0]?.data_type,
    parent_id: documentToProcess?.collection_id,
    workflows: [
      {
        workflows: {
          workflow_title: selectedDocumentWorkflow.workflows?.workflow_title,
          steps: [],
        },
      },
    ],
    workflows_ids: [selectedDocumentWorkflow._id], // this will be updated later to capture multiple workflows
    process_type: documentToProcess.document_name ? 'document' : 'template',
    org_name: currentUserDetails?.portfolio_info?.length > 1 ? currentUserDetails?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_name : currentUserDetails?.portfolio_info[0]?.org_name,
  };
// console.log('the documentToProcess is in util ', documentToProcess)
// console.log('the documentProcessSteps is in util ', documentProcessSteps)
  const foundProcessSteps = documentProcessSteps.find(
    (process) => process.workflow === selectedDocumentWorkflow._id
  );
  const tableOfContents = selectedDocumentContentMap.filter(
    (content) => content.workflow === selectedDocumentWorkflow._id
  );

  processObj.workflows[0].workflows.steps = foundProcessSteps
    ? foundProcessSteps.steps.map((step, currentIndex) => {
      let copyOfCurrentStep = { ...step };
      if (copyOfCurrentStep._id) delete copyOfCurrentStep._id;
      if (copyOfCurrentStep.toggleContent)
        delete copyOfCurrentStep.toggleContent;

      if (copyOfCurrentStep.step_name) {
        copyOfCurrentStep.stepName = copyOfCurrentStep.step_name;
        delete copyOfCurrentStep.step_name;
      }

      if (copyOfCurrentStep.role) {
        copyOfCurrentStep.stepRole = copyOfCurrentStep.role;
        delete copyOfCurrentStep.role;
      }

      copyOfCurrentStep.stepPublicMembers = publicMembersSelected
        .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
        .map((user) => {
          const copyOfUserItem = { ...user };
          if (Array.isArray(copyOfUserItem.member))
            copyOfUserItem.member = copyOfUserItem.member[0];
          delete copyOfUserItem.stepIndex;

          return copyOfUserItem;
        });

        copyOfCurrentStep.stepGroupMembers = groupMembersSelected
        .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
        .map((user) => {
          const copyOfUserItem = { ...user };
          delete copyOfUserItem.stepIndex;
          return copyOfUserItem;
        });

      copyOfCurrentStep.stepTeamMembers = teamMembersSelected
        .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
        .map((user) => {
          const copyOfUserItem = { ...user };
          if (Array.isArray(copyOfUserItem.member))
            copyOfUserItem.member = copyOfUserItem.member[0];
          delete copyOfUserItem.stepIndex;

          return copyOfUserItem;
        });

      copyOfCurrentStep.stepUserMembers = userMembersSelected
        .filter((selectedUser) => selectedUser.stepIndex === currentIndex)
        .map((user) => {
          const copyOfUserItem = { ...user };
          if (Array.isArray(copyOfUserItem.member))
            copyOfUserItem.member = copyOfUserItem.member[0];
          delete copyOfUserItem.stepIndex;

          return copyOfUserItem;
        });

      copyOfCurrentStep.stepDocumentCloneMap = [];

      copyOfCurrentStep.stepNumber = currentIndex + 1;
      copyOfCurrentStep.stepDocumentMap = tableOfContents
        .filter((content) => content.stepIndex === currentIndex)
        .map((content) => ({
          content: content.id,
          required: content.required,
          page: content.page,
        }));

      if (!copyOfCurrentStep.permitInternalWorkflow)
        copyOfCurrentStep.permitInternalWorkflow = false;
      if (!copyOfCurrentStep.skipStep) copyOfCurrentStep.skipStep = false;
      if (!copyOfCurrentStep.stepLocation)
        copyOfCurrentStep.stepLocation = 'any';

      if (copyOfCurrentStep.skipStep) {
        copyOfCurrentStep.stepCloneCount = 0;
        copyOfCurrentStep.stepDisplay = 'in_all_steps';
        copyOfCurrentStep.stepProcessingOrder = 'no_order';
        copyOfCurrentStep.stepRights = 'add_edit';
        copyOfCurrentStep.stepActivityType = 'individual_task';
      }
      return copyOfCurrentStep;
    })
    : [];

  if (skipDataChecks) return processObj;

  const requiredFieldKeys = Object.keys(requiredProcessStepsKeys);

  const pendingFieldsToFill = requiredFieldKeys.map((requiredKey) => {
    if (
      processObj.workflows[0].workflows.steps.every((step) =>
        step.hasOwnProperty(requiredKey)
      )
    )
      return null;
    return 'field missing';
  });

  if (pendingFieldsToFill.find((field) => field === 'field missing'))
    return {
      error: `Please make sure you ${requiredProcessStepsKeys[
        requiredFieldKeys[
        pendingFieldsToFill.findIndex(
          (field) => field === 'field missing'
        )
        ]
        ]
        } for each step`,
    };

  const membersMissingInStep = processObj.workflows[0].workflows.steps.map(
    (step) => {
      if (
        step.stepPublicMembers.length < 1 &&
        step.stepTeamMembers.length < 1 &&
        step.stepUserMembers.length < 1 &&
        step.stepGroupMembers.length < 1 &&
        !step.skipStep
      )
        return 'Please assign at least one user for each step';
      return null;
    }
  );

  if (
    membersMissingInStep.find(
      (member) => member === 'Please assign at least one user for each step'
    )
  )
    return {
      error: membersMissingInStep.find(
        (member) => member === 'Please assign at least one user for each step'
      ),
    };
 
  const documentMapMissingInStep =
    processObj.workflows[0].workflows.steps.map((step, index) => {
      // console.log("the documentProcessSteps data: ", documentProcessSteps[0].steps[index].stepRights)
      if (step.stepDocumentMap.length < 1 && !step.skipStep && documentProcessSteps[0].steps[index].stepRights== "add_edit")
        return 'Document map missing';
      return null;
    });

  if (
    documentMapMissingInStep.find(
      (stepMissing) => stepMissing === 'Document map missing'
    )
  )
    return {
      error:
        'Please make sure you select at least one item from the table of contents for each step',
    };

  // if (!processObj.workflows[0].workflows.steps.every(step => step.stepDocumentMap.length > 0)) return { error : "Please make sure you select at least one item from the table of contents for each step" };

  return processObj;
};
