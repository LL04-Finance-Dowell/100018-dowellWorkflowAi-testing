import React, { useState } from "react";
import styles from "./infoBoxes.module.css";
import { v4 as uuidv4 } from "uuid";
import { GrAdd } from "react-icons/gr";
import { MdOutlineRemove } from "react-icons/md";

const InfoBoxes = ({ selectedWorkFlows, setSelectedWorkFlows }) => {
  const [compInfoBoxes, setCompInfoBoxes] = useState(infoBoxes);

  const handleClick = (id) => {
    const updatedInfoBoxes = compInfoBoxes.map((item) =>
      item.id === id ? { ...item, isOpen: !item.isOpen } : item
    );

    setCompInfoBoxes(updatedInfoBoxes);
  };

  const addToSelectedWorkFlows = (selectedWorkFlow) => {
    setSelectedWorkFlows((prev) =>
      prev.find((item) => item.id === selectedWorkFlow.id)
        ? prev
        : [...prev, selectedWorkFlow]
    );
  };

  return (
    <div className={styles.container}>
      {compInfoBoxes.map((infoBox) => (
        <div key={infoBox.id} className={styles.box}>
          <div
            onClick={() => handleClick(infoBox.id)}
            className={styles.title__box}
          >
            <div
              style={{
                marginRight: "8px",
                fontSize: "14px",
              }}
            >
              {infoBox.isOpen ? <MdOutlineRemove /> : <GrAdd />}
            </div>
            <a className={styles.title}>{infoBox.title}</a>
          </div>
          <div
            style={{
              maxHeight: infoBox.isOpen ? "500px" : "0px",
              transition: "1s all ease",
            }}
          >
            <ol className={styles.content__box}>
              {infoBox.contents.map((item) => (
                <li
                  onClick={() => addToSelectedWorkFlows(item)}
                  key={item.id}
                  className={styles.content}
                >
                  {item.content}
                </li>
              ))}
            </ol>
          </div>
        </div>
      ))}
    </div>
  );
};

export default InfoBoxes;

export const infoBoxes = [
  {
    id: uuidv4(),
    title: "workflow",
    contents: [
      { id: uuidv4(), content: "workflow 1" },
      { id: uuidv4(), content: "workflow 1" },
      { id: uuidv4(), content: "workflow 1" },
      { id: uuidv4(), content: "workflow 1" },
    ],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "team",
    contents: [
      { id: uuidv4(), content: "member 1" },
      { id: uuidv4(), content: "member 1" },
      { id: uuidv4(), content: "member 1" },
      { id: uuidv4(), content: "member 1" },
    ],
    isOpen: true,
  },
  {
    id: uuidv4(),
    title: "guest",
    contents: [
      { id: uuidv4(), content: "guest 1" },
      { id: uuidv4(), content: "guest 1" },
      { id: uuidv4(), content: "guest 1" },
      { id: uuidv4(), content: "guest 1" },
    ],
    isOpen: true,
  },
];
