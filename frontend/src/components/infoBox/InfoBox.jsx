import React from "react";
import { useState } from "react";
/* import Collapse from "../../layouts/collapse/Collapse"; */
import styles from "./infoBox.module.css";
import {
  InfoBoxContainer,
  InfoContentBox,
  InfoContentContainer,
  InfoContentFormText,
  InfoContentText,
  InfoTitleBox,
} from "./styledComponents";
import { MdOutlineRemove, MdOutlineAdd } from "react-icons/md";
import { Collapse } from "react-bootstrap";

const InfoBox = ({
  items,
  title,
  type,
  boxType,
  boxId,
  handleItemClick,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <InfoBoxContainer boxType={boxType} className="info-box-container">
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
      <Collapse in={isOpen}>
        <InfoContentContainer boxType={boxType} className="info-content-cont">
          {type === "list" ? (
            <InfoContentBox boxType={boxType}>
              {items.map((item, index) => (
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
              {items.map((item) => (
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
              {items.map((item) => (
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
