import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import ManageFiles from "../../components/manageFiles/ManageFiles";
import { setToggleManageFileForm } from "../../features/app/appSlice";
import { detailDocument } from "../../features/document/asyncThunks";
import { detailTemplate } from "../../features/template/asyncThunks";
import { detailWorkflow } from "../../features/workflow/asyncTHunks";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import { searchForItem } from "../../services/searchServices";
import styles from "./style.module.css";


const SearchPage = () => {
    const [ searchResults, setSearchResults ] = useState([]);
    const { state } = useLocation();
    const [ currentSearch, setCurrentSearch ] = useState("");
    const  [ searchLoading, setSearchLoading ] = useState(false);
    const { userDetail } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
    
        if (!state) return

        if (state.searchResults) setSearchResults(state.searchResults)
        if (state.searchItem) setCurrentSearch(state.searchItem)
    
    }, [state])

    const handleSearchItemClick = (item) => {
        if (item.document_name) {
            const data = {
                document_name: item.document_name,
                document_id: item._id,
            };
            dispatch(detailDocument(data.document_id));
        }
        if (item.template_name) {
            const data = {
                template_id: item._id,
                template_name: item.template_name,
            };
            dispatch(detailTemplate(data.template_id));
        }
        if (item.workflows) {
            dispatch(setToggleManageFileForm(true));
            const data = { 
                workflow_id: item._id 
            };
            dispatch(detailWorkflow(data.workflow_id));
        }
    }

    const handleSearchInputChange = (value) => {
        setCurrentSearch(value)
        setSearchLoading(true);
    }

    useEffect(() => {
        
        if (!searchLoading) return

        const dataToPost = {
            company_id: userDetail?.portfolio_info[0]?.org_id,
            search: currentSearch,
        }

        searchForItem(dataToPost).then(res => {
            setSearchLoading(false);
            setSearchResults(res.data.search_result);       
        }).catch(error => {
            console.log(error.response ? error.response.data : error.message);
            setSearchLoading(false);
            toast.error(error.response ? error.response.data : error.message)  
        })

    }, [searchLoading])

    return <>
        <WorkflowLayout>
            <div className={styles.search__Page__Container}>
                <ManageFiles title="Search" contentBoxClassName={styles.search__Manage__Files__Content}>
                    <form onSubmit={(e) => e.preventDefault()} className={styles.search__box}>
                        <button type="submit">
                        {
                            searchLoading ? <LoadingSpinner color={"#61ce70"} width={"1rem"} height={"1rem"}/> : <>
                            <i>
                                <FaSearch />
                            </i>
                            </>
                        }
                        </button>
                        <input value={currentSearch} placeholder="Type here to search" onChange={(e) => handleSearchInputChange(e.target.value)} />
                    </form>
                    <div className={styles.minified__Search__Container}>
                        {
                            searchLoading ? <p>Please wait...</p> :

                            currentSearch.length < 1 ? <></> :

                            searchResults.length < 1 ? <p>No items found matching {currentSearch}</p> : <>
                                {
                                    React.Children.toArray(searchResults.map(searchResultItem => {
                                        return <button id={searchResultItem._id} onClick={() => handleSearchItemClick(searchResultItem)}>
                                        <span className={styles.search__Item__Info}>
                                            { 
                                                searchResultItem.document_name ? "Document" :
                                                searchResultItem.template_name ? "Template" :
                                                searchResultItem.workflows ? "Workflow" :
                                                ""
                                            }
                                        </span>
                                        <span>
                                            { 
                                                searchResultItem.document_name ? 
                                                    searchResultItem.document_name
                                                :
                                                searchResultItem.template_name ? 
                                                    searchResultItem.template_name
                                                :
                                                searchResultItem.workflows ?
                                                    searchResultItem.workflows?.workflow_title
                                                :
                                                ""
                                            }
                                            <Tooltip
                                                anchorId={searchResultItem._id} 
                                                content={
                                                    searchResultItem.document_name ? searchResultItem.document_name :
                                                    searchResultItem.template_name ? searchResultItem.template_name :
                                                    searchResultItem.workflows?.workflow_title ? searchResultItem.workflows?.workflow_title :
                                                    ""
                                                } 
                                                place="top" 
                                            />
                                        </span>
                                        </button>
                                    }))
                                }
                            </>
                        }
                    </div>
                </ManageFiles>
            </div>
        </WorkflowLayout>
    </>
}

export default SearchPage;
