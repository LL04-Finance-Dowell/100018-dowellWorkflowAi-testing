import { Link } from "react-router-dom";
import FlipCard from "../../components/flip-card/FlipCard";
import HoverCard from "../../components/hover-card/HoverCard";
import SmallFlip from "../../components/small-flip/SmallFlip";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import YouTubeIcon from "@mui/icons-material/YouTube";
import FacebookIcon from "@mui/icons-material/Facebook";
import ManageAccountsIcon from "@mui/icons-material/ManageAccounts";
import SearchIcon from "@mui/icons-material/Search";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import { useUserContext } from "../../contexts/UserContext";
import WorkflowLayout from "../../layouts/WorkflowLayout/WorkflowLayout"
import { dowellLoginUrl, dowellLogoutUrl } from "../../services/axios";
import { clearLocalStorageItems, handleAuthenticationBtnClick } from "../../services/common";
import "./style.css";
import Carousell from "../../components/carousel/Carousel";
import Table from "../../components/table/Table";
import Chat from "../../components/chat/Chat";

const WorkflowApp = () => {

    const { currentUser } = useUserContext();

    return <>
        <WorkflowLayout>
            <>
            <div className="main">
                {/* <SideBar /> */}

                <div className="top-main">
                <Carousell />

                <div
                    style={{
                    zIndex: "1",
                    position: "sticky",
                    top: "0px",
                    }}
                    className="sm-flip"
                >
                    <SmallFlip
                    icon={<NotificationsNoneIcon fontSize="large" />}
                    content={"006"}
                    button={"View"}
                    size={"50px"}
                    padding={"32px"}
                    color={"#1abc9c"}
                    />
                    <SmallFlip
                    icon={<InsertDriveFileIcon fontSize="large" />}
                    content={"New"}
                    button={"Create Document"}
                    size={"60px"}
                    padding={"30px"}
                    color={"gray"}
                    />
                    <SmallFlip
                    icon={<SearchIcon fontSize="large" />}
                    content={"Search"}
                    button={"Search Document"}
                    size={"60px"}
                    padding={"30px"}
                    color={"#61ce70"}
                    />
                    <SmallFlip
                    icon={<ManageAccountsIcon fontSize="large" />}
                    content={"Support"}
                    button={"Dowell Knowledge Center"}
                    size={"85px"}
                    padding={"15px"}
                    color={"#c3d6be"}
                    />
                </div>
                <div style={{ marginTop: "150px" }}>
                    <h5
                    id="ji"
                    style={{
                        border: "1px solid #74d481",
                        width: "107%",
                        height: "40px",
                        marginBottom: "0",
                        marginLeft: "39px",
                        color: "red",
                        paddingTop: "5px",
                        paddingLeft: "5px",
                    }}
                    >
                    Notifications - Documents
                    </h5>
                    <div
                    style={{
                        display: "grid",
                        width: "96%",

                        paddingLeft: "50px",
                        gridTemplateColumns: "auto auto auto",
                    }}
                    >
                    <HoverCard />
                    <HoverCard />
                    <HoverCard />
                    <HoverCard />
                    <HoverCard />
                    </div>
                </div>

                <div>
                    <h5
                    id="ji"
                    style={{
                        border: "1px solid #74d481",
                        width: "107%",
                        height: "40px",
                        marginBottom: "0",
                        marginLeft: "39px",
                        color: "red",
                        paddingTop: "5px",
                        paddingLeft: "5px",
                    }}
                    >
                    Notifications - Templates
                    </h5>
                    <div
                    style={{
                        display: "grid",
                        width: "96%",

                        paddingLeft: "50px",
                        gridTemplateColumns: "auto auto auto",
                    }}
                    >
                    <HoverCard color="#c3d6be" />
                    <HoverCard color="#c3d6be" />
                    <HoverCard color="#c3d6be" />
                    </div>
                </div>
                <div>
                    <h5
                    id="ji"
                    style={{
                        border: "1px solid #74d481",
                        width: "107%",
                        height: "40px",
                        marginBottom: "0",
                        marginLeft: "39px",
                        color: "red",
                        paddingTop: "5px",
                        paddingLeft: "5px",
                    }}
                    >
                    Notifications - Workflows
                    </h5>
                    <div
                    style={{
                        display: "grid",
                        width: "67%",

                        paddingLeft: "50px",
                        gridTemplateColumns: "auto auto auto",
                    }}
                    >
                    <HoverCard color="#e1e1e1" />
                    <HoverCard color="#e1e1e1" />
                    </div>
                </div>
                <div style={{ display: "flex" }}>
                    <Table header="Incomplete Tasks" />
                    <Table header="Complete Tasks" />
                </div>
                <div className="sm-flip">
                    <SmallFlip
                    icon={<NotificationsNoneIcon fontSize="large" />}
                    content={"006"}
                    button={"View"}
                    size={"50px"}
                    padding={"32px"}
                    color={"#1abc9c"}
                    />
                    <SmallFlip
                    icon={<InsertDriveFileIcon fontSize="large" />}
                    content={"New"}
                    button={"Create Document"}
                    size={"60px"}
                    padding={"30px"}
                    color={"gray"}
                    />
                    <SmallFlip
                    icon={<SearchIcon fontSize="large" />}
                    content={"Search"}
                    button={"Search Document"}
                    size={"60px"}
                    padding={"30px"}
                    color={"#61ce70"}
                    />
                    <SmallFlip
                    icon={<ManageAccountsIcon fontSize="large" />}
                    content={"Support"}
                    button={"Dowell Knowledge Center"}
                    size={"85px"}
                    padding={"15px"}
                    color={"#c3d6be"}
                    />
                </div>
                </div>
                <FlipCard />
                <Chat />
            </div>
            <div
                style={{ display: "flex", justifyContent: "space-between" }}
                className="footer"
            >
                <div>©All rights reserved by WorkFlowAI</div>
                <div style={{ display: "flex", gap: "20px" }}>
                <FacebookIcon fontSize="large" className="face" />
                <YouTubeIcon fontSize="large" className="face" />
                <LinkedInIcon fontSize="large" className="face" />
                </div>
            </div>
                {/* <h1>Hello {currentUser.username}</h1>

                <div>
                    { 
                        currentUser ? 
                        <button><Link to={dowellLogoutUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLogoutUrl, clearLocalStorageItems())}>Logout</Link></button> : 
                        <button><Link to={dowellLoginUrl} onClick={(e) => handleAuthenticationBtnClick(e, dowellLoginUrl)}>Login</Link></button> 
                    }
                </div> */}
            </>
        </WorkflowLayout>
    </>
}

export default WorkflowApp;