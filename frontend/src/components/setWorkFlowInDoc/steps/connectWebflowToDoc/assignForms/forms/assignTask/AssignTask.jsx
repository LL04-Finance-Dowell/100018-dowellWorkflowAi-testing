import globalStyles from "../../../connectWorkFlowToDoc.module.css";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import FormLayout from "../../../../../formLayout/FormLayout";
import AssignButton from "../../../../../assignButton/AssignButton";
import { useDispatch, useSelector } from "react-redux";
import { setProcessSteps } from "../../../../../../../features/app/appSlice";
import { useEffect } from "react";

const AssignTask = () => {
  const {
    register,
    handleSubmit,

    formState: { isSubmitSuccessful },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const { selectedMembersForProcess, docCurrentWorkflow } = useSelector((state) => state.app);
  const watchRoleValChange = watch("role", false);
  const watchCurrentMemberValChange = watch("members", false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("task", data);
    dispatch(setProcessSteps({ ...data, "workflow": docCurrentWorkflow._id }))
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
    
    if (!foundCurrentMemberPortfolio) return

    setMemberPortfolios([{ id: uuidv4(), option: foundCurrentMemberPortfolio.portfolio_name }])
    
  }, [selectedMembersForProcess])

  useEffect(() => {
    
    if (!watchRoleValChange) return 

    const currentRoleVal = watchRoleValChange.split("_")[1];

    let [ membersMatchingCriteria, foundMembers ] = [ [], [] ];

    if (currentRoleVal === "Team Member") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "team_member");

    if (currentRoleVal === "Guest (enter phone/email)") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "guest");
    
    if (currentRoleVal === "Public (link)") membersMatchingCriteria = selectedMembersForProcess.filter(user => user.member_type === "public");

    foundMembers = membersMatchingCriteria.map(user => {
      return {
        id : uuidv4(),
        option: user?.username,
      }
    });

    setMembersForCurrentUser(foundMembers);

  }, [watchRoleValChange, selectedMembersForProcess])

  useEffect(() => {

    if (!watchCurrentMemberValChange) return 

    const valAfterUuid = watchCurrentMemberValChange.split("_")[1];

    if (watchCurrentMemberValChange.indexOf(valAfterUuid) === -1) return

    const currentMemberVal = watchCurrentMemberValChange.slice(watchCurrentMemberValChange.indexOf(valAfterUuid), watchCurrentMemberValChange.length);
    
    const foundCurrentMemberPortfolio = selectedMembersForProcess.find(user => user.username === currentMemberVal)
    
    if (!foundCurrentMemberPortfolio) return

    setMemberPortfolios([{ id: uuidv4(), option: foundCurrentMemberPortfolio.portfolio_name }])
    
  }, [watchCurrentMemberValChange, selectedMembersForProcess])

  return (
    <FormLayout isSubmitted={isSubmitSuccessful} loading={loading}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Select register={register} name="role" options={roleArray} />
        <Select register={register} name="members" options={membersForCurrentUser} />
        <Select
          register={register}
          name="memberPortfolio"
          options={memberPortfolios}
        />
        <select
          required
          {...register("taskFeature")}
          size={taskFeatures.length}
          className={globalStyles.task__features}
        >
          {taskFeatures.map((item) => (
            <option className={globalStyles.task__features__text} key={item.id}>
              {item.feature}
            </option>
          ))}
        </select>
        <Select
          register={register}
          name="displayDoc"
          options={displayDocument}
        />
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
  },
  { id: uuidv4(), option: "Guest (enter phone/email)" },
  { id: uuidv4(), option: "Public (link)" },
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
  { id: uuidv4(), feature: "Add/Edit" },
  { id: uuidv4(), feature: "View" },
  { id: uuidv4(), feature: "Comment" },
  { id: uuidv4(), feature: "Approve" },
];

export const membersPortfolio = [
  { id: uuidv4(), option: "Member Porfolio 1" },
  { id: uuidv4(), option: "Member Porfolio 2" },
  { id: uuidv4(), option: "Member Porfolio 3" },
];

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step" },
  { id: uuidv4(), option: "Display document after processing this step" },
  { id: uuidv4(), option: "Display document only in this step" },
  { id: uuidv4(), option: "Display document in all steps" },
];
