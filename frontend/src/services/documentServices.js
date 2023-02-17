import { httpDocument } from "../httpCommon/httpCommon";

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post("/", data);
  };

  detailDocument = (documentId) => {
    return httpDocument.get(`/${documentId}/`);
  };

  signDocument = (data) => {
    return httpDocument.post("/to-sign/", data);
  };

  mineDocuments = (data) => {
    return httpDocument.post("/mine/", data);
  };

  rejectedDocuments = (data) => {
    return httpDocument.post("/rejected/", data);
  };

  savedDocuments = (data) => {
    return httpDocument.post("/saved/", data);
  };

  contentDocument = (documentId) => {
    return httpDocument.get(`/content/${documentId}/`);
  };

  allDocuments = (companyId) => {
    return httpDocument.get(`/org/${companyId}/`);
  };
}
