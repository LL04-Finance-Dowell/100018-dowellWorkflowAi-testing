import { AiOutlineClose } from "react-icons/ai"
import styles from './style.module.css';
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetArrayofLinks, setShowGeneratedLinksPopup, setLinksFetched } from "../../../../../../features/app/appSlice";

import React from "react";


const GeneratedLinksModal = ({ linksObj, copiedLinks, updateCopiedLinks, handleCloseBtnClick }) => {
  const { showGeneratedLinksPopup, ArrayofLinks } = useSelector(state => state.app);
  const dispatch = useDispatch();

  const [copiedStatus, setCopiedStatus] = useState(
    ArrayofLinks.map(() => false)
  );


  const handleCopyLink = (link) => {
    if (!link) return

    navigator.clipboard.writeText(link);
    const currentCopiedLinks = structuredClone(copiedLinks);
    currentCopiedLinks.push(link);
    updateCopiedLinks(currentCopiedLinks);
  }


  function handleProcessCopyLink(index, link) {
    navigator.clipboard.writeText(link);
    const newCopiedStatus = [...copiedStatus];
    newCopiedStatus[index] = true;
    setCopiedStatus(newCopiedStatus);
    setTimeout(() => {
      const newerCopiedStatus = [...copiedStatus];
      newerCopiedStatus[index] = false;
      setCopiedStatus(newerCopiedStatus);
    }, 1000);
  }
  ///////////
  return (
    linksObj && typeof linksObj === 'object' ? (
      <div className={styles.process__Generated__Links__Overlay}>
        <div className={styles.process__Generated__Links__Container}>
          <div className={styles.process__Generated__Links__Container__Close__Icon} onClick={() => handleCloseBtnClick()}>
            <AiOutlineClose />
          </div>
          <div className={styles.process__Links__Wrapper}>
            <table>
              <thead>
                <tr>
                  <td>S/No.</td>
                  <td>Name</td>
                  <td>Link</td>
                  <td>QR Code</td>
                  <td>Copy</td>
                </tr>
              </thead>
              <tbody className={styles.process__Links__Container}>
                {
                  React.Children.toArray(linksObj?.links?.map((link, index) => {
                    return <tr>
                      <td>{index + 1}.</td>
                      <td>{typeof link === "object" ? Object.keys(link)[0] : ""}</td>
                      <td className={styles.single__Link} onClick={() => handleCopyLink(Object.values(link)[0])}>{typeof link === "object" ? Object.values(link)[0] : ""}</td>
                      <td>
                        {
                          linksObj?.qrcodes[index] && typeof linksObj?.qrcodes[index] === "object" ?
                            <img src={Object.values(linksObj?.qrcodes[index])[0]} alt="qr code" /> :
                            <>Qr code</>
                        }
                      </td>
                      <td>
                        <span className={styles.process__Generated__Links__Copy__Item} onClick={() => handleCopyLink(Object.values(link)[0])}>{typeof link === "object" && copiedLinks.includes(Object.values(link)[0]) ? "Copied" : "Copy"}</span>
                      </td>
                    </tr>
                  }))
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ) : (
      <div className={styles.process__Generated__Links__Overlay}>
        <div className={styles.process__Generated__Links__Container}>
          <div className={styles.process__Generated__Links__Container__Close__Icon} onClick={() => {
            dispatch(setShowGeneratedLinksPopup(false));
            dispatch(SetArrayofLinks([]));
            dispatch(setLinksFetched(false));
          }}>
            <AiOutlineClose />
          </div>
          <div className={styles.process__Links__Wrapper}>
            <table>
              <thead>
                <tr>
                  <td>S/No.</td>
                  <td>Name</td>
                  <td>Link</td>
                  <td>Copy</td>
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
                      <td>
                        <button
                          className={styles.process__Generated__Links__Copy__Item}
                          onClick={() =>
                            handleProcessCopyLink(index, linkUrl)
                          }
                        >
                          {isCopied ? "Copied!" : "Copy"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  );




}

export default GeneratedLinksModal;