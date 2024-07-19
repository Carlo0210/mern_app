import React from 'react';
import './Model.css'; // Optional: for modal styling

const Modals = ({ isOpen, onClose, notes }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Provider Notes</h2>
                <button onClick={onClose}>Close</button>
                <table>
                    <thead>
                        <tr>
                            <th>Note</th>
                            <th>Created By</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map((note, index) => (
                            <tr key={index}>
                                <td>{note.text}</td>
                                <td>{note.createdBy}</td>
                                <td>{new Date(note.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Modals;
