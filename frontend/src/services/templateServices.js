import { httpApiUrl, httpApiUrlV2, httpTemplate } from '../httpCommon/httpCommon';

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post('/', data);
  };

  detailTemplate = (collection_id) => {
    return httpTemplate.get(`/${collection_id}/link/`);
    // return httpTemplate.get('https://100094.pythonanywhere.com/v2/templates/65cdf4074db13cf4ccdbe023/link/');
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
    return httpTemplate.get(`/metadata/${companyId}/organisations/?data_type=${dataType}&document_state=draft&item_type=template`, data)
    // return httpTemplate.post('/saved/', data);
  };

  allTemplates = (companyId, dataType) => {
    return httpApiUrlV2.get(
      `/metadata/${companyId}/organisations/?data_type=${dataType}&item_type=template`  
    );
  };

  // * The company id for demoTemplates is hard coded to that of Dowell Knowledge Centre
  demoTemplates = (count) =>  
   httpApiUrlV2.get(
      `companies/6385c0f38eca0fb652c9457e/templates/knowledge-centre/?data_type=Real_Data&page=${count}`
    );

  singleTemplateDetail = async (templateId) => {
    return await httpTemplate.get(`/${templateId}/`);
  };

  getTemplateReports = (companyId, dataType, member, portfolioName) => {
    httpApiUrlV2.get(
      `/templates/${companyId}/organisations/?data_type=${dataType}&template_state=draft&member=${member}&portfolio=${portfolioName}`
      // https://100094.pythonanywhere.com/v2/templates/6390b313d77dc467630713f2/organisations/?template_state=draft&data_type=Real_Data
    );
  }

  contentTemplate = async (data) => {
    return await httpTemplate.get(`/${data}/content/`);
  };
}
