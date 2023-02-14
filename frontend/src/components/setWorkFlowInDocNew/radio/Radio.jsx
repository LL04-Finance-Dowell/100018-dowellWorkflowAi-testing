import React from "react";

const Radio = ({ register, value, onChange, children, name }) => {
  return (
    <label style={{ display: "flex", gap: "10px", fontSize: 12 }}>
      <input type="radio" value={value} {...register(name)} onChange={onChange ? (e) => onChange(e) : () => {}} />
      {children}
    </label>
  );
};

export default Radio;
