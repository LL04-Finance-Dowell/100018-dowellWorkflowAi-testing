import styles from './stepTable.module.css';
import { MdModeEditOutline } from 'react-icons/md';
import { RiDeleteBinLine } from 'react-icons/ri';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

const StepTable = ({
  currentTableCell,
  setCurrentTableCall,
  internalWorkflows,
  setInternalWorkflows,
  setValue,
  stepNameRef,
}) => {
  const handleEditInternalTemplate = (currentİtem) => {
    setCurrentTableCall(currentİtem);
    stepNameRef.current?.click();
    setValue('step_name', currentİtem.step_name);
    setValue('role', currentİtem.role);
  };

  const handleRemoveInternalTemplate = (id) => {
    setInternalWorkflows((prev) => prev.filter((item) => item._id !== id));
  };
  const { t } = useTranslation();

  return (
    <div className={styles.container}>
      <table>
        <thead>
          <tr>
            <th>{t('step name')}</th>
            <th>{t('role')}</th>
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
                <span>{item.role}</span>
                <div className={styles.table__features__box}>
                  <span
                    onClick={() => handleEditInternalTemplate(item)}
                    className={styles.edit__item__button}
                  >
                    <i>
                      <MdModeEditOutline color='green' size={16} />
                    </i>
                  </span>
                  <span
                    onClick={() => handleRemoveInternalTemplate(item._id)}
                    className={styles.remove__item__button}
                  >
                    <i>
                      <RiDeleteBinLine color='red' size={16} />
                    </i>
                  </span>
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
