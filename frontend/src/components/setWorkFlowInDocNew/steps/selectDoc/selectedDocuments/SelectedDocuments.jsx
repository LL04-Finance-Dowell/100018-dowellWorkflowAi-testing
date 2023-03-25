import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCurrentDocToWfs } from "../../../../../features/app/appSlice";
import { contentDocument } from "../../../../../features/document/asyncThunks";
import { setContentOfDocument } from "../../../../../features/document/documentSlice";
import { PrimaryButton } from "../../../../styledComponents/styledComponents";
import styles from "./selectedDocuments.module.css";

const SelectedDocuments = ({ selectedDocument, selectedDocuments, disableSelections }) => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const dispatch = useDispatch();

  const onSubmit = (data) => {
    if (!selectedDocument) return
    
    // console.log("submitsadsadasd");
    const { document } = data;

    // console.log("first document", document);
    // const currentDocument = selectedDocuments.find(
      // (item) => item._id === document
    // );

    // const fetchData = { document_id: currentDocument?._id };

    // console.log("second document", document);
    dispatch(contentDocument(selectedDocument._id));
    dispatch(setCurrentDocToWfs(selectedDocument));
    dispatch(setContentOfDocument(null));
  };

  return (
    <div className={`${styles.container} ${isSubmitted && styles.selected}`} style={{ pointerEvents: disableSelections ? 'none' : 'all' }}>
      {/*  <div className={styles.selected__doc__box}> */}
      {
      !selectedDocument ? (
        <h3 className={styles.no__item}>Please select document</h3>
      ) :
      selectedDocuments?.length > 0 ? (
        <>
          <h2 className={styles.header}>
            Copies of the selected document (select for processing)
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <select
              required
              {...register("document")}
              className={styles.selected__doc__box}
              size={selectedDocuments.length > 1 ? selectedDocuments.length : 2}
            >
              {selectedDocuments.map((item) => (
                <option value={item._id} key={item._id}>
                  {item.document_name}
                </option>
              ))}
            </select>
            <PrimaryButton type="submit" hoverBg="success">
              Add selected document copies to process (Break processing of
              unselected)
            </PrimaryButton>
          </form>
        </>
      ) : (
        <>
          <h3 className={styles.no__item}>No document copies found for {selectedDocument.document_name}</h3>
          <PrimaryButton type="submit" hoverbg="success" onClick={onSubmit}>
            Add selected document copies to process (Break processing of
            unselected)
          </PrimaryButton>
        </>
      )}
    </div>
  );
};

export default SelectedDocuments;
