import React from 'react'
import { useNavigate } from 'react-router-dom';
import './tabs.css'

const Tabs = () => {
    const navigate = useNavigate()
    const currentURL = window.location.href;
    const parts = currentURL.split('/'); 
    const whichApproval =  parts[parts.length - 1];
    console.log('the approval is ', whichApproval)

  return (
    <div className='tabsWrapper'>
        <div  className={whichApproval == 'new-set-workflow-document' ?'tabBtnWrapper' : 'tabBtnWrapperNo'}>
            <button className='tabBtn' disabled={whichApproval == 'new-set-workflow-document'} onClick={()=>navigate('/workflows/new-set-workflow-document')}>
                Document Approval
            </button>
        </div>
        <div className={whichApproval == 'new-set-workflow-template' ?'tabBtnWrapper' : 'tabBtnWrapperNo'}>
            <button className='tabBtn' disabled={whichApproval == 'new-set-workflow-template'} onClick={()=>navigate('/workflows/new-set-workflow-template')}>
                Template Approval
            </button>
        </div>
    </div>
  )
}

export default Tabs