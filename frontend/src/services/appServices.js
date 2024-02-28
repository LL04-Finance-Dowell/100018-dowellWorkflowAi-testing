import { httpApiUrl, httpApiUrlV2 } from "../httpCommon/httpCommon";

export class AppServices {
  getItemsCounts = (data) => {
    return httpApiUrlV2.post("object_count/", data);
  };
}
