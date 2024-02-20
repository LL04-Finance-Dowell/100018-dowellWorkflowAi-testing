import { useEffect, useState } from "react";
import Overlay from "../../../components/manageFiles/overlay/Overlay";

import styles from "./CreateGroup.module.css";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  createGroupsStatus,
  getGroupsStatus,
  selectAllGroups,
} from "../groupsSlice";
import { createGroups, getGroups } from "../groupThunk";
import { toast } from "react-toastify";

const CreateGroup = ({ dropdownData, handleOverlay }) => {
  const { t } = useTranslation();

  const [teamsData, setTeamsData] = useState([]);

  const { userDetail } = useSelector((state) => state.auth);

  const { handleSubmit, control } = useForm();

  const dispatch = useDispatch();

  const AllGroups = useSelector(selectAllGroups);

  const createStatus = useSelector(createGroupsStatus);

  const getStatus = useSelector(getGroupsStatus);

  const onSubmit = async (data) => {
    const company_id = userDetail?.portfolio_info[0]?.org_id;
    const reformatTeam = data.team.map((data) => {
      return data?.value;
    });
    const copyData = { ...data };
    delete copyData.team;
    const finalPayload = {
      ...copyData,
      team: reformatTeam,
      user: [],
    };
    console.log("finalPayload", finalPayload);

    dispatch(createGroups({ payload: finalPayload, company_id: company_id }));
if (getStatus==="succeeded") {
  toast.success("Successfully Created a group");
  handleOverlay()
}
if (getStatus==="failed") {
  toast.error("Error");
 
}
  };

  const FormInputDropdown = ({ name, control, label, options }) => {
    return (
      <div>
        <label>{label}</label>
        <Controller
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              isMulti
              menuPortalTarget={document.body}
              options={options}
              label={label}
              value={options.find((c) => c.value?.content === value?.content)}
              onChange={onChange}
            ></ReactSelect>
          )}
          control={control}
          name={name}
        />
      </div>
    );
  };
  const FormInputText = ({ name, control, label, type = "text" }) => {
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
              type={type}
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

  useEffect(() => {
    if (!dropdownData) return;
    const teamDataRaw = dropdownData.find((h) => h.header === "Team");
    const Reformat = teamDataRaw?.portfolios?.map((data) => {
      return {
        label: data.content,
        value: data,
      };
    });
    setTeamsData([...Reformat]);
  }, [dropdownData]);

  useEffect(() => {
    const fetchData = async () => {
      const company_id = userDetail?.portfolio_info[0]?.org_id;
      await dispatch(
        getGroups({ company_id: company_id, data_type: "Real_Data" })
      );
    };

    fetchData();
  }, [userDetail]);

  console.log("all g", AllGroups);

  return (
    <Overlay title="Create Group" handleToggleOverlay={handleOverlay}>
      <div className={styles.form__container}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              padding: "5px",
            }}
          >
            <FormInputText
              name="group_name"
              control={control}
              label={t("Group Title")}
            />
            <FormInputDropdown
              options={teamsData}
              name="team"
              control={control}
              label={t("Team Members")}
            />

            <FormInputText
              name="public"
              type="number"
              control={control}
              label={t("Number of Public Members")}
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
