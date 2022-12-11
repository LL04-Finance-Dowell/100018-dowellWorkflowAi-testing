import styles from "./stepTable.module.css";
import { MdModeEditOutline } from "react-icons/md";
import { RiDeleteBinLine } from "react-icons/ri";
import { useRef } from "react";

const StepTable = ({
  currentTableCell,
  setCurrentTableCall,
  internalWorkflows,
  setInternalWorkflows,
  setValue,
  currentWorkflow,
  stepNameRef,
}) => {
  const handleEditInternalTemplate = (currentİtem) => {
    setCurrentTableCall(currentİtem);

    stepNameRef.current?.click();
    setValue("step_name", currentİtem.step_name);
    setValue("member_type", currentİtem.member_type);
  };

  const handleRemoveInternalTemplate = (id) => {
    setInternalWorkflows((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>step name</th>
            <th>role</th>
          </tr>
        </thead>
        <tbody>
          {internalWorkflows.map((item) => (
            <tr
              className={
                item._id === currentTableCell?._id && styles.editing__ceil
              }
              key={item._id}
            >
              <th>{item.step_name}</th>
              <th>
                <span>{item.member_type}</span>
                <div className={styles.table__features__box}>
                  {currentWorkflow && (
                    <span
                      onClick={() => handleEditInternalTemplate(item)}
                      className={styles.edit__item__button}
                    >
                      <i>
                        <MdModeEditOutline color="green" size={16} />
                      </i>
                    </span>
                  )}
                  {!currentWorkflow && (
                    <span
                      onClick={() => handleRemoveInternalTemplate(item.id)}
                      className={styles.remove__item__button}
                    >
                      <i>
                        <RiDeleteBinLine color="red" size={16} />
                      </i>
                    </span>
                  )}
                </div>
              </th>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StepTable;
