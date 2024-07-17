import React, { useState } from 'react';
import './TestsSelection.css';

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
    { id: 9, name: 'complete blood count (CBC)', price: 500 },
    { id: 10, name: 'biochemistry profile', price: 1000 },
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

function TestsSelection() {
  const [selectedTests, setSelectedTests] = useState([]);
  const [selectedAnimal, setSelectedAnimal] = useState('goat');

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

  const totalAmount = selectedTests.reduce((total, testId) => {
    const test = tests[selectedAnimal].find((test) => test.id === testId);
    return total + test.price;
  }, 0);

  return (
    <div className="tests-selection-container">
      <h1>Select Diagnostic Tests</h1>
      <label>
        Select Animal:
        <select value={selectedAnimal} onChange={handleAnimalChange}>
          <option value="goat">Goat</option>
          <option value="cow">Cow</option>
          <option value="dog">Dog</option>
          <option value="cat">Cat</option>
          <option value="parrot">Parrot</option>
          <option value="buffalo">Buffalo</option>
          <option value="sheep">Sheep</option>
        </select>
      </label>
      <ul>
        {tests[selectedAnimal].map((test) => (
          <li key={test.id}>
            <label>
              <input
                type="checkbox"
                value={test.id}
                onChange={() => handleTestChange(test.id)}
                checked={selectedTests.includes(test.id)}
              />
              {test.name} - Rs.{test.price}
            </label>
          </li>
        ))}
      </ul>
      <div className="total-amount">
        <h2>Total Amount: Rs.{totalAmount}</h2>
      </div>
      <button className="payment-button" onClick={() => alert(`Proceeding to payment of Rs.${totalAmount}`)}>
        Payment to Proceed
      </button>
    </div>
  );
}

export default TestsSelection;
