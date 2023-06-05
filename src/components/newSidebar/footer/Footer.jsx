import styles from "./footer.module.css";
import { footerIcons } from "../Sidebar";
import { useSelector } from "react-redux";
import { Tooltip } from "react-tooltip";
import { useTranslation } from "react-i18next";
import { productName } from "../../../utils/helpers";

const Footer = ({ handleIconClick }) => {
  const { t } = useTranslation();

  const { userDetail } = useSelector((state) => state.auth);

  return (
    <div className={styles.container}>
      <div className={styles.mode__box}>
        <h1>6</h1>
        <h2>{t(userDetail?.portfolio_info?.length > 1 ? userDetail?.portfolio_info.find(portfolio => portfolio.product === productName)?.data_type : userDetail?.portfolio_info[0].data_type)}</h2>
      </div>
      <div className={styles.icon__box}>
        {footerIcons.map((item) => (
          <i id={item.id} onClick={() => handleIconClick(item.feature)} key={item.id}>
            <item.icon cursor="pointer" size={28} />
            <Tooltip anchorId={item.id} content={item.label} style={{ fontStyle: "normal" }} />
          </i>
        ))}
      </div>
    </div>
  );
};

export default Footer;
