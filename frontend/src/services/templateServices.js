import { httpTemplate } from "../httpCommon/httpCommon";

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post("/", data);
  };

  detailTemplate = (data) => {
    return httpTemplate.post("/detail/", data);
  };

  approvedTemplate = (data) => {
    return httpTemplate.post("/approved/", data);
  };

  approveTemplate = (data) => {
    return httpTemplate.post("/approve/", data);
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

  allTemplates = (data) => {
    return httpTemplate.post("/all/", data);
  };
}
