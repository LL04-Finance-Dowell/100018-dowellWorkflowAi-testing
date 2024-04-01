import { createAsyncThunk } from '@reduxjs/toolkit';
import { DocumentServices } from '../../services/documentServices';
import { setEditorLink, setShowProfileSpinner, setError } from '../app/appSlice';
import { productName } from '../../utils/helpers';
import { setAllDocuments } from './documentSlice';
import { toast } from 'react-toastify';

const filterDocuments = (documents, thunkAPI) => {
  let filteredDocuments = [];

  const userThunkPortfolioDataTypeState =
    thunkAPI.getState().auth?.userDetail?.portfolio_info?.length > 1
      ? thunkAPI
        .getState()
        .auth?.userDetail?.portfolio_info.find(
          (portfolio) => portfolio.product === productName
        )?.data_type
      : thunkAPI.getState().auth?.userDetail?.portfolio_info[0]?.data_type;

  if (documents && documents.length && documents?.length > 0) {
    filteredDocuments = documents.filter(
      (item) =>
        item.data_type && item.data_type === userThunkPortfolioDataTypeState
    );
  } else {
    filteredDocuments = [];
  }

  return filteredDocuments;
};

const documentServices = new DocumentServices();

export const createDocument = createAsyncThunk(
  'document/create',
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.createDocument(data);

      const newDocument = {
        document_name: 'New Document',
        newly_created: true,
        _id: res.data._id,
        created_by: thunkAPI.getState().auth?.userDetail?.userinfo?.username,
        data_type:
          thunkAPI.getState().auth?.userDetail?.portfolio_info?.length > 1
            ? thunkAPI
              .getState()
              .auth?.userDetail?.portfolio_info.find(
                (portfolio) => portfolio.product === productName
              )?.data_type
            : thunkAPI.getState().auth?.userDetail?.portfolio_info[0]
              ?.data_type,
        created_on: new Date().toString(),
        document_type: 'original',
        document_state: 'draft',
      };

      const existingDocuments = [...thunkAPI.getState().document?.allDocuments];
      existingDocuments.unshift(newDocument);
      thunkAPI.dispatch(setAllDocuments(existingDocuments));

      // thunkAPI.dispatch(setEditorLink(res.data.editor_link));

      return res.data;
    } catch (error) {
      console.log(error.response.data.message);
      toast.info('Document Creation Failed');
    }
  }
);

export const detailDocument = createAsyncThunk(
  'document/detail',
  async (data, thunkAPI) => {
    
    try {
      const res = await documentServices.detailDocument(data);
      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      // console.log(error);

      thunkAPI.dispatch(setError("Cannot fetch the data of this document, please try again later"));
      throw error;
    }
     
  }
);

export const signDocument = createAsyncThunk('document/sign', async (data) => {
  try {
    const res = await documentServices.signDocument(data);

    return res.data;
  } catch (error) {
    console.log(error);
  }
});

export const mineDocuments = createAsyncThunk(
  'document/mine',
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.mineDocuments(data);

      const documents = filterDocuments(res.data.documents, thunkAPI);

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);

export const rejectedDocuments = createAsyncThunk(
  'document/rejected',
  async (data) => {
    try {
      const res = await documentServices.rejectedDocuments(data);

      return res.data;
    } catch (error) {
      console.log(error);
    }
  }
);

export const savedDocuments = createAsyncThunk(
  'document/saved',
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.savedDocuments(data);

      const documents = filterDocuments(res.data, thunkAPI);

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);

export const contentDocument = createAsyncThunk(
  'document/contentDocument',
  async ({ collection_id, item }) => {
    try {
      // console.log(collection_id, item)
      const res = await documentServices.contentDocument(collection_id, item);

      // console.log(res.data)
      return res.data;
    } catch (error) {
      console.log('Content document fetch error: ', error);
    }
  }
);

export const contentDocumentStep = createAsyncThunk(
  'document/contentDocument',
  async ({ collection_id, item }) => {
    try {
      // console.log(collection_id, item)
      const res = await documentServices.contentDocumentStep(collection_id, item);

      // console.log(res.data)
      return res.data;
    } catch (error) {
      console.log('Content document fetch error: ', error);
    }
  }
);

export const allDocuments = createAsyncThunk(
  'document/all',
  async (data, thunkAPI) => {
    try {
      const res = await documentServices.allDocuments(
        data.company_id,
        data.data_type,
        data.member
      )

      const documents = filterDocuments(
        res.data.documents ?? []
          .reverse()
          .filter((document) => document.document_state !== 'trash'),
        thunkAPI
      );

      return documents;
    } catch (error) {
      console.log(error);
    }
  }
);

export const documentReport = createAsyncThunk(
  'document/report',
  async (data, thunkAPI) => {
    thunkAPI.dispatch(setShowProfileSpinner(true));
    try {
      const res = await documentServices.documentCloneReport(data);
      thunkAPI.dispatch(setShowProfileSpinner(false));
      thunkAPI.dispatch(setEditorLink(res.data));

      return res.data;
    } catch (error) {
      console.log(error);
      thunkAPI.dispatch(setShowProfileSpinner(false));
    }
  }
);
