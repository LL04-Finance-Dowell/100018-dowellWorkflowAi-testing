import React, { useEffect } from "react";
import { useState } from "react";
/* import Collapse from "../../layouts/collapse/Collapse"; */
import styles from "./infoBox.module.css";
import {
	InfoBoxContainer,
	InfoContentBox,
	InfoContentContainer,
	InfoContentFormText,
	InfoContentText,
	InfoSearchbar,
	InfoTitleBox,
} from "./styledComponents";

import { AiOutlinePlus } from "react-icons/ai";
import { MdOutlineRemove, MdOutlineAdd } from "react-icons/md";
import { Collapse } from "react-bootstrap";

import TeamModal from "../modal/TeamModal";

const InfoBox = ({
	items,
	title,
	type,
	boxType,
	boxId,
	handleItemClick,
	onChange,
	showSearch,
	showAddButton
}) => {
	const [isOpen, setIsOpen] = useState(false);
	const [showModal, setShowModal] = useState(false);

	const [teams, setTeams] = useState([]);

	const handleAddTeam = (team) => {
		setTeams([...teams, team]);
	};

	const handleShowModal = () => {
		setShowModal(true);
	}

	const handleCloseModal = () => {
		setShowModal(false)
	}

	const handleToggle = () => {
		setIsOpen((prev) => !prev);
	};

	const [searchValue, setSearchValue] = useState("");
	const [itemsToDisplay, setItemsToDisplay] = useState([]);

	useEffect(() => {
		setItemsToDisplay(items);
	}, [items])

	useEffect(() => {
		const itemsMatchingSearchValue = items.filter((item) => item.content.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()));
		setItemsToDisplay(itemsMatchingSearchValue);
	}, [searchValue])

	return (
		<InfoBoxContainer boxType={boxType} className="info-box-container">
			<div className="flex">
				<InfoTitleBox
					boxType={boxType}
					className="info-title-box"
					onClick={handleToggle}
				>
					<div
						style={{
							marginRight: "8px",
							fontSize: "14px",
						}}
					>
						{type === "list" ? (
							isOpen ? (
								<MdOutlineRemove />
							) : (
								<MdOutlineAdd />
							)
						) : (
							<input type="checkbox" checked={isOpen} />
						)}
					</div>{" "}
					<a>{title}</a>

				</InfoTitleBox>
			</div>
			<Collapse in={isOpen}>
				<InfoContentContainer boxType={boxType} className="info-content-cont">
					<div style={{
						display: "flex",
					}}>
						{
							showSearch &&
							<InfoSearchbar
								placeholder="Search"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
							/>
						}
						{
							showAddButton &&
							<button
								style={{
									padding: "4px 12px",
									marginRight: "2px"
								}}
								onClick={handleShowModal}
							>
								<AiOutlinePlus />
							</button>
						}
					</div>

					<TeamModal
						show={showModal}
						onHide={handleCloseModal}
						backdrop="static"
						keyboard={false}
						onSubmit={handleAddTeam}
					/>

					{type === "list" ? (
						<InfoContentBox boxType={boxType}>
							{itemsToDisplay.map((item, index) => (
								<InfoContentText
									onClick={() => handleItemClick(item)}
									key={item._id}
								>
									{index + 1}. {item.content}
								</InfoContentText>
							))}
						</InfoContentBox>
					) : type === "radio" ? (
						<InfoContentBox>
							{itemsToDisplay.map((item) => (
								<InfoContentFormText key={item._id}>
									<input
										type="radio"
										id={item.content}
										name="portfolio"
										value={item._id}
										onChange={() => onChange({ item, title, boxId })}
									/>
									<label htmlFor="javascript">{item.content}</label>
								</InfoContentFormText>
							))}
						</InfoContentBox>
					) : (
						<InfoContentBox>
							{itemsToDisplay.map((item) => (
								<InfoContentFormText key={item._id}>
									<input
										onChange={() => onChange({ item, title, boxId })}
										/* {...register(item.content)} */
										checked={item.isSelected ? true : false}
										type={"checkbox"}
									/>
									<span key={item._id}>{item.content}</span>
								</InfoContentFormText>
							))}
						</InfoContentBox>
					)}
				</InfoContentContainer>
			</Collapse>
		</InfoBoxContainer>
	);
};

export default InfoBox;
