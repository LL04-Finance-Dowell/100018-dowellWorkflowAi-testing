import { httpApiUrl, httpTemplate } from '../httpCommon/httpCommon';

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post('/', data);
  };

  detailTemplate = (collection_id) => {
    return httpTemplate.get(`/${collection_id}/`);
  };

  approvedTemplate = (data) => {
    return httpTemplate.post('/approved/', data);
  };

  approveTemplate = (templateId) => {
    return httpTemplate.put(`/${templateId}/approval/`);
  };

  pendingTemplate = (data) => {
    return httpTemplate.post('/pending/', data);
  };

  mineTemplates = (data) => {
    return httpTemplate.post('/mine/', data);
  };

  savedTemplates = (data) => {
    return httpTemplate.post('/saved/', data);
  };

  allTemplates = (companyId, dataType) => {
    // return httpApiUrl.get(
    //   `/companies/${companyId}/templates/?data_type=${dataType}`
    // );
    return httpApiUrl.get(
      // `templates/${companyId}/?data_type=${dataType}`
      `/metadata/${companyId}/organisations/?data_type=${dataType}&item_type=template`  
      // {{base_url}}/templates/:company_id/?data_type // URL
    );
  };

  demoTemplates = (count) =>
    httpApiUrl.get(
      `companies/6385c0f38eca0fb652c9457e/templates/knowledge-centre/?data_type=Real_Data&page=${count}`
    );
  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre

  singleTemplateDetail = async (templateId) => {
    // return await httpTemplate.get(`/${templateId}/`);
    return await httpTemplate.get(`/${templateId}/object/`); // Old Version
    // {{base_url}}/templates/:template_id/ // URL
  };

  getTemplateReports = (companyId, dataType, templateState, member, portfolio, portfolioName, userName) =>
    httpApiUrl.get(
      // `${companyId}/?data_type=${dataType}&template_state=${templateState}&member=${member}portfolio=${portfolio}`
      // {{base_url}}/templates/:company_id/?data_type&template_state&member&portfolio // URL
      `/templates/${companyId}?data_type=${dataType}&template_state=&member=${member}&portfolio=${portfolioName}`
    );

    contentTemplate = async (data) => {
      return await httpTemplate.get(`/${data}/content/`);
    };
}
