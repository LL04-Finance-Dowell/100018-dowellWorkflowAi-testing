import React from "react";
import { useState } from "react";
import Collapse from "../../layouts/collapse/Collapse";
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
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove } from "react-icons/md";
import { useForm } from "react-hook-form";

const InfoBox = ({ items, title, type, register }) => {
  /*  const { register } = useForm(); */
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  console.log("isOpen", isOpen);

  return (
    <InfoBoxContainer className={styles.container}>
      <InfoTitleBox onClick={handleToggle}>{title}</InfoTitleBox>
      <Collapse open={isOpen}>
        <InfoContentContainer>
          {type === "list" ? (
            <InfoContentBox>
              {items.map((item) => (
                <InfoContentText key={item._id}>{item.content}</InfoContentText>
              ))}
            </InfoContentBox>
          ) : (
            items.map((item) => (
              <InfoContentFormText>
                <input {...register(item.content)} type={"checkbox"} />
                <span key={item._id}>{item.content}</span>
              </InfoContentFormText>
            ))
          )}
        </InfoContentContainer>
      </Collapse>
    </InfoBoxContainer>
  );
};

export default InfoBox;
