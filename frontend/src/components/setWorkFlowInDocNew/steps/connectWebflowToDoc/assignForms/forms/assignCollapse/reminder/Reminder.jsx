import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Select from "../../../../../../select/Select";

const Reminder = () => {
  const { register } = useForm();

  return (
    <form className={parentStyles.content__box}>
      <Select options={reminder} register={register} name="reminder" />
      <button className={parentStyles.primary__button}>set reminder</button>
    </form>
  );
};

export default Reminder;

export const reminder = [
  { id: uuidv4(), option: "No reminder" },
  { id: uuidv4(), option: "Send reminder every hour" },
  { id: uuidv4(), option: "Send reminder every day" },
  { id: uuidv4(), option: "I will decide later" },
];
