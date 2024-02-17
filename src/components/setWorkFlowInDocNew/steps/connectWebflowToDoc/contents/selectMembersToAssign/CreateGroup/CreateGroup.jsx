import { useState } from "react";
import Overlay from "../../../../../../manageFiles/overlay/Overlay";
import overlayStyles from "../../../../../../manageFiles/overlay/overlay.module.css";
import styles from "./CreateGroup.module.css";
import { useTranslation } from "react-i18next";
import { Controller,useForm } from "react-hook-form";
import ReactSelect from "react-select";

const CreateGroup = ({ handleOverlay }) => {
  const { t } = useTranslation();

  const {
    handleSubmit,
    control,
  } = useForm();

  const onSubmit = (data) => {
    console.log(data);
  };


  const FormInputDropdown = ({ name, control, label, options }) => {
    return (
      <div>
        <label>{label}</label>
        <Controller
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              menuPortalTarget={document.body} 
              options={options}
              label={label}
              value={options.find((c) => c.value === value)}
              onChange={(val) => onChange(val.value)}
            ></ReactSelect>
          )}
          control={control}
          name={name}
        />
      </div>
    );
  };
  const FormInputText = ({ name, control, label }) => {
    return (
      <Controller
        name={name}
        control={control}
        render={({
          field: { onChange, value },
          fieldState: { error, disabled },
        }) => (
          <div>
              <label>{label}</label>
            <input
              disabled={disabled}
             
              error={!!error}
              onChange={onChange}
              value={value || ""}
        
              variant="outlined"
            />
            {error && <p>{error.message}</p>}
          </div>
        )}
      />
    );
  };
  const options = [
    {
        value: "teamMembers",
        label: "Team Members",
    },
];
  return (
    <Overlay title="Create Group" handleToggleOverlay={handleOverlay}>
      <div className={styles.form__container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div style={{display:"flex",flexDirection:"column",gap:"12px",padding:"5px"}}>
          <FormInputText
            name="groupTitle"
            control={control}
            label={t("Group Title")} 
          />
            <FormInputDropdown
          options={options}
            name="teamMembers"
            control={control}
            label={t("Team Members")} 
          />
          <FormInputDropdown
          options={options}
            name="users"
            control={control}
            label={t("Users")} 
          />
</div>
          <div className={styles.button__group}>
            <button onClick={handleOverlay} className={styles.cancel__button}>
              {t("cancel")}
            </button>
            <button type="submit" className={styles.add__button}>
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};

export default CreateGroup;
