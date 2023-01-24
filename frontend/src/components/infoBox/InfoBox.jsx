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
  InfoSearchbar,
  InfoTitleBox,
} from "./styledComponents";
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove, MdOutlineAdd } from "react-icons/md";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { Collapse } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
  setColumn,
  setPermissionArray,
  setProccess,
  setSettingProccess,
  setTeamsInWorkflowAI,
  setUpdateProccess,
} from "../../features/app/appSlice";

const InfoBox = ({
  items,
  title,
  type,
  permissionContent,
  settingProccess,
  boxType,
  boxİd,
  teamsInWorkflowAI,
  handleItemClick,
  children,
}) => {
  const dispatch = useDispatch();
  const {
    column,
    proccess,
    settingProccess: settingProccessArray,
    permissionArray,
    teamsInWorkflowAI: teamsInWorkflowAIArray,
  } = useSelector((state) => state.app);

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const setIsSelected = (items, item) => {
    const ss = items.map((child) =>
      boxİd === child._id
        ? {
            ...child,
            column: child.column.map((col) =>
              col.proccess_title === title
                ? {
                    ...col,
                    items: col.items.map((colItem) =>
                      colItem._id === item._id
                        ? {
                            ...colItem,
                            isSelected: colItem.isSelected ? false : true,
                          }
                        : colItem
                    ),
                  }
                : col
            ),
          }
        : child
    );

    return ss;
  };

  const handlePermission = (item) => {
    if (permissionContent) {
      const ss = setIsSelected(permissionArray[0].children, item);

      dispatch(setPermissionArray(ss));

      const ccb = column.find((c) => c.proccess_title === title);

      if (ccb) {
        dispatch(
          setColumn(
            column.map((col) =>
              col.proccess_title === title
                ? {
                    ...col,
                    items: col.items.find(
                      (childItem) => childItem._id === item._id
                    )
                      ? col.items.filter(
                          (childItem) => childItem._id !== item._id
                        )
                      : [
                          ...col.items,
                          {
                            _id: item._id,
                            content: item.content,
                            isSelected: false,
                          },
                        ],
                  }
                : col
            )
          )
        );
      } else {
        dispatch(
          setColumn([
            ...column,
            {
              _id: uuidv4(),
              items: [
                { _id: item._id, content: item.content, isSelected: false },
              ],
              proccess_title: title,
              order: item.order,
            },
          ])
        );
      }
    }
    if (settingProccess) {
      const ss = setIsSelected(settingProccessArray[0].children, item);

      dispatch(setUpdateProccess(ss));
    }

    if (teamsInWorkflowAI) {
      const ss = setIsSelected(teamsInWorkflowAIArray[0].children, item);

      dispatch(setTeamsInWorkflowAI(ss));
    }
  };

  /* console.log("provvess", settingProccessArray[0].children); */

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
        <InfoContentContainer className="info-content-cont">
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
          ) : (
            <InfoContentBox>
              {items.map((item) => (
                <InfoContentFormText key={item._id}>
                  <input
                    onChange={() => handlePermission(item)}
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
