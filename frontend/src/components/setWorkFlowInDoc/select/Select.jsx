import styles from "./select.module.css";

const Select = ({ options, register, name, takeIdValue, takeNormalValue, ...rest }) => {
  return (
    <select
      id={name}
      className={styles.form__select}
      required
      {...register(name)}
      {...rest}
    >
      {options.map((item) => (
        <option value={takeIdValue && item._id ? item._id : takeNormalValue ? item.normalValue ? item.normalValue : item.option : `${item.id}_${item.option}`} key={item.id}>
          {item.option}
        </option>
      ))}
    </select>
  );
};

export default Select;
