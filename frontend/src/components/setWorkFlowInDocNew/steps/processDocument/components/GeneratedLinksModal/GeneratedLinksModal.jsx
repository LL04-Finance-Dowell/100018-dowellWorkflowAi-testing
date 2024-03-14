import { AiOutlineClose } from "react-icons/ai";
import styles from "./style.module.css";
import { toast } from "react-toastify";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";


import React from "react";
import {
  FaShareAlt,
  FaRegCopy,
} from "react-icons/fa";
import { Modal } from 'react-bootstrap';
import facebook from './../../../../../../assets/facebook.jpg'
import instagram from './../../../../../../assets/3225191_app_instagram_logo_media_popular_icon.jpg'
import snapchat from './../../../../../../assets/3225185_app_logo_media_popular_snapchat_icon.jpg'
import gmail from './../../../../../../assets/7115264_new_logo_gmail_icon.jpg'
import pinterest from './../../../../../../assets/3225188_app_logo_media_pinterest_popular_icon.jpg'
import whatsapp from './../../../../../../assets/3225179_app_logo_media_popular_social_icon.jpg'
import twitter from './../../../../../../assets/3225183_app_logo_media_popular_social_icon.jpg'
import discord from './../../../../../../assets/resize-17053994161792650344discord.png'
import { SetArrayofLinks, setLinksFetched, setShowGeneratedLinksPopup } from "../../../../../../features/app/appSlice";
import { setshowsProcessDetailPopup } from "../../../../../../features/processes/processesSlice";


