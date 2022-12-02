import styles from "../sideBar/sideBar.module.css";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import HouseIcon from "@mui/icons-material/House";
import PersonIcon from "@mui/icons-material/Person";
import PowerSettingsNewIcon from "@mui/icons-material/PowerSettingsNew";
import Button from "react-bootstrap/Button";
import AddIcon from "@mui/icons-material/Add";
import Collapse from "react-bootstrap/Collapse";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import Accordion from "../accordion/Accordion";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { dowellLoginUrl } from "../../services/axios";
const SideBar = ({ user }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const handleCreateWorkflowItemClick = (e) => {
    e.preventDefault();

    const linkPath = e.target.hash.replace("#", "") + e.target.search;

    if (user) return navigate(linkPath);
    window.location = dowellLoginUrl + linkPath;
  };

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
        <span className={styles.welcome}>
          Welcome, {user ? user.username : "Tom"}
        </span>
        <span className={styles.myOrganisation}>My Organisation</span>
        <img
          className={styles.orgImg}
          style={{}}
          src="https://i0.wp.com/workflowai.online/wp-content/uploads/2022/10/artistic-logo.png?w=916&ssl=1"
          alt=""
        />
        <span className={styles.notific}>Notifications</span>
      </div>
      <Accordion
        title="Documents (003)"
        content="1. To be Signed (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Templates (003)"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Workflows (004)"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />

      <div
        className={styles.newBtn}
        style={{
          width: "85%",
          height: "72px",
          marginLeft: "22px",
          border: "1px solid white",
          borderRadius: "5px",
          padding: "2px",
          marginTop: "50px",
        }}
      >
        {" "}
        <Button
          className={styles.btn}
          style={{
            width: "100%",
            height: "65px",
            backgroundColor: "#61ce70",
            borderCollapse: "separate",
            borderSpacing: "3px",
            border: "3px solid #54595f",

            // borderRadius: "3px",
          }}
          // variant="success"
          onClick={() => setOpen(!open)}
          aria-controls="example-collapse-text"
          aria-expanded={open}
        >
          <span
            style={{
              justifyContent: "start",
              display: "flex",
              gap: "3px",
              fontSize: "25px",
              fontWeight: "bold",
            }}
          >
            {!open ? (
              <AddIcon style={{ marginTop: "5px" }} />
            ) : (
              <KeyboardArrowUpIcon sx={{ color: "white" }} />
            )}
            New
          </span>
        </Button>
      </div>

      <Collapse
        style={{
          width: "83%",
          marginLeft: "25px",
          backgroundColor: "#e1e1e1",
        }}
        in={open}
      >
        <div id="example-collapse-text">
          <Link
            className={styles.colC}
            to={"/documents/new"}
            onClick={handleCreateWorkflowItemClick}
          >
            Document
          </Link>
          <Link
            className={styles.colC}
            to={"/templates/new"}
            onClick={handleCreateWorkflowItemClick}
          >
            Template
          </Link>
          <Link
            className={styles.colC}
            to={"/workflows/new"}
            onClick={handleCreateWorkflowItemClick}
          >
            Workflow
          </Link>
          <Link
            className={styles.colC}
            to={"/workflows/set-workflow"}
            onClick={handleCreateWorkflowItemClick}
          >
            Process
          </Link>
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
            fontWeight: "bold",
          }}
        >
          Search
        </span>
        <p
          style={{
            padding: "0 30px",
            marginLeft: "30px",
            color: "#dddfe1",
            fontWeight: "600",
          }}
        >
          Search in file names of Docs, Templates & Workflows
        </p>
      </div>
      <form>
        <input
          style={{
            fontSize: "17px",
            color: "#afafaf",
            paddingLeft: "40px",
            marginLeft: "40px",
            height: "50px",
            border: "gray",
          }}
          type="text"
          placeholder="Type here to search"
        />
      </form>
      <button
        style={{
          width: "78.5%",
          marginLeft: "39px",
          marginTop: "8px",
          height: "50px",
          backgroundColor: "#61ce70",
          color: "white",
          border: "1px solid gray",
          fontWeight: "bold",
        }}
      >
        <SearchIcon style={{ color: "white" }} />
        Search
      </button>
      <Accordion
        title="Documents (007)"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Templates (006)"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Workflows (004)"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <span
        className="manageFiles (003)"
        style={{
          fontWeight: "bold",
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
        title="My Documents (002)"
        content="New Documents"
        content2="Draft"
        dotColor="rgb(84, 89, 95)"
      />
      <Accordion
        title="Templates (004)"
        content2={
          <Link
            style={{ textDecoration: "none", color: "#e1e1e1" }}
            to={"/Templates/TempDraft/TempDraft"}
          >
            Draft
          </Link>
        }
        content={
          <Link
            style={{ textDecoration: "none", color: "#e1e1e1" }}
            to={"/Templates/NewTemplate/NewTemplate"}
          >
            New Template
          </Link>
        }
        dotColor="#54595f"
      />
      <Accordion
        title="Workflows (007)"
        content="New Workflow"
        content2="Draft"
        dotColor="#54595f"
        titleIsLink={true}
        titleLink={"/workflows/"}
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
          fontWeight: "bold",
        }}
      >
        Reports
      </span>
      <Accordion
        title="Documents"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Workflows"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <span
        className="dowell"
        style={{
          display: "flex",
          color: "#61ce70",
          justifyContent: "center",
          fontSize: "15px",
          paddingTop: "40px",
          fontWeight: "bold",
        }}
      >
        DoWell Knowledge Center
      </span>
      <Accordion
        title="Templates"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Learning Supports"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Case Studies"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="New Trends"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
      />
      <Accordion
        title="Legal Compliances"
        content="1. To be Approved (002)"
        content2="2. Rejected by others (001)"
        dotColor="#54595f"
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
          gap: "20px",
        }}
      >
        {" "}
        <MenuIcon fontSize="large" style={{ color: "white" }} />
        <PowerSettingsNewIcon fontSize="large" style={{ color: "white" }} />
        <PersonIcon fontSize="large" style={{ color: "white" }} />
        <HouseIcon fontSize="large" style={{ color: "white" }} />
        <PowerSettingsNewIcon fontSize="large" style={{ color: "white" }} />
      </div>
    </div>
  );
};

export default SideBar;
