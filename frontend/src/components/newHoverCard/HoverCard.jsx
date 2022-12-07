import styles from "./hoverCard.module.css";
import { FaSignature } from "react-icons/fa";
import { Box } from "./styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { detailDocument } from "../../features/document/asyncThunks";
import { detailTemplate } from "../../features/template/asyncThunks";

const HoverCard = ({ bgColor, item, feature }) => {
  const dispatch = useDispatch();
  const { status: documentStatus } = useSelector((state) => state.document);
  const { status: templateStatus } = useSelector((state) => state.template);

  const handleDetail = () => {
    if (feature === "document") {
      const data = {
        document_name: item.document_name,
        document_id: item._id,
      };

      console.log("handle doc detail", data);
      dispatch(detailDocument(data));
    }
    if (feature === "template") {
      const data = {
        template_id: item._id,
        template_name: item.template_name,
      };

      console.log("templateeeeeeeeeeeeeeeeeeee", data);
      dispatch(detailTemplate(data));
    }
  };

  return (
    <div className={styles.container}>
      <Box bgColor={bgColor} className={`${styles.box} ${styles.current}`}>
        {/*  <i>
          <FaSignature size={62} />
        </i> */}
        {/* <h2 className={styles.title}>To be signed</h2> */}
        <span className={styles.title}>
          {(feature === "document" && item.document_name) ||
            (feature === "template" && item.template_name) ||
            (feature === "workflow" && item.workflow_name)}
        </span>
      </Box>
      <div className={`${styles.box} ${styles.hover__box}`}>
        {feature === "workflow" ? (
          <>
            <h2 className={styles.step__text}>step1 - admin</h2>
            <div className={styles.button__group}>
              <button className={styles.update__button}>update</button>
              <button className={styles.delete__button}>delete</button>
            </div>
          </>
        ) : (
          <>
            <h2 className={styles.title}>{item.document_name}</h2>
            <span className={styles.sub__title}>Thumb nail of file</span>
            <button
              className={styles.detail__button}
              onClick={handleDetail}
              tabIndex={-30}
            >
              Click here
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default HoverCard;
