import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import Modal from 'react-modal';
import { useLocation } from 'react-router-dom';
import './labtest.css';

const tests = {
  goat: [
    { id: 1, name: 'General Herd Health Panel', price: 1000 },
    { id: 2, name: 'Caprine Respiratory Serologic Panel', price: 2000 },
    { id: 3, name: 'Brucellosis Testing', price: 1500 },
    { id: 4, name: 'Caprine Abortion Serologic Panel', price: 1800 },
  ],
  cow: [
    { id: 5, name: 'Mastitis Test', price: 2500 },
    { id: 6, name: 'Brucellosis Test', price: 3000 },
    { id: 7, name: 'Bovine Viral Diarrhea (BVD) Test', price: 2000 },
    { id: 8, name: 'Bovine Tuberculosis (TB) Test', price: 2200 },
  ],
  dog: [
    { id: 9, name: 'Complete Blood Count (CBC)', price: 500 },
    { id: 10, name: 'Biochemistry Profile', price: 1000 },
    { id: 11, name: 'Lyme Disease Test', price: 1500 },
    { id: 12, name: 'Heartworm Test', price: 2000 },
  ],
  cat: [
    { id: 13, name: 'Feline Heartworm Antigen Test', price: 1000 },
    { id: 14, name: 'Feline Panleukopenia Virus (FPV) Test', price: 1200 },
    { id: 15, name: 'Feline Immunodeficiency Virus (FIV) Test', price: 1400 },
    { id: 16, name: 'Feline Leukemia Virus (FeLV) Test', price: 1600 },
  ],
  parrot: [
    { id: 17, name: 'Parrot Blood Smear for Avian Leukosis', price: 800 },
    { id: 18, name: 'Parrot Avian Polyomavirus Test', price: 1000 },
    { id: 19, name: 'Parrot Fecal Test for Parasites', price: 1200 },
    { id: 20, name: 'Parrot Viral DNA Test', price: 1400 },
  ],
  buffalo: [
    { id: 21, name: 'Mastitis Test', price: 2500 },
    { id: 22, name: 'Blood Parasitology Test', price: 2700 },
    { id: 23, name: 'Tuberculosis Test (TB Test)', price: 3000 },
    { id: 24, name: 'Brucellosis Test', price: 3200 },
  ],
  sheep: [
    { id: 25, name: 'Ovine Progressive Pneumonia (OPP) Test', price: 900 },
    { id: 26, name: 'Scrapie Test', price: 1100 },
    { id: 27, name: 'Blood Test for Johne Disease', price: 1300 },
    { id: 28, name: 'Fecal Egg Count (FEC)', price: 1500 },
  ],
};

function Labtest() {
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('goat');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const location = useLocation();
  const email = location.state?.email;

  const isMobile = useMediaQuery({ query: '(max-width:425px)' });
  const isTablet = useMediaQuery({ query: '(max-width: 768px)' });

  const handleAnimalChange = (event) => {
    setSelectedAnimal(event.target.value);
    setSelectedTests([]);
  };

  const handleTestChange = (id) => {
    setSelectedTests((prevSelectedTests) => {
      if (prevSelectedTests.includes(id)) {
        return prevSelectedTests.filter((testId) => testId !== id);
      } else {
        return [...prevSelectedTests, id];
      }
    });
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value.toLowerCase());
  };

  const filteredTests = tests[selectedAnimal].filter((test) =>
    test.name.toLowerCase().includes(searchTerm)
  );

  const totalAmount = selectedTests.reduce((total, testId) => {
    const test = tests[selectedAnimal].find((test) => test.id === testId);
    return total + test.price;
  }, 0);

  const handlePayment = () => {
    // Simulate successful booking and open the modal
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className={`labtest ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
      <div className="tests-selection-container">
        <div className='headingg'>
          <h1>Select Diagnostic Tests</h1>
        </div>
        <div className="search-bar-container">
          <FontAwesomeIcon icon={faSearch} size="5x" className="search-icon" />
          <input
            type="text"
            placeholder="Search by animal"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <button>Search</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>Test ID</th>
              <th>Test Name</th>
              <th>Test Price</th>
              <th>Select</th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.map((test) => (
              <tr key={test.id}>
                <td>{test.id}</td>
                <td>{test.name}</td>
                <td>Rs.{test.price}</td>
                <td>
                  <input
                    type="checkbox"
                    value={test.id}
                    onChange={() => handleTestChange(test.id)}
                    checked={selectedTests.includes(test.id)}
                    className='chk-box'
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="total-amount">
          <h2 className='amount-txt'>Total Amount: Rs.{totalAmount}</h2>
        </div>
        <button className="payment-button" onClick={handlePayment}>
          Payment to Proceed
        </button>
      </div>

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Payment Confirmation"
        ariaHideApp={false}
        overlayClassName="modal-overlay"
      >
          <div className="modal-class">
            <h2>Payment Confirmation</h2>
            <FontAwesomeIcon icon={faThumbsUp} size="3x" />
            <p>Your payment of Rs.{totalAmount} is being processed.</p>
            <button onClick={closeModal}>Close</button>
          </div>

      </Modal>
    </div>
  );
}

export default Labtest;
