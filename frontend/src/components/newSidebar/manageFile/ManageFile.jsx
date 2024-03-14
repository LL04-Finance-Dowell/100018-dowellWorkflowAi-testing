import React, { useState } from 'react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CollapseItem from '../collapseItem/CollapseItem';
import { v4 as uuidv4 } from 'uuid';
import { IoMdArrowDropright } from 'react-icons/io';

import sidebarStyles from '../sidebar.module.css';
import { allDocuments } from '../../../features/document/asyncThunks';
import { allTemplates } from '../../../features/template/asyncThunks';
import { allWorkflows } from '../../../features/workflow/asyncTHunks';
import styles from './manageFile.module.css';

import { useTranslation } from 'react-i18next';
import { productName } from '../../../utils/helpers';
import { HashLink } from 'react-router-hash-link';
import { useAppContext } from '../../../contexts/AppContext';

const ManageFile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { userDetail } = useSelector((state) => state.auth);
  const { themeColor } = useSelector((state) => state.app);
  const { folders } = useAppContext();

  const { allWorkflows: allWorkflowsArray, allWorkflowsStatus } = useSelector(
    (state) => state.workflow
  );
  const { allTemplates: allTemplatesArray, allTemplatesStatus } = useSelector(
    (state) => state.template
  );
  const { allDocuments: allDocumentsArray, allDocumentsStatus } = useSelector(
    (state) => state.document
  );
  const { allProcesses } = useSelector((state) => state.processes);

  const [test, setTest] = useState(manageFileItems);
  const [itemsCountToDisplay, setItemsCountToDisplay] = useState({
    documents: { count: 0, countSet: false },
    workflows: { count: 0, countSet: false },
    templates: { count: 0, countSet: false },
    processes: { count: 0, countSet: false },
  });

  useEffect(() => {
    const data = {
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
          : userDetail?.portfolio_info[0].org_id,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
          : userDetail?.portfolio_info[0].data_type,
    };
    /*  if (savedDocumentsStatus === "idle") dispatch(savedDocuments(data));
    if (savedTemplatesItemsStatus === "idle") dispatch(savedTemplates(data));
    if (savedWorkflowStatus === "idle") dispatch(savedWorkflows(data)); */

    if (allDocumentsStatus === 'idle') dispatch(allDocuments(data));
    if (allTemplatesStatus === 'idle') dispatch(allTemplates(data));
    if (allWorkflowsStatus === 'idle') dispatch(allWorkflows(data));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const currentUserportfolioDataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
        : userDetail?.portfolio_info[0]?.data_type;

    // THIS UPDATES AN INDIVIDUAL ITEM COUNT FOR EITHER DOCUMENT/TEMPLATE/WORKFLOW/PROCESS
    if (
      allDocumentsArray &&
      allDocumentsArray.length > 0 &&
      !itemsCountToDisplay.documents.countSet
    ) {
      const countOfDocuments =
        allDocumentsArray
          .filter(
            (item) =>
              item.created_by === userDetail?.userinfo?.username
          )
          .filter((item) => item.data_type === currentUserportfolioDataType).length
      
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          documents: { count: countOfDocuments, countSet: true },
        };
      });
    }

    if (
      allTemplatesArray &&
      allTemplatesArray.length > 0 &&
      !itemsCountToDisplay.templates.countSet
    ) {
      const countOfTemplates =
        allTemplatesArray
          .filter((item) => item.created_by === userDetail?.userinfo?.username)
          .filter((item) => item.data_type === currentUserportfolioDataType)
          .length 
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          templates: { count: countOfTemplates, countSet: true },
        };
      });
    }

    if (
      allWorkflowsArray &&
      allWorkflowsArray.length > 0 &&
      !itemsCountToDisplay.workflows.countSet
    ) {
      const countOfWorkflows =
        allWorkflowsArray
          .filter((item) => item.created_by === userDetail?.userinfo?.username)
          .filter(
            (item) =>
              item.workflows &&
              (item?.data_type === currentUserportfolioDataType ||
                item.workflows?.data_type === currentUserportfolioDataType)
          ).length
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          workflows: { count: countOfWorkflows, countSet: true },
        };
      });
    }

    if (allProcesses.length > 0 && !itemsCountToDisplay.processes.countSet) {
      const countOfProcesses =
        allProcesses
          .filter((process) => process.processing_state === 'draft')
          .filter(
            (process) => process.data_type === currentUserportfolioDataType
          )
          .filter(
            (process) => process.created_by === userDetail?.userinfo?.username
          )
          .filter((process) => process.workflow_construct_ids).length +
        allProcesses
          .filter((process) => process.processing_state === 'processing')
          .filter(
            (process) => process.data_type === currentUserportfolioDataType
          ).length +
        allProcesses
          .filter((process) => process.processing_state === 'paused')
          .filter(
            (process) => process.data_type === currentUserportfolioDataType
          ).length +
        allProcesses
          .filter((process) => process.processing_state === 'cancelled')
          .filter(
            (process) => process.data_type === currentUserportfolioDataType
          ).length;
      setItemsCountToDisplay((prevItems) => {
        return {
          ...prevItems,
          processes: { count: countOfProcesses, countSet: true },
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allDocumentsArray, allTemplatesArray, allWorkflowsArray, allProcesses]);

  useEffect(() => {
    // THIS UPDATES THE COUNT OF ITEMS IN THE MANAGE FILE SECTION FOR DOCUMENTS/TEMPLATES/WORKFLOWS/PROCESSES
    setTest((prev) =>
      prev.map((item) =>
        item.parent.includes('Documents')
          ? {
            ...item,
            count:
              itemsCountToDisplay.documents.count > 0
                ? itemsCountToDisplay.documents.count
                : '000',
          }
          : item.parent.includes('Templates')
            ? {
              ...item,
              count:
                itemsCountToDisplay.templates.count > 0
                  ? itemsCountToDisplay.templates.count
                  : '000',
            }
            : item.parent.includes('Workflows')
              ? {
                ...item,
                count:
                  itemsCountToDisplay.workflows.count > 0
                    ? itemsCountToDisplay.workflows.count
                    : '000',
              }
              : item.parent.includes('Processes')
                ? {
                  ...item,
                  count:
                    itemsCountToDisplay.processes.count > 0
                      ? itemsCountToDisplay.processes.count
                      : '000',
                }
                : item
      )
    );
  }, [itemsCountToDisplay]);

  return (
    <div className={sidebarStyles.feature__box}>
      <h2
        className={sidebarStyles.feature__title}
        style={{ color: themeColor }}
      >
        {t('Manage Files')}
      </h2>
      <CollapseItem items={test} />

      <HashLink
        to='/folders'
        className={`${styles.folder_href} ${styles.parent__item__box}`}
      >
        <i>
          <IoMdArrowDropright size={25} />
        </i>
        Folders {folders ? `(${folders.length})` : ''}
      </HashLink>
    </div>
  );
};

export default ManageFile;

export const manageFileItems = [
  {
    id: uuidv4(),
    parent: 'Documents',
    children: [
      { id: uuidv4(), child: 'Drafts', href: '/documents/#drafts' },
      {
        id: uuidv4(),
        child: 'saved documents',
        href: '/documents/saved',
      },
      // {
      //   id: uuidv4(),
      //   child: "trash documents",
      //   href: "/documents/trash",
      // },
      /*   { id: uuidv4(), child: "Waiting to Process", href: "#" }, */
    ],
  },
  {
    id: uuidv4(),
    parent: 'Templates',
    children: [
      { id: uuidv4(), child: 'Drafts', href: '/templates/#drafts' },
      {
        id: uuidv4(),
        child: 'saved templates',
        href: '/templates/saved',
      },
      // {
      //   id: uuidv4(),
      //   child: "trash templates",
      //   href: "/templates/trash",
      // },
    ],
  },
  {
    id: uuidv4(),
    parent: 'Workflows',
    children: [
      { id: uuidv4(), child: 'Drafts', href: '/workflows/#drafts' },
      {
        id: uuidv4(),
        child: 'saved workflows',
        href: '/workflows/saved',
      },
      // {
      //   id: uuidv4(),
      //   child: "trash workflows",
      //   href: "/workflows/trash",
      // },
      // {
      //   id: uuidv4(),
      //   child: "Waiting to Process",
      //   href: "/workflows/set-workflow",
      // },
    ],
  },
  {
    id: uuidv4(),
    parent: 'Processes',
    children: [
      { id: uuidv4(), child: 'Drafts', href: '/processes/#drafts' },
      {
        id: uuidv4(),
        child: 'saved processes',
        href: '/processes/saved',
      },
      {
        id: uuidv4(),
        child: 'paused processes',
        href: '/processes/paused',
      },
      {
        id: uuidv4(),
        child: 'cancelled processes',
        href: '/processes/cancelled',
      },
      // {
      //   id: uuidv4(),
      //   child: "trash processes",
      //   href: "/processes/trash",
      // },
      // {
      //   id: uuidv4(),
      //   child: "Waiting to Process",
      //   href: "/workflows/new-set-workflow",
      // },
    ],
  },
  // {
  //   id: uuidv4(),
  //   parent: 'Folders',
  //   href: '/folders',
  //   isFolder: true,
  // },
];
