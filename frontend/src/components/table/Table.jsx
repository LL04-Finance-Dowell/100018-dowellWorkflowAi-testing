import Accordion from "../accordion/Accordion";
import style from "../table/table.module.css";
const Table = (props) => {
  return (
    <div className={style.table}>
<<<<<<< HEAD
      <span className={style.header}>{props.header}</span>
=======
      <span style={{ color: `${props.color}` }} className={style.header}>
        {props.header}
      </span>
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
      <div style={{ backGroundColor: "#e1e1e1" }}>
        {" "}
        <Accordion
          title="Documents (007)"
          content="1. To be Approved (002)"
          content2="2. Rejected by others (001)"
          color="#7a7a91"
          bgColor="#E1E1DB"
<<<<<<< HEAD
          dotColor="#e1e1e1"
          bColor="white"
          width="100%"
          margin="0"
          paddingg="12px 0 7px 0"
=======
          dotColor="#E1E1DB"
          bColor="white"
          width="100%"
          margin="0"
          widthh="100%"
          paddingg="12px 0 20px 0"
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
          marg="12px"
          top="0"
          contPad="30px 0 0 20px"
          contPadd="0 0 0 20px"
          contColor="#ff0000"
        />
        <Accordion
          title="Documents (007)"
          content="1. To be Approved (002)"
          content2="2. Rejected by others (001)"
          color="#7a7a91"
          bgColor="#E1E1DB"
<<<<<<< HEAD
          dotColor="#e1e1e1"
          bColor="white"
          width="100%"
          margin="0"
          paddingg="12px 0 7px 0"
=======
          dotColor="#E1E1DB"
          bColor="white"
          width="100%"
          margin="0"
          widthh="100%"
          paddingg="12px 0 20px 0"
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
          marg="12px"
          top="0"
          contPad="30px 0 0 20px"
          contPadd="0 0 0 20px"
          contColor="#ff0000"
        />
        <Accordion
          title="Documents (007)"
          content="1. To be Approved (002)"
          content2="2. Rejected by others (001)"
          color="#7a7a91"
<<<<<<< HEAD
          contColor="#ff0000"
          bgColor="#E1E1DB"
          dotColor="#e1e1e1"
          bColor="white"
          width="100%"
          margin="0"
          paddingg="12px 0 7px 0"
=======
          bgColor="#E1E1DB"
          dotColor="#E1E1DB"
          bColor="white"
          width="100%"
          margin="0"
          widthh="100%"
          paddingg="12px 0 20px 0"
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
          marg="12px"
          top="0"
          contPad="30px 0 0 20px"
          contPadd="0 0 0 20px"
<<<<<<< HEAD
=======
          contColor="#ff0000"
>>>>>>> fbd08303aaf6338b0e0a195de7f1bcb92a8d359e
        />
      </div>
    </div>
  );
};

export default Table;
<div className="table"></div>;
