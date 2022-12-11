import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mineTemplates } from "../../../features/template/asyncThunks";
import TemplateCard from "../../../components/hoverCard/templateCard/TemplateCard";
import { localStorageGetItem } from "../../../utils/localStorageUtils";

const TemplatesPage = () => {
  const userDetail = localStorageGetItem("userDetail");
  const { minedTemplates, draftsTemlateItems } = useSelector(
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
      <div id="newTemplate">
        <ManageFiles title="Template">
          <div id="drafts">
            <SectionBox
              /*  feature="template" */
              cardBgColor="#1ABC9C"
              title="drafts"
              Card={TemplateCard}
              cardItems={drafts}
            />
          </div>
          <div id="createdByMe">
            <SectionBox
              feature="template"
              cardBgColor="#1ABC9C"
              title="created by me"
              Card={TemplateCard}
              cardItems={minedTemplates}
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
