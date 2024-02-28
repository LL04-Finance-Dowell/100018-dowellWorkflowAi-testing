import * as React from "react";
import styles from './workflowreport.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import handHold from '../../../assets/streamline_hand-held-tablet-writing-solid.jpg'
import fluent from '../../../assets/fluent_text-abc-underline-double-32-filled.jpg'
import green from '../../../assets/ic_round-person.jpg'
import errorImage from '../../../assets/mingcute_question-fill.jpg'
import backOutline from '../../../assets/ion_chevron-back-outline.jpg'
import { useLocation } from 'react-router-dom';



export const WorkflowReport = () => {
	const navigate = useNavigate()
	const { ShowDocumentReport, SingleDocument } = useSelector((state) => state.app);
	// Inside your component
	const location = useLocation();
	const passedData = location.state;
	// console.log("ShowDocumentReport", passedData)

	const handleBack = () => {
		navigate('/documents/draft-reports');
	}
	return (
		<div className={styles.div}>
			<div className={styles.div_2} onClick={handleBack}>
				<img
					loading="lazy"
					src={backOutline}
					className={styles.img}
					alt="back image"
				/>
				<div className={styles.div_3}>{SingleDocument?.document_name || "Untitled Document"}</div>
			</div>
			<img
				loading="lazy"
				src="https://cdn.builder.io/api/v1/image/assets/TEMP/57fa37204e567f20d28ad43c31dfb32139623794ee09b9563f567304ab1ce777?apiKey=0f3485998dff4988b054d7523e6c5b82&"
				className={styles.img_2}
			/>
			<div className={styles.div_4}>
				{/* <div className={styles.div_5}>
					Text is simply dummy text of the printing and typesetting industry. Lorem
					Ipsum has been the industry's standard dummy
					<br />
					text ever since the 1500s. Lorem Ipsum has been the industry's standard
					dummy text ever since the 1500s.
				</div> */}
				<div className={styles.div_6}>
					{/* <div className={styles.div_7}>
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5f2dd28a7b6c83a9103c921c3cd5c2a906f5d9f9eee1ba9ac9fde437d38b8db?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_3}
						/>
						<div className={styles.timeline}>
							<div className={styles.timeline_line} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle} aria-hidden="true"></div>
							<div className={styles.timeline_circle}>
								<span className={styles.timeline_number}>{ShowDocumentReport?.words}</span>
								<span className={styles.timeline_text}>Words</span>
							</div>
						</div>
					</div> */}
					<div className={styles.div_8}>
						<img
							loading="lazy"
							src={handHold}
							className={styles.img_5}
							alt="Hnadhold Image"

						/>
						{/* <img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/d14a8b7d099b1d5fe9abcd52c44100e54e379113cb24e46d5cd3f51d4c015c6c?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_6}
						/> */}
						<div className={styles.timeline2}>
							<div className={styles.timeline_line2} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle2} aria-hidden="true"></div>
							<div className={styles.timeline_circle2}>
								<span className={styles.timeline_number2}>{ShowDocumentReport?.words || 111}</span>
								<span className={styles.timeline_text2}>Words</span>
							</div>
						</div>
						<div className={styles.div_19}>
							<div className={styles.div_20}>
								Number of
								<br />
								Words
							</div>
							{/* <div className={styles.div_21}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy
									</div> */}
						</div>
					</div>
					{/* <div className={styles.div_9}>
						<img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee8d21ecc994822b636b28f68f52ca5d99e1870a6313b5a042333006f859d3b9?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_7}
						/>
						<div className={styles.timeline3}>
							<div className={styles.timeline_line3} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle3} aria-hidden="true"></div>
							<div className={styles.timeline_circle3}>
								<span className={styles.timeline_number3}>250</span>
								<span className={styles.timeline_text3}>Words</span>
							</div>
						</div>
					</div> */}
					<div className={styles.div_10}>
						<img
							loading="lazy"
							src={fluent}
							className={styles.img_9}
							alt="Fluent Image"

						/>
						{/* <img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/e4e8681653a1f2eb8c8386bbfed2f492dbc95489d8d27fb1c65bd5919c7c4536?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_10}
						/> */}
						<div className={styles.timeline4}>
							<div className={styles.timeline_line4} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle4} aria-hidden="true"></div>
							<div className={styles.timeline_circle4}>
								<span className={styles.timeline_number4}>{ShowDocumentReport?.characters}</span>
								<span className={styles.timeline_text4}>characters</span>
							</div>
						</div>
						<div className={styles.div_25}>
							<div className={styles.div_26}>
								Number of
								<br />
								Characters
							</div>
							{/* <div className={styles.div_27}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has
									</div> */}
						</div>
					</div>
					<div className={styles.div_11}>
						<img
							loading="lazy"
							src={green}
							className={styles.img_11}
							alt="green Image"

						/>
						{/* <img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/678d99af020d18811f924612001c159bac7ec018081694eebe19465931334323?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_12}
						/> */}
						<div className={styles.timeline5}>
							<div className={styles.timeline_line5} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle5} aria-hidden="true"></div>
							<div className={styles.timeline_circle5}>
								<span className={styles.timeline_number5}>{ShowDocumentReport?.nouns}</span>
								<span className={styles.timeline_text5}>Nouns</span>
							</div>
						</div>
						<div className={styles.div_28}>
									<div className={styles.div_29}>
										Nouns Used
										<br />
										in Document
									</div>
									{/* <div className={styles.div_30}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy.
									</div> */}
								</div>
					</div>
					<div className={styles.div_12}>
						<img
							loading="lazy"
							src={errorImage}
							alt="Error Image"
							className={styles.img_13}
						/>
						{/* <img
							loading="lazy"
							src="https://cdn.builder.io/api/v1/image/assets/TEMP/05dd3a0ac45c2c9dab2690a68419372cee8388fda34ef682a97445b34ac9a8de?apiKey=0f3485998dff4988b054d7523e6c5b82&"
							className={styles.img_14}
						/> */}
						<div className={styles.timeline6}>
							<div className={styles.timeline_line6} aria-hidden="true"></div>
							<div class={styles.timeline_outer_circle6} aria-hidden="true"></div>
							<div className={styles.timeline_circle6}>
								<span className={styles.timeline_number6}>{ShowDocumentReport?.adjectives}</span>
								<span className={styles.timeline_text6}>Adjectives</span>
							</div>
						</div>
						<div className={styles.div_31}>
									<div className={styles.div_32}>
										Adjectives
										<br />
										in Document
									</div>
									{/* <div className={styles.div_33}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy.
									</div> */}
								</div>
					</div>
				</div>

			</div>
			<div className={styles.div_34}>
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/cef3ddce8d038c78219a7207dc68e10e550b660e238d8e9c1663f486cc6fc304?apiKey=0f3485998dff4988b054d7523e6c5b82&"
					className={styles.img_15}
				/>
				<img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d7ae2c38c6f8b0e5baeed1714c26e7551212440465883007951f594dacc6c84?apiKey=0f3485998dff4988b054d7523e6c5b82&"
					className={styles.img_16}
				/>
				{/* <img
					loading="lazy"
					src="https://cdn.builder.io/api/v1/image/assets/TEMP/510eabbac9ee64822dc5ebaf50a779b3c5e08aa441b053f19683c25b78b21bec?apiKey=0f3485998dff4988b054d7523e6c5b82&"
					className={styles.img_17}
				/> */}
			</div>
		</div>
	)
}


