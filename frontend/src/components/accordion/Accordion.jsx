import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Collapse from "react-bootstrap/Collapse";
import "bootstrap/dist/css/bootstrap.css";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import "../accordion/accordion.css";
import { useState } from "react";
import { Link } from "react-router-dom";
const Accordion = (props) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{ backgroundColor: `${props.bgColor}` }}
      className="accordion-section"
    >
      <div
        className="accordion"
        onClick={() => setOpen(!open)}
        aria-controls="collapse"
        aria-expanded={open}
        style={{
          marginTop: `${props.top}`,
        }}
      >
        <span className="accordion-icon">
          {!open ? (
            <ChevronRightIcon
              style={{ color: `${props.color}`, marginTop: `${props.marg}` }}
              sx={{ color: "white" }}
            />
          ) : (
            <KeyboardArrowUpIcon
              style={{ color: `${props.color}`, marginTop: `${props.marg}` }}
              sx={{ color: "white" }}
            />
          )}
        </span>

        {
          props.titleIsLink ? <Link to={props.titleLink}>
        <span
          style={{
            color: `${props.color}`,
            padding: `${props.paddingg}`,
            borderBottom: `1px solid ${props.color}`,
            width: `${props.widthh}`,
          }}
          className="title"
        >
          {props.title}
        </span>
        </Link> : 
        <span
          style={{
            color: `${props.color}`,
            padding: `${props.paddingg}`,
            borderBottom: `1px solid ${props.color}`,
            width: `${props.widthh}`,
          }}
          className="title"
        >
          {props.title}
        </span>
        }
      </div>

      <Collapse in={open}>
        <div
          style={{
            backgroundColor: `${props.bColor}`,
            marginLeft: `${props.margin}`,
            width: `${props.width}`,
            padding: `${props.padding}`,
          }}
          className="accordion-content"
          id="collapse"
        >
          <span
            style={{
              fontWeight: "bold",
              color: `${props.contColor}`,
              padding: `${props.contPad}`,
            }}
          >
            {props.content}
          </span>
          <span
            style={{
              fontWeight: "bold",
              color: `${props.contColor}`,
              padding: `${props.contPadd}`,
            }}
          >
            {props.content2}
          </span>
        </div>
      </Collapse>
      {!open && (
        <span
          style={{
            paddingBottom: "1px",
            borderBottom: "1px solid #e1e1e1",
            marginLeft: "43px",
            color: `${props.dotColor}`,
          }}
          className="dot"
        >
          ...............................................................
        </span>
      )}
    </div>
  );
};

export default Accordion;
