import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState, useRef } from "react";
const Accordion = (props) => {
  const [setActive, setActiveState] = useState("");
  const [setHeight, setHeightState] = useState("0px");
  const content = useRef(null);
  function toggleAccordion() {
    setActiveState(setActive === "" ? "active" : "");
    setHeightState(
      setActive === "active" ? "0px" : `${content.current.scrollHeight}px`
    );
  }
  return (
    <div className="accordion-section">
      <div className="accordion-main">
        <span className={`accordion ${setActive}`} onClick={toggleAccordion}>
          <div className="accordion-icon">
            <ChevronRightIcon />
          </div>
          <span className="accordion-title">{props.title}</span>
        </span>
      </div>
      <div
        ref={content}
        style={{ maxHeight: `${setHeight}` }}
        className="accordion-content"
      >
        <div
          className="accordion-text"
          dangerouslySetInnerHTML={{ __html: props.content }}
        />
      </div>
    </div>
  );
};

export default Accordion;
