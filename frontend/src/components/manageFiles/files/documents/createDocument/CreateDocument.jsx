import styles from "./createDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import Overlay from "../../../overlay/Overlay";
import overlayStyles from "../../../overlay/overlay.module.css";
import { BsArrowRightShort } from "react-icons/bs";
import Collapse from "../../../../../layouts/collapse/Collapse";

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

  const handleClickLabel = () => {
    ref.current?.focus();
  };

  return (
    <Overlay title="Create Document" handleToggleOverlay={handleToggleOverlay}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <label onClick={handleClickLabel} htmlFor="template">
          Select Template <span>*</span>
        </label>
        <div id="template" className={styles.dropdown__container}>
          <div style={{ position: "relative" }}>
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
          </div>
          <div className={styles.dropdown__option__container}>
            <Collapse open={toggleDropdown}>
              <div role="listbox" className={styles.dropdown__option__box}>
                {templates.map((item) => (
                  <div
                    onClick={() => handleOptionClick(item.option)}
                    className={styles.dropdown__option__content}
                  >
                    {item.option}
                  </div>
                ))}
              </div>
            </Collapse>
          </div>
        </div>

        <button className={styles.create__button} type="submit">
          <span>Go to Editor</span>
          <i>
            <BsArrowRightShort size={25} />
          </i>
        </button>
      </form>
    </Overlay>
  );
};

export default CreateDocument;

export const templates = [
  { id: uuidv4(), option: "__template batu__" },
  { id: uuidv4(), option: "__template batu__" },
  { id: uuidv4(), option: "__template batu__" },
  { id: uuidv4(), option: "__template batu__" },
];
