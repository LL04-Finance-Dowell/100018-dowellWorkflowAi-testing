import { AiOutlineClose } from "react-icons/ai"
import styles from './style.module.css';
import { useDispatch, useSelector } from "react-redux";
import { SetArrayofLinks, setShowGeneratedLinksPopup,setLinksFetched } from "../../../../../../features/app/appSlice";

import React from "react";


const GeneratedLinksModal = ({ linksObj, copiedLinks, updateCopiedLinks, handleCloseBtnClick }) => {
  const { showGeneratedLinksPopup, ArrayofLinks } = useSelector(state => state.app);
  const dispatch = useDispatch();




  const handleCopyLink = (link) => {
    if (!link) return

    navigator.clipboard.writeText(link);
    const currentCopiedLinks = structuredClone(copiedLinks);
    currentCopiedLinks.push(link);
    updateCopiedLinks(currentCopiedLinks);
  }
  ///////////
  if (ArrayofLinks && Array.isArray(ArrayofLinks))
    return <div className={styles.process__Generated__Links__Overlay}>
      <div className={styles.process__Generated__Links__Container}>
        <div className={styles.process__Generated__Links__Container__Close__Icon} onClick={() => {
          dispatch(setShowGeneratedLinksPopup(false));
          dispatch(SetArrayofLinks([]));
          dispatch( setLinksFetched(false));
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
              </tr>
            </thead>
            <tbody className={styles.process__Links__Container}>
              {
                React.Children.toArray(ArrayofLinks.map((link, index) => {
                  return <tr>
                    <td>{index + 1}</td>

                    <td>{Object.keys(link)[0]}</td>

                    <td className={styles.single__Link}>{Object.values(link)[0]}</td>

                  </tr>
                }))
              }
            </tbody>
          </table>
        </div>
      </div>
    </div>



  ///////////////


  if (!linksObj || typeof linksObj !== 'object') return <></>

  return <div className={styles.process__Generated__Links__Overlay}>
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
}

export default GeneratedLinksModal;