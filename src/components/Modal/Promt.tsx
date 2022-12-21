import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import "./Promt.css";


interface Props {
    reset: () => void;
}

export default function Promt( {reset}: Props) {
  const [show, setShow] = useState(false);

    //i need to reset board here and I need to swap the size of the board
    const handleClose = () => {
        setShow(false);
    };

    const handleCloseReset = () => {
        setShow(false);
        reset();
        console.log("hi")
    };
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Start New Game!!!
      </Button>

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Welcome To Breakthrough</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Choose Your Color!!!
        </Modal.Body>
        <Modal.Footer id="footer">
            <Button variant="light" onClick={handleCloseReset} id="button" >
                White
            </Button>
            <Button variant="dark" onClick={handleCloseReset} >
                Black
            </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

