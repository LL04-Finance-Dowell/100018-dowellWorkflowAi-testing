import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { setCurrentDocToWfs } from "../../../../../features/app/appSlice";
import { setContentOfDocument } from "../../../../../features/document/documentSlice";
import { PrimaryButton } from "../../../../styledComponents/styledComponents";
import styles from "./selectedDocuments.module.css";

const SelectedDocuments = ({ selectedDocuments }) => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();

  /*   const handleAddDocument = (document) => {
    dispatch(setCurrentDocToWfs(document));
    dispatch(setContentOfDocument(null));
  }; */

  const onSubmit = (data) => {
    const { document } = data;
    /*     console.log("documenttttttttttttttttttttttttt", document);
    const currentDocument = selectedDocuments.find(
      (item) => item._id === document
    );
    console.log("documenttttttttttttttttttttttttt", currentDocument); */
    dispatch(setCurrentDocToWfs(document));
    dispatch(setContentOfDocument(null));
  };

  return (
    <div className={styles.container}>
      {/*  <div className={styles.selected__doc__box}> */}
      {selectedDocuments.length > 0 ? (
        <>
          <h2 className={styles.header}>
            Copies of the selected document (select for processing)
          </h2>
          <form onSubmit={handleSubmit(onSubmit)}>
            <select
              {...register("document")}
              className={styles.selected__doc__box}
              size={selectedDocuments.length}
            >
              {selectedDocuments.map((item) => (
                <option value={item} key={item._id}>
                  {item.document_name}
                </option>
              ))}
            </select>
            {/* </div> */}
            <PrimaryButton
              type="submit"
              /*  onClick={() => handleAddDocument()} */
              hoverBg="success"
            >
              Add selected document copies to process (Break processing of
              unselected)
            </PrimaryButton>
          </form>
        </>
      ) : (
        <h3 className={styles.no__item}>Please select document</h3>
      )}
    </div>
  );
};

export default SelectedDocuments;
