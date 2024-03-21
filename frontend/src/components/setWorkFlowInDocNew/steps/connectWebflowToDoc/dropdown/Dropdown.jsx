import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setDropdowndToggle,
} from '../../../../../features/app/appSlice';
import Collapse from '../../../../../layouts/collapse/Collapse';
import styles from './dropdown.module.css';
import { TiArrowSortedDown, TiArrowSortedUp } from 'react-icons/ti';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { toast } from 'react-toastify';
import { setDocCurrentWorkflow } from '../../../../../features/processes/processesSlice';

const Dropdown = ({ disableClick, addWorkflowStep }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { wfToDocument, docCurrentWorkflow,  } = useSelector(
    (state) => state.processes
  );
  const {dropdownToggle,  DocumentId } = useSelector((state) => state.app);
  /*  const [toggle, setToggle] = useState(false); */

  ////copied workflow
  const copiedWorkflow = useSelector((state) => state.copyProcess.workflow);

  useEffect(() => {
    const timerId = setTimeout(() => {
      // console.log('entered drop down', wfToDocument.workflows)
      if (wfToDocument.workflows && copiedWorkflow !== null) {
        dispatch(setDocCurrentWorkflow(wfToDocument.workflows[0]));

        dispatch(setDropdowndToggle(false));
        // console.log('finished dropdown')
      }
    }, 5000);
    return () => clearTimeout(timerId);
  }, [copiedWorkflow, wfToDocument])

  const handleToggle = () => {

    if (disableClick) return;
    dispatch(setDropdowndToggle(!dropdownToggle));
  };

  const handleCurrentWorkflow = (item) => {
    dispatch(setDocCurrentWorkflow(item));

    dispatch(setDropdowndToggle(false));
  };

  // console.log("ProcessDetailWorkflowDropdown", ProcessDetail)
  // // console.log("the wfToDocument.workflows are ",wfToDocument.workflows)

  const handleWorkflowSubmit = (item) => {
    // e.preventDefault();
  	// dispatch(SetDocumentId(props.step));
  	// console.log("itemMubeen", item, DocumentId)
  	// const apiUrl = `https://100094.pythonanywhere.com/v2/processes/${ProcessDetail._id}/`;
    const apiUrl = `https://100094.pythonanywhere.com/v2/processes/64bb6c7c1da82ab75d3c75b8/`;


  	const payload = {
  		step_id: DocumentId.stepNumber || 1,
  		workflows: [
  			{
  				workflows: {
  					workflow_title: item.workflows.workflow_title || "Test-CTA-Process Demo",
  					// steps: [
  					// 	{
  					// 		stepCloneCount: 1,
  					// 		stepTaskType: "assign_task",
  					// 		stepRights: "add_edit",
  					// 		stepProcessingOrder: "no_order",
  					// 		stepTaskLimitation: "portfolios_assigned_on_or_before_step_start_date_and_time",
  					// 		stepActivityType: "team_task",
  					// 		stepDisplay: "in_all_steps",
  					// 		stepName: "Manager",
  					// 		stepRole: "Manager",
  					// 		stepPublicMembers: [
  					// 			{
  					// 				"member": "Uchechukwu",
  					// 				"portfolio": "BackendDev1"
  					// 			}
  					// 			// {
  					// 			//     "member": "PublicMem",
  					// 			//     "portfolio": "No_portf"
  					// 			// }
  					// 		],
  					// 		stepTeamMembers: [],
  					// 		stepUserMembers: [],
  					// 		stepDocumentCloneMap: [],
  					// 		stepNumber: 1,
  					// 		stepDocumentMap: [
  					// 			"t1"
  					// 		],
  					// 		permitInternalWorkflow: false,
  					// 		skipStep: false,
  					// 		stepLocation: "any"
  					// 	},
  					// 	{
  					// 		stepCloneCount: 2,
  					// 		stepTaskType: "assign_task",
  					// 		stepRights: "add_edit",
  					// 		stepProcessingOrder: "no_order",
  					// 		stepTaskLimitation: "portfolios_assigned_on_or_before_step_start_date_and_time",
  					// 		stepActivityType: "team_task",
  					// 		stepDisplay: "in_all_steps",
  					// 		stepName: "Customer",
  					// 		stepRole: "Customer",
  					// 		stepPublicMembers: [],
  					// 		stepTeamMembers: [
  					// 			// {
  					// 			//     "member": "PublicMem",
  					// 			//     "portfolio": "No_portf"
  					// 			// }
  					// 			{
  					// 				member: "ayoolaa_",
  					// 				portfolio: "ThePro"
  					// 			}
  					// 		],
  					// 		stepUserMembers: [],
  					// 		stepDocumentCloneMap: [],
  					// 		stepNumber: 2,
  					// 		stepDocumentMap: [
  					// 			"t2"
  					// 		],
  					// 		permitInternalWorkflow: false,
  					// 		skipStep: false,
  					// 		stepLocation: "any"
  					// 	}
  					// ],
  					steps: DocumentId
  				}
  			}
  		]
  	};

  	// console.log('payload', payload)

  	// Making a POST request with Axios
  	axios.put(apiUrl, payload)
  		.then((response) => {
  			// Handle the API response here
  			// console.log('API Response:', response.data);
  			toast.success("Member Added in Portfolio")
  		})
  		.catch((error) => {
  			// Handle any errors here
  			toast.error(error.response.data)
  			console.error('API Error:', error.response);
  		});
  };

  return (
    <>
      {wfToDocument.document && wfToDocument.workflows.length > 0 && (
        <div className={styles.container}>
          <button
            onClick={handleToggle}
            className={`${styles.current__item__box} ${styles.box}`}
            style={{ cursor: disableClick ? 'not-allowed' : 'initial' }}
          >
            <span>
              {docCurrentWorkflow
                ? docCurrentWorkflow?.workflows.workflow_title
                : t('Select a Workflow')}
            </span>
            <i>
              {dropdownToggle ? (
                <TiArrowSortedUp size={22} />
              ) : (
                <TiArrowSortedDown size={22} />
              )}
            </i>
          </button>

            <div style={{ marginBottom: '20px' }}>
              <Collapse open={dropdownToggle}>
                <div className={styles.options__container}>
                  {wfToDocument.workflows?.map((item) => (
                    <div
                      /* style={{
                  backgroundColor:
                    item._id === docCurrentWorkflow?.workflows._id &&
                    "var(--e-global-color-accent)",
                }} */
                      key={item._id}
                      onClick={() => handleCurrentWorkflow(item)}
                      className={`${styles.option__box} ${styles.box} ${item._id === docCurrentWorkflow?._id && styles.current
                        }`}
                    >
                      <span>{item.workflows.workflow_title}</span>
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
        </div>
      )}
    </>
  );
};

export default Dropdown;
