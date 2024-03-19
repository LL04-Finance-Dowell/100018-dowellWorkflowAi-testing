import ConnectWorkFlowToDoc from './steps/connectWebflowToDoc/ConnectWorkFlowToDoc';
import SelectDoc from './steps/selectDoc/SelectDoc';
import SelectWorkflow from './steps/selectWorkflow/SelectWorkflow';
import styles from './setWorkflowInDoc.module.css';
import CheckErrors from './steps/checkErrors/CheckErrors';
import ProcessDocument from './steps/processDocument/ProcessDocument';
import ProcessName from '../setWorkFlowInDocNew/steps/setProcessName/ProcessName';
import ContentMapOfDoc from './contentMapOfDoc/ContentMapOfDoc';

import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setContentOfDocument } from '../../features/document/documentSlice';
import { getContinents } from '../../services/locationServices';
import { 
    resetSetWorkflows,
    setContinents,
    setContinentsLoaded, } from '../../features/processes/processesSlice';


const SetWorkflowInDoc = () => {
  const dispatch = useDispatch();
  const { userDetail, session_id } = useSelector((state) => state.auth);
  const { continentsLoaded } = useSelector((state) => state.proccesses.app);

  useEffect(() => {
    dispatch(resetSetWorkflows());
    dispatch(setContentOfDocument(null));

    if (continentsLoaded) return;

    getContinents(userDetail?.userinfo?.username, session_id)
      .then((res) => {
        const formattedContinents = res.data.map((item) => {
          const copyOfItem = { ...item };
          copyOfItem.id = crypto.randomUUID();
          copyOfItem.option = item.name;
          return copyOfItem;
        });
        dispatch(setContinents(formattedContinents));
        dispatch(setContinentsLoaded(true));
      })
      .catch((err) => {
        // console.log(err, 'Failed to fetch continents');
        dispatch(setContinentsLoaded(true));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <WorkflowLayout>
      <div
        style={{ position: 'relative', display: 'flex' }}
        className={`${styles.container} set-workflow-in-document-container`}
      >
        <h2 className={`${styles.title} h2-large`}>
          Set WorkFlows in Documents
        </h2>
        <div className={styles.select__container}>
          <div className={styles.left__container}>
            <SelectDoc />
          </div>
          <div className={styles.right__container}>
            <SelectWorkflow />
          </div>
        </div>
        <ContentMapOfDoc />
        <ConnectWorkFlowToDoc />
        <CheckErrors />
        <ProcessName />
        <ProcessDocument />
        {/* <CustomerSupport /> */}
      </div>
    </WorkflowLayout>
  );
};

export default SetWorkflowInDoc;
