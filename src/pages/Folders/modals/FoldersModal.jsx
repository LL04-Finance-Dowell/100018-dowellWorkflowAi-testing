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
    userDetail,
  } = useAppContext();
  const [isCreating, setIsCreating] = useState(false);
  const navigate = useNavigate();
  const [folder, setFolder] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [folderName, setFolderName] = useState('');
  const [delFolderName, setDelFolderName] = useState('');
  const [docsList, setDocsList] = useState([]);
  const [tempsList, setTempsList] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);
  const [selectedTemps, setSelectedTemps] = useState([]);
  const [addFolderId, setAddFolderId] = useState();
  const [addFolder, setAddFolder] = useState({});
  const [foldersContainingItem, setFoldersContainingItem] = useState([]);
  const [userCompanyId] = useState(
    userDetail?.portfolio_info?.length > 1
      ? userDetail?.portfolio_info?.find(
          (portfolio) => portfolio.product === productName
        )?.org_id
      : userDetail?.portfolio_info[0]?.org_id
  );
  const [userDataType] = useState(
    userDetail?.portfolio_info?.length > 1
      ? userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
      : userDetail?.portfolio_info[0].data_type
  );

  const {
    allDocuments,

    // : allDocumentsArray, allDocumentsStatus
  } = useSelector((state) => state.document);

  const {
    allTemplates,

    // : allTemplatesArray, allTemplatesStatus
  } = useSelector((state) => state.template);

  const handleCreateFolder = async () => {
    const data = {
      company_id: userCompanyId,
      created_by: userDetail?.userinfo.username,
      data_type: userDataType,
    };
    const folderServices = new FolderServices();
    try {
      setIsCreating(true);
      await folderServices.createFolder(data);
      const res = await folderServices.getAllFolders(userCompanyId);
      setFolders(res.data ? res.data.reverse() : []);
      toast.success('Folder created');
      navigate('/folders');
      setIsCreating(false);
      setShowFoldersActionModal(false);
    } catch (err) {
      // console.log(err);
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
          toast.success('Added successfully');
        } catch (err) {
          // console.log(err);
          toast.error('Failed to add!');
        } finally {
          setShowFoldersActionModal(false);
          setAddFolderId('');
          setIsAdding(false);
        }
      } else toast.warn('Select a folder');
    } else if (action === 'edit') {
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
          items,
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
          toast.success('Folder edited');
        } catch (err) {
          // console.log(err);
          toast.error('Editing failed!');
        } finally {
          setIsEditing(false);
          setShowFoldersActionModal({ state: false, action: '' });
        }
      } else toast.warn('Enter Folder name');
    } else if (action === 'delete') {
      if (delFolderName.trim() === folder.folder_name) {
        setIsDeleting(true);
        try {
          const data = { item_id: folder._id, item_type: 'folder' };
          await folderServices.deleteFolder(data);
          setFolders((prev) => prev.filter((fld) => fld._id !== folder._id));
          toast.success('Folder deleted');
        } catch (err) {
          // console.log(err);
          toast.error('Deleting failed!');
        } finally {
          setIsDeleting(false);
          setShowFoldersActionModal({ state: false, action: '' });
        }
      } else toast.error('Incorrect folder name!');
    }
  };

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
    if (action === 'add') {
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
      setDocsList(
        allDocuments.map((doc) => ({
          name: doc.document_name,
          id: doc._id,
          category: 'document',
        }))
      );

    if (allTemplates)
      setTempsList(
        allTemplates.map((temp) => ({
          name: temp.template_name,
          id: temp._id,
          category: 'template',
        }))
      );
  }, [allDocuments, allTemplates]);

  useEffect(() => {
    if (!state) {
      setFolderActionId('');
      setSelectedDocs([]);
      setSelectedTemps([]);
      setDelFolderName('');
    }
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
                    folder={folder}
                  />
                </div>

                <div className={styles.form_opt}>
                  <SelectInput
                    list={tempsList}
                    type='temps'
                    selTemps={selectedTemps}
                    setSelTemps={setSelectedTemps}
                    folder={folder}
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
            <>
              <h3 style={{ color: 'red' }}>
                {isDeleting
                  ? `Deleting ${folder && folder.folder_name} folder`
                  : `Delete ${folder && folder.folder_name} folder?`}

                {!isDeleting && (
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
                    placeholder={`Enter folder name (${folder.folder_name}) to remove`}
                    id='folder_name'
                    value={delFolderName}
                    onChange={(e) => setDelFolderName(e.target.value)}
                  />
                </div>
              </form>

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
          ) : action === 'add' ? (
            <>
              <h3>
                {isAdding
                  ? `Adding to ${addFolder.folder_name}`
                  : `Select folder`}

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
                      <option
                        value={folder._id}
                        key={folder._id}
                        disabled={foldersContainingItem.find(
                          (conFolder) => conFolder._id === folder._id
                        )}
                      >
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
  folder,
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
            list.map(({ name, id, category }) => (
              <div
                className={styles.drop_opt}
                key={id}
                style={
                  folder.data &&
                  folder.data.find((itm) => itm[`${category}_id`] === id)
                    ? { pointerEvents: 'none' }
                    : {}
                }
              >
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
                          // console.log('Change not handled');
                        }
                  }
                  disabled={
                    folder.data &&
                    folder.data.find((itm) => itm[`${category}_id`] === id)
                  }
                  checked={
                    folder.data &&
                    folder.data.find((itm) => itm[`${category}_id`] === id)
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
