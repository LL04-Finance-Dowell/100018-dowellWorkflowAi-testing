import { useState } from "react";
import styles from "./connectWorkFlowToDoc.module.css";
import { v4 as uuidv4 } from "uuid";
import Select from "./select/Select";
import { BsChevronDown } from "react-icons/bs";
import DoneIcon from "@mui/icons-material/Done";
import { Form } from "react-bootstrap";
import { useEffect } from "react";
import TimeInput from "./timeInput/TimeInput";
import { useForm } from "react-hook-form";

const ConnectWorkFlowToDoc = () => {
  const { register, watch } = useForm();

  return (
    <div className={styles.container}>
      <div className={styles.step__title__box}>
        <h2 className="h2-small step-title">
          3. Connect Selected Workflows to the selected Document
        </h2>
      </div>
      <div className={styles.step__container}>
        <div className={`${styles.header} h2-medium`}>Workflow 1</div>
        <div className={styles.step__header}>step 1 - name</div>
        <div className={styles.skip}>
          <input type="checkbox" />
          Skip this Step
        </div>
        <div className={styles.confirm__box}>
          <Select register={register} name="document" options={documents} />
          <div className={styles.paste__button}>paste document map</div>
        </div>
        <div className={styles.table__of__contents__header}>
          <span>Table of Contents</span>
          <BsChevronDown />
        </div>
        <div className={styles.confirm__box}>
          <Select register={register} name="role" options={roleArray} />
          <Select register={register} name="members" options={members} />
          <Select
            register={register}
            name="memberPortfolio"
            options={membersPortfolio}
          />
          <div className={styles.task__features}>
            {taskFeatures.map((item) => (
              <span className={styles.task__features__text} key={item.id}>
                {item.feature}
              </span>
            ))}
          </div>
          <Select
            register={register}
            name="displayDoc"
            options={displayDocument}
          />
          <button className={styles.assign__button}>Assign Task</button>
          <div className={styles.pasted__text}>
            <DoneIcon />
            <span> Pasted</span>
          </div>
        </div>
        <div className={styles.confirm__box}>
          <Select register={register} name="location" options={locations} />
          <button className={styles.assign__button}>Assign Location</button>
        </div>
        <div className={styles.confirm__box}>
          <Select register={register} name="limitTime" options={limitTimes} />
          <TimeInput placeHolder={"Start date & time"} />
          <TimeInput placeHolder={"End date & time"} />
          <Select
            register={register}
            name="reminder"
            options={reminderFrequency}
          />
          <button className={styles.assign__button}>Assign Period</button>
        </div>
      </div>
    </div>
  );
};

export default ConnectWorkFlowToDoc;

export const documents = [
  { id: uuidv4(), option: "All Document" },
  { id: uuidv4(), option: "Balance Document" },
  { id: uuidv4(), option: "Same as Previouse" },
];

export const roleArray = [
  {
    id: uuidv4(),
    option: "Team Member",
  },
  { id: uuidv4(), option: "Guest (enter phone/email)" },
  { id: uuidv4(), option: "Public (link)" },
];

export const members = [
  {
    id: uuidv4(),
    option: "Member 1",
  },
  {
    id: uuidv4(),
    option: "Member 2",
  },
  {
    id: uuidv4(),
    option: "Member 3",
  },
];

export const membersPortfolio = [
  { id: uuidv4(), option: "Member Porfolio 1" },
  { id: uuidv4(), option: "Member Porfolio 2" },
  { id: uuidv4(), option: "Member Porfolio 3" },
];

export const taskFeatures = [
  { id: uuidv4(), feature: "Add/Edit" },
  { id: uuidv4(), feature: "View" },
  { id: uuidv4(), feature: "Comment" },
  { id: uuidv4(), feature: "Approve" },
];

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step" },
  { id: uuidv4(), option: "Display document after processing this step" },
  { id: uuidv4(), option: "Display document only in this step" },
  { id: uuidv4(), option: "Display document in all steps" },
];

export const locations = [
  { id: uuidv4(), option: "Mumbai" },
  { id: uuidv4(), option: "London" },
  { id: uuidv4(), option: "Newyork" },
];

export const limitTimes = [
  { id: uuidv4(), option: "No time limit" },
  { id: uuidv4(), option: "Within 1 hour" },
  { id: uuidv4(), option: "Within 8 hour" },
  { id: uuidv4(), option: "Within 24 hour" },
  { id: uuidv4(), option: "Within 3 days" },
  { id: uuidv4(), option: "Within 7 days" },
  { id: uuidv4(), option: "Custom time" },
];

export const reminderFrequency = [
  { id: uuidv4(), option: "Send reminder every hour" },
  { id: uuidv4(), option: "Send reminder every day" },
  { id: uuidv4(), option: "I will decide later" },
  { id: uuidv4(), option: "Skip this step to continue" },
];
