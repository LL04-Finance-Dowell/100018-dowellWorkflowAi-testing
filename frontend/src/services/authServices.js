import { httpAuth, httpLogout } from "../httpCommon/httpCommon";

export class AuthServices {
  getUserDetail = (data) => {
    return httpAuth.post("/userinfo/", data);
  };
}
