import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { json, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { setEditorLink } from '../../../features/app/appSlice';
import HoverCard from '../HoverCard';
import { Button } from '../styledComponents';
import { detailDocument, documentReport } from '../../../features/document/asyncThunks';
import { useState } from 'react';
import axios from 'axios';
import { LoadingSpinner } from '../../LoadingSpinner/LoadingSpinner';
import {
  verifyProcessForUser,
  getVerifiedProcessLink,
} from '../../../services/processServices';
import { useAppContext } from '../../../contexts/AppContext';
import {
  SetShowDocumentReport,
  SetSingleDocument
} from "../../../features/app/appSlice";

import {
  addNewFavoriteForUser,
  deleteFavoriteForUser,
} from '../../../services/favoritesServices';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { moveItemToArchive } from '../../../services/archiveServices';
import { setAllDocuments } from '../../../features/document/documentSlice';
import { BsBookmark, BsFillBookmarkFill, BsArrowBarRight } from 'react-icons/bs';
import {
  extractTokenFromVerificationURL,
  openEditorInNewTab,
  productName,
  updateVerificationDataWithTimezone,
} from '../../../utils/helpers';
import { useTranslation } from 'react-i18next';
import { DocumentServices } from '../../../services/documentServices';
import { MdOutlineFiberNew } from 'react-icons/md';
import { IoIosRefresh } from 'react-icons/io';
import { Tooltip } from 'react-tooltip';

import AddRemoveBtn from '../AddRemoveBtn';
import PdfViewer from '../../documentViewer/PdfViewer';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const DocumentCard = ({
  cardItem,
  title,
  hideFavoriteIcon,
  hideDeleteIcon,
  isFolder,
  folderId,
  isCompletedDoc,
  isRejectedDoc,
  isReport,
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showPdfViewer, setShowPdfViewer] = useState(false);
  const [pdfUrl, setPdfUrl] = useState('');


  const [dataLoading, setDataLoading] = useState(false);
  const [docDataLoading, setDocDataLoading] = useState(false);
  const { userDetail } = useSelector((state) => state.auth);
  const [openPdfDrawer, setOpenPdfDrawer] = useState(false);

  const {
    favoriteItems,
    addToFavoritesState,
    removeFromFavoritesState,
    setIsNoPointerEvents,
  } = useAppContext();
  const { allDocuments } = useSelector((state) => state.document);
  const [documentLoading, setDocumentLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [pdfUrlLink, setPdfUrlLink] = useState('');
  const [contentHTML, setContentHTML] = useState([]);




  // console.log("cardItem", cardItem, isReport)

  const handleFavoritess = async (item, actionType) => {
    /*  const data = {
      id,
      type: "document",
    };
    dispatch(handleFavorites(data)); */
    // // console.log('the data to be bookmarked is ', item)
    if (actionType === 'add') {
      addToFavoritesState('documents', {
        ...item,
        favourited_by: userDetail?.userinfo?.username,
      });
      try {
        const data = {
          item: {
            _id: item._id,
            company_id: item.company_id,
            document_name: item.document_name,
            collection_id: item.collection_id
          },
          item_type: 'document',
          username: userDetail?.userinfo?.username,
        };
        const response = await (await addNewFavoriteForUser(data)).data;
        toast.success(response);
      } catch (error) {
        toast.info('Failed to add document to bookmarks');
        removeFromFavoritesState('documents', item._id);
      }
    }

    if (actionType === 'remove') {
      removeFromFavoritesState('documents', item._id);
      try {
        await (
          await deleteFavoriteForUser(
            item._id,
            'document',
            userDetail?.userinfo?.username
          )
        ).data;
        toast.success('Item removed from bookmarks');
      } catch (error) {
        toast.info('Failed to remove document from bookmarks');
        addToFavoritesState('documents', {
          ...item,
          favourited_by: userDetail?.userinfo?.username,
        });
      }
    }
  };

  const handleTrashDocument = async (cardItem) => {
    const copyOfAllDocuments = [...allDocuments];
    const foundDocumentIndex = copyOfAllDocuments.findIndex(
      (item) => item._id === cardItem._id
    );
    if (foundDocumentIndex === -1) return;

    const copyOfDocumentToUpdate = {
      ...copyOfAllDocuments[foundDocumentIndex],
    };
    copyOfDocumentToUpdate.data_type = 'Archive_Data';
    copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
    dispatch(setAllDocuments(copyOfAllDocuments));

    try {
      await removeFromFavoritesState('documents', cardItem._id);
      await deleteFavoriteForUser(
        cardItem._id,
        'document',
        userDetail?.userinfo?.username
      )
      const response = await (
        await moveItemToArchive(cardItem._id, 'document')
      ).data;
      toast.success(response);
    } catch (error) {
      copyOfDocumentToUpdate.data_type = 'Real_Data';
      copyOfAllDocuments[foundDocumentIndex] = copyOfDocumentToUpdate;
      dispatch(setAllDocuments(copyOfAllDocuments));
    }
  };

  const handleDetailDocumnet = async (item) => {
    // console.log("handle detail doc hit ", item)
    const documentServices = new DocumentServices();
    if (dataLoading) return;
    if (documentLoading)
      return toast.info('Please wait for this document to be refreshed first');
    if (item.type === 'sign-document') {
      setDataLoading(true);
      try {
        setIsNoPointerEvents(true);
        const dataToPost = {
          user_name: userDetail?.userinfo?.username,
          // process_id: item.process_id,
        };

        const response = await (
          await getVerifiedProcessLink(item.process_id, dataToPost)
        ).data;

        /*  dispatch(setEditorLink(response)); */

        // setDataLoading(false);
        console.log("response", response, item)
        window.open(response);
      } catch (error) {
        setDataLoading(false);
        // toast.info(
        //   error.response.status !== 500
        //     ? error.response
        //       ? error.response.data
        //       : error.message
        //     : 'Could not get notification link'
        // );
        if (error.response && error.response.status !== 500) {
          // Handle specific error responses
          setErrorMessage(error.response.data || error.message);
        } else {
          setErrorMessage('Cannot fetch this document at the moment, please try again later!');
        }
        setShowErrorModal(true);
      } finally {
        setIsNoPointerEvents(false);
      }
      return;
    };


    const data = {
      document_name: item.document_name,
      collection_id: item.collection_id,
      document_state: item.document_state
    };


    try {
      setDocDataLoading(true);
      setDataLoading(true);

      if (isCompletedDoc || isRejectedDoc) {
        const editorURL = await ((await documentServices.documentCloneReport(data.collection_id)).data);
        setDataLoading(false);
        setDocDataLoading(false);
        console.info(editorURL);
        openEditorInNewTab(editorURL, data.document_name, 'Document');
        return
      }

      const editorURL = await ((await documentServices.detailDocument(data)).data);
      console.info(editorURL);
      setDataLoading(false);
      setDocDataLoading(false);
      openEditorInNewTab(editorURL, data.document_name, 'Document');
    } catch (error) {
      setDataLoading(false);
      setDocDataLoading(false);
      toast.error('Something went wrong opening the document')
      console.error(error)
    }
    console.log("data", data)
  };

  const closeModal = () => {
    setShowErrorModal(false);
    setErrorMessage('');
  };

  const viewAsPDF = async (item) => {
    console.log("view as Preview")
    setPdfUrl('https://dowellfileuploader.uxlivinglab.online/view-pdf/Morvin%20Nov%20Inv<br>.pdf');
    // setPdfUrl(pdfUrl);
    setOpenPdfDrawer(!openPdfDrawer);
  };

  const viewAsPdfLink = async (url) => {
    console.log("view as Preview", url)
    // setPdfUrl('https://dowellfileuploader.uxlivinglab.online/view-pdf/Morvin%20Nov%20Inv<br>.pdf');
    // setPdfUrl(url);
    setOpenPdfDrawer(!openPdfDrawer);
    console.log("pdfUrl, openpdfDrawer", openPdfDrawer, pdfUrl)
  };

  const handleShowDocument = async (item) => {
    console.log("itemhandleMubeen", item)
    dispatch(SetSingleDocument(item));
    getDocumentDetail(item.collection_id)
    // navigate("/documents/document-detail");
  };

  function getDocumentDetail(document_id) {
    axios
      // .get(`https://100094.pythonanywhere.com/v2/documents/${document_id}/reports/`)
      .get(`https://100094.pythonanywhere.com/v2/documents/${document_id}/reports/`)
      .then((response) => {
        dispatch(SetShowDocumentReport(response.data));
        // setProcessDetailLoading(false);
        // dispatch(setDetailFetched(true));
        navigate("/documents/document-detail");
      })
      .catch((error) => {
        // console.log(error);
        toast.info("Failed to fetch Document details");
      });
  }

  const handleGoToEditor = async (link, item) => {
    if (!link) return;
    const token = extractTokenFromVerificationURL(link);
    if (!token) return;

    const dataToPost = {
      token: token,
      user_name: userDetail?.userinfo?.username,
      portfolio:
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.portfolio_name
          : userDetail?.portfolio_info[0]?.portfolio_name,
      city: userDetail?.userinfo?.city,
      country: userDetail?.userinfo?.country,
      continent: userDetail?.userinfo?.timezone?.split('/')[0],
      collection_id: item.collection_id
    };

    const sanitizedDataToPost = updateVerificationDataWithTimezone(dataToPost);

    // NEWER VERIFICATION LINKS
    if (link.includes('?') && link.includes('=')) {
      const shortenedLinkToExtractParamsFrom =
        new URL(link).origin + '/' + link.split('verify/')[1]?.split('/')[1];
      const paramsPassed = new URL(shortenedLinkToExtractParamsFrom)
        .searchParams;

      const auth_username = paramsPassed.get('username');
      const auth_portfolio = paramsPassed.get('portfolio');
      const auth_role = paramsPassed.get('auth_role');
      const user_type = paramsPassed.get('user_type');
      const org_name = paramsPassed.get('org');

      const currentUserPortfolioName =
        userDetail?.portfolio_info?.length > 1
          ? userDetail?.portfolio_info.find(
            (portfolio) => portfolio.product === productName
          )?.portfolio_name
          : userDetail?.portfolio_info[0]?.portfolio_name;

      if (
        auth_username !== userDetail?.userinfo?.username ||
        auth_portfolio !== currentUserPortfolioName
      ) {
        toast.info('You are not authorized to view this');
        return setDataLoading(false);
      }

      sanitizedDataToPost.auth_username = auth_username;
      sanitizedDataToPost.auth_portfolio = auth_portfolio;
      sanitizedDataToPost.auth_role = auth_role;
      sanitizedDataToPost.user_type = user_type;
      sanitizedDataToPost.org_name = org_name;

      delete sanitizedDataToPost.user_name;
      delete sanitizedDataToPost.portfolio;

      // return setDataLoading(false);
    }

    try {
      const response = await (
        await verifyProcessForUser(item.process_id, sanitizedDataToPost)
      ).data;
      setDataLoading(false);
      dispatch(setEditorLink(response));
    } catch (err) {
      // // console.log(err.response ? err.response.data : err.message);
      setDataLoading(false);
      toast.info(
        err.response
          ? err.response.status === 500
            ? 'Process verification failed'
            : err.response.data
          : 'Process verification failed'
      );
    }
  };

  const handleFetchNewDocumentDetail = async (documentId) => {
    // console.log("chkeinggggggggg")
    if (documentLoading) return;
    if (dataLoading)
      return toast.info('Please wait for this document to open first');

    const copyOfAllDocuments = [...allDocuments];
    const foundDocumentIndex = copyOfAllDocuments.findIndex(
      (item) => item._id === documentId
    );

    if (foundDocumentIndex === -1) return;

    setDocumentLoading(true);

    try {
      const documentService = new DocumentServices();
      const response = (await documentService.singleDocumentDetail(documentId))
        .data;

      copyOfAllDocuments[foundDocumentIndex] = response;
      dispatch(setAllDocuments(copyOfAllDocuments));

      setDocumentLoading(false);
    } catch (error) {
      // // console.log(error.response ? error.response.data : error.message);
      toast.info('Refresh for document failed');
      setDocumentLoading(false);
    }
  };

  const generatePdfLink = async (item) => {
    console.log("cardItem", item);
    const apiUrl = 'https://100058.pythonanywhere.com/api/generate-pdf-link/';
    const collectionId = item?.collection_id || "653b5ba638ec7dcbdb556a38";

    // First, try to retrieve the download URL from localStorage
    const storedData = localStorage.getItem(collectionId);
    if (storedData) {
      const storedJson = JSON.parse(storedData);
      console.log('Using cached PDF link:', storedJson.download_url);
      setPdfUrlLink(storedJson.download_url);
      viewAsPdfLink(storedJson.download_url);
      toast.info('PDF loaded from cache successfully');
      return; // Stop execution here as we already have the PDF link
    }

    const payload = {
      item_type: "document",
      item_id: item?.collection_id || "653b5ba638ec7dcbdb556a38",
      // item_id: "653b5ba638ec7dcbdb556a38",
    };

    console.log("generate pdf link", apiUrl, payload)
    await axios.post(apiUrl, payload)
      .then((response) => {
        // Handle the API response here
        console.log('Pdf generated successfully', response);
        setPdfUrlLink(response.data.download_url);
        localStorage.setItem(item?.collection_id, JSON.stringify({ download_url: response.data.download_url }));
        // Assuming response.data contains the PDF link
        viewAsPdfLink(pdfUrlLink)
        toast.info('Pdf generated successfully');
        // window.open(pdfLink, '_blank');
      })
      .catch((error) => {
        // Handle any errors
        console.error('facing issue generating Pdf', error);
        toast.error('Pdf is not generated');
      });
  };


  // const generatePDF = (jsonData) => {
  //   if (!jsonData) {
  //     console.error('No HTML content to generate PDF');
  //     return;
  //   }
  //   debugger
  //   console.log("jsonData", jsonData)
  //   // Convert JSON data into HTML content
  //   const htmlContent = jsonData[1]?.map(item => {
  //     if (item.id.includes('t')) {
  //       // For text input items
  //       return `<input>${item.data}</input>`;
  //     } else if (item.id.includes('i')) {
  //       // For image input items
  //       return `<img src="${item.data}" />`;
  //     } else if (item.id.includes('s')) {
  //       // For image data as base64
  //       return `<img src="${item.data}" />`;
  //     } else if (item.id.includes('dd')) {
  //       // For select list items
  //       return `<date>${item.data}</date>`;
  //     }
  //   }).join('');

  //   console.log("htmlContent", htmlContent)

  //   const pdf = new jsPDF('p', 'pt', 'a4');
  //   const pageHeight = pdf.internal.pageSize.getHeight();

  //   // Add HTML content to the PDF
  //   pdf.html(htmlContent, {
  //     callback: function (pdf) {
  //       // Save the PDF
  //       pdf.save('generated.pdf');
  //     },
  //     margin: [10, 10, 10, 10],
  //     autoPaging: 'text',
  //     x: 0,
  //     y: 0,
  //     width: 190, //target width in the PDF document
  //     windowWidth: 675 //window width in CSS pixels
  //   });
  // };

  // const generatePdfClick = async (item) => {
  //   const documentServices = new DocumentServices();
  //   const collection_id = item.collection_id;

  //   const contentOfDocument = await documentServices.contentDocument(collection_id, item);
  //   console.log("contentOfDocument in pdf", contentOfDocument.data[0]);
  //   const jsonData = contentOfDocument.data[0];

  //   // generatePdfContent("data")
  //   const url = 'https://ll04-finance-dowell.github.io/100058-DowellEditor-V2/?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJwcm9kdWN0X25hbWUiOiJXb3JrZmxvdyBBSSIsImRldGFpbHMiOnsiY2x1c3RlciI6IkRvY3VtZW50cyIsImRhdGFiYXNlIjoiRG9jdW1lbnRhdGlvbiIsImNvbGxlY3Rpb24iOiJUZW1wbGF0ZVJlcG9ydHMiLCJkb2N1bWVudCI6InRlbXBsYXRlcmVwb3J0cyIsInRlYW1fbWVtYmVyX0lEIjoiMjI2ODkwNDQ0MzMiLCJmdW5jdGlvbl9JRCI6IkFCQ0RFIiwiX2lkIjoiNjVlZjIzZTNmOWM2NDc4MzRmOTAwMDhkIiwiZmllbGQiOiJ0ZW1wbGF0ZV9uYW1lIiwidHlwZSI6InRlbXBsYXRlIiwibWV0YWRhdGFfaWQiOiI2NWVmMjNlNDIzNDY2YTY3ZTJlNGRmMjQiLCJhY3Rpb24iOiJ0ZW1wbGF0ZSIsImZsYWciOiJlZGl0aW5nIiwibmFtZSI6IlRlc3QgVGVtcGxhdGUiLCJ1c2VybmFtZSI6IiIsInBvcnRmb2xpbyI6IiIsImVtYWlsIjoiIiwidGltZSI6IjIwMjQtMDMtMTIgMTY6Mzc6MDYuOTQ5NjY1IiwiY29tbWFuZCI6InVwZGF0ZSIsInVwZGF0ZV9maWVsZCI6eyJ0ZW1wbGF0ZV9uYW1lIjoiIiwiY29udGVudCI6IiIsInBhZ2UiOiIiLCJlZGl0ZWRfYnkiOiIiLCJwb3J0Zm9saW8iOiIiLCJlZGl0ZWRfb24iOiIyMDI0LTAzLTEyIDE2OjM3OjA2Ljk0OTY4NCJ9fX0.2lNa0XP3ciL3uA7ZQpLXUKmPr-eUy55_MLHNYukFaeQ'
  //   generatePDF(jsonData);
  // };


  const handleSaveFile = async () => {
  }

  const FrontSide = () => {
    return (
      <div style={{ wordWrap: 'break-word', width: '100%' }}>
        {cardItem.newly_created && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '0',
              fontSize: '1.5rem',
              color: '#ff0000',
            }}
          >
            <MdOutlineFiberNew />
          </div>
        )}
        {cardItem.document_name
          ? cardItem.document_name
          : typeof cardItem.document_name === 'string' &&
            cardItem.document_name.length < 1
            ? ''
            : 'no item'}
      </div>
    );
  };

  const BackSide = () => {
    return (
      <div>
        {/* <div
            style={{
              cursor: 'pointer',
              position: 'absolute',
              left: '0',
              top: '0',
            }}
            onClick={() => generatePdfClick(cardItem)}
          >{<BsArrowBarRight />}</div> */}

        <Tooltip id={`generatePdf-${cardItem._id}`} content="generate pdf" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
        <div
          anchorId={cardItem._id}
          data-tooltip-id={`generatePdf-${cardItem._id}`}
          style={{
            cursor: 'pointer',
            position: 'absolute',
            left: '0',
            top: '0',
          }}
          onClick={() => generatePdfLink(cardItem)}
        >
          <BsArrowBarRight />
        </div>

        {!hideFavoriteIcon && (
          <>
            <Tooltip id={`faviorates-${cardItem._id}`} content="Add to Bookmark" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
            <div
              anchorId={cardItem._id}
              data-tooltip-id={`faviorates-${cardItem._id}`}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '0',
                top: '0',
              }}
              onClick={() =>
                handleFavoritess(
                  cardItem,
                  favoriteItems?.documents?.find(
                    (item) => item._id === cardItem._id
                  )
                    ? 'remove'
                    : 'add'
                )
              }
            >

              {favoriteItems?.documents?.find(
                (item) => item._id === cardItem._id
              ) ? (
                <BsFillBookmarkFill />
              ) : (
                <BsBookmark />
              )}
            </div>
          </>
        )}
        {cardItem._id ? (
          isReport ?
            <Button onClick={() => handleShowDocument(cardItem)}>
              {dataLoading ? (
                <LoadingSpinner />
              ) : (
                t('Show Report')
              )}
            </Button>
            : <> <Button onClick={() => handleDetailDocumnet(cardItem)}>
              {dataLoading ? (
                <LoadingSpinner />
              ) : cardItem.type === 'sign-document' ? (
                'Sign Here'
              ) : (
                t('Open Document')
              )}
            </Button>
              <br />
              <Button onClick={() => generatePdfLink(cardItem)}>
                {/* <Button onClick={() => viewAsPDF(cardItem)}> */}
                {dataLoading && !docDataLoading ? (
                  <LoadingSpinner />
                ) : cardItem.type === 'sign-document' ? (
                  'Sign Here'
                ) : (
                  t('Preview Document')
                )}
              </Button>
            </>
        ) : (
          'no item'
        )}
        {!hideDeleteIcon && (
          <>
            <Tooltip id={`delete-${cardItem._id}`} content="Delete Document" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
            <div
              anchorId={cardItem._id}
              data-tooltip-id={`delete-${cardItem._id}`}
              style={{
                cursor: 'pointer',
                position: 'absolute',
                right: '0',
                bottom: '0',
              }}
              onClick={() => handleTrashDocument(cardItem)}
            >
              <RiDeleteBin6Line color='red' />
            </div>
          </>
        )}
        {cardItem.newly_created && (
          <div
            style={{
              position: 'absolute',
              left: '10px',
              top: '0',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <div
              id={cardItem._id}
              style={{
                color: '#ff0000',
                fontSize: '1.5rem',
              }}
            >
              <MdOutlineFiberNew />
              <Tooltip
                anchorId={cardItem._id}
                content={
                  'This is a new document. Refresh right here to see its actual title'
                }
                style={{
                  fontStyle: 'normal',
                  fontSize: '0.7rem',
                  width: '8rem',
                  wordWrap: 'break-word',
                }}
              />
            </div>
            <div
              style={{
                fontSize: '0.7rem',
                cursor: 'pointer',
              }}
              onClick={() => handleFetchNewDocumentDetail(cardItem._id)}
            >
              {!documentLoading ? (
                <IoIosRefresh />
              ) : (
                <LoadingSpinner
                  color={'#000'}
                  width={'0.7rem'}
                  height={'0.7rem'}
                />
              )}
            </div>
          </div>
        )}

        <Tooltip id={`add-${cardItem._id}`} content="Add doc to folder" direction="up" arrowSize={10} style={{ backgroundColor: 'rgb(97, 206, 112)', color: 'white' }}></Tooltip>
        <div
          anchorId={cardItem._id}
          data-tooltip-id={`add-${cardItem._id}`}
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <AddRemoveBtn type={'add'} item={{ ...cardItem, type: 'document' }} />
          {isFolder && (
            <AddRemoveBtn type={'remove'} item={cardItem} folderId={folderId} />
          )}
        </div>
        {pdfUrl && <PdfViewer
          open={openPdfDrawer}
          onClose={() => setOpenPdfDrawer(false)}
          pdfUrl={pdfUrl}
          onSave={handleSaveFile}
        />}
        {pdfUrlLink && <PdfViewer
          open={openPdfDrawer}
          onClose={() => setOpenPdfDrawer(false)}
          pdfUrl={pdfUrlLink}
          onSave={handleSaveFile}
        />}
        {/* Render PdfViewer only if showPdfViewer is true */}

        {showErrorModal && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={closeModal}>&times;</span>
              <p>{errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    );
  };
  return (
    <>
      <HoverCard
        Front={FrontSide}
        Back={BackSide}
        loading={documentLoading ? documentLoading : dataLoading}
        id={cardItem._id}
      />
    </>
  );
};

export default DocumentCard;
