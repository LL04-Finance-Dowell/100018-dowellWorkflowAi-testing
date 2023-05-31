import { httpAuth, httpAuthOther } from '../httpCommon/httpCommon';

export class AuthServices {
  getUserDetail = (data) => {
    return httpAuth.post('/userinfo/', data);
  };

  getUserDetailOther = (data) => {
    return httpAuthOther.post('/userinfo/', data);
  };

  getCurrentUser = (data) => {
    return httpAuth.post('/profile/', data);
  };

  getUserDetailAsync = async (data) => {
    return await httpAuth.post('/userinfo/', data);
  }

  getUserDetailOtherAsync = async (data) => {
    return await httpAuthOther.post('/userinfo/', data);
  }
}
