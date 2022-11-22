import styles from "../sideBar/sideBar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import HouseIcon from "@mui/icons-material/House";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Button from "react-bootstrap/Button";
import AddIcon from "@mui/icons-material/Add";
import Collapse from "react-bootstrap/Collapse";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import Accordion from "../accordion/Accordion";
import { useState } from "react";
const SideBar = () => {
  const [open, setOpen] = useState(false);
  return (
    <div className={styles.sideBar}>
      <div className={styles.main}>
        <img
          className={styles.dowellLogo}
          src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/cropped-Playstore_logo_2.png?resize=100%2C100&ssl=1"
          alt="Dowell-logo"
        />
        <span className={styles.workflow}>WorkFlow AI</span>
        <MenuIcon fontSize="large" style={{ color: "#7a7a7a" }} />
      </div>
      <div className={styles.icons}>
        <PowerSettingsNewIcon fontSize="large" style={{ color: "#7a7a7a" }} />
        <PersonIcon fontSize="large" style={{ color: "#7a7a7a" }} />
        <HouseIcon fontSize="large" style={{ color: "#7a7a7a" }} />
      </div>
      <div className={styles.welcoming}>
        <img
          className={styles.profilePicture}
          src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/02/download-e1658465151576.jpg?resize=100%2C100&ssl=1"
          alt=""
        />
        <span className={styles.welcome}>Welcome, Tom</span>
        <span className={styles.myOrganisation}>My Organisation</span>
        <img
          className={styles.orgImg}
          style={{ width: "150px" }}
          src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/10/artistic-logo.png?w=916&ssl=1"
          alt=""
        />
        <span className={styles.notific}>Notifications</span>
      </div>
      <Accordion
        title="Documents"
        content="1. To be Signed (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Workflows"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />

      <Button
        style={{ width: "80%", marginLeft: "30px", marginTop: "50px" }}
        variant="success"
        onClick={() => setOpen(!open)}
        aria-controls="example-collapse-text"
        aria-expanded={open}
      >
        <span style={{ justifyContent: "start", display: "flex", gap: "3px" }}>
          {!open ? (
            <AddIcon />
          ) : (
            <KeyboardArrowUpIcon sx={{ color: "white" }} />
          )}
          New
        </span>
      </Button>
      <Collapse style={{ width: "80%", marginLeft: "30px" }} in={open}>
        <div id="example-collapse-text">
          <p>1-heloo</p>
          <p>2-hi</p>
          <p>3-halo</p>
          <p>4-process</p>
        </div>
      </Collapse>
      <div className="search-input">
        <span
          className="search"
          style={{
            display: "flex",
            color: "#61ce70",
            justifyContent: "center",
            fontSize: "30px",
            paddingTop: "40px",
          }}
        >
          Search
        </span>
        <p>Search in file names of Docs, Templates & Workflows</p>
      </div>
      <Accordion
        title="Documents"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Workflows"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <span
        className="manageFiles"
        style={{
          display: "flex",
          color: "#61ce70",
          justifyContent: "start",
          fontSize: "30px",
          paddingTop: "40px",
          paddingLeft: "20px",
        }}
      >
        Manage Files
      </span>
      <Accordion
        title="My Documents"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Workflows"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <span
        className="reports"
        style={{
          display: "flex",
          color: "#61ce70",
          justifyContent: "start",
          fontSize: "30px",
          paddingTop: "40px",
          paddingLeft: "20px",
        }}
      >
        Reports
      </span>
      <Accordion
        title="Documents"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Workflows"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <span
        className="dowell"
        style={{
          display: "flex",
          color: "#61ce70",
          justifyContent: "center",
          fontSize: "15px",
          paddingTop: "40px",
        }}
      >
        DoWell Knowledge Center
      </span>
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Learning Supports"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Case Studies"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="New Trends"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <Accordion
        title="Legal Compliances"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
      />
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "30px 35px 10px 35px",
          color: "#7a7a7a",
        }}
      >
        <span>6</span>
        <span>Learning Mode</span>
      </div>
      <div
        style={{
          display: "flex",
          paddingTop: "20px",
          paddingBottom: "30px",
          justifyContent: "center",
          gap: "30px",
        }}
      >
        {" "}
        <MenuIcon fontSize="large" style={{ color: "white" }} />
        <PowerSettingsNewIcon fontSize="large" style={{ color: "white" }} />
        <PersonIcon fontSize="large" style={{ color: "white" }} />
        <HouseIcon fontSize="large" style={{ color: "white" }} />
      </div>
    </div>
  );
};

export default SideBar;
