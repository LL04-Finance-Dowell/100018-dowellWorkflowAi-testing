import { AiOutlineConsoleSql } from 'react-icons/ai';
import { httpApiUrl, httpDocument } from '../httpCommon/httpCommon';

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post('/', data);
  };

  detailDocument = (documentId) => {
    return httpDocument.get(`/${documentId}/`);
  };

  signDocument = (data) => {
    return httpDocument.post('/to-sign/', data);
  };

  mineDocuments = (data) => {
    return httpDocument.post('/mine/', data);
  };

  rejectedDocuments = (data) => {
    return httpDocument.post('/rejected/', data);
  };

  // ? This is the formal function for savedDocuments. I don't know its usage, that's why I'm not earsing it
  // savedDocuments = (data) => {
  //   return httpDocument.post('/saved/', data);
  // };

  getSavedDocuments = (companyId, dataType, pageCount) =>
    httpApiUrl.get(
      `/companies/${companyId}/documents/?data_type=${dataType}&page=${pageCount}`
    );

  contentDocument = (documentId) => {
    // console.log(documentId)
    return httpDocument.get(`/${documentId}/content/`);
  };

  allDocuments = (companyId, dataType) => {
    return httpApiUrl.get(
      `/companies/${companyId}/documents/?data_type=${dataType}`
    );
  };

  demoDocuments = (pageCount) =>
    httpApiUrl.get(
      `companies/6385c0f38eca0fb652c9457e/documents/knowledge-centre/?data_type=Real_Data&page=${pageCount}`
    );
  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre

  singleDocumentDetail = async (documentId) => {
    return await httpDocument.get(`/${documentId}/object/`);
  };

  getNotifications = async (companyId, dataType, userName, portfolioName) => {
    return await httpApiUrl.get(
      `/companies/${companyId}/documents/reports/?data_type=${dataType}&doc_state=processing&member=${userName}&portfolio=${portfolioName}`
    );
  };

  getAllOriginalDocuments = async (companyId, dataType) => {
    return await httpApiUrl.get(
      `/companies/${companyId}/documents/types/?data_type=${dataType}&doc_type=original`
    );
  };

  getDocumentReports = (companyId, dataType, userName, portfolioName) =>
    httpApiUrl.get(
      `/companies/${companyId}/documents/reports/?data_type=${dataType}&doc_state=draft&member=${userName}&portfolio=${portfolioName}`
    );
}
