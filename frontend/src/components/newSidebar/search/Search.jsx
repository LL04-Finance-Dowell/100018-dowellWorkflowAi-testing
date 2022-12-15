import React from "react";
import styles from "./search.module.css";
import CollapseItem from "../collapseItem/CollapseItem";
import { v4 as uuidv4 } from "uuid";
import { FaSearch } from "react-icons/fa";
import { useForm } from "react-hook-form";

const Search = () => {
  const { register, handleSubmit } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Search</h2>
      <p className={styles.info}>
        Search in file names of Docs, Templates & Workflows
      </p>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.search__box}>
        <input {...register("search")} placeholder="Type here to search" />
        <button type="submit">
          <i>
            <FaSearch />
          </i>
          <span>Search</span>
        </button>
      </form>

      <CollapseItem listType="ol" items={items} />
    </div>
  );
};

export default Search;

export const items = [
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Documents (07)",
    children: [
      { id: uuidv4(), child: "Payment voucher" },
      { id: uuidv4(), child: "Answer sheet" },
      { id: uuidv4(), child: "Agreement" },
      { id: uuidv4(), child: "Appointment order" },
      { id: uuidv4(), child: "Letter" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Templates (04)",
    children: [
      { id: uuidv4(), child: "Leave format" },
      { id: uuidv4(), child: "Payment voucher" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
  {
    id: uuidv4(),
    isOpen: false,
    parent: "Workflows (04)",
    children: [
      { id: uuidv4(), child: "Leave process" },
      { id: uuidv4(), child: "Payment process" },
      { id: uuidv4(), child: ".." },
      { id: uuidv4(), child: ".." },
    ],
  },
];
