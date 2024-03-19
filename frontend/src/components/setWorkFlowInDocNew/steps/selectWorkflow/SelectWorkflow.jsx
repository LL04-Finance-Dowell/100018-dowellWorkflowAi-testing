import React, {useEffect} from 'react';
import styles from './selectWorkflow.module.css';
import SelectWorkflowBoxes from './selectWorkflowBoxes/SelectWorkflowBoxes';
import { useAppContext } from '../../../../contexts/AppContext';

import { useDispatch, useSelector } from 'react-redux';
import SelectedWorkflows from './selectedWorkflow/SelectedWorkflows';
import { PrimaryButton } from '../../../styledComponents/styledComponents';


import { startConnecting } from '../../../../features/processCopyReducer';

import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { setWfToDocument } from '../../../../features/processes/processesSlice';
import { removeFromSelectedWorkflowsToDocGroup } from '../../../../features/app/appSlice';

const SelectWorkflow = ({ savedDoc }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useAppContext();

  const { currentDocToWfs, selectedWorkflowsToDoc, docCurrentWorkflow, } = useSelector((state) => state.processes);
  const { contentOfDocument } = useSelector((state) => state.document);

  ////copied workflow
  const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);
  const startCopyingWF = useSelector((state)=> state.copyProcess.startSelectWorkflow)

  useEffect(() => {
    if (!copiedWorkflow) return;

    // console.log('start useEffect in step 2. select workflow',startCopyingWF ,selectedWorkflowsToDoc?.length)
    const timerId = setTimeout(() => {
    if (selectedWorkflowsToDoc?.length >= 1 && copiedWorkflow !==null && startCopyingWF) {
    //  // console.log('entered to stpe 2. slect workflow')
      // const contentPageWise = contentOfDocument.reduce((r, a) => {
      //   r[a.pageNum] = r[a.pageNum] || [];
      //   r[a.pageNum].push(a);
      //   return r;
      // }, Object.create(null))
   
      // if (Object.keys(contentPageWise || {}).length < 1) return toast.info("The document selected for processing cannot be empty.");
      dispatch(setWfToDocument());
      // // console.log('middle of step 2')
      dispatch(startConnecting())
      // // console.log('finished useEffect in step 2. select workflow')
    }}, 2000);
    return () => clearTimeout(timerId);
  },[copiedWorkflow, selectedWorkflowsToDoc, startCopyingWF])


  const handleRemove = () => {
    if (savedDoc) return;
    dispatch(removeFromSelectedWorkflowsToDocGroup());
    dispatch(setWfToDocument());
  };

  const handleConnectWfToDoc = () => {
    // console.log(selectedWorkflowsToDoc)
    if ( selectedWorkflowsToDoc?.length < 1) {
      return toast.info('Please Select a Workflow to Continue');
    }
    
    if (savedDoc || selectedWorkflowsToDoc?.length < 1) return;

    const contentPageWise = contentOfDocument.reduce((r, a) => {
      r[a.pageNum] = r[a.pageNum] || [];
      r[a.pageNum].push(a);
      return r;
    }, Object.create(null))

    if (Object.keys(contentPageWise || {}).length < 1) return toast.info("The document selected for processing cannot be empty.");

    dispatch(setWfToDocument());
    if (currentDocToWfs) {
      // const data = { document_id: currentDocToWfs._id };

      // dispatch(contentDocument(data));
    }
    
  };

  return (
    <div className={styles.container}>
      <h2 id='step-title' className={`${styles.title} ${styles.h2__Doc__Title} h2-small step-title align-left`}>
        2. {t('Select a Workflow to add to the selected documents')}
      </h2>
      <div className={styles.content__box}>
        <SelectWorkflowBoxes savedDoc={savedDoc} handleRemove={handleRemove} />
        <SelectedWorkflows savedDoc={savedDoc} />
        <div className={styles.button__container}>
          <PrimaryButton
            onClick={handleConnectWfToDoc}
            hoverBg={savedDoc ? '' : 'success'}
            disabled={savedDoc ? true : false}
            style={{
              backgroundColor: 'var(--e-global-color-accent)',
              color: 'white',
              cursor: savedDoc ? 'not-allowed' : 'pointer',
            }}
            darkBgOnHover={true}
          >
            {isMobile ? 'Add' : t('Add Selected Workflows to document')}
          </PrimaryButton>
          <PrimaryButton
            onClick={handleRemove}
            hoverBg={savedDoc ? '' : 'error'}
            disabled={savedDoc ? true : false}
            style={{
              cursor: savedDoc ? 'not-allowed' : 'pointer',
            }}
            className={styles.btnsuces}
          >
            {isMobile ? 'Remove' : t('Remove Selected Workflows from document')}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default SelectWorkflow;
