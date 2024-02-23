import { AiOutlineConsoleSql } from 'react-icons/ai';
import { httpApiUrl, httpApiUrlV2, httpDocument, httpDocumentStep } from '../httpCommon/httpCommon';

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post('documents/', data);
  };

  detailDocument = (data, collection_id) => {
   
    if (data.document_state == "processing") {
      return httpDocument.get(`/clones/${data.collection_id}/`);
    }

    if (data.document_state == "draft") {
      return httpDocument.get(`/documents/${data.collection_id}/link/?document_type=document`);
      // https://100094.pythonanywhere.com/v2/documents/65ceffee6898c7cd953dfd26/link/?document_type=document
    }

    return httpDocument.get(`/documents/${data.collection_id}/link/?document_type=document`);
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

  savedDocuments = (companyId, dataType, data) =>
    // httpApiUrlV2.post(`/metadata/${companyId}/organisations/?data_type=${dataType}`, data); 
    httpApiUrlV2.get(`/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=document`, data); 

  getDraftDocuments = (companyId, dataType, member, documentType, pageCount) =>
    httpApiUrlV2.get(`/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&member=${member}&item_type=document`); 

  contentDocument = (collection_id ) => {
    return httpDocument.get(`content/${collection_id}/?item_type=document`);
  };

  contentDocumentStep = (collection_id, item ) => {
    return httpDocumentStep.get(`/content/${collection_id}/?item_type=${item}`);
  };

  allDocuments = (companyId, dataType, member) => {
    return httpApiUrlV2.get(
      `metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=document`
    );
  };

  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre
  demoDocuments = (pageCount) =>
  httpApiUrlV2.get(
      `companies/6385c0f38eca0fb652c9457e/documents/knowledge-centre/?data_type=Real_Data&page=${pageCount}`
  );

  singleDocumentDetail = async (documentId, documentType) => {
    return await httpDocument.get(`documents/${documentId}/link/?document_type=document`);
  };

  singleDecumentLink = async (documentId) => {
    return await httpDocument.get (`documents/${documentId}/link/`)
  }

  getNotifications = async (companyId, dataType, member, portfolio) => {
    return await httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=processing&member=${member}&portfolio=${portfolio}&item_type=clone`
    );
  };

  getAllOriginalDocuments = async (companyId, dataType) => {
    return await httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=document` 
    );
  };

  getDocumentReports = (companyId, dataType, member, portfolioName) =>
  httpApiUrlV2.get(
      `/documents/${companyId}/organisations/?data_type=${dataType}&document_type=document&document_state=draft&member=${member}&portfolio=${portfolioName}`
      // https://100094.pythonanywhere.com/v2/documents/6390b313d77dc467630713f2/organisations/?document_type=document&document_state=draft&data_type=Real_Data
    );

  documentCloneReport = (documentId) => {
    return httpDocument.get(`/documents/${documentId}/link/?document_type=clone`);
  };

  getOrgDocumentReportsFinalized = (companyId, dataType, state, member) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=finalized&item_type=clone`)
  getOrgDocumentReports = (companyId, dataType, state, member) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=rejected&member=${member}&item_type=clone`)
} 