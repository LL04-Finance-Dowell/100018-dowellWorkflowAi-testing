import React from "react";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Select from "../../../../../select/Select";

const Display = () => {
  const { register } = useForm();
  return (
    <form className={parentStyles.content__box}>
      <Select
        options={displayDocument}
        register={register}
        name="displayDocument"
      />
      <button type="submit" className={parentStyles.primary__button}>
        set display
      </button>
    </form>
  );
};

export default Display;

export const displayDocument = [
  { id: uuidv4(), option: "Display document before processing this step" },
  { id: uuidv4(), option: "Display document after processing this step" },
  { id: uuidv4(), option: "Display document only in this step" },
  { id: uuidv4(), option: "Display document in all steps" },
];
