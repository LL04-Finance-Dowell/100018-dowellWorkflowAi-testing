import { httpApiUrl, httpApiUrlV2 } from '../httpCommon/httpCommon';

export class FolderServices {
  createFolder = (data) => httpApiUrl.post('folders/', data);

  createFolderV2 = (data) => httpApiUrlV2.post('folders/', data);

  updateFolder = (data, id) => httpApiUrl.put(`folders/${id}`, data);

  getFolder = (folderId) => httpApiUrl.get(`folders/${folderId}`);

  getAllFolders = (companyId, dataType) =>
    httpApiUrl.get(`companies/${companyId}/folders/?data_type=${dataType}`);

  deleteFolder = (data) => httpApiUrl.post('archives/', data);

  removeFolderItem = (data, folderId, itemId) =>
    httpApiUrl.put(`folders/${folderId}/${itemId}`, data);
}
