import Button from "react-bootstrap/Button";
import "../flip-card/flipCard.css";
const FlipCard = () => {
  return (
    <div class="flip-card">
      <div className="flip-card-inner">
        <div className="flip-card-front">
          <span className="customer">
            <span style={{ fontWeight: "bold" }}>Customer Support</span>
            <span className="main-card">
              <br /> Learnig Support, New Trends, Case Studies, Preference
              Templates.
            </span>
          </span>
          <span className="main"></span>
        </div>
        <div className="flip-card-back">
          <img
            src="	https://i0.wp.com/workflowai.online/wp-content/uploads/2022/10/artistic-logo.png?w=916&ssl=1"
            alt=""
            style={{
              width: "50%",
              height: "50px",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          />
          <h4>Knowledge Center</h4>
          <p>learnig Support, New trends, Case Studies, Templates Workflow</p>
          <Button
            variant="secondary"
            style={{ width: "70%", border: "3px solid #FFFF" }}
          >
            Click Here
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
