import React, { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import sidebarStyles from "../sidebar.module.css";
import {
  mineDocuments,
  savedDocuments,
} from "../../../features/document/asyncThunks";
import {
  mineTemplates,
  savedTemplates,
} from "../../../features/template/asyncThunks";
import { savedWorkflows } from "../../../features/workflow/asyncTHunks";
import { getItemsCounts } from "../../../features/app/asyncThunks";

const ManageFile = () => {
  const dispatch = useDispatch();
  const { userDetail } = useSelector((state) => state.auth);

  const { savedWorkflowItems } = useSelector((state) => state.workflow);
  const { savedTemplatesItems } = useSelector((state) => state.template);
  const { savedDocumentsItems } = useSelector((state) => state.document);

  const { itemsCount } = useSelector((state) => state.app);

  const [test, setTest] = useState(manageFileItems);

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info[0].org_id,
    };

    /*  dispatch(savedDocuments(data));
    dispatch(savedTemplates(data));
    dispatch(savedWorkflows(data)); */
    dispatch(getItemsCounts(data));
  }, []);

  useEffect(() => {
    if (itemsCount) {
      setTest((prev) =>
        prev.map((item) =>
          item.parent.includes("Documents")
            ? {
                ...item,
                count:
                  itemsCount.process_count > 0
                    ? itemsCount.document_count
                    : "000",
              }
            : item.parent.includes("Templates")
            ? {
                ...item,
                count:
                  itemsCount.process_count > 0
                    ? itemsCount.template_count
                    : "000",
              }
            : item.parent.includes("Workflows")
            ? {
                ...item,
                count:
                  itemsCount.process_count > 0
                    ? itemsCount.process_count
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
    }
  }, [itemsCount]);

  console.log("itemsCOunt1", itemsCount);

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
      { id: uuidv4(), child: "Waiting to Process", href: "#" },
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
      /*    {
        id: uuidv4(),
        child: "Waiting to Process",
        href: "/processes/",
      }, */
    ],
  },
];
