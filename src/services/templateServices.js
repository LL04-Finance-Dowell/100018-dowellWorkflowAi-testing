import { httpApiUrl, httpApiUrlV2, httpTemplate } from '../httpCommon/httpCommon';

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post('/', data);
  };

  detailTemplate = (collection_id) => {
    return httpTemplate.get(`/65cdf4074db13cf4ccdbe023/link/`);
    // return httpTemplate.get('https://100094.pythonanywhere.com/v2/templates/65cdf4074db13cf4ccdbe023/link/');
    // return httpTemplate.get(`/${collection_id}/`);
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

  savedTemplates = (companyId, dataType, member, data) => {
    return httpTemplate.post(`/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draf&member=couzy&item_type=template`, data)
    // {{V2_URL}}metadata/6390b313d77dc467630713f2/organisations/?data_type=Real_Data&document_state=draft&member=couzy&item_type=template;
    // return httpTemplate.post('/saved/', data);
  };

  allTemplates = (companyId, dataType) => {
    // return httpApiUrl.get(
    //   `/companies/${companyId}/templates/?data_type=${dataType}`
    // );
    return httpApiUrlV2.get(
      // `templates/${companyId}/?data_type=${dataType}`
      `/metadata/${companyId}/organisations/?data_type=${dataType}&item_type=template`  
      // {{base_url}}/templates/:company_id/?data_type // URL
    );
  };

  demoTemplates = (count) =>
  httpApiUrlV2.get(
      `companies/6385c0f38eca0fb652c9457e/templates/knowledge-centre/?data_type=Real_Data&page=${count}`
    );
  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre

  singleTemplateDetail = async (templateId) => {
    return await httpTemplate.get(`/${templateId}/`);
  };

  getTemplateReports = (companyId, dataType, templateState, member, portfolio) =>
  httpApiUrlV2.get(
      // {{base_url}}/templates/:company_id/?data_type&template_state&member&portfolio // URL
      `/templates/${companyId}/?data_type=${dataType}/organisations/&template_state&member=couzy&portfolio=couzyTheGroupLead`
      
// https://100094.pythonanywhere.com/v1/companies/6390b313d77dc467630713f2/templates/reports/metadata/?data_type=Real_Data&template_state=draft&portfolio=WorkflowOwner&member=owner
    );

    contentTemplate = async (data) => {
      return await httpTemplate.get(`/${data}/content/`);
    };
}
