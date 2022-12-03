import React, { useRef } from "react";

const Collapse = ({ children, open }) => {
  const ref = useRef();

  return (
    <div
      style={{
        overflow: "hidden",
        height: open ? `${ref.current?.getBoundingClientRect().height}px` : 0,
        transition: "0.5s all ease",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
};

export default Collapse;
