import { httpTemplate } from "../httpCommon/httpCommon";

export class TemplateServices {
  createTemplate = (data) => {
    return httpTemplate.post("/", data);
  };

  mineTemplates = (data) => {
    return httpTemplate.post("mine/", data);
  };
}
