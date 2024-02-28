import React, { useState } from 'react';
import styles from './search.module.css';
import CollapseItem from '../collapseItem/CollapseItem';
import { v4 as uuidv4 } from 'uuid';
import { FaSearch } from 'react-icons/fa';
import { useForm } from 'react-hook-form';

import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';

import { useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';

import { useEffect } from 'react';
import { useAppContext } from '../../../contexts/AppContext';
import { searchItemByKeyAndGroupResults } from '../../../pages/Search/util';
import { useTranslation } from 'react-i18next';

const Search = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { isSubmitSuccessful },
  } = useForm();
  const { search } = watch();
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultItems, setSearchResultItems] = useState([]);
  const [searchResultLoaded, setSearchResultLoaded] = useState(false);

  const navigate = useNavigate();

  const { t } = useTranslation();
  const { searchItems,demoTemplates, setRerender } = useAppContext();
  const { allWorkflowsStatus } = useSelector((state) => state.workflow);
  const { allTemplatesStatus } = useSelector((state) => state.template);
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const { themeColor } = useSelector((state) => state.app);

  const onSubmit = async (data) => {
    if (data.search.length < 1 || searchLoading)
      return setSearchResultItems([]);

    setSearchLoading(true);
  };
// // console.log('the demoTemplates are ', demoTemplates)
  useEffect(() => {
    setRerender(uuidv4());
    // // console.log('hit the first useEffect')
  }, [searchResultItems]);

  useEffect(() => {
    if (
      !searchLoading ||
      !isSubmitSuccessful ||
      allDocumentsStatus === 'pending' ||
      allTemplatesStatus === 'pending' ||
      allWorkflowsStatus === 'pending'
    )
      return;

    try {
      const results = searchItemByKeyAndGroupResults(search, searchItems);
// // console.log('hit the second useEffect',results, search, searchItems)
      setSearchResultLoaded(true);
      setSearchLoading(false);
      setSearchResults(results);

      let updatedItems = items.map((item) => {
        const copyOfItem = { ...item };

        if (copyOfItem.type === 'Documents') {
          const documentsFound = results
            .filter((searchResultItem) => searchResultItem.document_name && searchResultItem.document_state)
            .slice(0, 3);
          copyOfItem.parent = 'Documents';
          copyOfItem.count = documentsFound.length;
          copyOfItem.children = documentsFound.map((result) => {
            return {
              id: uuidv4(),
              child: result.document_name,
              searchItem: true,
              href: '#',
              itemObj: result,
            };
          });
          copyOfItem.isOpen = true;
          return copyOfItem;
        }
        if (copyOfItem.type === 'Org_Documents') {
          const documentsFound = results
            .filter((searchResultItem) => searchResultItem.document_name && !searchResultItem.document_state)
            .slice(0, 3);
          copyOfItem.parent = 'Org_Documents';
          copyOfItem.count = documentsFound.length;
          copyOfItem.children = documentsFound.map((result) => {
            return {
              id: uuidv4(),
              child: result.document_name,
              searchItem: true,
              href: '#',
              itemObj: result,
            };
          });
          copyOfItem.isOpen = false;
          return copyOfItem;
        }
        if (item.type === 'Templates') {
          const templatesFound = results
            .filter((searchResultItem) => searchResultItem.template_name && searchResultItem.template_state)
            .slice(0, 3);
          copyOfItem.parent = 'Templates';
          copyOfItem.count = templatesFound.length;
          copyOfItem.children = templatesFound.map((result) => {
            return {
              id: uuidv4(),
              child: result.template_name,
              searchItem: true,
              href: '#',
              itemObj: result,
            };
          });
          copyOfItem.isOpen = false;
          return copyOfItem;
        }
        if (item.type === 'Org_Templates') {
          const templatesFound = results
            .filter((searchResultItem) => searchResultItem.template_name && !searchResultItem.template_state)
            .slice(0, 3);
          copyOfItem.parent = 'Org_Templates';
          copyOfItem.count = templatesFound.length;
          copyOfItem.children = templatesFound.map((result) => {
            return {
              id: uuidv4(),
              child: result.template_name,
              searchItem: true,
              href: '#',
              itemObj: result,
            };
          });
          copyOfItem.isOpen = false;
          return copyOfItem;
        }

        const workflowsFound = results
          .filter((searchResultItem) => searchResultItem.workflows)
          .slice(0, 3);
        copyOfItem.parent = 'Workflows';
        copyOfItem.count = workflowsFound.length;
        copyOfItem.children = workflowsFound.map((result) => {
          return {
            id: uuidv4(),
            child: result.workflows?.workflow_title,
            searchItem: true,
            href: '#',
            itemObj: result,
          };
        });
        copyOfItem.isOpen = false;
        return copyOfItem;
      });
      setSearchResultItems(updatedItems);
    } catch (error) {
      // console.log(error);
      setSearchLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    searchLoading,
    isSubmitSuccessful,
    searchItems,
    allDocumentsStatus,
    allTemplatesStatus,
    allWorkflowsStatus,
  ]);

  const handleSeeMoreBtnClick = () => {
    navigate('/search', {
      state: { searchResults: searchResults, searchItem: search },
    });
  };
  // // console.log('searchLoading ',searchLoading, " searchResults ",searchResults, " searchResultItems ", searchResultItems," searchResultLoaded ",searchResultLoaded)

  return (
    <div className={styles.container}>
      <h2 className={styles.title} style={{ color: themeColor }}>
        Search
      </h2>
      <p className={styles.info}>
        {t('Search in file names of Documents Templates & Workflows')}
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.search__box}>
        <input
          {...register('search')}
          placeholder={t('Type here to search')}
          readOnly={searchLoading ? true : false}
        />
        <button type='submit' style={{ backgroundColor: themeColor }}>
          {searchLoading ? (
            <LoadingSpinner color={'#fff'} />
          ) : (
            <>
              <i>
                <FaSearch />
              </i>
              <span>{t('Search')}</span>
            </>
          )}
        </button>
      </form>
      <CollapseItem listType='ol' items={searchResultItems} />
      {searchResults.length > 3 ? (
        <div className={styles.see__All__Btn__Container}>
          <button
            className={styles.see__All__Btn}
            onClick={handleSeeMoreBtnClick}
          >
            See more
          </button>
        </div>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Search;

export const items = [
  {
    id: uuidv4(),
    isOpen: false,
    parent: 'Documents (07)',
    type: 'Documents',
    children: [
      { id: uuidv4(), child: 'Payment voucher' },
      { id: uuidv4(), child: 'Answer sheet' },
      { id: uuidv4(), child: 'Agreement' },
      { id: uuidv4(), child: 'Appointment order' },
      { id: uuidv4(), child: 'Letter' },
      { id: uuidv4(), child: '..' },
      { id: uuidv4(), child: '..' },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: 'Templates (04)',
    type: 'Templates',
    children: [
      { id: uuidv4(), child: 'Leave format' },
      { id: uuidv4(), child: 'Payment voucher' },
      { id: uuidv4(), child: '..' },
      { id: uuidv4(), child: '..' },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: 'Workflows (04)',
    type: 'Workflows',
    children: [
      { id: uuidv4(), child: 'Leave process' },
      { id: uuidv4(), child: 'Payment process' },
      { id: uuidv4(), child: '..' },
      { id: uuidv4(), child: '..' },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: 'Org Templates (04)',
    type: 'Org_Templates',
    children: [
      { id: uuidv4(), child: 'Leave format' },
      { id: uuidv4(), child: 'Payment voucher' },
      { id: uuidv4(), child: '..' },
      { id: uuidv4(), child: '..' },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: 'Org Documents (07)',
    type: 'Org_Documents',
    children: [
      { id: uuidv4(), child: 'Payment voucher' },
      { id: uuidv4(), child: 'Answer sheet' },
      { id: uuidv4(), child: 'Agreement' },
      { id: uuidv4(), child: 'Appointment order' },
      { id: uuidv4(), child: 'Letter' },
      { id: uuidv4(), child: '..' },
      { id: uuidv4(), child: '..' },
    ],
  },
];
