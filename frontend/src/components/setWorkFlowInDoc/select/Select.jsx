import styles from "./select.module.css";

const Select = ({ options, register, name, takeIdValue, ...rest }) => {
  return (
    <select
      id={name}
      className={styles.form__select}
      required
      {...register(name)}
      {...rest}
    >
      {options.map((item) => (
        <option value={takeIdValue && item._id ? item._id : `${item.id}_${item.option}`} key={item.id}>
          {item.option}
        </option>
      ))}
    </select>
  );
};

export default Select;
