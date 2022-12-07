import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mineTemplates } from "../../../features/template/asyncThunks";

const TemplatesPage = () => {
  const { miningTemplates } = useSelector((state) => state.template);
  const dispatch = useDispatch();

  console.log("mining templateeeeeeeeeeeeeeeeeee", miningTemplates);

  useEffect(() => {
    const data = {
      company_id: "6360b64d0a882cf6308f5758",
    };

    dispatch(mineTemplates(data));
  }, []);

  return (
    <WorkflowLayout>
      <div id="newTemplate">
        <ManageFiles title="Template">
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              cardItems={drafts}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              feature="template"
              cardBgColor="#1ABC9C"
              title="created by me"
              cardItems={miningTemplates}
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default TemplatesPage;

export const createTemplatesByMe = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];

export const drafts = [
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
  { id: uuidv4() },
];
