import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import styles from './ProcessDetail.module.css'
import { toast } from 'react-toastify';
import { processReport } from '../../../httpCommon/httpCommon';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { processDetailReport } from '../../../utils/helpers';
import { Button } from 'react-bootstrap';
import {
  Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import Spinner from 'react-bootstrap/Spinner';
import { Bar, Pie } from 'react-chartjs-2';
// import { MdExpandMore } from "react-icons/md";
import { MdContentCopy, MdExpandMore, MdExpandLess, PiUsersThreeBold } from "react-icons/md";
import { FaUsers, FaUsersCog, FaUserSecret, FaPlus } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import processImage from "../../../assets/processImage.png";
import greenImage from "../../../assets/greenImage.png";
import UserDetail from '../../newSidebar/userDetail/UserDetail';
import { productName } from '../../../utils/helpers';
import ProgressBar from 'react-bootstrap/ProgressBar';
import AddMemberModal from './AddMemberModal';
import AddWorkflowModal from './AddWorkflowModal';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
);



const ProcessDetail = () => {
  const { ProcessDetail } = useSelector((state) => state.processes);
  const { userDetail } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const handleNavigateDocument = () => {
    navigate('/processes/document-report');
  };
  const handleNavigateScale = () => {
    navigate('/processes/scale-report');
  };
  const handleNavigate = () => {
    navigate('/processes/evaluation-report');
  };
  // const dispatch = useDispatch();
  // const { ProcessDetail } = useSelector((state) => state.app);

  // {ProcessDetail.links.map(({ member, [member]: link }) => (
  //   <a href={link} key={member}>
  //     // console.log({member})
  //   </a>
  // ))}

  const handleCopyLink = (link) => {
    if (!link) return;

    navigator.clipboard.writeText(link);
    toast.info("Link Copied")
  };

  // console.log("ProcessDetail", ProcessDetail)
  return (
    <>
      <div className={styles.body_div}>
        <div className={styles.steps}>
          <div className={styles.processName}>
            <img src={greenImage} alt={'Green Image'} />
            {/* <div class={styles.textOverlay}> */}
            <div className={styles.processHeading}>
              <h3>{ProcessDetail.process_title}</h3>
            </div>
            {/* </div> */}
          </div>

          <div className={styles.info_container}>
            <div className={styles.BarContainer}>
              <div >
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Created By :</div>
                  <div className={styles.value}>{userDetail?.userinfo?.username}</div>
                </div>
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Processing State :</div>
                  <div className={styles.valueProcessing}>{ProcessDetail?.processing_state}</div>
                </div>
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Processing Type :</div>
                  <div className={styles.value}>{ProcessDetail?.process_type}</div>
                </div>
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Portfolio:</div>
                  {/* <div className={styles.value}>{userDetail?.portfolio_info[0]?.portfolio_name}</div> */}
                  <div className={styles.value}>{userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.portfolio_name : userDetail?.portfolio_info[0]?.portfolio_name}</div>
                </div>
              </div>
              <div className={styles.LeftContent}>
                <CircularProgressBar percentage={ProcessDetail?.progress} />
              </div>
              <div>
                <div className={styles.ImageContainer}>
                  {/* <Button onClick={handleNavigateDocument} variant="success">
                    Assign Portfolios
                  </Button> */}
                  <img src={processImage} alt={'Process Image'} />
                </div>
              </div>
            </div>

          </div>
          <div className={styles.Process_Title}>
            Steps:
            {ProcessDetail?.process_steps?.map((step, index) => {
              return (
                <>
                  <StepCards
                    step={step}
                    index={index}
                  />
                </>
              );
            })}
          </div>

          <div className={styles.Process_Title}>Links :</div>
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
          {/* <div className="d-grid gap-2">
            <Button variant="secondary" size="md" onClick={handleNavigateDocument}>
              Document Report
            </Button>
            <Button onClick={handleNavigateScale} variant="secondary" size="md">
              Scale Report
            </Button>

            <Button onClick={handleNavigate} variant="secondary" size="md">
              Evaluation Report
            </Button>
          </div><br /> */}
          <ProgressBar striped variant="success" now={100} className={styles.custom_progress_bar} /><br />
          <div className={styles.button_container}>
            <Button onClick={handleNavigateDocument} variant="success">
              Document Report
            </Button>

            {/* <Button onClick={handleNavigateScale} variant="success">
              Scale Report
            </Button> */}

            <Button onClick={handleNavigate} variant="success">
              Evaluation Report
            </Button>
          </div><br />

        </div>
      </div>
    </>
  );
};

