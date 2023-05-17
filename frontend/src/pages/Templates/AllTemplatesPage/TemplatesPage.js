import ManageFiles from "../../../components/manageFiles/ManageFiles";
import SectionBox from "../../../components/manageFiles/sectionBox/SectionBox";
import WorkflowLayout from "../../../layouts/WorkflowLayout/WorkflowLayout";
import "./style.css";
import { v4 as uuidv4 } from "uuid";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  allTemplates,
  mineTemplates,
  savedTemplates,
} from "../../../features/template/asyncThunks";
import TemplateCard from "../../../components/hoverCard/templateCard/TemplateCard";
import { useNavigate } from "react-router-dom";

const TemplatesPage = ({ home, showOnlySaved, showOnlyTrashed }) => {
  const { userDetail } = useSelector((state) => state.auth);

  const {
    minedTemplates,
    mineStatus,
    allTemplates: allTemplatesArray,
    savedTemplatesItemsStatus,
    savedTemplatesItems,
    allTemplatesStatus,
  } = useSelector((state) => state.template);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("mining templateeeeeeeeeeeeeeeeeee", minedTemplates);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
      data_type: userDetail?.portfolio_info[0].data_type,
    };

    /*  if (mineStatus === "idle") dispatch(mineTemplates(mineData));
    if (savedTemplatesItemsStatus === "idle")
      dispatch(savedTemplates(savedTemplatesData)); */

    if (allTemplatesStatus === "idle") dispatch(allTemplates(data));
  }, [userDetail]);

  useEffect(() => {
    if (showOnlySaved) navigate("#saved-templates")
    if (showOnlyTrashed) navigate("#trashed-templates")
    if (home) navigate('#drafts')
  }, [showOnlySaved, showOnlyTrashed, home])

  console.log("allTemplatesArrayallTemplatesArray", allTemplatesArray);

  return (
    <WorkflowLayout>
      <div id="new-template">
        <ManageFiles title="Templates" removePageSuffix={true}>
          {
            home ? <div id="drafts">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="drafts"
                Card={TemplateCard}
                cardItems={
                  allTemplatesArray &&
                  allTemplatesArray.length &&
                  allTemplatesArray.filter(
                    (item) =>
                      item.created_by === userDetail?.portfolio_info[0].username
                  ).filter(item => item.data_type === userDetail?.portfolio_info[0]?.data_type)
                }
                status={allTemplatesStatus}
                itemType={"templates"}
              />
            </div> : <></>
          }
          {
            showOnlySaved ? <div id="saved-templates">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="saved templates"
                Card={TemplateCard}
                cardItems={allTemplatesArray.filter(item => item.data_type === userDetail?.portfolio_info[0]?.data_type)}
                status={allTemplatesStatus}
                itemType={"templates"}
              />
            </div> : <></>
          }
          {
            showOnlyTrashed ? <div id="trashed-templates">
              <SectionBox
                cardBgColor="#1ABC9C"
                title="trashed templates"
                Card={TemplateCard}
                cardItems={[]}
                status={allTemplatesStatus}
                itemType={"templates"}
              />
            </div> : <></>
          }
        </ManageFiles>
      </div>
    </WorkflowLayout>
  );
};

export default TemplatesPage;

export const createTemplatesByMe = [{ id: uuidv4() }];

export const drafts = [{ id: uuidv4() }];
