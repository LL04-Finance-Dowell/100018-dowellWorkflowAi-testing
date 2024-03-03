import React, { useEffect, useState } from 'react';

import { FaSearch } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

import { Tooltip } from 'react-tooltip';
import { LoadingSpinner } from '../../components/LoadingSpinner/LoadingSpinner';
import { setToggleManageFileForm } from '../../features/app/appSlice';
import { detailDocument } from '../../features/document/asyncThunks';
import { detailTemplate } from '../../features/template/asyncThunks';
import { detailWorkflow } from '../../features/workflow/asyncTHunks';
// import { searchForItem } from "../../services/searchServices";
import WorkflowLayout from '../../layouts/WorkflowLayout/WorkflowLayout';
import ManageFiles from '../../components/manageFiles/ManageFiles';
import styles from './style.module.css';
import { searchItemByKeyAndGroupResults } from './util';
import { useAppContext } from '../../contexts/AppContext';
import { IoIosRefresh } from 'react-icons/io';
import { DocumentServices } from '../../services/documentServices';
import { TemplateServices } from '../../services/templateServices';
import { WorkflowServices } from '../../services/workflowServices';
import { setAllDocuments } from '../../features/document/documentSlice';
import { setAllTemplates } from '../../features/template/templateSlice';
import { setAllWorkflows } from '../../features/workflow/workflowsSlice';
import { useMediaQuery } from 'react-responsive';

import { MdFilterList } from 'react-icons/md';
import DisplaySearch from './DisplaySearch';
import { productName } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const searchCategories = {
  documents: 'documents',
  templates: 'templates',
  workflows: 'workflows',
  all: 'all',
};

