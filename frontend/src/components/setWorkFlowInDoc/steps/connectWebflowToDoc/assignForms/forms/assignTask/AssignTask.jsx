import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../formLayout/FormLayout";
import AssignButton from "../../../../../assignButton/AssignButton";
import { useDispatch, useSelector } from "react-redux";

import { useEffect } from "react";
import { updateSingleProcessStep } from "../../../../../../../features/processes/processesSlice";

const AssignTask = ({ currentStepIndex, stepSkipped }) => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedMembersForProcess, docCurrentWorkflow } = useSelector((state) => state.processes);
  const watchRoleValChange = watch("member_type", false);
  const watchCurrentMemberValChange = watch("member", false);

  const onSubmit = (data) => {
    setLoading(true);
    if (data.member === "" && membersForCurrentUser[0]) data.member = membersForCurrentUser[0].option
    if (data.member_portfolio === "" && memberPortfolios[0]) data.member_portfolio = memberPortfolios[0].option
    dispatch(updateSingleProcessStep({ ...data, "indexToUpdate": currentStepIndex , "workflow": docCurrentWorkflow._id }))
    setTimeout(() => setLoading(false), 2000);
  };

  const [ membersForCurrentUser, setMembersForCurrentUser ] = useState([]);
  const [ memberPortfolios, setMemberPortfolios ] = useState([]);

  useEffect(() => {
    
    let foundMembers = selectedMembersForProcess.map(user => {
      return {
        id : uuidv4(),
        option: user?.username,
      }
    });
    
    setMembersForCurrentUser(foundMembers);

    const foundCurrentMemberPortfolio = selectedMembersForProcess.find(user => user.username === foundMembers[0].option)
    
    if (!foundCurrentMemberPortfolio) return setMemberPortfolios([])

    setMemberPortfolios([{ id: uuidv4(), option: foundCurrentMemberPortfolio.portfolio_name }])
    
  }, [selectedMembersForProcess, stepSkipped])

  useEffect(() => {
    
    if (!watchRoleValChange) return 

    let [ membersMatchingCriteria, foundMembers ] = [ [], [] ];

    if (watchRoleValChange === "TEAM_MEMBER") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "team_member");

    if (watchRoleValChange === "GUEST") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "to-be-decided");
    
    if (watchRoleValChange === "PUBLIC") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "public");

    foundMembers = membersMatchingCriteria.map(user => {
      return {
        id : uuidv4(),
        option: user?.username,
      }
    });

    setMembersForCurrentUser(foundMembers);

    const foundCurrentMemberPortfolio = membersMatchingCriteria.find(user => user.username === foundMembers[0].option)
    if (!foundCurrentMemberPortfolio) return setMemberPortfolios([])

    setMemberPortfolios([{ id: uuidv4(), option: foundCurrentMemberPortfolio.portfolio_name }])

  }, [watchRoleValChange, selectedMembersForProcess])

  useEffect(() => {

    if (!watchCurrentMemberValChange) return 

    const foundCurrentMemberPortfolio = selectedMembersForProcess.find(user => user.username === watchCurrentMemberValChange)
    
    if (!foundCurrentMemberPortfolio) return setMemberPortfolios([]);

    setMemberPortfolios([{ id: uuidv4(), option: foundCurrentMemberPortfolio.portfolio_name }])
    
  }, [watchCurrentMemberValChange, selectedMembersForProcess])

  return (
    <FormLayout isSubmitted={isSubmitSuccessful} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        { stepSkipped ? <Select register={register} name="member_type" options={roleArray} takeNormalValue={true} /> : <p>Step skipped</p> }
        <Select register={register} name="member" options={membersForCurrentUser} takeNormalValue={true} />
        { stepSkipped ? <Select
          register={register}
          name="member_portfolio"
          options={memberPortfolios}
          takeNormalValue={true}
        /> : <p>Step skipped</p> }
        { stepSkipped ? <select
          required
          {...register("rights")}
          size={taskFeatures.length}
          className={globalStyles.task__features}
        >
          {taskFeatures.map((item) => (
            <option className={globalStyles.task__features__text} key={item.id}>
              {item.feature}
            </option>
          ))}
        </select> : <p>Step skipped</p> }
        { stepSkipped ? <Select
          register={register}
          name="display_before"
          options={displayDocument}
          takeNormalValue={true}
        /> : <p>Step skipped</p> }
        <AssignButton loading={loading} buttonText="Assign Task" />
      </form>
    </FormLayout>
  );
};

export default AssignTask;

export const roleArray = [
  {
    id: uuidv4(),
    option: "Team Member",
    normalValue: "TEAM_MEMBER",
  },
  { id: uuidv4(), option: "Guest (enter phone/email)", normalValue: "GUEST" },
  { id: uuidv4(), option: "Public (link)", normalValue: "PUBLIC" },
];

export const members = [
  {
    id: uuidv4(),
    option: "Member 1",
  },
  {
    id: uuidv4(),
    option: "Member 2",
  },
  {
    id: uuidv4(),
    option: "Member 3",
  },
];

export const taskFeatures = [
  { id: uuidv4(), feature: "ADD/EDIT" },
  { id: uuidv4(), feature: "VIEW" },
  { id: uuidv4(), feature: "COMMENT" },
  { id: uuidv4(), feature: "APPROVE" },
];

export const membersPortfolio = [
  { id: uuidv4(), option: "Member Porfolio 1" },
  { id: uuidv4(), option: "Member Porfolio 2" },
  { id: uuidv4(), option: "Member Porfolio 3" },
];

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step", normalValue: "document_before_processing_this_step" },
  { id: uuidv4(), option: "Display document after processing this step", normalValue: "document_after_processing_this_step" },
  { id: uuidv4(), option: "Display document only in this step", normalValue: "document_only_this_step" },
  { id: uuidv4(), option: "Display document in all steps", normalValue: "document_in_all_steps" },
];
