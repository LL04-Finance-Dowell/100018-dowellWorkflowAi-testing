import {   httpGroups } from '../httpCommon/httpCommon';

export class GroupServices {
  createGroups = (companyId, data) => {
    return httpGroups.post(`/${companyId}/organisations/`, data);
  };
  getAllGroups = async (companyId, dataType) => {
    return await httpGroups.get(
      `/${companyId}/organisations/?data_type=${dataType}`
 );
  };

}