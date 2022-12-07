import { httpDocument } from "../httpCommon/httpCommon";

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post("/", data);
  };

  detailDocument = (data) => {
    return httpDocument.post("/detail/", data);
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

  drafts = (data) => {
    return httpDocument.post("/drafts/", data);
  };
}
