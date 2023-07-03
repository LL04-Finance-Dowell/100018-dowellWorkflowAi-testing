import { httpApiUrl } from '../httpCommon/httpCommon';

export class FolderServices {
  createFolder = (data) => httpApiUrl.post('folders/', data);

  updateFolder = (data, id) => httpApiUrl.put(`folders/${id}`, data);

  getFolder = (folderId) => httpApiUrl.get(`folders/${folderId}`);

  getAllFolders = (companyId) =>
    httpApiUrl.get(`companies/${companyId}/folders/`);

  deleteFolder = (data) => httpApiUrl.post('archives/', data);

  removeFolderItem = (data, folderId, itemId) =>
    httpApiUrl.put(`folders/${folderId}/${itemId}`, data);
}
