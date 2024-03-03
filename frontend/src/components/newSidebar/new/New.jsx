import React, { useState } from "react";
import Collapse from "../../../layouts/collapse/Collapse";
import styles from "./new.module.css";
import { v4 as uuidv4 } from "uuid";
import { FaPlus } from "react-icons/fa";
import { HashLink } from "react-router-hash-link";
import { useDispatch, useSelector } from "react-redux";
import { createTemplate } from "../../../features/template/asyncThunks";
import {
  setToggleManageFileForm,
  settemLoading,
  settemLoaded,
} from "../../../features/app/appSlice";
import { useTranslation } from "react-i18next";
import { productName } from "../../../utils/helpers";
import { useAppContext } from "../../../contexts/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const New = ({ toggleSidebar, isMobile }) => {
  const { userDetail } = useSelector((state) => state.auth);
  const { themeColor, creditResponse } = useSelector((state) => state.app);
  // // console.log(creditResponse.data.data.api_key)
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const [isOpen, setIsOpen] = useState(false);
  const { setShowFoldersActionModal } = useAppContext();

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
  };

  const handleNewItemClick = (e, content) => {
    if (content === "template") {
      e.preventDefault();

      dispatch(setToggleManageFileForm(true));

      const data = {
        created_by: userDetail?.userinfo.username,
        company_id:
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.org_id
            : userDetail?.portfolio_info[0].org_id,
        data_type:
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.data_type
            : userDetail?.portfolio_info[0].data_type,
        portfolio:
          userDetail?.portfolio_info?.length > 1
            ? userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.portfolio_name
            : userDetail?.portfolio_info[0].portfolio_name,
      };
      const Api_key = creditResponse?.api_key;
      axios
        .post(
          `https://100105.pythonanywhere.com/api/v3/process-services/?type=product_service&api_key=${Api_key}`,
          {
            service_id: "DOWELL10026",
            sub_service_ids: ["DOWELL100262"],
          }
        )
        // dispatch(settemLoading(true))
        .then((response) => {
          if (response.data.success == true) {
            dispatch(createTemplate(data));
          }
        })
        // dispatch(settemLoading(false))
        .catch((error) => {
          // console.log(error.response?.data?.message);
          toast.info(error.response?.data?.message);
        });
    } else {
      dispatch(setToggleManageFileForm(true));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.box2}>
        <div
          onClick={handleOpen}
          className={styles.new__button__box}
          style={{ backgroundColor: themeColor }}
        >
          <i>
            <FaPlus size={20} />
          </i>
        </div>
        <HashLink
          onClick={(e) => handleNewItemClick(e, "document")}
          to={"/documents/#newDocument"}
          className={styles.new__button__box2}
          style={{ backgroundColor: themeColor }}
        >
          <span>{t("new")}</span>
        </HashLink>
      </div>
      <div className={styles.box}>
        <Collapse open={isOpen}>
          <div className={styles.new__content}>
            {items.map((item) => (
              <HashLink
                onClick={(e) => handleNewItemClick(e, "document")}
                to={item.href}
                key={item.id}
              >
                {t(item.content)}
              </HashLink>
            ))}
            <button
              onClick={() => {
                setShowFoldersActionModal({ state: true, action: "create" });
                if (isMobile == true) {
                  toggleSidebar();
                }
              }}
            >
              Folder
            </button>
          </div>
        </Collapse>
      </div>
    </div>
  );
};

export default New;

const items = [
  // { id: uuidv4(), content: 'template', href: '/templates/#newTemplate' },
  { id: uuidv4(), content: "document", href: "/documents/#newDocument" },
  { id: uuidv4(), content: "workflow", href: "/workflows/#newWorkflow" },
  {
    id: uuidv4(),
    content: "process",
    href: "/workflows/new-set-workflow-document",
  },
];
