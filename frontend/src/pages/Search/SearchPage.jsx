import React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaSearch } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import { Tooltip } from "react-tooltip";
import { LoadingSpinner } from "../../components/LoadingSpinner/LoadingSpinner";
import { setToggleManageFileForm } from "../../features/app/appSlice";
import { detailDocument } from "../../features/document/asyncThunks";
import { detailTemplate } from "../../features/template/asyncThunks";
import { detailWorkflow } from "../../features/workflow/asyncTHunks";
// import { searchForItem } from "../../services/searchServices";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout";
import ManageFiles from "../../components/manageFiles/ManageFiles";
import styles from "./style.module.css";
import { searchItemByKeyAndGroupResults } from "./util";
import { useAppContext } from "../../contexts/AppContext";
import { IoIosRefresh } from "react-icons/io";
import { DocumentServices } from "../../services/documentServices";
import { TemplateServices } from "../../services/templateServices";
import { WorkflowServices } from "../../services/workflowServices";
import { setAllDocuments } from "../../features/document/documentSlice";
import { setAllTemplates } from "../../features/template/templateSlice";
import { setAllWorkflows } from "../../features/workflow/workflowsSlice";

const searchCategories = {
	documents: "documents",
	templates: "templates",
	workflows: "workflows",
	all: "all",
}

