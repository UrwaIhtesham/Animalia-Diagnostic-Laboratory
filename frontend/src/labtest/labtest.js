import React, { useState, useEffect } from 'react';
import './labtest.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import Loading from '../Components/Loading/Loading';

function Labtest() {
  const [tests, setTests] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const email = localStorage.getItem('userEmail');

  const isMobile = useMediaQuery({query: '(max-width:425px)'});
  const isTablet = useMediaQuery({query: '(max-width: 768px)'});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    
    const fetchTests =async() => {
      const token = localStorage.getItem('token');
      try {
        setLoading(true);
        console.log(email);
        const response = await axios.get('http://localhost:5000/alltests', {
          headers: {
            'Authentication': `Bearer ${token}`
          }
        });
        const fetchedTests = response.data;
        console.log("Fetched tests:", fetchedTests);
        setTests(fetchedTests);

        const animalTypes = [...new Set(Object.values(fetchedTests).flat().map(test => test.animal))];
        setAnimals(animalTypes);
        setSelectedAnimal(animalTypes[0]);
        console.log(animalTypes);
      } catch (error) {
        console.error('Error fetching tests:', error);
      } finally{
        setLoading(false);
      }
    };

    fetchTests();
  }, []);

  useEffect(() => {
    console.log('Selected:', selectedAnimal);
  }, [selectedAnimal]);

  useEffect(()=>{
    console.log("animal state updated:", animals);
  }, [animals]);

  const handleAnimalChange = (event) => {
    console.log('Selected animal: ', event.target.value);
    setSelectedAnimal(event.target.value);
    // setSelectedTests([]);
    
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

  const filteredTests = tests.filter((test) =>{
      const matchAnimal = selectedAnimal? test.animal === selectedAnimal:true;
      const matchSearchTerm = searchTerm ? test['test name'].toLowerCase().includes(searchTerm):true;
      return matchAnimal && matchSearchTerm;
  });

  const totalAmount = selectedTests.reduce((total, testId) => {
    // const test = tests[selectedAnimal].find((test) => test.id === testId);
    // const test = Object.values(tests).flat().find((test) => test.id === testId);
    // return total + test.price;
    const test = tests.find((test) => test['test id'] === testId);
    return total + (test?test.Fee:0);
  }, 0);

  const closeModal = () => {
    setIsModalOpen(false);
    navigate('/home');
  };

  const handlePayment = async()=> {
    

    const allTests = tests;

    console.log("Tests Object:", tests);
    console.log("Selected Test IDs:", selectedTests);
    localStorage.getItem('token');
    console.log('token');
    const bookingDetails = {
      email,
      selectedtests: selectedTests.map((testId) => {
        const test = allTests.find((test) => test['test id'] === testId);
        return {
          id: testId,
          name: test ? test['test name'] : 'Unknown Test',  // Check if test is defined
          price: test ? test.Fee : 0,  // Check if test is defined
        };
      }),
    };

    console.log(bookingDetails);
    const token = localStorage.getItem('token');
    try {
      setLoading(true);
      await axios.post('http://localhost:5000/book_labtest', bookingDetails, {
        headers: {
          'Authentication': `Bearer ${token}`
        }
      });
      // alert(`proceeding to payment of Rs.${totalAmount}`);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error booking lab tests:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`labtest ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
    {loading && <Loading/>}
    <div className="tests-selection-container">
      <div className='headingg'>
      <h1 >Select Diagnostic Tests</h1></div>
      <div className="filters-container">
          <div className="search-bar-container">
            <FontAwesomeIcon icon={faSearch} size="2x" className="search-icon" />
            <input
              type="text"
              placeholder="Search by test name"
              className='he'
              value={searchTerm}
              onChange={handleSearchChange}
            />
            <button className='search-bar-container-button'>Search</button>
          </div>
          <div className="dropdown-container">
            {/* <label htmlFor="animal-select">Filter by animal:</label> */}
            <select
              id="animal-select"
              value={selectedAnimal}
              onChange={handleAnimalChange}
            >
              <option value="">Filter by animal</option>
              {/* {animals.map(animal => (
                <option key={animal} value={animal}>{animal}</option>
              ))} */}
              {animals.map((animal, index) => (
                <option key={index} value={animal}>{animal}</option>
              ))}
            </select>
          </div>
        </div>
        <div className='table-container'>
      <table>
        <thead className='table-headder'>
          <tr>
            <th style={{ width: '10%' }}>Test ID</th>
            <th style={{ width: '70%' }}>Test Name</th>
            <th style={{ width: '10%' }}>Test Price</th>
            <th style={{ width: '1 0%' }}>Select</th>
          </tr>
        </thead>
        <tbody className='table-body'>
          {filteredTests.map((test) => (
            <tr key={test['test id']}>
              <td style={{ width: '10%' }}>{test['test id']}</td>
              <td style={{ width: '70%' }}>{test['test name']}</td>
              <td style={{ width: '10%' }}>Rs.{test.Fee}</td>
              <td style={{ width: '10%' }}>
                <input
                  type="checkbox"
                  value={test['test id']}
                  onChange={() => handleTestChange(test['test id'])}
                  checked={selectedTests.includes(test['test id'])}
                  className='chk-box'
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
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
            <FontAwesomeIcon icon={faThumbsUp} size="3x" className="icon-red bounce" />
            <p>Your payment of Rs.{totalAmount} is being processed.</p>
            <button onClick={closeModal}>Close</button>
          </div>

      </Modal>

    </div>
  );
}

export default Labtest;
