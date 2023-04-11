import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';

function MyModal(props) {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [spec, setSpec] = useState('');
  const [details, setDetails] = useState('');
  const [universalCode, setUniversalCode] = useState('');
  const [editedProps, setEditedProps] = useState({});

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleCodeChange = (event) => {
    setCode(event.target.value);
  };

  const handleSpecChange = (event) => {
    setSpec(event.target.value);
  };

  const handleDetailsChange = (event) => {
    setDetails(event.target.value);
  };

  const handleUniversalCodeChange = (event) => {
    setUniversalCode(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    props.onHide();

    const team = {
      name: name.trim(),
      code: code.trim(),
      spec: spec.trim(),
      details: details.trim(),
      universalCode: universalCode.trim(),
    };

    // console.log(team);

    setName('');
    setCode('');
    setSpec('');
    setDetails('');
    setUniversalCode('');

    // !props.onSubmit(team) <-- That method's name changes the argument to 'event';
    props.handleAddTeam(team);
  };

  // *This filters handleAddTeam from props
  useEffect(() => {
    let newProps = {};

    for (let key in props) {
      if (key !== 'handleAddTeam') {
        newProps = { ...newProps, [key]: props[key] };
      }
    }

    setEditedProps(newProps);
  }, [props]);

  return (
    <Modal
      {...editedProps}
      size='lg'
      aria-labelledby='contained-modal-title-vcenter'
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Create Team</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId='name'>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type='text'
              required
              value={name}
              onChange={handleNameChange}
            />
          </Form.Group>

          <Form.Group controlId='code'>
            <Form.Label>Code</Form.Label>
            <Form.Control
              type='text'
              required
              value={code}
              onChange={handleCodeChange}
            />
          </Form.Group>

          <Form.Group controlId='spec'>
            <Form.Label>Spec</Form.Label>
            <Form.Control
              type='text'
              required
              value={spec}
              onChange={handleSpecChange}
            />
          </Form.Group>

          <Form.Group controlId='details'>
            <Form.Label>Details</Form.Label>
            <Form.Control
              type='text'
              required
              value={details}
              onChange={handleDetailsChange}
            />
          </Form.Group>

          <Form.Group
            controlId='universalCode'
            style={{ marginBottom: '10px' }}
          >
            <Form.Label>Universal Code</Form.Label>
            <Form.Control
              type='text'
              required
              value={universalCode}
              onChange={handleUniversalCodeChange}
            />
          </Form.Group>

          <Button type='submit'>Add</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default MyModal;