const SearchPage = () => {
	const [searchResults, setSearchResults] = useState([]);
	const [searchResultsToDisplay, setSearchResultsToDisplay] = useState([]);
	const { state } = useLocation();
	const [currentSearch, setCurrentSearch] = useState("");
	const [searchLoading, setSearchLoading] = useState(false);
	const { userDetail } = useSelector((state) => state.auth);
	const [currentSearchOption, setCurrentSearchOption] = useState(searchCategories.all);
	const dispatch = useDispatch();
	const { searchItems } = useAppContext();
	const { allWorkflowsStatus } = useSelector((state) => state.workflow);
	const { allTemplatesStatus } = useSelector((state) => state.template);
	const { allDocumentsStatus } = useSelector((state) => state.document);
	const [ refreshLoading, setRefreshLoading ] = useState(false);

	useEffect(() => {

		if (!state) return

		if (state.searchResults) {
			setSearchResults(state.searchResults)
			setSearchResultsToDisplay(state.searchResults)
		}
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
		if (value.length < 1) return
		// setSearchLoading(true);
	}

	useEffect(() => {

		if (currentSearch.length < 1) {
			setSearchLoading(false);
			setSearchResults([]);
			return 
		}
		
		setSearchLoading(true);

		if (
			allDocumentsStatus === 'pending' ||
			allTemplatesStatus === 'pending' || 
			allWorkflowsStatus === 'pending' ||
			refreshLoading
		) return

		try {
			const results = searchItemByKeyAndGroupResults(currentSearch, searchItems);
			// console.log('Search results: ', results)
			setSearchLoading(false);
			setSearchResults(results);

		} catch (error) {
			console.log(error)
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
		// 	console.log(error.response ? error.response.data : error.message);
		// 	setSearchLoading(false);
		// 	toast.error(error.response ? error.response.data : error.message)
		// })

	}, [currentSearch, searchItems, allDocumentsStatus, allTemplatesStatus, allWorkflowsStatus, refreshLoading])

	useEffect(() => {

		const currentSearchResults = searchResults.slice();

		switch (currentSearchOption) {
			case searchCategories.all:
				setSearchResultsToDisplay(currentSearchResults)
				break;

			case searchCategories.documents:
				setSearchResultsToDisplay(currentSearchResults.filter(searchResultItem => searchResultItem.document_name))
				break;

			case searchCategories.templates:
				setSearchResultsToDisplay(currentSearchResults.filter(searchResultItem => searchResultItem.template_name))
				break;

			case searchCategories.workflows:
				setSearchResultsToDisplay(currentSearchResults.filter(searchResultItem => searchResultItem.workflows))
				break;

			default:
				console.log("Invalid search option")
				break;
		}

	}, [currentSearchOption, searchResults])

	const handleRefresh = async () => {

		if (refreshLoading) return;

		setRefreshLoading(true);

		const data = {
			company_id: userDetail?.portfolio_info[0].org_id,
		};
	
		const documentServices = new DocumentServices();
		const templatesServices = new TemplateServices();
		const workflowServices = new WorkflowServices();

		try {
			const documentsData = (await documentServices.allDocuments(data.company_id)).data;
			dispatch(
				setAllDocuments(
					documentsData.documents.reverse().filter(document => 
					document.document_state !== "trash" &&
					document.data_type && document.data_type === userDetail?.portfolio_info[0]?.data_type
				  )
				)
			);
		} catch (error) {
			toast.info('Refresh failed for documents')
		}

		try {
			const templatesData = (await templatesServices.allTemplates(data.company_id)).data;
			dispatch(
				setAllTemplates(
				  templatesData.templates.reverse().filter(template => 
					template.data_type && template.data_type === userDetail?.portfolio_info[0]?.data_type
				  )
				)
			);
		} catch (error) {
			toast.info('Refresh failed for templates')
		}

		try {
			const workflowsData = (await workflowServices.allWorkflows(data.company_id)).data;
			dispatch(
				setAllWorkflows(
				  workflowsData.workflows.filter(workflow => 
					workflow.workflows.data_type && workflow.workflows.data_type === userDetail?.portfolio_info[0]?.data_type
				  )
				)
			);
		} catch (error) {
			toast.info('Refresh failed for workflows')
		}

		setRefreshLoading(false);
	}

	return <>
		<WorkflowLayout>
			<div className={styles.search__Page__Container}>
				<ManageFiles title="Search for Documents, Templates and Workflows" contentBoxClassName={styles.search__Manage__Files__Content} removePageSuffix={true}>
					<div className={styles.header__Section}>
						<form onSubmit={(e) => e.preventDefault()} className={styles.search__box}>
							<button type="submit">
								{
									searchLoading ? <LoadingSpinner color={"#61ce70"} width={"1rem"} height={"1rem"} /> : <>
										<i>
											<FaSearch />
										</i>
									</>
								}
							</button>
							<input value={currentSearch} placeholder="Type here to search" onChange={(e) => handleSearchInputChange(e.target.value)} />
						</form>
						<button className={styles.refresh__btn} onClick={handleRefresh}>
							{
								refreshLoading ? <LoadingSpinner color={"white"} width={"1rem"} height={"1rem"} /> :
								<IoIosRefresh />
							}
							<span>Refresh</span>
						</button>
					</div>
					<div className={styles.minified__Search__Container}>
						{
							searchLoading ? <p>{`Please wait.${refreshLoading ? ' It might take awhile as items are being refreshed' : ''}...`}</p> :

								currentSearch.length < 1 ? <></> :

									<>
										<div className={styles.mini__Select__Row}>
											<label>
												<input type={"radio"} checked={currentSearchOption === searchCategories.all ? true : false} value={searchCategories.all} onChange={(e) => setCurrentSearchOption(e.target.value)} />
												All
											</label>
											<label>
												<input type={"radio"} checked={currentSearchOption === searchCategories.documents ? true : false} value={searchCategories.documents} onChange={(e) => setCurrentSearchOption(e.target.value)} />
												Documents
											</label>
											<label>
												<input type={"radio"} checked={currentSearchOption === searchCategories.templates ? true : false} value={searchCategories.templates} onChange={(e) => setCurrentSearchOption(e.target.value)} />
												Templates
											</label>
											<label>
												<input type={"radio"} checked={currentSearchOption === searchCategories.workflows ? true : false} value={searchCategories.workflows} onChange={(e) => setCurrentSearchOption(e.target.value)} />
												Workflows
											</label>
										</div>

										{
											searchResultsToDisplay.length < 1 ? <p>No {currentSearchOption === searchCategories.all ? "items" : currentSearchOption} found matching {currentSearch}</p> : <>
												{
													React.Children.toArray(searchResultsToDisplay.map(searchResultItem => {
														return <button id={searchResultItem._id} onClick={() => handleSearchItemClick(searchResultItem)}>
															<span className={
																`${styles.search__Item__Info} 
                                                    ${searchResultItem.document_name ? styles.search__Item__Doc :
																	searchResultItem.template_name ? styles.search__Item__Temp :
																		searchResultItem.workflows ? styles.search__Item__Workf : ''
																}`
															}>
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
									</>
						}
					</div>
				</ManageFiles>
			</div>
		</WorkflowLayout>
	</>
}

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
// 			console.log(error.response ? error.response.data : error.message);
// 			setSearchLoading(false);
// 			toast.error(error.response ? error.response.data : error.message);
// 		});
// }, [searchLoading]);
