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
      `/companies/${companyId}/templates/metadata/?data_type=${dataType}`
    );
  };

  demoTemplates = (count) =>
    httpApiUrl.get(
      `companies/6385c0f38eca0fb652c9457e/templates/knowledge-centre/?data_type=Real_Data&page=${count}`
    );
  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre

  singleTemplateDetail = async (templateId) => {
    return await httpTemplate.get(`/${templateId}/object/`);
  };

  getTemplateReports = (companyId, dataType, userName, portfolioName) =>
    httpApiUrl.get(
      `/companies/${companyId}/templates/reports/metadata/?data_type=${dataType}&template_state=draft&portfolio=${portfolioName}&member=${userName}`
    );

    contentTemplate = async (data) => {
      return await httpTemplate.get(`/${data}/content/`);
    };
}
