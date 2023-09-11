import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProcessDetail.module.css'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// import { MdExpandMore } from "react-icons/md";
import { MdContentCopy, MdExpandMore, MdExpandLess } from "react-icons/md";

const ProcessDetail = () => {
  const { ProcessDetail } = useSelector((state) => state.app);
  // const dispatch = useDispatch();
  // const { ProcessDetail } = useSelector((state) => state.app);

  // {ProcessDetail.links.map(({ member, [member]: link }) => (
  //   <a href={link} key={member}>
  //     console.log({member})
  //   </a>
  // ))}
  
  const handleCopyLink = (link) => {
    if (!link) return;

    navigator.clipboard.writeText(link);
    toast.info("Link Copied")
  };



  return (
    <>
      <div className={styles.body_div}>
        <div className={styles.steps}>
          <h3 className={styles.Process_Title}>{ProcessDetail.process_title}</h3>

          <div className={styles.info_container}>
            <div className={styles.Flex_div}>
              <div className={styles.label}>Created By :</div>
              <div className={styles.value}>{ProcessDetail.created_by}</div>
            </div>
            <div className={styles.Flex_div}>
              <div className={styles.label}>Processing State :</div>
              <div className={styles.value}>{ProcessDetail.processing_state}</div>
            </div>
            <div className={styles.Flex_div}>
              <div className={styles.label}>Processing Type :</div>
              <div className={styles.value}>{ProcessDetail.process_type}</div>
            </div>

          </div>
          <h3 className={styles.Process_Title}>Steps :</h3>

          <div className={styles.info_container}>
            <div className={styles.grid_container}>
              {ProcessDetail.process_steps.map((step, index) => {
                return (
                  <Step
                    className={styles.grid_item}
                    step={step}
                    index={index}
                  />
                );
              })}
            </div>
          </div>
          <h3 className={styles.Process_Title}>Links :</h3>
          <div className={styles.info_container}>
            <div className={styles.process__Links__Wrapper}>
              <table>
                <thead>
                  <tr>
                    <td>S/No.</td>
                    <td>Name</td>
                    <td>Link</td>
                    <td>Copy</td>
                  </tr>
                </thead>

                <tbody className={styles.process__Links__Container}>
                  {ProcessDetail.links && (
                    ProcessDetail.links.map((link, index) => {

                      const linkName = Object.keys(link)[0];
                      const linkValue = link[linkName];

                      return (
                        <tr key={index}>
                          <td>{index + 1}.</td>
                          <td>{linkName}</td>
                          <td
                            className={styles.single__Link}
                          // onClick={() => handleCopyLink(linkValue)}
                          >
                            {linkValue}
                          </td>
                          <td>
                            <span
                              className={styles.process__Generated__Links__Copy__Item}
                              onClick={() => handleCopyLink(linkValue)}
                            >
                              <MdContentCopy className={styles.copy_icon} />
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const Step = ({ step, index }) => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const stepDivClass = expanded ? styles.Step_div_expanded : styles.Step_div;

  return (
    <div onClick={()=>{navigate('StepDetail');
  }} className={stepDivClass}>
      <div className={styles.Process_Title}>
        {step.stepNumber}.
      </div>
      <div className={styles.Process_Title}>
        {step.stepName}
      </div>

   
       
        <div className={styles.expanded}>
          <div>
            <div>Public Member :</div>
          </div>
          <div>
            <span>Team Member :</span>
          </div>
          <div>
            <span>User Member :</span>
          </div>
        </div>
      
    </div>
  );
};




export default ProcessDetail
