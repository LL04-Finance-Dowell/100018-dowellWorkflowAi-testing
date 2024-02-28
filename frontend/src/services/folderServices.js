import { httpApiUrl, httpApiUrlV2 } from '../httpCommon/httpCommon';

export class FolderServices {
  createFolderV2 = (data) => httpApiUrlV2.post('folders/', data);

  updateFolder = (data, id) => httpApiUrlV2.put(`folders/${id}/`, data);

  getFolder = (folderId) => httpApiUrlV2.get(`folders/${folderId}/`);

  getAllFolders = (companyId, dataType) =>  
    httpApiUrlV2.get(`folders/${companyId}/organisations/?data_type=${dataType}`)
  

  // deleteFolder = (folderId, data, itemId) => httpApiUrlV2.delete(`folders/${folderId}/?item_id=${itemId}&item_type=document`, data);   
  // {{base_url}}/folders/<str:folder_id>/?item_id="<id>"&item_type="document"
  deleteFolder = ( data) => httpApiUrlV2.post(`archives/`, data);  

  removeFolderItem = (data, folderId) =>
    httpApiUrlV2.put(`folders/${folderId}/`, data);  

  // removeFolderItem = (data, folderId, itemId) =>
  // httpApiUrlV2.put(`folders/:${folderId}/${itemId}`, data);  
}
