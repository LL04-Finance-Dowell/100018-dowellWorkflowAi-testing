import React from "react";
import Select from "../../../../../../select/Select";
import parentStyles from "../assignCollapse.module.css";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import Radio from "../../../../../../radio/Radio";

const Location = () => {
  const { register } = useForm();

  return (
    <form className={parentStyles.content__box}>
      <div>
        <Radio register={register} value="anyLocation" name="location">
          Any Location
        </Radio>
        <Radio register={register} value="selectLocation" name="location">
          Select Location
        </Radio>
      </div>
      <div>
        <Select options={continents} register={register} name="continent" />
        <Select options={countries} register={register} name="country" />
        <Select
          options={cities}
          register={register}
          name="displayDocitycument"
        />
      </div>
      <button className={parentStyles.primary__button}>set location</button>
    </form>
  );
};

export default Location;

export const continents = [
  { id: uuidv4(), option: "asia" },
  { id: uuidv4(), option: "africa" },
  { id: uuidv4(), option: "europa" },
  { id: uuidv4(), option: "america" },
];

export const countries = [
  { id: uuidv4(), option: "india" },
  { id: uuidv4(), option: "kenya" },
  { id: uuidv4(), option: "germany" },
  { id: uuidv4(), option: "USA" },
];

export const cities = [
  { id: uuidv4(), option: "delhi" },
  { id: uuidv4(), option: "nairobi" },
  { id: uuidv4(), option: "munich" },
  { id: uuidv4(), option: "newyork" },
];
