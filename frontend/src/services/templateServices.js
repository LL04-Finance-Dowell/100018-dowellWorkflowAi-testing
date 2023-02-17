import { httpTemplate } from "../httpCommon/httpCommon";

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post("/", data);
  };

  detailTemplate = (templateId) => {
    return httpTemplate.get(`/${templateId}/`);
  };

  approvedTemplate = (data) => {
    return httpTemplate.post("/approved/", data);
  };

  approveTemplate = (templateId) => {
    return httpTemplate.get(`/approve/${templateId}`);
  };

  pendingTemplate = (data) => {
    return httpTemplate.post("/pending/", data);
  };

  mineTemplates = (data) => {
    return httpTemplate.post("/mine/", data);
  };

  savedTemplates = (data) => {
    return httpTemplate.post("/saved/", data);
  };

  allTemplates = (companyId) => {
    return httpTemplate.get(`/org/${companyId}/`);
  };
}
