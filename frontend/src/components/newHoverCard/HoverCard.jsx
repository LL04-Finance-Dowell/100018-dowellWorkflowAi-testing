import styles from "./hoverCard.module.css";
import { FaSignature } from "react-icons/fa";
import { Box } from "./styledComponents";
import { useDispatch, useSelector } from "react-redux";
import { detailDocument } from "../../features/document/asyncThunks";
import { detailTemplate } from "../../features/template/asyncThunks";
import Test from "../hoverCard/HoverCard";

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

  return <Test />;
};

export default HoverCard;
