import React, { useState } from "react";
import styles from "./search.module.css";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { IoMdClose } from "react-icons/io";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { searchForItem } from "../../../services/searchServices";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { useNavigate } from "react-router-dom";
import { detailDocument } from "../../../features/document/asyncThunks";
import { detailTemplate } from "../../../features/template/asyncThunks";
import { setToggleManageFileForm } from "../../../features/app/appSlice";
import { detailWorkflow } from "../../../features/workflow/asyncTHunks";

const Search = () => {
  const { register, handleSubmit, watch } = useForm();
  const { search } = watch();
  const  [ searchLoading, setSearchLoading ] = useState(false);
  const [ searchResults, setSearchResults ] = useState([]);
  const [ searchResultItems, setSearchResultItems ] = useState([]);
  const [ searchResultLoaded, setSearchResultLoaded ] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data) => {
    if (data.search.length < 1 || searchLoading) return setSearchResultItems([])

    setSearchLoading(true);

    const dataToPost = {
      company_id: userDetail?.portfolio_info[0]?.org_id,
      search: data.search,
    }

    try {
      const response = await (await searchForItem(dataToPost)).data; 
      setSearchResultLoaded(true);
      setSearchLoading(false);
      setSearchResults(response.search_result);     
      
      let updatedItems = items.map(item => {
        const copyOfItem = {...item};

        if (copyOfItem.type === "Documents") {
          const documentsFound = response.search_result.filter(searchResultItem => searchResultItem.document_name).slice(0, 3)
          copyOfItem.parent = "Documents";
          copyOfItem.count = documentsFound.length;
          copyOfItem.children = documentsFound.map(result => {
            return { id: uuidv4(), child: result.document_name, searchItem: true, href: "#", itemObj: result}
          })
          copyOfItem.isOpen = true
          return copyOfItem
        }
        if (item.type === "Templates") {
          const templatesFound = response.search_result.filter(searchResultItem => searchResultItem.template_name).slice(0, 3)
          copyOfItem.parent = "Templates";
          copyOfItem.count = templatesFound.length;
          copyOfItem.children = templatesFound.map(result => {
            return { id: uuidv4(), child: result.template_name, searchItem: true, href: "#", itemObj: result}
          })
          copyOfItem.isOpen = true
          return copyOfItem
        }

        const workflowsFound = response.search_result.filter(searchResultItem => searchResultItem.workflows).slice(0, 3)
        copyOfItem.parent = "Workflows";
        copyOfItem.count = workflowsFound.length;
        copyOfItem.children = workflowsFound.map(result => {
          return { id: uuidv4(), child: result.workflows?.workflow_title, searchItem: true, href: "#", itemObj: result}
        })
        copyOfItem.isOpen = true
        return copyOfItem
      })
      setSearchResultItems(updatedItems);

    } catch (error) {
      console.log(error.response ? error.response.data : error.message);
      setSearchLoading(false);
      toast.error(error.response ? error.response.data : error.message)
    }
  };

  const handleSeeMoreBtnClick = () => {
    navigate('/search', { state: { searchResults: searchResults, searchItem: search }})
  }

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Search</h2>
      <p className={styles.info}>
        Search in file names of Documents, Templates & Workflows
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.search__box}>
        <input {...register("search")} placeholder="Type here to search" />
        <button type="submit">
          {
            searchLoading ? <LoadingSpinner color={"#fff"} /> : <>
            <i>
              <FaSearch />
            </i>
            <span>Search</span>
            </>
          }
        </button>
        {/* {
          searchResultLoaded ? <div className={styles.minified__Search__Results}>
            <div className={styles.minified__Search__Top__Row}>
              <h5>Search results</h5>
              <button onClick={() => setSearchResultLoaded(false)}>
                <IoMdClose />
              </button>
            </div>
            <div className={styles.minified__Search__Container}>
              {
                searchResults.length < 1 ? <p>No items found matching {search}</p> : <>
                  {
                    React.Children.toArray(searchResults.slice(0, 3).map(searchResultItem => {
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
                              searchResultItem.document_name.length > 10 ?
                                searchResultItem.document_name.slice(0, 10) + "..." :
                                searchResultItem.document_name
                            :
                            searchResultItem.template_name ? 
                              searchResultItem.template_name.length > 10 ?
                                searchResultItem.template_name.slice(0, 10) + "..." :
                                searchResultItem.template_name
                            :
                            searchResultItem.workflows ?
                              searchResultItem.workflows?.workflow_title.length > 10 ?
                                searchResultItem.workflows?.workflow_title.slice(0, 10) + "..." :
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
            { 
              searchResults.length > 3 ? <button className={styles.see__All__Btn} onClick={handleSeeMoreBtnClick}>
                See all
              </button> :
              <></>
            }
          </div> : <></>
        } */}
      </form>
      <CollapseItem listType="ol" items={searchResultItems} />
      { 
        searchResultItems.length > 3 ? <div className={styles.see__All__Btn__Container}>
          <button className={styles.see__All__Btn} onClick={handleSeeMoreBtnClick}>
            See more
          </button>
        </div> : <></>
      }
    </div>
  );
};

export default Search;

export const items = [
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Documents (07)",
    type: "Documents",
    children: [
      { id: uuidv4(), child: "Payment voucher" },
      { id: uuidv4(), child: "Answer sheet" },
      { id: uuidv4(), child: "Agreement" },
      { id: uuidv4(), child: "Appointment order" },
      { id: uuidv4(), child: "Letter" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Templates (04)",
    type: "Templates",
    children: [
      { id: uuidv4(), child: "Leave format" },
      { id: uuidv4(), child: "Payment voucher" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Workflows (04)",
    type: "Workflows",
    children: [
      { id: uuidv4(), child: "Leave process" },
      { id: uuidv4(), child: "Payment process" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
];
