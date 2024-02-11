import React from "react";

const Radio = ({ register, value, onChange, children, name, checked, radioRef }) => {
  return (
    <label style={{ display: "flex", gap: "10px", fontSize: 12, position: 'relative' }} ref={radioRef}>
      {

        checked ?
          <input type="radio" value={value} {...register(name)} onChange={onChange ? (e) => onChange(e) : () => { }} checked={checked} />
          :
          <input type="radio" value={value} {...register(name)} onChange={onChange ? (e) => onChange(e) : () => { }} />
      }
      {children}
    </label>
  );
};

export default Radio;
