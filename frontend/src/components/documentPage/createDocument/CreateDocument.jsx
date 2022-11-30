import styles from "./createDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";

const CreateDocument = ({ handleToggleOverlay }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const ref = useRef(null);

  const { register, handleSubmit, setValue, watch } = useForm();

  const { template } = watch();

  const onSubmit = (data) => {
    console.log("data", data);
  };

  const handleDropdown = () => {
    setToggleDropdown((prev) => !prev);
    ref.current?.blur();
  };

  const handleOptionClick = (option) => {
    setToggleDropdown(false);
    setValue("template", option);
    ref.current?.focus();
  };

  return (
    <div className={styles.form__box}>
      <div className={styles.close__icon} onClick={handleToggleOverlay}>
        <AiOutlineClose size={20} />
      </div>
      <div className={styles.form__header}>
        <p>Create Document</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/*  <div>
          <label htmlFor="name">Name*</label>
          <input
            required
            {...register("name")}
            id="name"
            className={styles.form__input}
          />
        </div> */}
        <div>
          <label htmlFor="template">Select Template*</label>

          <div id="template" className={styles.dropdown__container}>
            <input
              tabIndex={-98}
              required
              className={styles.ghost__input}
              {...register("template")}
            />
            <button
              ref={ref}
              type="button"
              onClick={handleDropdown}
              className={`${styles.dropdown__current__option} `}
            >
              {template ? template : "__Template Name__"}
            </button>
            <div
              role="listbox"
              style={{ display: toggleDropdown ? "block" : "none" }}
              className={styles.dropdown__option__container}
            >
              {templates.map((item) => (
                <div
                  tabIndex={-20}
                  key={item.id}
                  className={styles.dropdown__option__box}
                >
                  <div
                    onClick={() => handleOptionClick(item.option)}
                    className={styles.dropdown__option__content}
                  >
                    {item.option}
                  </div>
                </div>
              ))}
            </div>
            <div className={styles.hr} />
          </div>
        </div>
        <button className={styles.create__button} type="submit">
          Go to Editor
        </button>
      </form>
    </div>
  );
};

export default CreateDocument;

export const templates = [{ id: uuidv4(), option: "__template batu__" }];
