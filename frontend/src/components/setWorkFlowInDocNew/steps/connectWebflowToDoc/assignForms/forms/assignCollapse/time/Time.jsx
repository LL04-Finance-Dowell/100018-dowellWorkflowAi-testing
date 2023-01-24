import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Radio from "../../../../../../radio/Radio";
import Select from "../../../../../../select/Select";

const Time = () => {
  const { register } = useForm();

  return (
    <form className={parentStyles.content__box}>
      <div>
        <Radio name="time" value="noTimeLimit" register={register}>
          No Time limit
        </Radio>
        <Radio name="time" value="selectTimeLimit" register={register}>
          Select Time limit
        </Radio>
      </div>
      <Select options={times} register={register} name="time" />
      <Radio name="time" value="customTime" register={register}>
        Custom Time
      </Radio>
      <div>
        <div>
          <label htmlFor="startTime">Start</label>
          <input {...register("startTime")} id="startTime" />
        </div>
        <div>
          <label htmlFor="endTime">End</label>
          <input {...register("endTime")} id="endTime" />
        </div>
      </div>
      <button className={parentStyles.primary__button}>set time limit</button>
    </form>
  );
};

export default Time;

export const times = [
  { id: uuidv4(), option: "within 1 hour" },
  { id: uuidv4(), option: "within 8 hours " },
  { id: uuidv4(), option: "within 24 hours" },
  { id: uuidv4(), option: "within 3 days" },
  { id: uuidv4(), option: "within 7 days" },
];
