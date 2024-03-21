import { useEffect, useMemo, useState } from "react";
import Overlay from "../../../components/manageFiles/overlay/Overlay";

import styles from "./CreateGroup.module.css";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import ReactSelect from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  getGroupsStatus,
  selectedGroupForEdit,
  setUpdatedGroupFlag,
  updateGroupFlag,
  updateGroupsStatus,
} from "../groupsSlice";
import { createGroups, editGroups, getGroups } from "../groupThunk";
import { toast } from "react-toastify";

const CreateGroup = ({
  totalPublicMembersVal,
  dropdownData,
  handleOverlay,
  fromSettings,
  editGroupsFlag,
}) => {
  const { t } = useTranslation();

  const [teamsData, setTeamsData] = useState([]);

  const [selectedGroup, setSelectedGroup] = useState();

  const { userDetail } = useSelector((state) => state.auth);

  const selectedG = useSelector(selectedGroupForEdit);

  const dispatch = useDispatch();

  const getStatus = useSelector(getGroupsStatus);
  const updateStatus = useSelector(updateGroupsStatus);
  const [teamList, setTeamsList] = useState([]);
  const updatedFlag = useSelector(updateGroupFlag);
  const defaultValues = useMemo(() => {
    return {
      group_name: `${selectedGroup?.group_name}`,
      public: Number(selectedGroup?.public_members),
team:teamList?.length ? [...teamList] : []
    };
  }, [selectedGroup,teamList]);

  useEffect(() => {
    if (selectedG) setSelectedGroup(selectedG);
    console.log("dropdownData",selectedG);
  }, [selectedG, defaultValues,updatedFlag]);

  useEffect(() => {
    if (selectedGroup?.team_members?.length)
      setTeamsList(
        selectedGroup?.team_members?.map((data) => {
          return {
            label: data.content,
            value: data,
          };
        })
      );
     
  }, [selectedGroup]);

  const { handleSubmit, reset, control } = useForm();

  useEffect(() => {
    if (defaultValues.group_name) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  const onSubmit = async (data) => {
    console.log("data",data);
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
    if (editGroupsFlag) {
      const finalForEdit ={
        "group_id":selectedGroup._id,
        ...finalPayload
      }
      console.log("finalForEdit",finalForEdit);
      dispatch(editGroups({ payload: finalForEdit, company_id: company_id }));
      dispatch(setUpdatedGroupFlag())
      if (updateStatus === "succeeded") {
        toast.success("Successfully Updated a group");
       
      }
      if (updateStatus === "failed") {
        toast.error("Error");
      }
      handleOverlay();
    } else {
      dispatch(createGroups({ payload: finalPayload, company_id: company_id }));
      if (getStatus === "succeeded") {
        toast.success("Successfully Created a group");
        handleOverlay();
      }
      if (getStatus === "failed") {
        toast.error("Error");
      }
    }
  };

  const FormInputDropdown = ({
    fromSettings,
    name,
    defaultValue,
    control,
    label,
    options,
  }) => {
    return (
      <div>
        <label>{label}</label>
        <Controller
          render={({ field: { onChange, value } }) => (
            <ReactSelect
              defaultValue={defaultValue}
              name={name}
              isMulti
              menuPortalTarget={!fromSettings && document.body}
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
  const FormInputText = ({
    name,
    control,
    label,
    type = "text",
    maxMin = false,
  }) => {
    const customOnChange = (e, onCh) => {
      const selectedValue = Math.max(
        0,
        Math.min(totalPublicMembersVal, Number(e.target.value))
      );
      onCh(selectedValue);
    };
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
              name={name}
              type={type}
              disabled={disabled}
              error={!!error}
              onChange={(e) => {
                maxMin ? customOnChange(e, onChange) : onChange(e);
              }}
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
    if (Reformat) {
      if (defaultValues.group_name && teamList?.length) {
        const existingContent = teamList?.map((_data) => {
          return _data.label;
        });

        if (existingContent?.length) {
          const uniqueList = Reformat?.filter(
            (data) => !existingContent?.includes(data.label)
          );
          console.log(uniqueList);
          setTeamsData([...uniqueList]);
        }
      } else {
        setTeamsData([...Reformat]);
      }
    }
   
  }, [dropdownData,updatedFlag, defaultValues, teamList]);

  useEffect(() => {
    const fetchData = async () => {
      const company_id = userDetail?.portfolio_info[0]?.org_id;
      await dispatch(
        getGroups({ company_id: company_id, data_type: "Real_Data" })
      );
    };

    fetchData();
  }, [userDetail]);

  return (
    <Overlay
      title={editGroupsFlag ? "Edit Group" : "Create Group"}
      handleToggleOverlay={handleOverlay}
    >
      <div className={styles.form__container}>
        <form>
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
              defaultValue={teamList?.length ? [...teamList] : []}
              control={control}
              fromSettings={fromSettings}
              label={t("Team Members")}
            />

            <FormInputText
              name="public"
              type="number"
              control={control}
              label={t("Number of Public Members")}
              maxMin={true}
            />
          </div>
          <div className={styles.button__group}>
            <button onClick={handleOverlay} className={styles.cancel__button}>
              {t("cancel")}
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              className={styles.add__button}
            >
              {t("save")}
            </button>
          </div>
        </form>
      </div>
    </Overlay>
  );
};

export default CreateGroup;