const StepCards = ({ step, index }) => {
  const [showModal, setShowModal] = useState(false);
  const [workflowShowModal, setWorkflowShowModal] = useState(false);


  const handleShowModal = () => {
    // console.log("handleShowModal")
    setShowModal(true);
    // console.log("handleShowModal", showModal)

  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleWorkflowCloseModal = () => {
    setWorkflowShowModal(false);
    // console.log("handleShowModal", workflowShowModal)

  };
  const handleInternalProcess = () => {
    // console.log("step", step)
    if(step.permitInternalWorkflow && workflowShowModal === false && step.stepDocumentCloneMap.length > 0 ){
      setWorkflowShowModal(true);
      // toast.success("Internal Processing is allowed at this step")
    }
  }

  return (
    <>
      <Accordion defaultActiveKey={null} onClick={handleInternalProcess}>
        <Accordion.Item eventKey="0" >
          <Accordion.Header style={{ color: '#13511D', fontWeight: 'bold' }}>{step.stepName}</Accordion.Header>
          <Accordion.Body>
            <div className={styles.CardContainer}>
              <Card key={index} style={{ width: '10rem', backgroundColor: '#EDD680' }}>
                <Card.Body>
                  <Card.Title><span><FaUserSecret /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '17.78px' }}>User Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#D5B02E', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step?.stepUserMembers?.length}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card key={index} style={{ width: '10rem', backgroundColor: '##72C8E0' }}>
                <Card.Body>
                  <Card.Title><span><FaUsersCog /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '17.78px' }}>Team Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#2E99B7', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step?.stepTeamMembers?.length}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card key={index} style={{ width: '10rem', backgroundColor: '#FFF0F0' }}>
                <Card.Body>
                  <Card.Title><span><FaUsers /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '17.78px' }}>Public Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#E07575', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step?.stepPublicMembers?.length}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card key={index} style={{ width: '10rem', backgroundColor: '#DBF0DE' }} onClick={handleShowModal}>
                <Card.Body>
                  <Card.Title style={{ justifyContent: 'center', display: 'flex', paddingTop: '35px' }}><span><FaPlus /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '17.78px', paddingBottom: '40px' }}>Add Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#E07575', fontSize: '50.9px', fontStyle: 'Rajdhani', visibility: 'hidden' }}>
                    {/* {step?.stepPublicMembers?.length} */}
                  </Card.Text>
                </Card.Body>
              </Card>
              <AddMemberModal
                show={showModal}
                onHide={handleCloseModal}
                backdrop='static'
                keyboard={false}
                step={step}
              />
              <AddWorkflowModal
                show={workflowShowModal}
                onHide={handleWorkflowCloseModal}
                backdrop='static'
                keyboard={false}
                step={step}
              />
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>

  );
};

const CircularProgressBar = ({ percentage }) => {
  // Calculate the circumference of the circle
  // const circumference = 160; // Increase the circumference for a larger circle
  const radius = 60; // Increase the radius as needed
  const circumference = 2 * Math.PI * radius;
  const strokeWidth = 15; // Adjust the stroke width as needed
  const progress = ((100 - percentage) / 100) * circumference;
  // const progress = percentage
  const progressOffset = (circumference - (percentage / 100) * circumference);


  return (
    <svg width={radius * 2} height={radius * 2} viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill="transparent"
        stroke="#e0e0e0" // Background color
        strokeWidth={strokeWidth}
      />
      <circle
        cx={radius}
        cy={radius}
        r={radius - strokeWidth / 2}
        fill="transparent"
        stroke={percentage > 0 ? "#E5B842" : "e0e0e0"} // Progress color
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={progressOffset}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24.74px"
        fill="#000000" // Text color
        fontWeight="600"
      >
        {percentage}%
      </text>
    </svg>
  );
};

export const pieChartData = {
  labels: ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5', 'Score 6', 'Score 7'],
  datasets: [
    {
      label: 'score list',
      data: [1, 3, 2, 10, 7, 4, 8], // Values from the 'score_list'
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8B4513',
        '#98FB98',
        '#20B2AA',
        '#FF4500'
      ],
      hoverBackgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#8B4513',
        '#98FB98',
        '#20B2AA',
        '#FF4500'
      ],
      borderWidth: 1,
    }
  ]
};

export default ProcessDetail
