import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { toast } from 'react-toastify';


export default function AddMemberModal(props) {
  const { userDetail } = useSelector((state) => state.auth);
  const { ProcessDetail } = useSelector((state) => state.processes);
  const [selectedRows, setSelectedRows] = useState([]);
  const [showAllTeamMembers, setShowAllTeamMember] = useState(false);
  const [showAllPublicMembers, setShowAllPublicMember] = useState(false);
  const [showAllUserMembers, setShowAllUserMember] = useState(false);

  const [allTeamMembers, setAllTeamMembers] = useState(userDetail?.members?.team_member);
  const [allPublicMembers, setAllPublicMembers] = useState(userDetail?.public_members);
  const [allUserMembers, setAllUserMembers] = useState(userDetail?.members?.user_member);
  const [assignPortfolio, setAssignPortfolio] = useState(null);
  const [assignPublicPortfolio, setAssignPublicPortfolio] = useState(null);
  const [assignUserPortfolio, setAssignUserPortfolio] = useState(null);



  // console.log("userDetail", userDetail, ProcessDetail, props.step)

  // Step 3: Handle Selection
  const handleSelectRow = (email) => {
    const updatedSelectedRows = selectedRows.includes(email)
      ? selectedRows.filter((selectedEmail) => selectedEmail !== email)
      : [...selectedRows, email];

    setSelectedRows(updatedSelectedRows);
    // console.log("updatedSelectedRows", updatedSelectedRows)
  };

  const handleTeamSubmit = (e) => {
    e.preventDefault();

    const apiUrl = `https://100094.pythonanywhere.com/v2/processes/${ProcessDetail._id}/portfolio/`;
    // const apiUrl = `https://100094.pythonanywhere.com/v2/processes/657c60838fc5bccaf9f1f476/portfolio/`;

    const payload = [{
      step: props.step.stepNumber || 1,
      user_type: 'team',
      member: selectedRows[0]?.name || 'Teste',
      portfolio: selectedRows[0]?.portfolio_name || 'Portfolio',
    }];

    // console.log('payload', payload)

    // Making a POST request with Axios
    axios.post(apiUrl, payload)
      .then((response) => {
        // Handle the API response here
        // console.log('API Response:', response.data);
        setAssignPortfolio(response.data)
        toast.success("Member added in portfolio")
      })
      .catch((error) => {
        // Handle any errors here
        console.error('API Error:', error);
      });
  };

  const handlePubicSubmit = (e) => {
    e.preventDefault();

    const apiUrl = `https://100094.pythonanywhere.com/v2/processes/${ProcessDetail._id}/portfolio/`;

    const payload = {
      step: props.step.stepNumber || 1,
      user_type: 'public',
      member: selectedRows[0]?.name || 'Teste',
      portfolio: selectedRows[0]?.portfolio_name || 'Portfolio',
    };

    // console.log('payload', payload)

    // Making a POST request with Axios
    axios.post(apiUrl, payload)
      .then((response) => {
        // Handle the API response here
        // console.log('API Response:', response.data);
        setAssignPublicPortfolio(response.data)
        toast.success("Member Added in Portfolio")
      })
      .catch((error) => {
        // Handle any errors here
        console.error('API Error:', error);
      });
  };

  const handleUserSubmit = (e) => {
    e.preventDefault();

    const apiUrl = `https://100094.pythonanywhere.com/v2/processes/${ProcessDetail._id}/portfolio/`;

    const payload = {
      step: props.step.stepNumber || 1,
      user_type: 'user',
      member: selectedRows[0]?.name || 'Teste',
      portfolio: selectedRows[0]?.portfolio_name || 'Portfolio',
    };

    // console.log('payload', payload)

    // Making a POST request with Axios
    axios.post(apiUrl, payload)
      .then((response) => {
        // Handle the API response here
        // console.log('API Response:', response.data);
        setAssignUserPortfolio(response.data)
        toast.success("Member Added in Portfolio")
      })
      .catch((error) => {
        // Handle any errors here
        console.error('API Error:', error);
      });
  };

  return (
    <Modal
      {...props}
      size="md"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>
          Add members
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          <div className="d-grid gap-2">
            <Button variant='success' onClick={() => setShowAllTeamMember(!showAllTeamMembers)}>Show All Team Members</Button>
          </div>
          {showAllTeamMembers && (
            <form onSubmit={handleTeamSubmit}>
              {allTeamMembers && allTeamMembers.map((row, index) => (
                <div key={`${row.name}-${index}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      // checked={selectedRows.includes(`${row.name}-${index}`)}
                      onChange={() => handleSelectRow(row)}
                    />
                    {row.name} - {row.first_name} {row.last_name}
                  </label>
                </div>
              ))}
              <Button variant="outline-success" type="submit">Submit</Button> 
            </form>
          )}<br /><br />
          <div className="d-grid gap-2">
            <Button variant='success' onClick={() => setShowAllPublicMember(!showAllPublicMembers)}>Show All Public Members</Button>
          </div>
          {showAllPublicMembers && (
            <form onSubmit={handlePubicSubmit}>
              {allPublicMembers ? allPublicMembers.map((row, index) => (
                <div key={`${row.name}-${index}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                    />
                    {row.name} - {row.first_name} {row.last_name}
                  </label>
                </div>
              )) : <div>No Public Member</div>}
              {allPublicMembers ? '' : <Button variant="outline-success" type="submit">Submit</Button>}
            </form>
          )}
          <br /><br />
          <div className="d-grid gap-2">
            <Button variant='success' onClick={() => setShowAllUserMember(!showAllUserMembers)}>Show All User Members</Button>
          </div>
          {showAllUserMembers && (
            <form onSubmit={handleUserSubmit}>
              {allUserMembers && allUserMembers.map((row, index) => (
                <div key={`${row.name}-${index}`}>
                  <label>
                    <input
                      type="checkbox"
                      checked={selectedRows.includes(row)}
                      onChange={() => handleSelectRow(row)}
                    />
                    {row.name} - {row.first_name} {row.last_name}
                  </label>
                </div>
              ))}
              <Button variant="outline-success" type="submit">Submit</Button>
            </form>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        {/* <Button onClick={props.onHide}>Close</Button> */}
      </Modal.Footer>
    </Modal>
  );
}
