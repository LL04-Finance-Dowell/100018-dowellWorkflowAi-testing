import styles from "./createDocumentForm.module.css";
import { v4 as uuidv4 } from "uuid";
import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

const CreateDocumentForm = ({ toggleSidebar }) => {
  const [toggleDropdown, setToggleDropdown] = useState(false);

  const ref = useRef(null);

  const { register, handleSubmit, setValue, watch } = useForm();
  const template = watch("template");

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

  console.log(toggleSidebar);

  return (
    <div
      className={`${styles.container} ${
        !toggleSidebar && styles.toggle__sidebar
      } `}
    >
      <div className={`${styles.form__container} `}>
        <div className={styles.form__box}>
          <div className={styles.form__header}>
            <p>Create Document</p>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label htmlFor="name">Name*</label>
              <input
                required
                {...register("name")}
                id="name"
                className={styles.form__input}
              />
            </div>
            <div>
              <label htmlFor="template">Select Template*</label>
              <input
                tabIndex={-98}
                required
                style={{ display: "none" }}
                {...register("template")}
              />
              <div id="template" className={styles.dropdown__container}>
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
      </div>
    </div>
  );
};

export default CreateDocumentForm;

export const templates = [{ id: uuidv4(), option: "__template batu__" }];
