import React, { useState, useEffect, useRef } from 'react';
import styles from './folders_modal.module.css';
import { FaTimes, FaCaretUp, FaCaretDown } from 'react-icons/fa';
import { GiCheckMark } from 'react-icons/gi';
import { useAppContext } from '../../../contexts/AppContext';
import { FolderServices } from '../../../services/folderServices';
import { useSelector } from 'react-redux';
import { productName } from '../../../utils/helpers';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { v4 } from 'uuid';

const FoldersModal = () => {
  const {
    showFoldersActionModal: { state, action, item },
    setShowFoldersActionModal,
    folders,
    folderActionId,
    setFolders,
    setFolderActionId,
  } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [folder, setFolder] = useState();
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [docsList, setDocsList] = useState([]);
  const [tempsList, setTempsList] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [addFolderId, setAddFolderId] = useState();

  const {
    allDocuments,

    // : allDocumentsArray, allDocumentsStatus
  } = useSelector((state) => state.document);

  const {
    allTemplates,

    // : allTemplatesArray, allTemplatesStatus
  } = useSelector((state) => state.template);

  const { userDetail } = useSelector((state) => state.auth);

  const handleCreateFolder = async () => {
    const data = {
      company_id:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.org_id
          : userDetail?.portfolio_info[0].org_id,
      created_by: userDetail?.userinfo.username,
      data_type:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
              (portfolio) => portfolio.product === productName
            )?.data_type
          : userDetail?.portfolio_info[0].data_type,
    };
    const folderServices = new FolderServices();
    try {
      setIsCreating(true);
      await folderServices.createFolder(data);
      setFolders([
        { ...data, folder_name: 'Untitled Folder', _id: v4() },
        ...folders,
      ]);
      toast.success('Folder created');
      navigate('/folders');
      setIsCreating(false);
      setShowFoldersActionModal(false);
    } catch (err) {
      console.log(err);
      toast.error('Folder creating failed!');
      setIsCreating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const folderServices = new FolderServices();

    if (action === 'add') {
      if (addFolderId) {
        const selFolder = folders.find((folder) => folder._id === addFolderId);
        const modData = {
          item_id: item._id,
          item_type: item.type,
        };

        const data = {
          company_id:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.org_id
              : userDetail?.portfolio_info[0].org_id,
          created_by: userDetail?.userinfo.username,
          data_type:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.data_type
              : userDetail?.portfolio_info[0].data_type,
          folder_name: selFolder.folder_name,
          ...modData,
        };

        console.log('data: ', data);
        console.log('folderId: ', addFolderId);

        try {
          setIsAdding(true);
          await folderServices.updateFolder(data, addFolderId);
          setFolders(
            folders.map((folder) =>
              folder._id === addFolderId
                ? { ...folder, data: [modData, ...folder.data] }
                : folder
            )
          );
          toast.success('Added successfully');
        } catch (err) {
          toast.error('Failed to add!');
          console.log(err);
        } finally {
          setShowFoldersActionModal(false);
          setAddFolderId('');
          setIsAdding(false);
        }
      } else {
        toast.warn('Select a folder');
      }
    } else if (action === 'edit') {
      if (folderName) {
        // ...selectedDocs.map((doc) => ({
        //   item_id: doc._id,
        //   item_type: doc.type,
        // })),
        // ...selectedTemps.map((temp) => ({
        //   item_id: temp._id,
        //   item_type: temp.type,
        // })),
        const ids = [
          ...selectedDocs.map((doc) => `${doc.id}|${doc.type}`),
          ...selectedTemps.map((temp) => `${temp.id}|${temp.type}`),
        ];

        // console.log('ids: ', JSON.stringify(ids));
        // console.log('ids: ', ids.toString());

        const data = {
          company_id:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.org_id
              : userDetail?.portfolio_info[0].org_id,
          created_by: userDetail?.userinfo.username,
          data_type:
            userDetail?.portfolio_info?.length > 1
              ? userDetail?.portfolio_info.find(
                  (portfolio) => portfolio.product === productName
                )?.data_type
              : userDetail?.portfolio_info[0].data_type,
          folder_name: folderName,
          item_id: ids.toString(),
          item_type: 'list',
        };

        const dataForLocal = [
          ...selectedDocs.map((doc) => ({ type: doc.type, _id: doc.id })),
          ...selectedTemps.map((temp) => ({ type: temp.type, _id: temp.id })),
        ];
        try {
          setIsEditing(true);
          // await folderServices.updateFolder(data, folder._id);
          // setFolders(
          //   folders.map((fol) =>
          //     fol._id === folder._id
          //       ? { ...fol, data: dataForLocal, folder_name: folderName }
          //       : fol
          //   )
          // );
          // toast.success('Folder Edited');
        } catch (err) {
          console.log(err);
          toast.error('Editting failed!');
        } finally {
          setIsEditing(false);
          setShowFoldersActionModal({ state: false, action: '' });
        }
      } else toast.warn('Enter Folder name');
    }
  };

  useEffect(() => {
    if (folderActionId)
      setFolder(folders.find((folder) => folder._id === folderActionId));
  }, [folderActionId]);

  useEffect(() => {
    if (folder) {
      setFolderName(folder.folder_name);
    }
  }, [folder]);

  useEffect(() => {
    if (allDocuments)
      setDocsList(
        allDocuments.map((doc) => ({
          name: doc.document_name,
          id: doc._id,
          type: 'document',
        }))
      );

    if (allTemplates)
      setTempsList(
        allTemplates.map((temp) => ({
          name: temp.template_name,
          id: temp._id,
          type: 'template',
        }))
      );
  }, [allDocuments, allTemplates]);

  useEffect(() => {
    setFolderActionId('');
  }, [state]);

  //  TODO TRY TO SEE IF YOU CAN USE A SPINNER IN FOLDERS PAGE, UNTIL ALL NEEDED VARIABLES ARE AVAILABLE
  // TODO ADD NEW FOLDER TP FOLDERS ARRAY

  return (
    state && (
      <section className={styles.folders_modal_sect}>
        <div className={styles.folders_modal_wrapper}>
          {action === 'create' ? (
            <>
              <h3>
                {isCreating ? 'Creating new folder.' : 'Create new folder?'}
              </h3>

              <div className={styles.btns_wrapper}>
                {isCreating ? (
                  <LoadingSpinner />
                ) : (
                  <>
                    <button
                      className={`${styles.opt_btn} ${styles.cancel_btn}`}
                      onClick={() =>
                        setShowFoldersActionModal({ state: false, action: '' })
                      }
                    >
                      <FaTimes />
                    </button>
                    <button
                      className={`${styles.opt_btn} ${styles.affirm_btn}`}
                      onClick={handleCreateFolder}
                    >
                      <GiCheckMark />
                    </button>
                  </>
                )}
              </div>
            </>
          ) : action === 'edit' ? (
            <>
              <h3>
                {isEditing
                  ? `Editing ${folder && folder.folder_name} folder`
                  : `Edit ${folder && folder.folder_name} folder`}

                {!isEditing && (
                  <button
                    className={styles.close_btn}
                    onClick={() =>
                      setShowFoldersActionModal({ state: false, action: '' })
                    }
                  >
                    <FaTimes />
                  </button>
                )}
              </h3>

              <form className={styles.folder_form} onSubmit={handleSubmit}>
                <div className={styles.form_opt}>
                  <label htmlFor='folder_name'>Name</label>
                  <input
                    type='text'
                    placeholder='Enter folder name'
                    id='folder_name'
                    value={folderName}
                    onChange={(e) => setFolderName(e.target.value)}
                  />
                </div>

                <div className={styles.form_opt}>
                  <SelectInput
                    list={docsList}
                    type='docs'
                    selDocs={selectedDocs}
                    setSelDocs={setSelectedDocs}
                  />
                </div>

                <div className={styles.form_opt}>
                  <SelectInput
                    list={tempsList}
                    type='temps'
                    selTemps={selectedTemps}
                    setSelTemps={setSelectedTemps}
                  />
                </div>

                {isEditing ? (
                  <LoadingSpinner />
                ) : (
                  <button type='submit' className={styles.edit_btn}>
                    Done
                  </button>
                )}
              </form>
            </>
          ) : action === 'delete' ? (
            ''
          ) : action === 'add' ? (
            <>
              <h3>
                {isAdding ? `Adding to folder` : `Select folder`}

                {!isAdding && (
                  <button
                    className={styles.close_btn}
                    onClick={() => {
                      setShowFoldersActionModal({ state: false, action: '' });
                      setAddFolderId('');
                    }}
                  >
                    <FaTimes />
                  </button>
                )}
              </h3>

              <form className={styles.folder_form} onSubmit={handleSubmit}>
                <div className={styles.form_opt}>
                  <select
                    name='folders'
                    id=''
                    defaultValue='Select folder'
                    onChange={(e) => setAddFolderId(e.target.value)}
                  >
                    <option value='Select folder' disabled>
                      Select Folder
                    </option>
                    {folders.map((folder) => (
                      <option value={folder._id} key={folder._id}>
                        {folder.folder_name}
                      </option>
                    ))}
                  </select>
                </div>

                {isAdding ? (
                  <LoadingSpinner />
                ) : (
                  <button type='submit' className={styles.edit_btn}>
                    Add
                  </button>
                )}
              </form>
            </>
          ) : (
            ''
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
      if (supEl.dataset.id === 'docs' && el.dataset.id === 'docs') {
        if (isDocDrop)
          supEl.style.height = el.getBoundingClientRect().height + 'px';
        else supEl.style.height = '0px';
      } else if (supEl.dataset.id === 'temps' && el.dataset.id === 'temps') {
        if (isTempDrop)
          supEl.style.height = el.getBoundingClientRect().height + 'px';
        else supEl.style.height = '0px';
      }
    }
  }, [superContainerRef, containerRef, isDocDrop, isTempDrop]);

  return (
    <>
      <button
        type='button'
        className={styles.select_drop_btn}
        onClick={() =>
          type === 'docs'
            ? setIsDocDrop(!isDocDrop)
            : type === 'temps'
            ? setIsTempDrop(!isTempDrop)
            : console.log('Error at drop button')
        }
      >
        Select{' '}
        {type === 'docs' ? 'Documents' : type === 'temps' ? 'Templates' : ''}
        <span className={styles.select_drop_icon}>
          {type === 'docs' && (isDocDrop ? <FaCaretUp /> : <FaCaretDown />)}
          {type === 'temps' && (isTempDrop ? <FaCaretUp /> : <FaCaretDown />)}
        </span>
      </button>

      <div
        className={styles.drop_super_container}
        ref={superContainerRef}
        data-id={type === 'docs' ? type : type === 'temps' ? type : ''}
      >
        <div
          className={styles.drop_container}
          ref={containerRef}
          data-id={type === 'docs' ? type : type === 'temps' ? type : ''}
        >
          {list.length ? (
            list.map(({ name, id }) => (
              <div className={styles.drop_opt} key={id}>
                <input
                  id={id}
                  type='checkbox'
                  value={name}
                  name={type}
                  onChange={
                    type === 'docs'
                      ? handleDocsChange
                      : type === 'temps'
                      ? handleTempsChange
                      : () => {
                          console.log('Change not handled');
                        }
                  }
                />
                <label htmlFor={id}>{name}</label>
              </div>
            ))
          ) : (
            <p>
              No{' '}
              {type === 'docs'
                ? 'Documents'
                : type === 'temps'
                ? 'Templates'
                : ''}
            </p>
          )}
        </div>
      </div>
    </>
  );
};