const GeneratedLinksModal = ({
  linksObj,
  masterLink,

  copiedLinks,
  updateCopiedLinks,
  handleCloseBtnClick,
}) => {
  const {  ProcessDetail } = useSelector((state) => state.processes);
  const { ArrayofLinks } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const { process_title, process_steps } = ProcessDetail;
  const [showModal, setShowModal] = useState(false);

  const [copiedStatus, setCopiedStatus] = useState(
    ArrayofLinks.map(() => false)
  );
  const handleCopyLink = (link) => {
    if (!link) return;

    navigator.clipboard.writeText(link);
    const currentCopiedLinks = structuredClone(copiedLinks);
    currentCopiedLinks.push(link);
    updateCopiedLinks(currentCopiedLinks);
    setTimeout(() => {
      updateCopiedLinks([]);
    }, 3000);
  };

  function handleProcessCopyLink(index, link) {
    navigator.clipboard.writeText(link);
    const newCopiedStatus = [...copiedStatus];
    newCopiedStatus[index] = true;
    setCopiedStatus(newCopiedStatus);
    toast.info("Link Copied");
    setTimeout(() => {
      const newerCopiedStatus = [...copiedStatus];
      newerCopiedStatus[index] = false;
      setCopiedStatus(newerCopiedStatus);
    }, 1000);
  }
  function handleCloseDetailBtnClick() {
    dispatch(setshowsProcessDetailPopup(false));
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShare = () => {
    setShowModal(true);
  };
  const socialMedia = [
    {
      name: "Facebook",
      src: facebook,
      onClick: () => window.open("https://www.facebook.com", "_blank"),
    },
    {
      name: "Gmail",
      src: gmail,
      onClick: () => window.open("https://mail.google.com/", "_blank"),
    },
    {
      name: "Whatsapp",
      src: whatsapp,
      onClick: () => window.open("https://www.whatsapp.com", "_blank"),
    },
    {
      name: "Instagram",
      src: instagram,
      onClick: () => window.open("https://www.instagram.com", "_blank"),
    },
    {
      name: "Twitter",
      src: twitter,
      onClick: () => window.open("https://www.twitter.com", "_blank"),
    },
    {
      name: "Snapchat",
      src: snapchat,
      onClick: () => window.open("https://www.snapchat.com", "_blank"),
    },
    {
      name: "Pinterest",
      src: pinterest,
      onClick: () => window.open("https://www.pinterest.com", "_blank"),
    },
    {
      name: "Discord",
      src: discord,
      onClick: () => window.open("https://www.discord.com", "_blank"),
    },
  ];

  return linksObj && typeof linksObj === "object" ? (
    <div className={styles.process__Generated__Links__Overlay}>
      <div className={styles.process__Generated__Links__Container}>
        <div
          className={styles.process__Generated__Links__Container__Close__Icon}
          onClick={() => handleCloseBtnClick()}
        >
          <AiOutlineClose />
        </div>
        <div className={styles.process__Links__Wrapper}>
          <table>
            <thead>
              <tr>
                <td>S/No.</td>
                <td>Name</td>
                <td>Link</td>
                {linksObj.master_code ? <td>QR Code</td> : null}
                <td>Copy</td>
              </tr>
            </thead>

            <tbody className={styles.process__Links__Container}>
              {linksObj.master_link &&
              typeof linksObj.master_link === "string" ? (
                <>
                  <tr>
                    <td>0.</td>
                    {/* <td>{Object.keys(linksObj.master_link)}</td> */}
                    <td>Master Link</td>
                    <td
                      className={styles.single__Link}
                      onClick={() => handleCopyLink(linksObj.master_link)}
                    >
                      {linksObj.master_link}
                    </td>
                    <td>
                      {linksObj.master_code &&
                      typeof linksObj.master_code === "string" ? (
                        <img
                          src={linksObj.master_code}
                          alt="qr code"
                          onClick={() => {
                            navigator.clipboard.writeText(linksObj.master_code);
                            toast.info("Copied to clipboard!");
                          }}
                        />
                      ) : (
                        <>Qr code</>
                      )}
                    </td>
                    <td>
                      <span
                        className={styles.process__Generated__Links__Copy__Item}
                        onClick={() => handleCopyLink(linksObj.master_link)}
                      >
                        {copiedLinks.includes(linksObj.master_link)
                          ? "Copied"
                          : "Copy"}
                      </span>
                    </td>
                  </tr>
                  {linksObj.links.map((link, index) => {
                    if (typeof link !== "object") return null; // Skip non-object entries

                    const linkName = Object.keys(link)[0];
                    const linkValue = Object.values(link)[0];

                    return (
                      <tr key={index}>
                        <td>{index + 1}.</td>
                        <td>{linkName}</td>
                        <td
                          className={styles.single__Link}
                          onClick={() => handleCopyLink(linkValue)}
                        >
                          {linkValue}
                        </td>
                        <td>{null}</td>
                        <td>
                          <span
                            className={
                              styles.process__Generated__Links__Copy__Item
                            }
                            onClick={() => handleCopyLink(linkValue)}
                          >
                            {copiedLinks.includes(linkValue)
                              ? "Copied"
                              : "Copy"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </>
              ) : (
                linksObj.links.map((link, index) => {
                  if (typeof link !== "object") return null; // Skip non-object entries

                  const linkName = Object.keys(link)[0];
                  const linkValue = Object.values(link)[0];

                  return (
                    <tr key={index}>
                      <td>{index + 1}.</td>
                      <td>{linkName}</td>
                      <td
                        className={styles.single__Link}
                        onClick={() => handleCopyLink(linkValue)}
                      >
                        {linkValue}
                      </td>
                      <td>
                        <span
                          className={
                            styles.process__Generated__Links__Copy__Item
                          }
                          onClick={() => handleCopyLink(linkValue)}
                        >
                          {copiedLinks.includes(linkValue) ? "Copied" : "Copy"}
                        </span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.process__Generated__Links__Overlay}>
      <div className={styles.process__Generated__Links__Container}>
        <div
          className={styles.process__Generated__Links__Container__Close__Icon}
          onClick={() => {
            dispatch(setShowGeneratedLinksPopup(false));
            dispatch(SetArrayofLinks([]));
            dispatch(setLinksFetched(false));
          }}
        >
          <AiOutlineClose />
        </div>
        <div className={styles.process__Links__Wrapper}>
          <table>
            <thead>
              <tr>
                <td>S/No.</td>
                <td>Name</td>
                <td>Link</td>
                {/* <td>Copy</td> */}
                {/* <td>Mail</td> */}
                <td>share</td>
              </tr>
            </thead>
            <tbody className={styles.process__Links__Container}>
              {ArrayofLinks.map((link, index) => {
                const linkName = Object.keys(link)[0];
                const linkUrl = Object.values(link)[0];
                const isCopied = copiedStatus[index];
                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{linkName}</td>
                    <td className={styles.single__Link}>{linkUrl}</td>
                    {/* <td>
                      <button
                        className={styles.process__Generated__Links__Copy__Item}
                        onClick={() => handleProcessCopyLink(index, linkUrl)}
                      >
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </td> */}
                    {/* <td>
                      <span
                        className={styles.process__Generated__Links__Copy__Item}
                      >
                        <MdEmail />
                      </span>
                    </td> */}

                    <td>
                      <span
                        className={styles.process__Generated__Links__Copy__Item}
                        onClick={handleShare}
                      >
                        <FaShareAlt />
                      </span>
                    </td>
                    <Modal show={showModal} onHide={handleCloseModal} centered>
                      <Modal.Header closeButton>
                        <Modal.Title
                          style={{
                            color: "#111",
                            fontSize: 22,
                            marginLeft: 10,
                          }}
                        >
                          Share
                        </Modal.Title>
                      </Modal.Header>
                      <Modal.Body>
                        <div >
                          <div className={styles.social_icons}>
                            {
                              React.Children.toArray(socialMedia.map(item => {
                                return <div
                                  onClick={
                                    typeof item.onClick === 'function' ? 
                                      () => item.onClick()
                                    :
                                    () => {}
                                  }
                                >
                                  <div className={styles.social_icons_icon}>
                                    <img src={item.src} style={{ borderRadius: "50%" }} alt={item.name}></img>
                                  </div>
                                  <div style={{color: "#111"}}>{item.name}</div>
                                </div>
                              }))
                            }
                            
                            {/* <div onClick={openFacebook}>
                              <div className={styles.social_icons_icon}>
                                <img src={facebook} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111"}}> Facebook </div>
                            </div>
                            <div onClick={openInstagram}>
                              <div className={styles.social_icons_icon}>
                                <img src={instagram} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111"}}> instagram </div>
                            </div>
                            <div onClick={openWhatsapp}>
                              <div className={styles.social_icons_icon}>
                                <img src={whatsapp} style={{ borderRadius: "50%" }}></img>
                              </div>
                              <div style={{color: "#111"}}> whatsapp </div>
                            </div>
                            <div onClick={openGmail}> 
                              <div className={styles.social_icons_icon}>
                                <img src={gmail} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111", paddingLeft: "20px"}}> Gmail </div>
                            </div>
                          </div>
                          <div className={styles.social_icons} >
                            <div onClick={openPinterest}>
                              <div className={styles.social_icons_icon}>
                                <img src={pinterest} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <p>{media.name}</p>
                            </div>
                            <div onClick={openSnapchat}>
                              <div className={styles.social_icons_icon}>
                                <img src={snapchat} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111", paddingLeft: "5px"}}> Snapchat </div>
                            </div>
                            <div onClick={openTwitter}>
                              <div className={styles.social_icons_icon}>
                                <img src={twitter} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111", paddingLeft: "15px"}}> Twitter </div>
                            </div>
                            <div onClick={openDiscord} >
                              <div className={styles.social_icons_icon}>
                                <img src={discord} style={{ borderRadius: "50%" }} alt='select image'></img>
                              </div>
                              <div style={{color: "#111", paddingLeft: "10px"}}> Discord </div>
                            </div> */}
                          </div>
                        </div><br />

                        <br />
                        <div className={styles.copy_link}>
                          <h5>Copy Link</h5>
                          <div className={styles.url_section}>
                            <input
                              className={styles.url_section_input}
                              type="text"
                              value={linkUrl}
                              disabled
                            />
                            <button
                              onClick={() =>
                                handleProcessCopyLink(index, linkUrl)
                              }
                            >
                              {<FaRegCopy style={{ fontSize: 20 }} />}
                            </button>
                          </div>
                        </div>
                      </Modal.Body>
                      <Modal.Footer>
                        {/* <Button variant="success">
                          {<FaFacebook />}
                        </Button>
                        <Button variant="success">
                          {<MdEmail />}
                        </Button> */}
                      </Modal.Footer>
                    </Modal>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default GeneratedLinksModal;
