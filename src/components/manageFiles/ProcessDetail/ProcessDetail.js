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
import { FaUsers, FaUsersCog, FaUserSecret } from "react-icons/fa";
import Card from 'react-bootstrap/Card';
import Accordion from 'react-bootstrap/Accordion';
import processImage from "../../../assets/processImage.png";
import greenImage from "../../../assets/greenImage.png";

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
  LinearScale,
  BarElement,
  Title,
);



const ProcessDetail = () => {
  const { ProcessDetail } = useSelector((state) => state.app);
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/processes/evaluation-report');
  };
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
                  <div className={styles.value}>{ProcessDetail.created_by}</div>
                </div>
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Processing State :</div>
                  <div className={styles.valueProcessing}>{ProcessDetail.processing_state}</div>
                </div>
                <div className={styles.Flex_div}>
                  <div className={styles.label}>Processing Type :</div>
                  <div className={styles.value}>{ProcessDetail.process_type}</div>
                </div>
              </div>
              <div className={styles.LeftContent}>
                <CircularProgressBar percentage={50} />
              </div>
              <div>
                <div className={styles.ImageContainer}>
                  <img src={processImage} alt={'Process Image'} />
                </div>
              </div>
            </div>

          </div>
          <div className={styles.Process_Title}>
            Steps:
            {ProcessDetail.process_steps.map((step, index) => {
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


          <div className={`d-flex flex-column align-items-center justify-content-center`}>
              <Button onClick={handleNavigate} variant="success" className="mb-4">
                Click here to see Evaluation Report
              </Button>
          </div>

          {/* <h3 className={styles.Process_Title}>Steps :</h3> */}

          {/* <div className={styles.info_container}>
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
          </div> */}

        </div>
      </div>
    </>
  );
};

// const Step = ({ step, index }) => {
//   const [expanded, setExpanded] = useState(false);

//   const stepDivClass = expanded ? styles.Step_div_expanded : styles.Step_div;

//   return (
//     <div className={stepDivClass}>
//       <div className={styles.Process_Title}>
//         {step.stepNumber}.
//       </div>
//       <div className={styles.Process_Title}>
//         {step.stepName}
//       </div>



//       <div className={styles.expanded}>
//         <div>
//           <span>Public Member :</span><span>{step.stepPublicMembers.length}</span>

//         </div>
//         <div>
//           <span>Team Member :</span><span>{step.stepTeamMembers.length}</span>

//         </div>
//         <div>

//           <span>User Member :</span><span>{step.stepUserMembers.length}</span>


//         </div>
//       </div>

//     </div>
//   );
// };

const StepCards = ({ step, index }) => {

  return (
    <>
      <Accordion defaultActiveKey="0">
        <Accordion.Item eventKey="0">
          <Accordion.Header style={{ color: '#13511D', fontWeight: 'bold' }}>{step.stepName}</Accordion.Header>
          <Accordion.Body>
            <div className={styles.CardContainer}>
              <Card key={index} style={{ width: '15rem', backgroundColor: '#EDD680' }}>
                <Card.Body>
                  <Card.Title><span><FaUserSecret /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '26.78px' }}>User Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#D5B02E', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step.stepUserMembers.length}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card key={index} style={{ width: '15rem', backgroundColor: '##72C8E0' }}>
                <Card.Body>
                  <Card.Title><span><FaUsersCog /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '26.78px' }}>Team Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#2E99B7', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step.stepTeamMembers.length}
                  </Card.Text>
                </Card.Body>
              </Card>
              <Card key={index} style={{ width: '15rem', backgroundColor: '#FFF0F0' }}>
                <Card.Body>
                  <Card.Title><span><FaUsers /></span></Card.Title>
                  <Card.Subtitle className="mb-2" style={{ color: '#3E3E3E', fontSize: '26.78px' }}>Public Member</Card.Subtitle>
                  <Card.Text style={{ textAlign: 'right', color: '#E07575', fontSize: '50.9px', fontStyle: 'Rajdhani' }}>
                    {step.stepPublicMembers.length}
                  </Card.Text>
                </Card.Body>
              </Card>
            </div>
          </Accordion.Body>
        </Accordion.Item>
      </Accordion>
    </>

  );
};

const CircularProgressBar = ({ percentage }) => {
  // Calculate the circumference of the circle
  const circumference = 160; // Increase the circumference for a larger circle
  const radius = 60; // Increase the radius as needed
  const strokeWidth = 15; // Adjust the stroke width as needed
  const progress = ((100 - percentage) / 100) * circumference;


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
        stroke="#E5B842" // Progress color
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={progress}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="24.74px        "
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

// const EvaluationReportComponent = () => {
//   const [reportData, setReportData] = useState(processDetailReport);
//   const { ProcessDetail } = useSelector((state) => state.app);
//   console.log("ProcessDetail", ProcessDetail._id)

//   const normalityAnalysisData = {
//     labels: ['Actual Areas', 'Rectangle Area', 'Slope', 'Slope Percentage Deviation', 'Calculated Slope'],
//     datasets: [
//       {
//         label: 'Analysis Value',
//         data: 
//         [
//           reportData?.normality_analysis?.list1?.actual_areas || 3.42,
//           reportData?.normality_analysis?.list1?.rectangle_area || 3.73,
//           reportData?.normality_analysis?.list1?.slope[0] || 1.84, // assuming only one value in slope array
//           reportData?.normality_analysis?.list1?.slope_percentage_deviation || 0.25,
//           reportData?.normality_analysis?.list1?.calculated_slope || 1.84
//         ],
//         backgroundColor: '#FFCE56'
//       }
//     ]
//   };

//   const barChartData = {
//     labels: ['Mean', 'Median', 'Mode'],
//     datasets: [
//       {
//         label: 'Scores Statistics',
//         data: [
//           reportData?.central_tendencies?.normal_dist?.mergedMean || 5.0,
//            reportData?.central_tendencies?.normal_dist?.mergedMedian || 4.0,
//             reportData?.central_tendencies?.normal_dist?.mergedMode?.length || 4.0
//         ],
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.6)',
//           'rgba(54, 162, 235, 0.6)',
//           'rgba(255, 206, 86, 0.6)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(255, 206, 86, 1)'
//         ],
//         borderWidth: 1,
//       }
//     ]
//   };

