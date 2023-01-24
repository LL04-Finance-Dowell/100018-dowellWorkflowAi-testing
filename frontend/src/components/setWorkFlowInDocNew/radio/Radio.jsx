import React from "react";

const Radio = ({ register, value, children, name }) => {
  return (
    <label style={{ display: "flex", gap: "10px", fontSize: 12 }}>
      <input type="radio" value={value} {...register(name)} />
      {children}
    </label>
  );
};

export default Radio;
