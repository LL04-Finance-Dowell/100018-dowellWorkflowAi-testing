import * as React from "react";
import styles from './workflowreport.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import handHold from '../../../assets/streamline_hand-held-tablet-writing-solid.jpg'
import fluent from '../../../assets/fluent_text-abc-underline-double-32-filled.jpg'
import green from '../../../assets/ic_round-person.jpg'
import errorImage from '../../../assets/mingcute_question-fill.jpg'
import backOutline from '../../../assets/ion_chevron-back-outline.jpg'


export const WorkflowReport = () => {
	const navigate = useNavigate()
	const { ShowDocumentReport } = useSelector((state) => state.app);
	console.log("ShowDocumentReport", ShowDocumentReport)

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
				<div className={styles.div_3}>Workflow Reports</div>
			</div>
			<img
				loading="lazy"
				src="https://cdn.builder.io/api/v1/image/assets/TEMP/57fa37204e567f20d28ad43c31dfb32139623794ee09b9563f567304ab1ce777?apiKey=0f3485998dff4988b054d7523e6c5b82&"
				className={styles.img_2}
			/>
			<div className={styles.div_4}>
				<div className={styles.div_5}>
					Text is simply dummy text of the printing and typesetting industry. Lorem
					Ipsum has been the industry's standard dummy
					<br />
					text ever since the 1500s. Lorem Ipsum has been the industry's standard
					dummy text ever since the 1500s.
				</div>
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
								<span className={styles.timeline_number4}>{ShowDocumentReport?.characters || 313}</span>
								<span className={styles.timeline_text4}>characters</span>
							</div>
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
								<span className={styles.timeline_number5}>{ShowDocumentReport?.nouns || 63}</span>
								<span className={styles.timeline_text5}>Nouns</span>
							</div>
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
								<span className={styles.timeline_number6}>{ShowDocumentReport?.adjectives || 0}</span>
								<span className={styles.timeline_text6}>Errors</span>
							</div>
						</div>
					</div>
				</div>
				<div className={styles.div_13}>
					<div className={styles.div_14}>
						{/* <div className={styles.column}>
							<div className={styles.div_15}>
								<div className={styles.div_16}>Edit History</div>
								<div className={styles.div_17}>
									Text is simply dummy text of the printing and typesetting
									industry.
								</div>
							</div>
						</div> */}
						<div className={styles.column_2}>
							<div className={styles.div_18}>
								<div className={styles.div_19}>
									<div className={styles.div_20}>
										Number of
										<br />
										Words
									</div>
									<div className={styles.div_21}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy
									</div>
								</div>
								{/* <div className={styles.div_22}>
									<div className={styles.div_23}>
										Language
										<br />
										Used
									</div>
									<div className={styles.div_24}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy.
									</div>
								</div> */}
								<div className={styles.div_25}>
									<div className={styles.div_26}>
										Number of
										<br />
										Characters
									</div>
									<div className={styles.div_27}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has
									</div>
								</div>
								<div className={styles.div_28}>
									<div className={styles.div_29}>
										Nouns Used
										<br />
										in Document
									</div>
									<div className={styles.div_30}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy.
									</div>
								</div>
								<div className={styles.div_31}>
									<div className={styles.div_32}>
										Grammatical
										<br />
										Errors
									</div>
									<div className={styles.div_33}>
										Text is simply dummy text of the printing and typesetting
										industry. Lorem Ipsum has been the industry's standard dummy.
									</div>
								</div>
							</div>
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

		//     <div className="bg-white flex flex-col pt-8">
		//     <div className="items-center flex gap-5 ml-10 self-start max-md:ml-2.5">
		//       <img
		//         loading="lazy"
		//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/93b188ecc92d123d9aefe641e9b543a2ae052d33ad360f94bece407f21ac3d0f?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//         className="aspect-square object-contain object-center w-8 overflow-hidden shrink-0 max-w-full my-auto"
		//       />
		//       <div className="text-neutral-900 text-3xl font-semibold self-stretch grow whitespace-nowrap">
		//         Workflow Reports
		//       </div>
		//     </div>
		//     <img
		//       loading="lazy"
		//       src="https://cdn.builder.io/api/v1/image/assets/TEMP/57fa37204e567f20d28ad43c31dfb32139623794ee09b9563f567304ab1ce777?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//       className="aspect-[1440] object-contain object-center w-full stroke-[1px] stroke-neutral-500 stroke-opacity-30 overflow-hidden self-stretch mt-8 max-md:max-w-full"
		//     />
		//     <div className="self-stretch flex w-full flex-col items-stretch mt-7 px-14 max-md:max-w-full max-md:px-5">
		//       <div className="text-neutral-500 text-2xl leading-8 tracking-wide max-md:max-w-full">
		//         Text is simply dummy text of the printing and typesetting industry.
		//         Lorem Ipsum has been the industry's standard dummy
		//         <br />
		//         text ever since the 1500s. Lorem Ipsum has been the industry's
		//         standard dummy text ever since the 1500s.
		//       </div>
		//       <div className="items-stretch flex justify-between gap-5 mt-20 pr-20 max-md:max-w-full max-md:flex-wrap max-md:mt-10 max-md:pr-5">
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/c5f2dd28a7b6c83a9103c921c3cd5c2a906f5d9f9eee1ba9ac9fde437d38b8db?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/d7b104273d205890499b80afe8b41ff09d220cb32a4fb37b9933edfb9270479d?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.75] object-contain object-center w-[168px] overflow-hidden mt-3"
		//           />
		//         </div>
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/e3ac4951c809761fef74d66155200e16e69aa87ca5bccfc80217715ebf1d22ee?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/d14a8b7d099b1d5fe9abcd52c44100e54e379113cb24e46d5cd3f51d4c015c6c?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.75] object-contain object-center w-[168px] overflow-hidden mt-3"
		//           />
		//         </div>
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/ee8d21ecc994822b636b28f68f52ca5d99e1870a6313b5a042333006f859d3b9?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/380c7b7af862df6be11ed5d451124c61c0b76312f7fae317f0505490e760896f?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.75] object-contain object-center w-[168px] overflow-hidden mt-3"
		//           />
		//         </div>
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/2a2fd0dd4990cb9601788569907a215bf76e8474e096830d56f509786f6cf748?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/e4e8681653a1f2eb8c8386bbfed2f492dbc95489d8d27fb1c65bd5919c7c4536?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.74] object-contain object-center w-[167px] overflow-hidden mt-3"
		//           />
		//         </div>
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/8c37a870a1b5d89408a0ae89162180a70d6818377e2b236d6312a8edf6b3bcd1?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/678d99af020d18811f924612001c159bac7ec018081694eebe19465931334323?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.75] object-contain object-center w-[168px] overflow-hidden mt-3"
		//           />
		//         </div>
		//         <div className="justify-center items-center flex grow basis-[0%] flex-col">
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/9de6b17bfdbd5643b445dc1908b7efd77ff5a70090844329a739ca54a5b6af8c?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-square object-contain object-center w-[25px] overflow-hidden max-w-full"
		//           />
		//           <img
		//             loading="lazy"
		//             src="https://cdn.builder.io/api/v1/image/assets/TEMP/05dd3a0ac45c2c9dab2690a68419372cee8388fda34ef682a97445b34ac9a8de?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//             className="aspect-[0.75] object-contain object-center w-[168px] overflow-hidden mt-3"
		//           />
		//         </div>
		//       </div>
		//       <div className="mt-5 max-md:max-w-full">
		//         <div className="gap-5 flex max-md:flex-col max-md:items-stretch max-md:gap-0">
		//           <div className="flex flex-col items-stretch w-[16%] max-md:w-full max-md:ml-0">
		//             <div className="justify-center items-center flex flex-col max-md:mt-6">
		//               <div className="text-cyan-500 text-center text-xl font-medium whitespace-nowrap">
		//                 Edit History
		//               </div>
		//               <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                 Text is simply dummy text of the printing and typesetting
		//                 industry.{" "}
		//               </div>
		//             </div>
		//           </div>
		//           <div className="flex flex-col items-stretch w-[84%] ml-5 max-md:w-full max-md:ml-0">
		//             <div className="flex grow items-start justify-between gap-5 max-md:max-w-full max-md:flex-wrap max-md:justify-center max-md:mt-6">
		//               <div className="items-center self-stretch flex grow basis-[0%] flex-col">
		//                 <div className="text-violet-500 text-center text-xl font-medium">
		//                   Number of
		//                   <br />
		//                   Words
		//                 </div>
		//                 <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                   Text is simply dummy text of the printing and typesetting
		//                   industry. Lorem Ipsum has been the industry's standard dummy
		//                   <br />
		//                   text ever since the 1500s. Lorem Ipsum has been the
		//                   industry's standard dummy text ever since the 1500s.
		//                 </div>
		//               </div>
		//               <div className="items-center flex grow basis-[0%] flex-col self-start">
		//                 <div className="text-orange-400 text-center text-xl font-medium">
		//                   Language
		//                   <br />
		//                   Used
		//                 </div>
		//                 <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                   Text is simply dummy text of the printing and typesetting
		//                   industry. Lorem Ipsum has been the industry's standard
		//                   dummy.
		//                 </div>
		//               </div>{" "}
		//               <div className="items-center flex grow basis-[0%] flex-col self-start">
		//                 <div className="text-fuchsia-600 text-center text-xl font-medium">
		//                   Number of
		//                   <br />
		//                   Characters
		//                 </div>{" "}
		//                 <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                   Text is simply dummy text of the printing and typesetting
		//                   industry. Lorem Ipsum has
		//                 </div>
		//               </div>{" "}
		//               <div className="items-center flex grow basis-[0%] flex-col self-start">
		//                 <div className="text-teal-500 text-center text-xl font-medium">
		//                   Nouns Used
		//                   <br />
		//                   in Document
		//                 </div>{" "}
		//                 <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                   Text is simply dummy text of the printing and typesetting
		//                   industry. Lorem Ipsum has been the industry's standard
		//                   dummy.
		//                 </div>
		//               </div>
		//               <div className="items-center flex grow basis-[0%] flex-col self-start">
		//                 <div className="text-orange-500 text-center text-xl font-medium">
		//                   Grammatical
		//                   <br />
		//                   Errors
		//                 </div>
		//                 <div className="text-neutral-500 text-center text-sm leading-5 tracking-normal self-stretch mt-4">
		//                   Text is simply dummy text of the printing and typesetting
		//                   industry. Lorem Ipsum has been the industry's standard
		//                   dummy.
		//                 </div>
		//               </div>
		//             </div>
		//           </div>
		//         </div>
		//       </div>
		//     </div>{" "}
		//     <div className="flex-col fill-[linear-gradient(90deg,#FCF1B1_-12.47%,#BEE1C8_103.98%)] overflow-hidden self-stretch relative flex min-h-[252px] w-full justify-between gap-5 mt-2 pt-12 items-end max-md:max-w-full max-md:flex-wrap">
		//       <img
		//         loading="lazy"
		//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/cef3ddce8d038c78219a7207dc68e10e550b660e238d8e9c1663f486cc6fc304?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//         className="absolute h-full w-full object-cover object-center inset-0"
		//       />{" "}
		//       <img
		//         loading="lazy"
		//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/3d7ae2c38c6f8b0e5baeed1714c26e7551212440465883007951f594dacc6c84?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//         className="aspect-[5.62] object-contain object-center w-[343px] fill-[linear-gradient(90deg,rgba(254,244,173,0.70)_9.94%,rgba(212,231,192,0.70)_49.15%)] overflow-hidden shrink-0 max-w-full mt-36 max-md:mt-10"
		//       />{" "}
		//       <img
		//         loading="lazy"
		//         src="https://cdn.builder.io/api/v1/image/assets/TEMP/510eabbac9ee64822dc5ebaf50a779b3c5e08aa441b053f19683c25b78b21bec?apiKey=0f3485998dff4988b054d7523e6c5b82&"
		//         className="aspect-[14.26] object-contain object-center w-[385px] fill-[linear-gradient(90deg,rgba(165,216,149,0.60)_19.35%,rgba(76,202,143,0.60)_94.01%)] overflow-hidden mt-44 max-md:mt-10"
		//       />
		//     </div>
		//   </div>
	)
}