//   const pieChartData = {
//     labels: ['Score 1', 'Score 2', 'Score 3', 'Score 4', 'Score 5', 'Score 6', 'Score 7'],
//     datasets: [
//       {
//         label: 'score list',
//         data: reportData?.score_list || [1, 3, 2, 10, 7, 4, 8], // Values from the 'score_list'
//         backgroundColor: [
//           '#FF6384',
//           '#36A2EB',
//           '#FFCE56',
//           '#8B4513',
//           '#98FB98',
//           '#20B2AA',
//           '#FF4500'
//         ],
//         hoverBackgroundColor: [
//           '#FF6384',
//           '#36A2EB',
//           '#FFCE56',
//           '#8B4513',
//           '#98FB98',
//           '#20B2AA',
//           '#FF4500'
//         ],
//         borderWidth: 1,
//       }
//     ]
//   };

//   let promotersScores = 0;
//   let passiveScores = 0;
//   let DetractorsScores = 0;
//   if (reportData && reportData.score_list) {
//     const scoreListLength = reportData.score_list.length;

//     promotersScores = ((reportData.score_list.filter(score => score === 9 || score === 10).length) / scoreListLength) * 100;
//     passiveScores = ((reportData.score_list.filter(score => score === 7 || score === 8).length) / scoreListLength) * 100;
//     DetractorsScores = ((reportData.score_list.filter(score => score > 0 && score <= 6).length) / scoreListLength) * 100;
//   }

//   const npsScoreDistributionData = {
//     labels: ['Detractors', 'Passives', 'Promoters'],
//     datasets: [
//       {
//         data: [DetractorsScores || 20, passiveScores || 10, promotersScores || 65], // Assuming percentages for each category
//         backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
//         hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
//       }
//     ]
//   };

//   useEffect(() => {
//     console.log(ProcessDetail);
//     const fetchData = async () => {
//       try {
//         const requestBody = { process_id: 'abc0099986567abcd' };
//         const response = await axios.post('https://100035.pythonanywhere.com/evaluation/evaluation-api/?report_type=process', requestBody);
//         console.log("response", response.data.score_list)
//         setReportData(response.data);
//       } catch (error) {
//         console.error('Error fetching data:', error);
//       }
//     };

//     fetchData();
//   }, []);

//   if (!reportData) {
//     return <Spinner animation="grow" variant="success" />;
//   }

//   console.log("reportData", reportData)
//   // Process reportData and structure it for chart display
//   const barChartOptions = {
//     maintainAspectRatio: false,
//     responsive: false,  // Set to false to prevent resizing
//     // scales: {
//     //   y: {
//     //     beginAtZero: true
//     //   }
//     // },
//     height: "222px",    // Set your desired height
//     width: "450px"      // Set your desired width
//   };
//   return (
//     <div>
//       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//         <div className={styles.processHeadingChart2}>
//           <h5>Normality Analysis Data:</h5>
//         </div>

//         <div className={styles.processHeadingChart2}>
//           <h5>Bar Chart for Central Tendencies:</h5>
//         </div>
//       </div>

//       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

//         <Bar data={normalityAnalysisData} options={barChartOptions} />
//         <Bar data={barChartData} options={barChartOptions} />
//       </div>
//       <br/>

//       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
//         <div className={styles.processHeadingChart2}>
//           <h5>Pie Chart for Score List:</h5>
//         </div>

//         <div className={styles.processHeadingChart2}>
//           <h5>Pie Chart for NPS Score Distribution:</h5>
//         </div>
//       </div>

//       <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>

//         <Pie
//           data={pieChartData}
//           options={barChartOptions}
//         />
//         <Pie
//           data={npsScoreDistributionData}
//           options={barChartOptions}
//         />
//       </div>
//       {/* <div className={styles.processHeadingChart}>
//         <h3>Normality Analysis Data:</h3>
//       </div>
//       <Bar data={normalityAnalysisData} options={barChartOptions}/>
//       <br />

//       <div className={styles.processHeadingChart}>
//         <h3>Bar Chart for Central Tendencies:</h3>
//       </div>
//       <Bar data={barChartData} options={barChartOptions}/>
//       <br />

//       <div className={styles.processHeadingChart}>
//         <h3>Pie Chart for Score List:</h3>
//       </div>
//       <Pie
//         data={pieChartData}
//         options={barChartOptions}
//       />
//       <br />

//       <div className={styles.processHeadingChart}>
//         <h3>Pie Chart for NPS Score Distribution:</h3>
//       </div>
//       <Pie
//         data={npsScoreDistributionData}
//         options={barChartOptions}
//       /> */}
//     </div>
//   );
// };

export default ProcessDetail
