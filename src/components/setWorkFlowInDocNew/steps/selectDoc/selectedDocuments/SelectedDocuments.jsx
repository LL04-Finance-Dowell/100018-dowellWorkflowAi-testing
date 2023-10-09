import React, {useEffect} from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentDocToWfs } from '../../../../../features/app/appSlice';
import { contentDocument } from '../../../../../features/document/asyncThunks';
import { setContentOfDocument } from '../../../../../features/document/documentSlice';
import { PrimaryButton } from '../../../../styledComponents/styledComponents';
import styles from './selectedDocuments.module.css';
import { useTranslation } from 'react-i18next';

import { startCopyingWorkflow } from '../../../../../features/processCopyReducer';
import { contentTemplate } from '../../../../../features/template/asyncThunks';

const SelectedDocuments = ({
  selectedDocument,
  selectedDocuments,
  disableSelections,
}) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  console.log(selectedDocuments.clones)

    ///import which doc or template approval
    const whichApproval = useSelector((state)=> state.copyProcess.whichApproval)

    ////copied docs
    const copiedDocument = useSelector((state) => state.copyProcess.document);
    const startCopyingDoc = useSelector((state)=> state.copyProcess.startSelectDocument)
    useEffect(() => {
      if (!copiedDocument) return;
    
      // console.log('Selection started!', startCopyingDoc);

      if(copiedDocument !==null && startCopyingDoc == true){
        setTimeout(()=>{
          dispatch(contentDocument(copiedDocument.collection_id));
          dispatch(setCurrentDocToWfs(copiedDocument));
          dispatch(setContentOfDocument(null));
          dispatch(startCopyingWorkflow())
          // console.log('document should be selected');
        },3000)
        
      }

    }, [copiedDocument, startCopyingDoc]);
    
    // console.log('the selected document is ', selectedDocument)

  const onSubmit = (data) => {
    if (!selectedDocument) return;

   

    
    // const currentDocument = selectedDocuments.find(
    // (item) => item._id === document
    // );

    // const fetchData = { document_id: currentDocument?._id };

    if(whichApproval == 'Document'){
     const item = 'documents'
      dispatch(contentDocument({ collection_id: selectedDocument.collection_id, item }));
    }
    else{
      const item = 'templates'
      dispatch(contentDocument({ collection_id: selectedDocument.collection_id, item }));
    }

    // dispatch(contentDocument(selectedDocument.collection_id, whichApproval));
    dispatch(setCurrentDocToWfs(selectedDocument));
    dispatch(setContentOfDocument(null));
  };

  return (
    <div
      className={`${styles.container} ${isSubmitted && styles.selected}`}
      style={{ pointerEvents: disableSelections ? 'none' : 'all' }}
    >
      {/*  <div className={styles.selected__doc__box}> */}
      {!selectedDocument ? (
        <h3 className={styles.no__item}>{t('Please select document')}</h3>
      ) : selectedDocuments?.length > 0 ? (
        <>
          <h2 className={styles.header}>
            Copies of the selected document (select for processing)
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <select
              required
              {...register('document')}
              className={styles.selected__doc__box}
              size={selectedDocuments.length > 1 ? selectedDocuments.length : 2}
            >
              {selectedDocuments.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.document_name}
                </option>
              ))}
            </select>
            <PrimaryButton type='submit' hoverBg='success'>
              Add selected document copies to process (Break processing of
              unselected)
            </PrimaryButton>
          </form>
        </>
      ) : (
        <>
          <h3 className={styles.no__item}>
            No document copies found for {selectedDocument.document_name}
            <br />
            <br />
            <span className={styles.continue__Text}>
              Click the button below to continue
            </span>
          </h3>
          <PrimaryButton type='submit' hoverBg='success' onClick={onSubmit}>
            Add selected document copies to process (Break processing of
            unselected)
          </PrimaryButton>
        </>
      )}
    </div>
  );
};

export default SelectedDocuments;
