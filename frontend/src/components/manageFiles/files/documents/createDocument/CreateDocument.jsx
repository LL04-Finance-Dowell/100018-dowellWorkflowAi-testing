import styles from "./createDocument.module.css";
import { v4 as uuidv4 } from "uuid";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import Overlay from "../../../overlay/Overlay";
import { BsArrowRightShort } from "react-icons/bs";
import Collapse from "../../../../../layouts/collapse/Collapse";
import { useDispatch, useSelector } from "react-redux";
import {
  draftsTemplate,
  mineTemplates,
} from "../../../../../features/template/asyncThunks";
import { useEffect } from "react";
import { createDocument } from "../../../../../features/document/asyncThunks";
import { LoadingSpinner } from "../../../../LoadingSpinner/LoadingSpinner";
import SubmitButton from "../../../../submitButton/SubmitButton";
import { setToggleManageFileForm } from "../../../../../features/app/appSlice";
import Spinner from "../../../../spinner/Spinner";

const CreateDocument = ({ handleToggleOverlay }) => {
  const { userDetail } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const { draftedTemplates, draftsTemplateStatu } = useSelector(
    (state) => state.template
  );
  const { status: documentStatus } = useSelector((state) => state.document);
  const [currentOption, setCurrentOption] = useState(null);
  const [toggleDropdown, setToggleDropdown] = useState(false);
  const ref = useRef(null);

  const { register, handleSubmit, setValue, watch } = useForm();
  const { template } = watch();

  const onSubmit = (data) => {
    console.log("data", data);

    const { template } = data;

    dispatch(setToggleManageFileForm(false));

    const createDocumentData = {
      company_id: userDetail?.portfolio_info.org_id,
      template_id: template,
      created_by: userDetail?.userinfo.username,
    };

    console.log("create document", createDocumentData);

    dispatch(createDocument(createDocumentData));
  };

  const handleDropdown = () => {
    setToggleDropdown((prev) => !prev);
    ref.current?.blur();
  };

  const handleOptionClick = (item) => {
    setToggleDropdown(false);
    setCurrentOption(item.template_name);
    setValue("template", item._id);
    ref.current?.focus();
  };

  const handleClickLabel = () => {
    ref.current?.focus();
  };

  useEffect(() => {
    const data = {
      company_id: userDetail?.portfolio_info.org_id,
    };

    dispatch(draftsTemplate(data));
  }, []);

  console.log("dox statussss", draftedTemplates);

  return (
    <Overlay title="Create Document" handleToggleOverlay={handleToggleOverlay}>
      {draftsTemplateStatu === "pending" ? (
        <Spinner />
      ) : draftedTemplates ? (
        <form onSubmit={handleSubmit(onSubmit)}>
          <div id="template" className={styles.dropdown__container}>
            <label onClick={handleClickLabel} htmlFor="template">
              Select Template <span>*</span>
            </label>
            <div style={{ position: "relative" }}>
              <select
                required
                className={styles.ghost__input}
                tabIndex={-98}
                {...register("template")}
              >
                {draftedTemplates.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.template_name}
                  </option>
                ))}
              </select>
            </div>
            <button
              ref={ref}
              type="button"
              onClick={handleDropdown}
              className={`${styles.dropdown__current__option} `}
            >
              {currentOption ? currentOption : "__Template Name__"}
            </button>
            <div className={styles.dropdown__option__container}>
              <Collapse open={toggleDropdown}>
                <div role="listbox" className={styles.dropdown__option__box}>
                  {draftedTemplates.map((item) => (
                    <div
                      onClick={() => handleOptionClick(item)}
                      className={styles.dropdown__option__content}
                    >
                      {item.template_name}
                    </div>
                  ))}
                </div>
              </Collapse>
            </div>
          </div>
          <button type="submit" className={styles.create__button}>
            <span>Go to Editor</span>
            <i>
              <BsArrowRightShort size={25} />
            </i>
          </button>
        </form>
      ) : (
        <h4>No Template</h4>
      )}
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
