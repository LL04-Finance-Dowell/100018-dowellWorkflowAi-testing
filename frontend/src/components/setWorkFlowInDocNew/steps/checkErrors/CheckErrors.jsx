import styles from "./checkErrors.module.css";
import Select from "../../select/Select";
import { v4 as uuidv4 } from "uuid";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { PrimaryButton } from "../../../styledComponents/styledComponents";
import InfoBox from "../../../infoBox/InfoBox";

const CheckErrors = () => {
  const {
    register,
    handleSubmit,
    formState: { isSubmitted },
  } = useForm();
  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    setLoading(true);
    console.log("process", data);
    setTimeout(() => setLoading(false), 2000);
  };

  console.log("sssssssssss");

  return (
    <div className={styles.container}>
      <h2 className={`h2-small step-title align-left`}>
        4. Check errors before processing
      </h2>
      <div className={styles.content__box}>
        <Select
          register={register}
          options={processOptions.map((item) => item.selectItem)}
          name="proccess"
        />
        <div className={styles.info__container}>
          <PrimaryButton hoverBg="success">Show Procceess</PrimaryButton>
          <PrimaryButton hoverBg="success">25%</PrimaryButton>
        </div>
        <div className={styles.proccess__container}>
          {processOptions[0].workflows.map((item) => (
            <div className={styles.proccess__box}>
              <div
                className={styles.first__box}
                style={{ backgroundColor: processOptions[0].color }}
              >
                <h3 className={styles.box__header}>
                  {processOptions[0].selectItem.option}
                </h3>
                <h3 className={styles.box__info}>
                  {item.workflows.workflow_title}
                </h3>
              </div>
              {item.workflows.steps.map((step) => (
                <div className={styles.box}>
                  <InfoBox
                    boxType="dark"
                    title={item.workflows.workflow_title + "-" + step.step_name}
                    type="list"
                    items={tableOfContents.map((item) => ({
                      _id: item._id,
                      content: item.id,
                    }))}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CheckErrors;

export const tableOfContents = [
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: "t1",
    pageNum: "1",
    _id: "dc208cc5-00ea-4c1d-93f1-6cc2fad699f9",
  },
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: "t1",
    pageNum: "1",
    _id: "dc208cc5-00ea-4c1d-93f1-6cc2fad699f9",
  },
  {
    data: 'Eric&nbsp; <span class="" style="font-family: &quot;Comic Sans MS&quot;;">Name&nbsp;</span>',
    id: "t1",
    pageNum: "1",
    _id: "dc208cc5-00ea-4c1d-93f1-6cc2fad699f9",
  },
];

export const processOptions = [
  {
    color: "#FFF3005E",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: "Workflow wise Process flow (Workflow 1>2>3...)",
    },
    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: "#61CE704A;",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option:
        "Member wise Process flow in a workflow step (Team Member>User>Public)",
    },

    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: "#7A7A7A45",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option:
        "Content wise Process flow in a workflow step (Document content 1>2>3...)",
    },

    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: "#6EC1E45E",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: "Workflow Step wise Process flow (Step1>Step2>Step3...)",
    },

    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
  {
    color: "#FF000047",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: "Location wise Process flow (Location 1>2>3...)",
    },

    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },

  {
    color: "#0048FF26",
    id: uuidv4(),
    selectItem: {
      id: uuidv4(),
      option: "Time wise Process flow (End date and time 1>2>3...)",
    },

    workflows: [
      {
        company_id: "6390b313d77dc467630713f2",
        created_by: "workfloweric11",
        eventId: "FB1010000000167446920554648428",
        _id: "63ce5f5adcc2a171957b080d",
        workflows: {
          data_type: "Real_Data",
          workflow_title: "Eric Work",
          steps: [
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
            {
              role: "Fill and sign",
              step_name: "1",
              _id: uuidv4(),
            },
          ],
        },
      },
    ],
  },
];
