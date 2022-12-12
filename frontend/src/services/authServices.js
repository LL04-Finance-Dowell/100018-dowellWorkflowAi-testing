import { httpAuth, httpAuthOther, httpLogout } from "../httpCommon/httpCommon";

export class AuthServices {
  getUserDetail = (data) => {
    return httpAuth.post("/userinfo/", data);
  };

  getUserDetailOther = (data) => {
    return httpAuthOther.post("/userinfo/", data);
  };

  getCurrentUser = (data) => {
    return httpAuth.post("/profile/", data);
  };
}
