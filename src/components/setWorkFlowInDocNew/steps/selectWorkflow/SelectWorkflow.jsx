import styles from './selectWorkflow.module.css';
import SelectWorkflowBoxes from './selectWorkflowBoxes/SelectWorkflowBoxes';
import { useAppContext } from '../../../../contexts/AppContext';

import { useDispatch, useSelector } from 'react-redux';
import SelectedWorkflows from './selectedWorkflow/SelectedWorkflows';
import { PrimaryButton } from '../../../styledComponents/styledComponents';
import {
  removeFromSelectedWorkflowsToDocGroup,
  setWfToDocument,
} from '../../../../features/app/appSlice';

import { useTranslation } from 'react-i18next';

const SelectWorkflow = ({ savedDoc }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isMobile } = useAppContext();

  const { currentDocToWfs } = useSelector((state) => state.app);

  const handleRemove = () => {
    if (savedDoc) return;
    dispatch(removeFromSelectedWorkflowsToDocGroup());
  };

  const handleConnectWfToDoc = () => {
    if (savedDoc) return;
    dispatch(setWfToDocument());
    if (currentDocToWfs) {
      // const data = { document_id: currentDocToWfs._id };
      // console.log(data, "dataaaaaaaaaaaaaaaaaa");
      // dispatch(contentDocument(data));
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={`${styles.title} ${styles.h2__Doc__Title} h2-small step-title align-left`}>
        2. {t('Select a Workflow to add to the selected documents')}
      </h2>
      <div className={styles.content__box}>
        <SelectWorkflowBoxes savedDoc={savedDoc} />
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
