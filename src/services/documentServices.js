import { AiOutlineConsoleSql } from 'react-icons/ai';
import { httpApiUrl, httpApiUrlV2, httpDocument, httpDocumentStep } from '../httpCommon/httpCommon';

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post('documents/', data);
  };

  detailDocument = (data) => {
   
    if (data.document_state == "processing") {

      return httpDocument.get(`/clones/${data.collection_id}/`);
    }
    if (data.document_state == "draft") {
      return httpDocument.get(`documents/${data.collection_id}/link/?document_type=document`);
      // return httpDocument.get(`documents/65ccd4479910da1dbad86d63/link/?document_type=document`);
    }

    return httpDocument.get(`documents/${data.collection_id}/link/?document_type=document`);
    // return httpDocument.get(`/${data.collection_id}/`);
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

  savedDocuments = (companyId, dataType, data, member, documentType, pageCount) =>
    // httpApiUrlV2.post(`/metadata/${companyId}/organisations/?data_type=${dataType}`, data); 
    httpApiUrlV2.post(`/metadata/${companyId}/organisations/?data_type=${dataType}&item_type=document&document_state=draft`, data); 

  getDraftDocuments = (companyId, dataType, member, documentType, pageCount) =>
    httpApiUrlV2.get(`/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&member=${member}&item_type=document`); 

  contentDocument = (collection_id, item ) => {
    return httpDocument.get(`content/${collection_id}/?item_type=document`);
    // return httpDocument.get(`content/65ccd4479910da1dbad86d63/?item_type=document`);
    // return httpDocument.get(`/${collection_id}/content/?item_type=${item}`);
    // {{base_url}}/content/:item_id/?item_type
  };

  contentDocumentStep = (collection_id, item ) => {
    return httpDocumentStep.get(`/content/${collection_id}/?item_type=${item}`);
  };

  allDocuments = (companyId, dataType, member) => {
    return httpApiUrlV2.get(
      `metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&member=${member}&item_type=document`
      // `metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=document`
      // {{V2_URL}}metadata/6390b313d77dc467630713f2/organisations/?data_type=Real_Data&document_state=draft&member=couzy&item_type=document
    );
  };

  demoDocuments = (pageCount) =>
  httpApiUrlV2.get(
      `companies/6385c0f38eca0fb652c9457e/documents/knowledge-centre/?data_type=Real_Data&page=${pageCount}`
    );

  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre

  singleDocumentDetail = async (documentId, documentType) => {
    return await httpDocument.get(`documents/${documentId}/?document_type=document`);
  };

  singleDecumentLink = async (documentId) => {
    return await httpDocument.get (`documents/${documentId}/link/`)
  }

  getNotifications = async (companyId, dataType, member, portfolio, portfolioName, userName ) => {
    return await httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=processing&member=${member}&portfolio=${portfolio}&item_type=clone`
    );
  };

  getAllOriginalDocuments = async (companyId, dataType, member) => {
    return await httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=document` 
      // `/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&member=couzy&item_type=document` 
    );
  };

  getDocumentReports = (companyId, dataType, userName, member, portfolioName, state) =>
  httpApiUrlV2.get(
      `/documents/${companyId}/organisations/?data_type=${dataType}&member=${member}&portfolio=${portfolioName}`
      // `/documents/${companyId}/organisations/?data_type=${dataType}&member=couzy&portfolio=couzyTheGruopLead`
    );

  documentCloneReport = (documentId) => {
    return httpDocument.get(`/documents/${documentId}/link/?document_type=clone`);
    // {{base_url}}/documents/:document_id/?document_type
    // return httpDocument.get(`/document/${documentId}/organisations/data_type=${dataType}&member=couzy&porfolio=couzyTheGroupLead`);
  };

  getOrgDocumentReportsFinalized = (companyId, dataType, state, member) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=finalized&item_type=clone`)
  getOrgDocumentReports = (companyId, dataType, state, member) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=${state}&member=${member}&item_type=clone`)
  // getOrgDocumentReports = (companyId, dataType, state) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=${state}&item_type=document`)
  // {{V2_URL}}metadata/6390b313d77dc467630713f2/organisations/?data_type=Real_Data&document_state=rejected&member=couzy&item_type=clone
   
} 