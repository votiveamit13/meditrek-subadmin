import React from "react";
import { Modal } from "react-bootstrap";
import "./custommodal.css";

const CustomModal = ({
    show,
    onHide,
    title,
    children,
    onSubmit,
    submitText = "Save",
    cancelText = "Cancel",
    width = "500px"
}) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            className="custom-modal"
            dialogClassName="custom-modal-dialog"
        >
            <div style={{ maxWidth: width }}>
                <Modal.Header closeButton>
                    <Modal.Title>{title}</Modal.Title>
                </Modal.Header>

                <Modal.Body>{children}</Modal.Body>

                <Modal.Footer className="d-flex justify-content-end gap-2">
                    <button className="modal-btn cancel" onClick={onHide}>
                        {cancelText}
                    </button>

                    <button className="modal-btn primary" onClick={onSubmit}>
                        {submitText}
                    </button>
                </Modal.Footer>
            </div>
        </Modal>
    );
};

export default CustomModal;