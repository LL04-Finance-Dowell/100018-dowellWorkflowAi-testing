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
import UserDetail from '../../newSidebar/userDetail/UserDetail';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale,
	LinearScale,
	BarElement,
	Title,
);

export default function ScaleDetailReport() {
	const { ProcessDetail } = useSelector((state) => state.app);
	const { userDetail } = useSelector((state) => state.auth);
	const navigate = useNavigate();

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
									<div className={styles.value}>{userDetail.userinfo.username}</div>
								</div>
								<div className={styles.Flex_div}>
									<div className={styles.label}>Processing State :</div>
									<div className={styles.valueProcessing}>{ProcessDetail.processing_state}</div>
								</div>
								<div className={styles.Flex_div}>
									<div className={styles.label}>Processing Type :</div>
									<div className={styles.value}>{ProcessDetail.process_type}</div>
								</div>
								<div className={styles.Flex_div}>
									<div className={styles.label}>Portfolio:</div>
									<div className={styles.value}>{userDetail.userportfolio[0].portfolio_name}</div>
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
}

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

