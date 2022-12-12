import { httpAuth, httpAuthOther, httpLogout } from "../httpCommon/httpCommon";

export class AuthServices {
  getUserDetail = (data) => {
    return httpAuth.post("/userinfo/", data);
  };

  getUserDetailOther = (data) => {
    const config = {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
      },
    };

    return httpAuthOther.post("/userinfo/", data, config);
  };

  getCurrentUser = (data) => {
    return httpAuth.post("/profile/", data);
  };
}
