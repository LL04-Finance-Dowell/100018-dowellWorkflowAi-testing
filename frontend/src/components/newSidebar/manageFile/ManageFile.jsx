import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";

import sidebarStyles from "../sidebar.module.css";
import { mineDocuments } from "../../../features/document/asyncThunks";
import { mineTemplates } from "../../../features/template/asyncThunks";
import { mineWorkflow } from "../../../features/workflow/asyncTHunks";
import { localStorageGetItem } from "../../../utils/localStorageUtils";

const ManageFile = () => {
  const dispatch = useDispatch();
  const userDetail = localStorageGetItem("userDetail");

  const { minedWorkflows } = useSelector((state) => state.workflow);
  const { minedTemplates } = useSelector((state) => state.template);
  const { minedDocuments } = useSelector((state) => state.document);

  const [test, setTest] = useState(manageFileItems);

  console.log("mined docccccccccccccccc", minedDocuments);

  useEffect(() => {
    const docData = {
      created_by: userDetail?.userinfo.username,
      company_id: userDetail?.portfolio_info.org_id,
    };

    const tempData = {
      company_id: userDetail?.portfolio_info.org_id,
    };

    const workData = {
      created_by: userDetail?.userinfo.username,
      company_id: userDetail?.portfolio_info.org_id,
    };

    dispatch(mineDocuments(docData));
    dispatch(mineTemplates(tempData));
    dispatch(mineWorkflow(workData));
  }, []);

  useEffect(() => {
    setTest((prev) =>
      prev.map((item) =>
        item.parent.includes("My Documnets")
          ? {
              ...item,
              count:
                minedDocuments?.length > 0 ? minedDocuments?.length : "000",
            }
          : item.parent.includes("My Templates")
          ? {
              ...item,
              count:
                minedTemplates?.length > 0 ? minedTemplates?.length : "000",
            }
          : item.parent.includes("My Workflows")
          ? {
              ...item,
              count:
                minedWorkflows?.length > 0 ? minedWorkflows?.length : "000",
            }
          : item
      )
    );
  }, [minedDocuments, minedTemplates, minedWorkflows]);

  return (
    <div className={sidebarStyles.feature__box}>
      <h2 className={sidebarStyles.feature__title}>Manage File</h2>
      <CollapseItem items={test} />
    </div>
  );
};

export default ManageFile;

export const manageFileItems = [
  {
    id: uuidv4(),
    parent: "My Documnets",
    children: [
      { id: uuidv4(), child: "New Document", href: "/documents/#newDocument" },
      { id: uuidv4(), child: "Drafts", href: "/documents/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/documents/#createdByMe" },
      { id: uuidv4(), child: "Waiting to Process", href: "#" },
    ],
  },
  {
    id: uuidv4(),
    parent: "My Templates",
    children: [
      { id: uuidv4(), child: "New Template", href: "/templates/#newTemplate" },
      { id: uuidv4(), child: "Drafts", href: "/templates/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/templates/#createdByMe" },
    ],
  },
  {
    id: uuidv4(),
    parent: "My Workflows",
    children: [
      { id: uuidv4(), child: "New Workflow", href: "/workflows/#newWorkflow" },
      { id: uuidv4(), child: "Drafts", href: "/workflows/#drafts" },
      { id: uuidv4(), child: "Created by me", href: "/workflows/#createdByMe" },
      {
        id: uuidv4(),
        child: "Waiting to Process",
        href: "/workflows/set-workflow",
      },
    ],
  },
];