const SearchPage = () => {
  const [searchResults, setSearchResults] = useState([]);
  const [searchResultsToDisplay, setSearchResultsToDisplay] = useState([]);
  const { state } = useLocation();
  const [currentSearch, setCurrentSearch] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const [currentSearchOption, setCurrentSearchOption] = useState(
    searchCategories.all
  );
  const dispatch = useDispatch();
  const { searchItems } = useAppContext();
  const { allWorkflowsStatus } = useSelector((state) => state.workflow);
  const { allTemplatesStatus } = useSelector((state) => state.template);
  const { allDocumentsStatus } = useSelector((state) => state.document);
  const [refreshLoading, setRefreshLoading] = useState(false);
  const [filterDocs, setFilterDocs] = useState([]);
  const [filterTemps, setFilterTemps] = useState([]);
  const [filterWorks, setFilterWorks] = useState([]);
  const [isDropdown, setIsDropdown] = useState(false);
  const nonDesktop = useMediaQuery({
    query: '(max-width: 750px)',
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!state) return;

    if (state.searchResults) {
      setSearchResults(state.searchResults);
      setSearchResultsToDisplay(state.searchResults);
    }
    if (state.searchItem) setCurrentSearch(state.searchItem);
  }, [state]);

  const handleSearchItemClick = (item) => {
    if (item.document_name) {
      const data = {
        document_name: item.document_name,
        document_id: item._id,
      };
      dispatch(detailDocument(item));
    }
    if (item.template_name) {
      const data = {
        template_id: item._id,
        template_name: item.template_name,
      };
      dispatch(detailTemplate(item.collection_id));
    }
    if (item.workflows) {
      dispatch(setToggleManageFileForm(true));
      const data = {
        workflow_id: item._id,
      };
      navigate('/workflows/saved#saved-workflows')
      dispatch(detailWorkflow(item._id));
    }
  };

  const handleSearchInputChange = (value) => {
    setCurrentSearch(value);
    if (value.length < 1) return;
    // setSearchLoading(true);
  };

  useEffect(() => {
    if (currentSearch.length < 1) {
      setSearchLoading(false);
      setSearchResults([]);
      return;
    }

    setSearchLoading(true);

    if (
      allDocumentsStatus === 'pending' ||
      allTemplatesStatus === 'pending' ||
      allWorkflowsStatus === 'pending' ||
      refreshLoading
    )
      return;

    try {
      const results = searchItemByKeyAndGroupResults(
        currentSearch,
        searchItems
      );
      
      setSearchLoading(false);
      setSearchResults(results);
    } catch (error) {
      // console.log(error);
      setSearchLoading(false);
    }

    // const dataToPost = {
    // 	company_id: userDetail?.portfolio_info[0]?.org_id,
    // 	search: currentSearch,
    // }
    // searchForItem(dataToPost).then(res => {
    // 	setSearchLoading(false);
    // 	setSearchResults(res.data.search_result);
    // }).catch(error => {
    // 	setSearchLoading(false);
    // 	toast.error(error.response ? error.response.data : error.message)
    // })
  }, [
    currentSearch,
    searchItems,
    allDocumentsStatus,
    allTemplatesStatus,
    allWorkflowsStatus,
    refreshLoading,
  ]);

  // console.log("searchItemsoutside",searchItems)
  useEffect(() => {
    const currentSearchResults = searchResults.slice();
    // console.log("searchItems",searchItems)

    switch (currentSearchOption) {
      case searchCategories.all:
        setSearchResultsToDisplay(currentSearchResults);
        break;

      case searchCategories.documents:
        setSearchResultsToDisplay(
          currentSearchResults.filter(
            (searchResultItem) => searchResultItem.document_name
          )
        );
        break;

      case searchCategories.templates:
        setSearchResultsToDisplay(
          currentSearchResults.filter(
            (searchResultItem) => searchResultItem.template_name
          )
        );
        break;

      case searchCategories.workflows:
        setSearchResultsToDisplay(
          currentSearchResults.filter(
            (searchResultItem) => searchResultItem.workflows
          )
        );
        break;

      default:
        break;
    }
  }, [currentSearchOption, searchResults]);

  const handleRefresh = async () => {
    if (refreshLoading) return;

    setRefreshLoading(true);

    const [ currentUserportfolioDataType, currentUserCompanyId ] = [
      userDetail?.portfolio_info?.length > 1 ? 
        userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type
        :
      userDetail?.portfolio_info[0]?.data_type,
        
      userDetail?.portfolio_info?.length > 1 ? 
        userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.org_id
        :
      userDetail?.portfolio_info[0].org_id
    ]

    const data = {
      company_id: currentUserCompanyId,
      data_type: currentUserportfolioDataType,
    };

    const documentServices = new DocumentServices();
    const templatesServices = new TemplateServices();
    const workflowServices = new WorkflowServices();

    try {
      const [documentsData, templatesData, workflowsData] = await Promise.all([
        documentServices.allDocuments(data.company_id, data.data_type),
        templatesServices.allTemplates(data.company_id, data.data_type),
        workflowServices.allWorkflows(data.company_id, data.data_type),
      ]);

      dispatch(
        setAllDocuments(
          documentsData.data.documents
            .reverse()
            .filter(
              (document) =>
                document.document_state !== 'trash' &&
                document.data_type &&
                document.data_type === currentUserportfolioDataType
            )
        )
      );

      dispatch(
        setAllTemplates(
          templatesData.data.templates
            .reverse()
            .filter(
              (template) =>
                template.data_type &&
                template.data_type === currentUserportfolioDataType
            )
        )
      );

      dispatch(
        setAllWorkflows(
          workflowsData.data.workflows.filter(
            (workflow) =>
              (workflow?.data_type &&
                workflow?.data_type ===
                  currentUserportfolioDataType) ||
              (workflow.workflows.data_type &&
                workflow.workflows.data_type ===
                  currentUserportfolioDataType)
          )
        )
      );
    } catch (error) {
      // console.log(error.response ? error.response.data : error.message);
    }
    setRefreshLoading(false);
  };

  useEffect(() => {
    if (searchResultsToDisplay.length) {
      setFilterDocs(searchResultsToDisplay.filter((res) => res.document_name));
      setFilterTemps(searchResultsToDisplay.filter((res) => res.template_name));
      setFilterWorks(searchResultsToDisplay.filter((res) => res.workflows));
    }
  }, [searchResultsToDisplay]);

  useEffect(() => {
    if (filterDocs || filterTemps || filterWorks) {
      const maxLength = Math.max(
        ...[filterDocs.length, filterTemps.length, filterWorks.length]
      );
      const filterArr = [
        { title: 'docs', arr: filterDocs },
        { title: 'temps', arr: filterTemps },
        { title: 'works', arr: filterWorks },
      ];
      filterArr.forEach(({ title, arr }) => {
        if (arr.length < maxLength) {
          let spaces = [];
          for (let i = maxLength - arr.length; i > 0; i--) spaces.push('');
          switch (title) {
            case 'docs':
              setFilterDocs([...filterDocs, ...spaces]);
              break;
            case 'temps':
              setFilterTemps([...filterTemps, ...spaces]);
              break;
            case 'works':
              setFilterWorks([...filterWorks, ...spaces]);
              break;
            default:
              return;
          }
        }
      });
    }
  }, [filterDocs, filterTemps, filterWorks]);

  return (
    <>
      <WorkflowLayout>
        <div className={styles.search__Page__Container}>
          <ManageFiles
            title='Search for Documents, Templates and Workflows'
            contentBoxClassName={styles.search__Manage__Files__Content}
            removePageSuffix={true}
          >
            <div className={styles.header__Section}>
              <form
                onSubmit={(e) => e.preventDefault()}
                className={styles.search__box}
              >
                <button type='submit'>
                  {searchLoading ? (
                    <LoadingSpinner
                      color={'#61ce70'}
                      width={'1rem'}
                      height={'1rem'}
                    />
                  ) : (
                    <>
                      <i>
                        <FaSearch />
                      </i>
                    </>
                  )}
                </button>
                <input
                  value={currentSearch}
                  placeholder='Type here to search'
                  onChange={(e) => handleSearchInputChange(e.target.value)}
                />
              </form>

              <div className={styles.btns_wrapper}>
                <div className={styles.search_filter_sect}>
                  <button
                    className={styles.search_drop_btn}
                    onClick={() => setIsDropdown(!isDropdown)}
                    style={isDropdown ? { borderRadius: '5px 5px 0 0' } : {}}
                  >
                    <span
                      className='filter_icon'
                      style={{ marginRight: '10px' }}
                    >
                      <MdFilterList />
                    </span>
                    {currentSearchOption === 'documents'
                      ? 'Documents'
                      : currentSearchOption === 'templates'
                      ? 'Templates'
                      : currentSearchOption === 'workflows'
                      ? 'Workflows'
                      : 'All'}
                  </button>
                  <div
                    style={
                      isDropdown
                        ? {
                            height: '130px',
                          }
                        : { height: '0' }
                    }
                    className={styles.search_drop_opts_super_wrapper}
                  >
                    <div className={styles.search_drop_opts_wrapper}>
                      <label>
                        <input
                          type={'radio'}
                          checked={
                            currentSearchOption === searchCategories.all
                              ? true
                              : false
                          }
                          value={searchCategories.all}
                          onChange={(e) => {
                            setCurrentSearchOption(e.target.value);
                            setIsDropdown(false);
                          }}
                        />
                        All
                      </label>
                      <label>
                        <input
                          type={'radio'}
                          checked={
                            currentSearchOption === searchCategories.documents
                              ? true
                              : false
                          }
                          value={searchCategories.documents}
                          onChange={(e) => {
                            setCurrentSearchOption(e.target.value);
                            setIsDropdown(false);
                          }}
                        />
                        Documents
                      </label>
                      <label>
                        <input
                          type={'radio'}
                          checked={
                            currentSearchOption === searchCategories.templates
                              ? true
                              : false
                          }
                          value={searchCategories.templates}
                          onChange={(e) => {
                            setCurrentSearchOption(e.target.value);
                            setIsDropdown(false);
                          }}
                        />
                        Templates
                      </label>
                      <label>
                        <input
                          type={'radio'}
                          checked={
                            currentSearchOption === searchCategories.workflows
                              ? true
                              : false
                          }
                          value={searchCategories.workflows}
                          onChange={(e) => {
                            setCurrentSearchOption(e.target.value);
                            setIsDropdown(false);
                          }}
                        />
                        Workflows
                      </label>
                    </div>
                  </div>
                </div>

                <button className={styles.refresh__btn} onClick={handleRefresh}>
                  {refreshLoading ? (
                    <LoadingSpinner
                      color={'white'}
                      width={'1rem'}
                      height={'1rem'}
                    />
                  ) : (
                    <IoIosRefresh />
                  )}
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            <div className={styles.minified__Search__Container}>
              {searchLoading ? (
                <p>{`Please wait.${
                  refreshLoading
                    ? ' It might take awhile as items are being refreshed'
                    : ''
                }...`}</p>
              ) : currentSearch.length < 1 ? (
                <></>
              ) : (
                <>
                  {searchResultsToDisplay.length < 1 ? (
                    <p>
                      No{' '}
                      {currentSearchOption === searchCategories.all
                        ? 'items'
                        : currentSearchOption}{' '}
                      found matching {currentSearch}
                    </p>
                  ) : currentSearchOption === searchCategories.all ? (
                    <div className={`${styles.all__search__result__wrapper}`}>
                      {!nonDesktop ? (
                        <>
                          <div
                            className={`${styles.all__search__result__header}`}
                          >
                            <span
                              style={{
                                backgroundColor: 'var(--e-global-color-accent)',
                              }}
                            >
                              documents
                            </span>
                            <span
                              style={{
                                backgroundColor:
                                  'var(--e-global-color-accent)',
                              }}
                            >
                              templates
                            </span>
                            <span
                              style={{
                                backgroundColor:
                                  'var(--e-global-color-accent)',
                              }}
                            >
                              workflows
                            </span>
                          </div>

                          <div
                            className={`${styles.all__search__result__main}`}
                          >
                            <article
                              className={`${styles.all__search__result__opts}`}
                            >
                              {filterDocs.map((doc, ind) => {
                                if (doc) {
                                  return (
                                    <button
                                      key={ind}
                                      className={`${styles.all__search__result__btn} `}
                                      id={doc._id}
                                      onClick={() => handleSearchItemClick(doc)}
                                    >
                                      {doc.document_name}
                                    </button>
                                  );
                                }
                                return <span></span>;
                              })}
                            </article>

                            <article
                              className={`${styles.all__search__result__opts}`}
                            >
                              {filterTemps.map((temp, ind) => {
                                if (temp) {
                                  return (
                                    <button
                                      key={ind}
                                      className={`${styles.all__search__result__btn} `}
                                      id={temp._id}
                                      onClick={() =>
                                        handleSearchItemClick(temp)
                                      }
                                    >
                                      {temp.template_name}
                                    </button>
                                  );
                                }
                                return <span></span>;
                              })}
                            </article>

                            <article
                              className={`${styles.all__search__result__opts}`}
                            >
                              {filterWorks.map((work, ind) => {
                                if (work) {
                                  return (
                                    <button
                                      key={ind}
                                      className={`${styles.all__search__result__btn} `}
                                      id={work._id}
                                      onClick={() =>
                                        handleSearchItemClick(work)
                                      }
                                    >
                                      {work.workflows.workflow_title}
                                    </button>
                                  );
                                }
                                return <span></span>;
                              })}
                            </article>
                          </div>
                        </>
                      ) : (
                        <DisplaySearch
                          result={searchResultsToDisplay}
                          handleSearchItemClick={handleSearchItemClick}
                        />
                      )}
                    </div>
                  ) : (
                    <>
                      {React.Children.toArray(
                        searchResultsToDisplay.map((searchResultItem) => {
                          return (
                            <button
                              id={searchResultItem._id}
                              onClick={() =>
                                handleSearchItemClick(searchResultItem)
                              }
                            >
                              <span
                                className={`${styles.search__Item__Info} 
                                                    ${
                                                      searchResultItem.document_name
                                                        ? styles.search__Item__Doc
                                                        : searchResultItem.template_name
                                                        ? styles.search__Item__Temp
                                                        : searchResultItem.workflows
                                                        ? styles.search__Item__Workf
                                                        : ''
                                                    }`}
                              >
                                {searchResultItem.document_name
                                  ? 'Document'
                                  : searchResultItem.template_name
                                  ? 'Template'
                                  : searchResultItem.workflows
                                  ? 'Workflow'
                                  : ''}
                              </span>
                              <span>
                                {searchResultItem.document_name
                                  ? searchResultItem.document_name
                                  : searchResultItem.template_name
                                  ? searchResultItem.template_name
                                  : searchResultItem.workflows
                                  ? searchResultItem.workflows?.workflow_title
                                  : ''}
                                <Tooltip
                                  anchorId={searchResultItem._id}
                                  content={
                                    searchResultItem.document_name
                                      ? searchResultItem.document_name
                                      : searchResultItem.template_name
                                      ? searchResultItem.template_name
                                      : searchResultItem.workflows
                                          ?.workflow_title
                                      ? searchResultItem.workflows
                                          ?.workflow_title
                                      : ''
                                  }
                                  place='top'
                                />
                              </span>
                            </button>
                          );
                        })
                      )}
                    </>
                  )}
                </>
              )}
            </div>
          </ManageFiles>
        </div>
      </WorkflowLayout>
    </>
  );
};

