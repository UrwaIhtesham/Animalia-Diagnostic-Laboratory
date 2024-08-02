import React, { useState, useEffect } from 'react';
import './labtest.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { useMediaQuery } from 'react-responsive';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// const tests = {
//   goat: [
//     { id: 1, name: 'General Herd Health Panel', price: 1000 },
//     { id: 2, name: 'Caprine Respiratory Serologic Panel', price: 2000 },
//     { id: 3, name: 'Brucellosis Testing', price: 1500 },
//     { id: 4, name: 'Caprine Abortion Serologic Panel', price: 1800 },
//   ],
//   cow: [
//     { id: 5, name: 'Mastitis Test', price: 2500 },
//     { id: 6, name: 'Brucellosis Test', price: 3000 },
//     { id: 7, name: 'Bovine Viral Diarrhea (BVD) Test', price: 2000 },
//     { id: 8, name: 'Bovine Tuberculosis (TB) Test', price: 2200 },
//   ],
//   dog: [
//     { id: 9, name: 'Complete Blood Count (CBC)', price: 500 },
//     { id: 10, name: 'Biochemistry Profile', price: 1000 },
//     { id: 11, name: 'Lyme Disease Test', price: 1500 },
//     { id: 12, name: 'Heartworm Test', price: 2000 },
//   ],
//   cat: [
//     { id: 13, name: 'Feline Heartworm Antigen Test', price: 1000 },
//     { id: 14, name: 'Feline Panleukopenia Virus (FPV) Test', price: 1200 },
//     { id: 15, name: 'Feline Immunodeficiency Virus (FIV) Test', price: 1400 },
//     { id: 16, name: 'Feline Leukemia Virus (FeLV) Test', price: 1600 },
//   ],
//   parrot: [
//     { id: 17, name: 'Parrot Blood Smear for Avian Leukosis', price: 800 },
//     { id: 18, name: 'Parrot Avian Polyomavirus Test', price: 1000 },
//     { id: 19, name: 'Parrot Fecal Test for Parasites', price: 1200 },
//     { id: 20, name: 'Parrot Viral DNA Test', price: 1400 },
//   ],
//   buffalo: [
//     { id: 21, name: 'Mastitis Test', price: 2500 },
//     { id: 22, name: 'Blood Parasitology Test', price: 2700 },
//     { id: 23, name: 'Tuberculosis Test (TB Test)', price: 3000 },
//     { id: 24, name: 'Brucellosis Test', price: 3200 },
//   ],
//   sheep: [
//     { id: 25, name: 'Ovine Progressive Pneumonia (OPP) Test', price: 900 },
//     { id: 26, name: 'Scrapie Test', price: 1100 },
//     { id: 27, name: 'Blood Test for Johne Disease', price: 1300 },
//     { id: 28, name: 'Fecal Egg Count (FEC)', price: 1500 },
//   ],
// };

function Labtest() {
  const [tests, setTests] = useState([]);
  const [animals, setAnimals] = useState([]);
  const [selectedTests, setSelectedTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState('');

  const location = useLocation();
  const email = location.state?.email;

  const isMobile = useMediaQuery({query: '(max-width:425px)'});
  const isTablet = useMediaQuery({query: '(max-width: 768px)'});

  useEffect(() => {
    // axios.get('http://localhost:5000/animals')
    // .then(response => {
    //   setAnimals(response.data);
    // })
    // .catch(error => console.error('Error fetching animals:', error));

    const fetchTests =async() => {
      try {
        console.log(email);
        const response = await axios.get('http://localhost:5000/alltests');
        const fetchedTests = response.data;
        console.log("Fetched tests:", fetchedTests);
        setTests(fetchedTests);

        const animalTypes = [...new Set(Object.values(fetchedTests).flat().map(test => test.animal))];
        setAnimals(animalTypes);
        setSelectedAnimal(animalTypes[0]);
        console.log(animalTypes);
      } catch (error) {
        console.error('Error fetching tests:', error);
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

  const handlePayment =async()=> {
    // const bookingDetails = {
    //   email, 
    //   selectedtests: selectedTests.map((testId) => ({
    //     id: testId,
    //     name: tests[selectedAnimal].find((test) => test.id === testId).name,
    //     price: tests[selectedAnimal].find((test)=> test.id === testId).price,
    //   })),
    // };

    const allTests = tests;

    console.log("Tests Object:", tests);
    console.log("Selected Test IDs:", selectedTests);

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

    try {
      await axios.post('http://ec2-44-204-83-159.compute-1.amazonaws.com:5000/book_labtest', bookingDetails);
      alert(`proceeding to payment of Rs.${totalAmount}`);
    } catch (error) {
      console.error('Error booking lab tests:', error);
    }
  };

  return (
    <div className={`labtest ${isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'}`}>
    <div className="tests-selection-container">
      <div className='headingg'>
      <h1 >Select Diagnostic Tests</h1></div>
      <div className="filters-container">
          <div className="search-bar-container">
            <FontAwesomeIcon icon={faSearch} size="2x" className="search-icon" />
            <input
              type="text"
              placeholder="Search by test name"
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
    </div>
  );
}

export default Labtest;
