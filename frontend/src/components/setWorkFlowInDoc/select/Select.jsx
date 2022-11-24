import styles from "./select.module.css";

const Select = ({ options, register, name, ...rest }) => {
  return (
    <select
      id={name}
      className={styles.form__select}
      required
      {...register(name)}
      {...rest}
    >
      {options.map((item) => (
        <option value={`${item.id}_${item.option}`} key={item.id}>
          {item.option}
        </option>
      ))}
    </select>
  );
};

export default Select;
