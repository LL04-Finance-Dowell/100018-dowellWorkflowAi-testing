import React from "react";
import { useForm } from "react-hook-form";
import Radio from "../../../../../radio/Radio";
import AssignTask from "./assignTask/AssignTask";
import styles from "./selectMembersToAssign.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState } from "react";

const SelectMembersToAssign = () => {
  const [selectMembersComp, setSelectMembersComp] = useState(selectMembers);
  const [current, setCurrent] = useState(selectMembers[0]);
  const { register } = useForm();

  const handleSetCurrent = (item) => {
    setCurrent(item);
  };

  return (
    <div className={styles.container}>
      <div className={styles.select__container}>
        <div className={styles.select__header__box}>
          {selectMembersComp.map((item) => (
            <div
              onClick={() => handleSetCurrent(item)}
              key={item.id}
              className={`${styles.select__header} ${
                current.id === item.id && styles.selected
              }`}
            >
              {item.header}
            </div>
          ))}
        </div>
        <div className={styles.select__content__container}>
          <h3 className={styles.title}>{current.title}</h3>
          <div>
            <Radio
              register={register}
              name="select"
              value={"all" + current.header}
            >
              Select all {current.header}
            </Radio>
            <Radio
              register={register}
              name="select"
              value={"selectIn" + current.header}
            >
              Select Teams in {current.header}
            </Radio>
          </div>
          <select
            required
            {...register("teams")}
            size={current.teams.length}
            className={styles.open__select}
          >
            {current.teams.map((item) => (
              <option key={item.id}>{item.content}</option>
            ))}
          </select>
          <Radio
            register={register}
            name="select"
            value={"select" + current.header}
          >
            Select Members
          </Radio>
          <select
            required
            {...register("members")}
            size={current.portfolios.length}
            className={styles.open__select}
          >
            {current.portfolios.map((item) => (
              <option key={item.id}>{item.content}</option>
            ))}
          </select>
        </div>
      </div>
      <AssignTask />
    </div>
  );
};

export default SelectMembersToAssign;

export const teams = [
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 1",
  },
  {
    id: uuidv4(),
    content: "team 1",
  },
];

export const members = [
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
  {
    id: uuidv4(),
    content: "member 1",
  },
];

export const selectMembers = [
  {
    id: uuidv4(),
    header: "Team",
    title: "Team Members",
    all: "Select all Team Members",
    selectInTeam: "Select Teams in Team Members",
    selectMembers: "Select Members",
    teams: teams,
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Users",
    title: "Users",
    all: "Select all Users",
    selectInTeam: "Select Teams in Users",
    selectMembers: "Select Users",
    teams: teams,
    portfolios: members,
  },
  {
    id: uuidv4(),
    header: "Public",
    title: "Public",
    all: "Select all Public",
    selectInTeam: "Select Teams in Public",
    selectMembers: "Select Public",
    teams: teams,
    portfolios: members,
  },
];
