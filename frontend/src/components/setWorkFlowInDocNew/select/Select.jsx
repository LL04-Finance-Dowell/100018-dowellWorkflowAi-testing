import styles from "./select.module.css";

const Select = ({ options, register, name, label, takeOptionValue, takeNormalValue, takeActionValue, ...rest }) => {
  return (
    <div className={styles.container}>
      <label htmlFor={name}>{label}</label>
      <select
        id={name}
        className={styles.form__select}
        required
        {...register(name)}
        {...rest}
      >
        {options.map((item) => (
          <option value={takeOptionValue ? item.option : takeNormalValue ? item.normalValue : takeActionValue ? item.actionKey : `${item.id}_${item.option}`} key={item.id}>
            {item.option}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
