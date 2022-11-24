import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Collapse from "react-bootstrap/Collapse";
import "bootstrap/dist/css/bootstrap.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../accordion/accordion.css";
import { useState } from "react";
const Accordion = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="accordion-section">
      <div
        className="accordion"
        onClick={() => setOpen(!open)}
        aria-controls="collapse"
        aria-expanded={open}
      >
        <span className="accordion-icon">
          {!open ? (
            <ChevronRightIcon sx={{ color: "white" }} />
          ) : (
            <KeyboardArrowUpIcon sx={{ color: "white" }} />
          )}
        </span>

        <span className="title">{props.title}</span>
      </div>

      <Collapse in={open}>
        <div className="accordion-content" id="collapse">
          <span>{props.content}</span>
          <span>{props.content2}</span>
        </div>
      </Collapse>
      {!open && (
        <span
          style={{
            width: "80%",
            paddingBottom: "1px",
            borderBottom: "1px solid #ffff",
            marginLeft: "43px",
            color: "#54595f",
          }}
        >
          ...............................................................
        </span>
      )}
    </div>
  );
};

export default Accordion;
