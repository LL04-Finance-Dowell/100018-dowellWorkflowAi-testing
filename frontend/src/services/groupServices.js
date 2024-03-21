import {   httpGroups } from '../httpCommon/httpCommon';

export class GroupServices {
  createGroups = (companyId, data) => {
    return httpGroups.post(`/${companyId}/organisations/`, data);
  };
  updateGroups = (companyId, data) => {
    return httpGroups.put(`/${companyId}/organisations/?data_type=Real_Data`, data);
  };
  getAllGroups = async (companyId, dataType) => {
    return await httpGroups.get(
      `/${companyId}/organisations/?data_type=${dataType}`
 );
  };

}