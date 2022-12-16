import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  mineTemplates,
  draftsTemplate,
} from "../../../features/template/asyncThunks";
import TemplateCard from "../../../components/hoverCard/templateCard/TemplateCard";

const TemplatesPage = () => {
  const { userDetail } = useSelector((state) => state.auth);

  const { minedTemplates, mineStatus, draftsTemplateStatu, draftedTemplates } =
    useSelector((state) => state.template);
  const dispatch = useDispatch();

  console.log("mining templateeeeeeeeeeeeeeeeeee", minedTemplates);

  useEffect(() => {
    const savedTemplates = {
      company_id: userDetail?.portfolio_info.org_id,
    };

    const mineData = {
      company_id: userDetail?.portfolio_info.org_id,
      created_by: userDetail?.portfolio_info.username,
    };

    dispatch(mineTemplates(mineData));
    /*  dispatch(mineTemplates(draftData)); */
    dispatch(draftsTemplate(savedTemplates));
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
              cardItems={minedTemplates}
              status={mineStatus}
            />
          </div>
          <div id="saved-templates">
            <SectionBox
              cardBgColor="#1ABC9C"
              title="saved templates"
              Card={TemplateCard}
              cardItems={draftedTemplates}
              status={draftsTemplateStatu}
            />
          </div>
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default TemplatesPage;

export const createTemplatesByMe = [{ id: uuidv4() }];

export const drafts = [{ id: uuidv4() }];
