import React from 'react'
import { useNavigate } from "react-router-dom";
import { AiOutlineClose } from 'react-icons/ai';
import { useDispatch, useSelector } from 'react-redux';
import { SetProcessDetail, setshowsProcessDetailPopup } from '../../../../features/processes/processesSlice';
import { setDetailFetched } from '../../../../features/app/appSlice';
export const ProcessDetailModail = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { ProcessDetail } = useSelector((state) => state.processes);
    

    function handleCloseDetailBtnClick() {
        dispatch(setshowsProcessDetailPopup(false));
    }
    return (
        <div style={{
            background: 'rgba(0, 0, 0, 0.12)',
            backdropFilter: 'blur(5px)',
            height: '100%',
            width: '100%',
            position: 'fixed',
            top: 0,
            left: 0,
            animation: 'fadeIn 0.2s ease-in-out',
            zIndex: 100002,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        }}>

            <div style={{
                backgroundColor: 'var(--white)',
                width: '73%',
                borderRadius: '10px',
                padding: '5% 2%',
                maxHeight: '30rem',
                position: 'relative'
            }}>

                <div
                    style={{
                        position: 'absolute',
                        top: '1%',
                        right: '2%',
                        cursor: 'pointer'
                    }}
                    onClick={() => {
                        dispatch(setshowsProcessDetailPopup(false));
                        dispatch(SetProcessDetail([]));
                        dispatch(setDetailFetched(false));
                    }}
                >

                    <AiOutlineClose />
                </div>
                <h5 style={{ textAlign: "center" }}>Process Detail</h5>
                <table>
                    <tbody>
                        <tr>
                            <td>Process Title</td>
                            <td>{ProcessDetail.process_title}</td>
                        </tr>
                        <tr>
                            <td >Document Name</td>
                            <td>{ProcessDetail.document_name}</td>
                        </tr>
                        <tr>
                            {ProcessDetail.stepRole && (
                                <>
                                    <td >Step Role</td>
                                    <td>{ProcessDetail.stepRole}</td>
                                </>
                            )}
                        </tr>
                        <tr>
                            {ProcessDetail.stepName && (
                                <>
                                    <td>Step Name</td>
                                    <td>{ProcessDetail.stepName}</td>
                                </>
                            )}
                        </tr>
                        <tr>
                            {ProcessDetail.processing_state && (
                                <>
                                    <td>Processing State</td>
                                    <td
                                        style={{
                                            color: ProcessDetail.processing_state === 'processing' ? 'red' : 'inherit'
                                        }}
                                    >
                                        {ProcessDetail.processing_state === 'processing' ? 'Processing...' : 'Finalized'}
                                    </td>

                                </>
                            )}
                        </tr>
                    </tbody>
                </table>
                <div
                    style={{ textAlign: "center", marginTop: "30px", backgroundColor: "black", color: "white", cursor: "pointer" }}
                    onClick={() => {
                        navigate('/processes/processdetail');
                        dispatch(setshowsProcessDetailPopup(false));
                    }}
                >Show All Detail</div>
            </div>
        </div>
    );
}

