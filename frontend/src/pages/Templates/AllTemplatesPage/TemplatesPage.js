import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mineTemplates } from "../../../features/template/asyncThunks";
import TemplateCard from "../../../components/hoverCard/templateCard/TemplateCard";

const TemplatesPage = () => {
  const { userDetail } = useSelector((state) => state.auth);

  const { minedTemplates, draftsTemlateItems, mineStatus } = useSelector(
    (state) => state.template
  );
  const dispatch = useDispatch();

  console.log("mining templateeeeeeeeeeeeeeeeeee", minedTemplates);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info.org_id,
    };

    dispatch(mineTemplates(data));
  }, []);

  return (
    <WorkflowLayout>
      <div id="new-template">
        <ManageFiles title="Template">
          <div id="drafts">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={TemplateCard}
              cardItems={drafts}
            />
          </div>
          <div id="saved-templates">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved templates"
              Card={TemplateCard}
              cardItems={minedTemplates}
              status={mineStatus}
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

export const drafts = [{ id: uuidv4() }];
