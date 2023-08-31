import { AiOutlineConsoleSql } from 'react-icons/ai';
import { httpApiUrl, httpDocument } from '../httpCommon/httpCommon';

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post('/', data);
  };

  detailDocument = (data) => {
    console.log(data)
    if (data.document_state == "processing") {

      return httpDocument.get(`/clones/${data.collection_id}/`);
    }
    if (data.document_state == "draft") {

      return httpDocument.get(`/${data.collection_id}/`);
    }
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
    httpApiUrl.get(`/companies/${companyId}/documents/clones/metadata/?data_type=${dataType}&doc_state=processing`);
  // {{base_url}}/companies/6390b313d77dc467630713f2/documents/clones/metadata/?data_type=Real_Data&doc_state=finalized

  contentDocument = (collection_id) => {
    console.log(collection_id)
    return httpDocument.get(`/${collection_id}/content/`);
  };

  // allDocuments = (companyId, dataType) => {
  //   return httpApiUrl.get(
  //     `/companies/${companyId}/documents/?data_type=${dataType}`
  //   );
  // };

  allDocuments = (companyId, dataType) => {
    // return httpApiUrl.get(
    //   `/companies/${companyId}/documents/?data_type=${dataType}&document_type=original&document_state=draft`
    // );
    return httpApiUrl.get(
      `/companies/${companyId}/documents/metadata/?data_type=${dataType}&document_state=draft`
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
      `/companies/${companyId}/documents/reports/metadata/?data_type=${dataType}&doc_state=processing&member=${userName}&portfolio=${portfolioName}`
    );
  };

  getAllOriginalDocuments = async (companyId, dataType) => {
    return await httpApiUrl.get(
      // `/companies/${companyId}/documents/types/?data_type=${dataType}&doc_type=original`
      `/companies/${companyId}/documents/metadata/?data_type=${dataType}&document_state=draft`
    );
  };

  getDocumentReports = (companyId, dataType, userName, portfolioName, state) =>
    httpApiUrl.get(
      `/companies/${companyId}/documents/reports/metadata/?data_type=${dataType}&doc_state=${state}&portfolio=${portfolioName}&member=${userName}`

    );

  documentCloneReport = (documentId) => {
    return httpDocument.get(`/clones/${documentId}/`);
  };

  getOrgDocumentReports = (companyId, dataType, state) => httpApiUrl.get(`/companies/${companyId}/documents/clones/?data_type=${dataType}&doc_state=${state}`)
}
