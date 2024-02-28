import styles from "./select.module.css";
import { useTranslation } from "react-i18next";

const Select = ({ options, register, name, label, takeOptionValue, takeNormalValue, takeActionValue, currentValue, ...rest }) => {
  const { t } = useTranslation();
  
  return (
    <div className={styles.container}>
      <label htmlFor={name}>{t(label)}</label>
      <select
        id={name}
        className={styles.form__select}
        required
        {...register(name)}
        {...rest}
      >
        {options.map((item) => (
          <option 
            selected={
              currentValue ? 
                takeOptionValue ? item.option === currentValue :
                takeNormalValue ? item.normalValue === currentValue :
                takeActionValue ? item.actionKey === currentValue :
                false :
              false
            } 
            value={
              takeOptionValue ? 
                item.option : 
              takeNormalValue ? 
                item.normalValue : 
              takeActionValue ? 
                item.actionKey : 
              `${item.id}_${item.option}`
            } 
            key={item.id}
          >
            {t(item.option)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
