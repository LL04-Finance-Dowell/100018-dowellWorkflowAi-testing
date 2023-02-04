import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import sidebarStyles from "../sidebar.module.css";
import {
  allDocuments,
  mineDocuments,
  savedDocuments,
} from "../../../features/document/asyncThunks";
import {
  allTemplates,
  mineTemplates,
  savedTemplates,
} from "../../../features/template/asyncThunks";
import {
  allWorkflows,
  savedWorkflows,
} from "../../../features/workflow/asyncTHunks";
import { getItemsCounts } from "../../../features/app/asyncThunks";

const ManageFile = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.auth);

  const { allWorkflows: allWorkflowsArray, allWorkflowsStatus } = useSelector(
    (state) => state.workflow
  );
  const { allTemplates: allTemplatesArray, allTemplatesStatus } = useSelector(
    (state) => state.template
  );
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );

  const [test, setTest] = useState(manageFileItems);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    /*  if (savedDocumentsStatus === "idle") dispatch(savedDocuments(data));
    if (savedTemplatesItemsStatus === "idle") dispatch(savedTemplates(data));
    if (savedWorkflowStatus === "idle") dispatch(savedWorkflows(data)); */

    if (allDocumentsStatus === "idle") dispatch(allDocuments(data));
    if (allTemplatesStatus === "idle") dispatch(allTemplates(data));
    if (allWorkflowsStatus === "idle") dispatch(allWorkflows(data));
  }, []);

  useEffect(() => {
    setTest((prev) =>
      prev.map((item) =>
        item.parent.includes("Documents")
          ? {
              ...item,
              count:
                allDocumentsArray?.length > 0
                  ? allDocumentsArray?.length
                  : "000",
            }
          : item.parent.includes("Templates")
          ? {
              ...item,
              count:
                allTemplatesArray?.length > 0
                  ? allTemplatesArray?.length
                  : "000",
            }
          : item.parent.includes("Workflows")
          ? {
              ...item,
              count:
                allWorkflowsArray?.length > 0
                  ? allWorkflowsArray?.length
                  : "000",
            }
          : item.parent.includes("Processes")
          ? {
              ...item,
              count: "000",
            }
          : item
      )
    );
  }, [allDocumentsArray, allTemplatesArray, allWorkflowsArray]);

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
    parent: "Documents",
    children: [
      { id: uuidv4(), child: "Drafts", href: "/documents/#drafts" },
      {
        id: uuidv4(),
        child: "saved documents",
        href: "/documents/#saved-documents",
      },
      /*   { id: uuidv4(), child: "Waiting to Process", href: "#" }, */
    ],
  },
  {
    id: uuidv4(),
    parent: "Templates",
    children: [
      { id: uuidv4(), child: "Drafts", href: "/templates/#drafts" },
      {
        id: uuidv4(),
        child: "saved templates",
        href: "/templates/#saved-templates",
      },
    ],
  },
  {
    id: uuidv4(),
    parent: "Workflows",
    children: [
      { id: uuidv4(), child: "Drafts", href: "/workflows/#drafts" },
      {
        id: uuidv4(),
        child: "saved workflows",
        href: "/workflows/#saved-workflows",
      },
      {
        id: uuidv4(),
        child: "Waiting to Process",
        href: "/workflows/set-workflow",
      },
    ],
  },
  {
    id: uuidv4(),
    parent: "Processes",
    children: [
      { id: uuidv4(), child: "Drafts", href: "/processes/#drafts" },
      {
        id: uuidv4(),
        child: "saved processes",
        href: "/processes/#saved-processes",
      },
      {
        id: uuidv4(),
        child: "Waiting to Process",
        href: "/workflows/new-set-workflow",
      },
    ],
  },
];