export default SearchPage;

// // ********** Dummy Data **********
// const searchForItemDummy = (dataToPost) => {
// 	const dummyArray = [
// 		{ _id: "as", document_name: "Doc 1" },
// 		{ _id: "asd", document_name: "Doc 2" },
// 		{ _id: "asda", document_name: "Doc 3" },
// 		{ _id: "asdfg", template_name: "Temp 1" },
// 		{ _id: "asdfgh", template_name: "Temp 2" },
// 		{
// 			_id: "qw", workflows: {
// 				workflow_title: "Workflow 1",
// 			}
// 		},
// 		{
// 			_id: "qwe", workflows: {
// 				workflow_title: "Workflow 2",
// 			}
// 		}
// 	];
// 	return Promise.resolve({ data: { search_result: dummyArray } });
// };

// useEffect(() => {
// 	if (!searchLoading) return;

// 	const dataToPost = {
// 		company_id: userDetail?.portfolio_info[0]?.org_id,
// 		search: currentSearch,
// 	};

// 	searchForItemDummy(dataToPost)
// 		.then((res) => {
// 			setSearchLoading(false);
// 			setSearchResults(res.data.search_result);
// 		})
// 		.catch((error) => {
// 			// console.log(error.response ? error.response.data : error.message);
// 			setSearchLoading(false);
// 			toast.error(error.response ? error.response.data : error.message);
// 		});
// }, [searchLoading]);
