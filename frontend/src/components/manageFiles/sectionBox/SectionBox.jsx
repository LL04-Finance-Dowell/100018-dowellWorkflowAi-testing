import styles from "./sectionBox.module.css";
import maneFilesStyles from "../manageFiles.module.css";
import BookSpinner from "../../bookSpinner/BookSpinner";
import { useState } from "react";
import { Box } from "../../hoverCard/styledComponents";
import { PrimaryButton } from "../../styledComponents/styledComponents";
import { IoIosRefresh } from "react-icons/io";
import { LoadingSpinner } from "../../LoadingSpinner/LoadingSpinner";
import { useDispatch, useSelector } from "react-redux";
import { DocumentServices } from "../../../services/documentServices";
import { toast } from "react-toastify";
import { TemplateServices } from "../../../services/templateServices";
import { WorkflowServices } from "../../../services/workflowServices";
import { getAllProcessesV2 } from "../../../services/processServices";
import { setAllProcesses } from "../../../features/app/appSlice";
import { setAllDocuments } from "../../../features/document/documentSlice";
import { setAllTemplates } from "../../../features/template/templateSlice";
import { setAllWorkflows } from "../../../features/workflow/workflowsSlice";

const SectionBox = ({ cardItems, title, Card, status, idKey, itemType }) => {
  const [sliceCount, setSliceCount] = useState(1);
  const [ refreshLoading, setRefreshLoading ] = useState(false);
  const { userDetail } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  const handleLoadMore = () => {
    setSliceCount((prev) => prev + 1);
  };

  const handleRefresh = () => {
    if (itemType === "documents") {
      setRefreshLoading(true);

      const data = {
        company_id: userDetail?.portfolio_info[0].org_id,
      };

      const documentServices = new DocumentServices();

      documentServices.allDocuments(data.company_id).then(res => {
        dispatch(
          setAllDocuments(
            res.data.documents.reverse().filter(document => 
              document.document_state !== "trash" &&
              document.data_type && document.data_type === userDetail?.portfolio_info[0]?.data_type
            )
          )
        );
        toast.success("Successfully refreshed documents")
        setRefreshLoading(false);
      }).catch(err => {
        console.log("Refresh for documents failed")
        toast.info("Refresh for documents failed")
        setRefreshLoading(false);
      })
    }

    if (itemType === "templates") {
      setRefreshLoading(true);
      
      const data = {
        company_id: userDetail?.portfolio_info[0].org_id,
      };

      const templatesServices = new TemplateServices();

      templatesServices.allTemplates(data.company_id).then(res => {
        dispatch(
          setAllTemplates(
            res.data.templates.reverse().filter(template => 
              template.data_type && template.data_type === userDetail?.portfolio_info[0]?.data_type
            )
          )
        );
        toast.success("Successfully refreshed templates")
        setRefreshLoading(false);
      }).catch(err => {
        console.log("Refresh for templates failed")
        toast.info("Refresh for templates failed")
        setRefreshLoading(false);
      })
    }

    if (itemType === "workflows") {
      setRefreshLoading(true);
      
      const data = {
        company_id: userDetail?.portfolio_info[0].org_id,
      };

      const workflowServices = new WorkflowServices();

      workflowServices.allWorkflows(data.company_id).then(res => {
        dispatch(
          setAllWorkflows(
            res.data.workflows.filter(workflow => 
              workflow.data_type && workflow.data_type === userDetail?.portfolio_info[0]?.data_type
            )
          )
        );
        toast.success("Successfully refreshed workflows")
        setRefreshLoading(false);
      }).catch(err => {
        console.log("Refresh for workflows failed")
        toast.info("Refresh for workflows failed")
        setRefreshLoading(false);
      })
    }

    if (itemType === "processes") {
      setRefreshLoading(true);
      
      const data = {
        company_id: userDetail?.portfolio_info[0].org_id,
      };

      getAllProcessesV2(data.company_id).then(res => {
        dispatch(setAllProcesses(res.data.filter(process => process.processing_state).reverse()));
        toast.success("Successfully refreshed processes")
        setRefreshLoading(false)
      }).catch(err => {
        console.log("Refresh for processes failed")
        toast.info("Refresh for processes failed")
        setRefreshLoading(false);
      })
    }
  }

  console.log("slideCount", sliceCount);

  return (
    <div className={styles.container}>
      <div className={styles.content__container}>
        <div className={styles.content__box}>
          <h2
            className={maneFilesStyles.header}
            id={idKey ? title.replaceAll(" ", "") + "-" + idKey : ""}
          >
            {title}
            { 
              itemType && <button style={{ "background": "none" }} onClick={handleRefresh}>
                {
                  refreshLoading ? <LoadingSpinner color={"black"} width={"1.2rem"} height={"1.2rem"} /> :
                  <IoIosRefresh />
                }
              </button> 
            }
          </h2>
          {status === "pending" ? (
            <div style={{ marginTop: "15px" }}>
              <BookSpinner />
            </div>
          ) : (
            Card &&
            cardItems &&
            cardItems.length && (
              <>
                <div className={styles.grid__box}>
                  {Card &&
                    cardItems &&
                    cardItems.length > 0 &&
                    cardItems
                      .slice(0, sliceCount * 10)
                      .map((item) => <Card key={item.id} cardItem={item} />)}
                  {cardItems && cardItems.length > 10 && (
                    <PrimaryButton
                      style={{
                        pointerEvents: `${
                          cardItems.length / 10 < sliceCount && "none"
                        }`,
                      }}
                      hoverBg="success"
                      onClick={handleLoadMore}
                    >
                      {cardItems.length / 10 < sliceCount
                        ? "no more load"
                        : "load more"}
                    </PrimaryButton>
                  )}
                </div>
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default SectionBox;
