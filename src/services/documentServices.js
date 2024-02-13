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

      return httpDocument.get(`documents/65c8fa5ebfb2bb5ce6aab13c/?document_type=document`);
      // return httpDocument.get(`documents/${data.collection_id}/?document_type=document`);
    }
    return httpDocument.get(`documents/65c8fa5ebfb2bb5ce6aab13c/?document_type=document`);
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

  getSavedDocuments = (companyId, dataType, documentType, pageCount) =>
    httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&item_type=document&document_state=draft`); 
    // https://100094.pythonanywhere.com/v2/metadata/6390b313d77dc467630713f2/organisations/?data_type=Real_Data&item_type=document&document_state=draft


  contentDocument = (collection_id, item ) => {
    return httpDocument.get(`/${collection_id}/content/?item_type=${item}`);
  };

  contentDocumentStep = (collection_id, item ) => {
    return httpDocumentStep.get(`/content/${collection_id}/?item_type=${item}`);
  };

  allDocuments = (companyId, dataType) => {
    return httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?item_type=document&data_type=${dataType}&Real_Data&document_state=draft`
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
      `/metadata/${companyId}/organisations/?data_type=${dataType}&item_type=document&document=draft`
    );
  };

  getAllOriginalDocuments = async (companyId, dataType) => {
    return await httpApiUrlV2.get(
      `/documents/${companyId}/organisations/?data_type=Real_Data&document_state=draft&document_type=document`  
    );
  };

  getDocumentReports = (companyId, dataType, userName, member, portfolioName, portfolio, state) =>
  httpApiUrlV2.get(
      `/documents/${companyId}/organisations/?data_type=${dataType}&member=${member}&portfolio=${portfolio}`
    );

  documentCloneReport = (documentId) => {
    return httpDocument.get(`/clones/${documentId}/`);
  };

  getOrgDocumentReports = (companyId, dataType, state) => httpApiUrlV2.get(`metadata/${companyId}/organisations/?data_type=${dataType}&document_state=${state}&item_type=document`)
}