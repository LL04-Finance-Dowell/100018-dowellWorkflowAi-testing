import { httpApiUrl } from "../httpCommon/httpCommon";

export class AppServices {
  getItemsCounts = (data) => {
    return httpApiUrl.post("object_count/", data);
  };
}
