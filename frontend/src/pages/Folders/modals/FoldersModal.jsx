import React, { useState, useEffect, useRef } from "react";
import styles from "./folders_modal.module.css";
import { FaTimes, FaCaretUp, FaCaretDown } from "react-icons/fa";
import { GiCheckMark } from "react-icons/gi";
import { useAppContext } from "../../../contexts/AppContext";
import { FolderServices } from "../../../services/folderServices";
import { useSelector } from "react-redux";
import { productName } from "../../../utils/helpers";
import { LoadingSpinner } from "../../../components/LoadingSpinner/LoadingSpinner";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { v4 } from "uuid";

const FoldersModal = () => {
  const {
    showFoldersActionModal: { state, action, item },
    setShowFoldersActionModal,
    folders,
    folderActionId,
    setFolders,
    setFolderActionId,
    userDetail,
    fetchFolders,
  } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [folder, setFolder] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [docsList, setDocsList] = useState([]);
  const [tempsList, setTempsList] = useState([]);
  const [docsListToDisplay, setDocsListToDisplay] = useState([]);
  const [tempsListToDisplay, setTempsListToDisplay] = useState([]);
  const [docsListCurrentPage, setDocsListCurrentPage] = useState(1);
  const [tempsListCurrentPage, setTempsListCurrentPage] = useState(1);
  const [totalPageCount, setTotalPageCount] = useState({
    docs: 0,
    temps: 0,
    docPageArr: [],
    tempPageArr: [],
  });
  const [itemsPerPage] = useState(10);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [addFolderId, setAddFolderId] = useState();
  const [addFolder, setAddFolder] = useState({});
  const [foldersContainingItem, setFoldersContainingItem] = useState([]);
  const [userCompanyId, setUserCompanyId] = useState("");
  const [userDataType, setUserDataType] = useState("");

  const { allDocuments } = useSelector((state) => state.document);

  const { allTemplates } = useSelector((state) => state.template);

  const handleCreateFolder = async () => {
    // console.log("foldernameedd", folderName);
    const data = {
      company_id: userCompanyId,
      created_by: userDetail?.userinfo.username,
      data_type: userDataType,
      folder_name: folderName,
    };
    const folderServices = new FolderServices();
    try {
      setIsCreating(true);
      await folderServices.createFolderV2(data);
      const res = await folderServices.getAllFolders(
        userCompanyId,
        userDataType
      ); ///////////////
      setFolders(res.data ? res.data : []);
      toast.success("Folder created");
      navigate("/folders");
      setIsCreating(false);
      setShowFoldersActionModal(false);
    } catch (err) {
      // // console.log(err);
      toast.error("Folder creating failed!");
      setIsCreating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const folderServices = new FolderServices();

    if (action === "add") {
      if (addFolderId) {
        const selFolder = folders.find((folder) => folder._id === addFolderId);
        const key = `${item.type}_id`;
        const value = item._id;
        setAddFolder(selFolder);

        const data = {
          company_id: userCompanyId,
          created_by: userDetail?.userinfo.username,
          data_type: userDataType,
          folder_name: selFolder.folder_name,
          items: [{ [key]: value }],
        };

        try {
          setIsAdding(true);
          await folderServices.updateFolder(data, addFolderId);
          setFolders(
            folders.map((folder) =>
              folder._id === addFolderId
                ? { ...folder, data: [{ [key]: value }, ...folder.data] }
                : folder
            )
          );
          toast.success("Added successfully");
        } catch (err) {
          // // console.log(err);
          toast.error("Failed to add!");
        } finally {
          setShowFoldersActionModal(false);
          setAddFolderId("");
          setIsAdding(false);
        }
      } else toast.warn("Select a folder");
    } else if (action === "edit") {
      // console.log("selectedDocs(", selectedDocs);
      if (folderName) {
        const items = [
          ...selectedDocs.map((doc) => ({ [`${doc.category}_id`]: doc.id })),
          ...selectedTemps.map((temp) => ({
            [`${temp.category}_id`]: temp.id,
          })),
        ];

        const data = {
          company_id: userCompanyId,
          created_by: userDetail?.userinfo.username,
          data_type: userDataType,
          folder_name: folderName,
          items: items,
        };

        try {
          setIsEditing(true);
          await folderServices.updateFolder(data, folder._id);
          setFolders((prev) =>
            prev.map((item) =>
              item._id === folder._id
                ? {
                    ...item,
                    folder_name: folderName,
                    data: [...items, ...item.data],
                  }
                : item
            )
          );
          toast.success("Folder edited");
        } catch (err) {
          // // console.log(err);
          toast.error("Editing failed!");
        } finally {
          setIsEditing(false);
          setShowFoldersActionModal({ state: false, action: "" });
        }
      } else toast.warn("Enter Folder name");
    } else if (action === "delete") {
      setIsDeleting(true);
      try {
        const data = { item_id: folder._id, item_type: "folder" };
        await folderServices.deleteFolder(data);
        setFolders((prev) => prev.filter((fld) => fld._id !== folder._id));
        toast.success("Folder deleted");
      } catch (err) {
        // // console.log(err);
        toast.error("Deleting failed!");
      } finally {
        setIsDeleting(false);
        setShowFoldersActionModal({ state: false, action: "" });
      }
    } else if (action === "remove") {
      const data = {
        item_type: item.document_name
          ? "document"
          : item.template_name
          ? "template"
          : "",
      };
      const folderServices = new FolderServices();
      setIsRemoving(true);
      try {
        await folderServices.removeFolderItem(data, folderActionId, item._id);
        const modFolder = {
          ...folder,
          data: folder.data.filter(
            (itm) =>
              (itm.document_id && itm.document_id !== item._id) ||
              (itm.template_id && itm.template_id !== item._id)
          ),
        };

        setFolders((prev) =>
          prev.map((folderArr) =>
            folderArr._id === folderActionId
              ? {
                  ...folderArr,
                  data: folderArr.data.filter(
                    (itm) =>
                      (itm.document_id && itm.document_id !== item._id) ||
                      (itm.template_id && itm.template_id !== item._id)
                  ),
                }
              : folderArr
          )
        );

        toast.success(
          `${
            item.document_name
              ? "Document"
              : item.template_name
              ? "Template"
              : ""
          } removed`
        );
        setShowFoldersActionModal(false);
      } catch (err) {
        // // console.log(err);
        toast.error(
          `Failed to remove ${
            item.document_name
              ? "Document"
              : item.template_name
              ? "Template"
              : ""
          }`
        );
      } finally {
        setIsRemoving(false);
      }
    }
  };

  useEffect(() => {
    if (!userDetail || userDetail.msg || userDetail.message) return;

    const companyId =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info?.find(
            (portfolio) => portfolio.product === productName
          )?.org_id
        : userDetail?.portfolio_info[0]?.org_id;

    const dataType =
      userDetail?.portfolio_info?.length > 1
        ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.data_type
        : userDetail?.portfolio_info[0].data_type;

    setUserCompanyId(companyId);
    setUserDataType(dataType);
    fetchFolders();
  }, [userDetail]);

  useEffect(() => {
    if (folderActionId)
      setFolder(folders.find((folder) => folder._id === folderActionId));
    else setFolder({});
  }, [folderActionId]);

  useEffect(() => {
    if (folder) {
      setFolderName(folder.folder_name);
    }
  }, [folder]);

  useEffect(() => {
    if (action === "add") {
      setFoldersContainingItem(
        folders.filter((folder) =>
          folder.data.find((itm) => itm[`${item.type}_id`] === item._id)
        )
      );
    } else {
      setFoldersContainingItem([]);
    }
  }, [action]);

  useEffect(() => {
    if (allDocuments)
    // // console.log("allDocuments", allDocuments
    // .filter((doc) => doc.document_type === 'original')
    // .map((doc) => ({
    //   name: doc.document_name,
    //   id: doc._id,
    //   category: 'document',
    // })))
    setDocsList(allDocuments.map((doc) => ({
      name: doc.document_name,
      id: doc._id,
      category: 'document',
    })));
    // setDocsList(
    //   allDocuments
    //     .filter((doc) => doc.document_type === "original")
    //     .map((doc) => ({
    //       name: doc.document_name,
    //       id: doc._id,
    //       category: "document",
    //     }))
    // );

    if (allTemplates)
      setTempsList(
        allTemplates.map((temp) => ({
          name: temp.template_name,
          id: temp._id,
          category: "template",
        }))
      );
  }, [allDocuments, allTemplates]);

  useEffect(() => {
    const start = (docsListCurrentPage - 1) * itemsPerPage;
    const end = docsListCurrentPage * itemsPerPage;
    setDocsListToDisplay(docsList.slice(start, end));
  }, [docsList, docsListCurrentPage]);

  useEffect(() => {
    const start = (tempsListCurrentPage - 1) * itemsPerPage;
    const end = tempsListCurrentPage * itemsPerPage;

    setTempsListToDisplay(tempsList.slice(start, end));
  }, [tempsList, tempsListCurrentPage]);

  useEffect(() => {
    if (docsList.length)
      setTotalPageCount((prev) => ({
        ...prev,
        docs: Math.ceil(docsList.length / itemsPerPage),
      }));

    if (tempsList.length)
      setTotalPageCount((prev) => ({
        ...prev,
        temps: Math.ceil(tempsList.length / itemsPerPage),
      }));
  }, [docsList, tempsList]);

  useEffect(() => {
    if (totalPageCount.docs) {
      if (totalPageCount.docs !== totalPageCount.docPageArr.length) {
        const modArr = [];
        for (let i = 1; i <= totalPageCount.docs; i++) {
          modArr.push(i);
        }
        setTotalPageCount((prev) => ({ ...prev, docPageArr: [...modArr] }));
      }
    }

    if (totalPageCount.temps) {
      if (totalPageCount.temps !== totalPageCount.tempPageArr.length) {
        const modArr = [];
        for (let i = 1; i <= totalPageCount.temps; i++) {
          modArr.push(i);
        }
        setTotalPageCount((prev) => ({ ...prev, tempPageArr: [...modArr] }));
      }
    }
  }, [totalPageCount]);

  useEffect(() => {
    if (!state) {
      setFolderActionId("");
      setSelectedDocs([]);
      setSelectedTemps([]);
    }
  }, [state]);

  const handleFolderChange = (e) => {
    setFolderName(e.target.value);
    // console.log("foldername", folderName);
  };

  ///////////////////////////// Checking whether the input is empty
  const [isFolderNameEmpty, setIsFolderNameEmpty] = useState(true);

  /////////////////////// Function to update the isFolderNameEmpty state
  const handleFolderNameChange = (e) => {
    const folderNameValue = e.target.value.trim();
    setFolderName(e.target.value);
    setIsFolderNameEmpty(folderNameValue === "");
  };

  //  TODO TRY TO SEE IF YOU CAN USE A SPINNER IN FOLDERS PAGE, UNTIL ALL NEEDED VARIABLES ARE AVAILABLE
  // TODO ADD NEW FOLDER TP FOLDERS ARRAY

  return (
    state && (
      <section className={styles.folders_modal_sect}>
        <div className={styles.folders_modal_wrapper}>
          {action === "create" ? (
            <>
              <h3>
                {isCreating ? "Creating new folder." : "Create new folder?"}
              </h3>
              <input
                type="text"
                value={folderName}
                onChange={handleFolderNameChange} // Handle the empty input
                // onChange={handleFolderChange}
                placeholder="Enter Folder Name"
                id="folder_name"
              />
              {/* <input
                type='text'
                placeholder='Enter folder name'
                id='folder_name'
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
              /> */}

              <div className={styles.btns_wrapper}>
                {isCreating ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      className={`${styles.opt_btn} ${styles.cancel_btn}`}
                      onClick={() =>
                        setShowFoldersActionModal({ state: false, action: "" })
                      }
                    >
                      {/* <FaTimes /> */}
                      Cancel
                    </button>

                     

                      {isFolderNameEmpty ? null : (
                      <button
                        className={`${styles.opt_btn} ${styles.affirm_btn}`}
                        onClick={handleCreateFolder}
                        // disabled={isFolderNameEmpty} // Disable the button
                      >
                        Done
                      </button>
                    )}
                    
                    {/* <button
                      className={`${styles.opt_btn} ${styles.affirm_btn}`}
                      onClick={handleCreateFolder}
                      // disabled={isFolderNameEmpty} // Disable the button
                    >
                      <GiCheckMark />
                    </button> */}
                  </>
                )}
              </div>
            </>
          ) : action === "edit" ? (
            <>
              <h3>
                {isEditing
                  ? `Editing ${folder && folder?.folder_name} ${
                      folder?.folder_name
                        ? folder?.folder_name.toLowerCase().includes("folder")
                          ? ""
                          : "folder"
                        : ""
                    }`
                  : `Edit ${folder && folder?.folder_name} ${
                      folder?.folder_name
                        ? folder?.folder_name.toLowerCase().includes("folder")
                          ? ""
                          : "folder"
                        : ""
                    }`}

                {!isEditing && (
                  <button
                    className={styles.close_btn}
                    onClick={() =>
                      setShowFoldersActionModal({ state: false, action: "" })
                    }
                  >
                    <FaTimes />
                  </button>
                )}
              </h3>

              <form className={styles.folder_form} onSubmit={handleSubmit}>
                <div className={styles.form_opt}>
                  <label htmlFor="folder_name">Name</label>
                  <input
                    type="text"
                    placeholder="Enter folder name"
                    id="folder_name"
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                </div>

                <div className={styles.form_opt}>
                  <SelectInput
                    list={docsListToDisplay}
                    type="docs"
                    selDocs={selectedDocs}
                    setSelDocs={setSelectedDocs}
                    folder={folder}
                    totalPageCount={totalPageCount}
                    docsListCurrentPage={docsListCurrentPage}
                    setDocsListCurrentPage={setDocsListCurrentPage}
                  />
                </div>

                <div className={styles.form_opt}>
                  <SelectInput
                    list={tempsListToDisplay}
                    type="temps"
                    selTemps={selectedTemps}
                    setSelTemps={setSelectedTemps}
                    folder={folder}
                    totalPageCount={totalPageCount}
                    tempsListCurrentPage={tempsListCurrentPage}
                    setTempsListCurrentPage={setTempsListCurrentPage}
                  />
                </div>

                {isEditing ? (
                  <LoadingSpinner />
                ) : (
                  <button type="submit" className={styles.edit_btn}>
                    Done
                  </button>
                )}
              </form>
            </>
          ) : action === "delete" ? (
            <>
              <h3 style={{ color: "red" }}>
                {isDeleting
                  ? `Deleting ${folder && folder?.folder_name} ${
                      folder?.folder_name
                        ? folder?.folder_name.toLowerCase().includes("folder")
                          ? ""
                          : "folder"
                        : ""
                    }`
                  : `Delete ${folder && folder?.folder_name} ${
                      folder?.folder_name
                        ? folder?.folder_name.toLowerCase().includes("folder")
                          ? ""
                          : "folder"
                        : ""
                    }?`}

                {!isDeleting && (
                  <button
                    className={styles.close_btn}
                    onClick={() =>
                      setShowFoldersActionModal({ state: false, action: "" })
                    }
                  >
                    <FaTimes />
                  </button>
                )}
              </h3>

              {/* <form className={styles.folder_form} onSubmit={handleSubmit}>
                <div className={styles.form_opt}>
                  <label htmlFor='folder_name'>Name</label>
                  <input
                    type='text'
                    placeholder={`Enter folder name (${folder.folder_name}) to remove`}
                    id='folder_name'
                    value={delFolderName}
                    onChange={(e) => setDelFolderName(e.target.value)}
                  />
                </div>
              </form> */}

              <div className={styles.btns_wrapper}>
                {isDeleting ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      className={`${styles.opt_btn} ${styles.cancel_btn}`}
                      onClick={handleSubmit}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </>
          ) : action === "add" ? (
            <>
              <h3>
                {isAdding
                  ? `Adding to ${addFolder?.folder_name}`
                  : `Select folder`}

                {!isAdding && (
                  <button
                    className={styles.close_btn}
                    onClick={() => {
                      setShowFoldersActionModal({ state: false, action: "" });
                      setAddFolderId("");
                    }}
                  >
                    <FaTimes />
                  </button>
                )}
              </h3>

              <form className={styles.folder_form} onSubmit={handleSubmit}>
                <div className={styles.form_opt}>
                  <select
                    name="folders"
                    id=""
                    defaultValue="Select folder"
                    onChange={(e) => setAddFolderId(e.target.value)}
                  >
                    <option value="Select folder" disabled>
                      Select Folder
                    </option>
                    {folders.map((folder) => (
                      <option
                        value={folder._id}
                        key={folder._id}
                        disabled={foldersContainingItem.find(
                          (conFolder) => conFolder._id === folder._id
                        )}
                      >
                        {folder?.folder_name}
                      </option>
                    ))}
                  </select>
                </div>

                {isAdding ? (
                  <LoadingSpinner />
                ) : (
                  <button type="submit" className={styles.edit_btn}>
                    Add
                  </button>
                )}
              </form>
            </>
          ) : action === "remove" ? (
            <>
              <h3>
                {isRemoving
                  ? `Removing ${
                      item?.document_name || item?.template_name
                    } from ${folder?.folder_name}`
                  : `Remove ${
                      item?.document_name || item?.template_name
                    } from ${folder?.folder_name}?`}
              </h3>

              <div className={styles.btns_wrapper}>
                {isRemoving ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      className={`${styles.opt_btn} ${styles.cancel_btn}`}
                      onClick={() =>
                        setShowFoldersActionModal({ state: false, action: "" })
                      }
                    >
                      <FaTimes />
                    </button>
                    <button
                      className={`${styles.opt_btn} ${styles.affirm_btn}`}
                      onClick={handleSubmit}
                    >
                      <GiCheckMark />
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </section>
    )
  );
};

export default FoldersModal;

const SelectInput = ({
  type,
  list,
  selTemps,
  selDocs,
  setSelTemps,
  setSelDocs,
  folder,
  totalPageCount,
  docsListCurrentPage,
  tempsListCurrentPage,
  setDocsListCurrentPage,
  setTempsListCurrentPage,
}) => {
  const [isDocDrop, setIsDocDrop] = useState(false);
  const [isTempDrop, setIsTempDrop] = useState(false);
  const superContainerRef = useRef(null);
  const containerRef = useRef(null);

  const handleDocsChange = (e) => {
    const elId = e.target.id;
    if (e.target.checked)
      setSelDocs([...selDocs, list.find((item) => item.id === elId)]);
    else setSelDocs(selDocs.filter((item) => item.id !== elId));
  };
  const handleTempsChange = (e) => {
    const elId = e.target.id;
    if (e.target.checked)
      setSelTemps([...selTemps, list.find((item) => item.id === elId)]);
    else setSelTemps(selTemps.filter((item) => item.id !== elId));
  };

  useEffect(() => {
    const supEl = superContainerRef.current;
    const el = containerRef.current;
    if (supEl && el) {
      if (supEl.dataset.id === "docs" && el.dataset.id === "docs") {
        if (isDocDrop)
          supEl.style.height = el.getBoundingClientRect().height + 10 + "px";
        else supEl.style.height = "0px";
      } else if (supEl.dataset.id === "temps" && el.dataset.id === "temps") {
        if (isTempDrop)
          supEl.style.height = el.getBoundingClientRect().height + 10 + "px";
        else supEl.style.height = "0px";
      }
    }
  }, [superContainerRef, containerRef, isDocDrop, isTempDrop, list]);

  return (
    <>
      <button
        type="button"
        className={styles.select_drop_btn}
        onClick={() =>
          type === "docs"
            ? setIsDocDrop(!isDocDrop)
            : type === "temps"
            ? setIsTempDrop(!isTempDrop)
            : console.log("Error at drop button")
        }
      >
        Select{" "}
        {type === "docs" ? "Documents" : type === "temps" ? "Templates" : ""}
        <span className={styles.select_drop_icon}>
          {type === "docs" && (isDocDrop ? <FaCaretUp /> : <FaCaretDown />)}
          {type === "temps" && (isTempDrop ? <FaCaretUp /> : <FaCaretDown />)}
        </span>
      </button>

      <div
        className={styles.drop_super_container}
        ref={superContainerRef}
        data-id={type === "docs" ? type : type === "temps" ? type : ""}
      >
        <div
          className={styles.drop_container}
          ref={containerRef}
          data-id={type === "docs" ? type : type === "temps" ? type : ""}
        >
          {list.length ? (
            <>
              {list.map(({ name, id, category }) => (
                <div
                  className={styles.drop_opt}
                  key={id}
                  style={
                    folder?.data &&
                    folder?.data?.find((itm) => itm[`${category}_id`] === id)
                      ? { pointerEvents: "none" }
                      : {}
                  }
                >
                  <input
                    id={id}
                    type="checkbox"
                    value={name}
                    name={type}
                    onChange={
                      type === "docs"
                        ? handleDocsChange
                        : type === "temps"
                        ? handleTempsChange
                        : () => {
                            // // console.log('Change not handled');
                          }
                    }
                    disabled={
                      folder?.data &&
                      folder?.data.find((itm) => itm[`${category}_id`] === id)
                    }
                    checked={
                      (folder?.data &&
                        folder?.data.find(
                          (itm) => itm[`${category}_id`] === id
                        )) ||
                      (selDocs && selDocs.find((doc) => doc.id === id)) ||
                      (selTemps && selTemps.find((temp) => temp.id === id))
                    }
                  />
                  <label htmlFor={id}>{name}</label>
                </div>
              ))}

              <div className={styles.pagination_wrapper}>
                {type === "docs"
                  ? totalPageCount.docPageArr.map((page) => (
                      <button
                        type="button"
                        className={`${styles.page_btn} ${
                          docsListCurrentPage === page ? styles.active : ""
                        }`}
                        key={page}
                        onClick={() => setDocsListCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))
                  : type === "temps"
                  ? totalPageCount.tempPageArr.map((page) => (
                      <button
                        type="button"
                        className={`${styles.page_btn} ${
                          tempsListCurrentPage === page ? styles.active : ""
                        }`}
                        key={page}
                        onClick={() => setTempsListCurrentPage(page)}
                      >
                        {page}
                      </button>
                    ))
                  : ""}
              </div>
            </>
          ) : (
            <p>
              No{" "}
              {type === "docs"
                ? "Documents"
                : type === "temps"
                ? "Templates"
                : ""}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
