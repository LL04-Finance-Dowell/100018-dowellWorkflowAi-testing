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
import AssignDocumentMap from "./assignForms/forms/assignDocumentMap/AssignDocumentMap";
import AsignTask from "./assignForms/forms/assignTask/AssignTask";
import AssignLocation from "./assignForms/forms/assignLocation/AssignLocation";
import AssignTime from "./assignForms/forms/assignTime/AssignTimes";

const ConnectWorkFlowToDoc = () => {
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
        {/* <div className={styles.confirm__box}>
          <Select register={register} name="document" options={documents} />
          <div className={styles.paste__button}>paste document map</div>
        </div> */}
        <AssignDocumentMap />
        <div className={styles.table__of__contents__header}>
          <span>Table of Contents</span>
          <BsChevronDown />
        </div>
        {/*   <div className={styles.confirm__box}>
          <Select register={register} name="role" options={roleArray} />
          <Select register={register} name="members" options={members} />
          <Select
            register={register}
            name="memberPortfolio"
            options={membersPortfolio}
          />
          <select
            {...register("taskFeature")}
            size={taskFeatures.length}
            className={styles.task__features}
          >
            {taskFeatures.map((item) => (
              <option className={styles.task__features__text} key={item.id}>
                {item.feature}
              </option>
            ))}
          </select>
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
        </div> */}
        <AsignTask />
        {/*   <div className={styles.confirm__box}>
          <Select register={register} name="location" options={locations} />
          <button className={styles.assign__button}>Assign Location</button>
        </div> */}
        <AssignLocation />
        {/*   <div className={styles.confirm__box}>
          <Select register={register} name="limitTime" options={limitTimes} />
         
          <input
            {...register("startTime")}
            className={styles.time__input}
            type="time"
          />
          <input
            {...register("endTime")}
            className={styles.time__input}
            type="time"
          />
          <Select
            register={register}
            name="reminder"
            options={reminderFrequency}
          />
          <button className={styles.assign__button}>Assign Period</button>
        </div> */}
        <AssignTime />
      </div>
    </div>
  );
};

export default ConnectWorkFlowToDoc;
