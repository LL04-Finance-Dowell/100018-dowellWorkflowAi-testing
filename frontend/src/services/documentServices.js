import { httpDocument } from "../httpCommon/httpCommon";

export class DocumentServices {
  createDocument = (data) => {
    return httpDocument.post("/", data);
  };
}
