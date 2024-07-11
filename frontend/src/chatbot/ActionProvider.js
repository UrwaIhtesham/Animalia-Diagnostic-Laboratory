import React from 'react';
import SymptomsDropdown from './SymptomsDropdown';
import axios from 'axios';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.symptomsByAnimalType = {};
    this.maxSymptoms = 4;
    this.selectedSymptoms = [];

    this.state = {
      currentAnimalType: null
    };
  }

  loadDiseaseMapping = (animalType) => {
    let mappingFileName = '';

    //Adding filename to variable mappingFileName according to the animalType
    switch (animalType){
      case 'dog':
      case 'cat':
      case 'parrot':
        mappingFileName = 'pets_disease.txt';
        break;
      case 'cow':
      case 'sheep':
      case 'buffalo':
      case 'goat':
        mappingFileName = 'livestock_disease.txt';
        break;
      case 'chicken':
        mappingFileName = 'poultry_disease.txt';
        break;
      default:
        console.error('Unknown animal type: ', animalType);
        return;
    }

    const mappingUrl = `${process.env.PUBLIC_URL}/diseases/${mappingFileName}`; // URL to the txt file in the public directory
    fetch(mappingUrl)
      .then(response => response.text())
      .then(text => {
        this.diseaseMapping = this.parseMapping(text);
        //console.log('Loaded disease mapping:', this.diseaseMapping);
      })
      .catch(error => {
        console.error('Error loading disease mapping:', error);
      });
  };
  

  handleSymptoms = (animalType) => {
    this.loadDiseaseMapping(animalType);

    const fileName = `${animalType.toLowerCase()}.txt`;
    const filePath = `${process.env.PUBLIC_URL}/files/${fileName}`; // Adjust path as per your project structure

    console.log(animalType);
    console.log(`Fetching symptoms from: ${filePath}`); // Debugging statement

    fetch(filePath)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to fetch ${fileName}`);
        }
        return response.text();
      })
      .then(data => {
        const symptoms = data.trim().split('\n');
  
        if (symptoms.length === 0) {
          const message = this.createChatBotMessage("No symptoms found for the specified animal type.");
          this.updateChatbotState(message);
          return;
        }

        const dropdownMessage = this.createChatBotMessage(
          <SymptomsDropdown options={symptoms} data={{ animalType: animalType }} onSelect={(selectedSymptoms) => this.handleSelectSymptom(selectedSymptoms, animalType)} />,
          {
            withAvatar: true,
          }
        );
        this.updateChatbotState(dropdownMessage);
      })
      .catch(error => {
        console.error(`Error loading ${fileName}:`, error);
        const message = this.createChatBotMessage("Failed to load symptoms for the specified animal type.");
        this.updateChatbotState(message);
      });
  };

  handleSelectSymptom = (selectedSymptoms, animalType) => {
    console.log('Selected symptoms in ActionProvider:', selectedSymptoms); // Debugging statement
    const message = this.createChatBotMessage(`Selected symptoms: ${selectedSymptoms.join(', ')}`, {withAvatar: true});
    this.updateChatbotState(message);
    //const {currentAnimalType} = this.state;
    console.log(animalType);

    if (animalType){
      this.predictDisease(animalType, selectedSymptoms);
    } else {
      console.error('Animal type not set. Cannot predict disease.');
    }
  }
  
  displaySelectedSymptoms() {
    const message = this.createChatBotMessage(`Selected symptoms: ${this.selectedSymptoms.join(', ')}`, {withAvatar: true});
    this.updateChatbotState(message);
  }


  


  updateChatbotState(message) {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
  }

  greetUser = () => {
    const greetingMessage = this.createChatBotMessage("Hello.");
    this.updateChatbotState(greetingMessage);
  };

  handleAnimalCategory = (category) => {
    const validCategories = ["pets", "pet", "ivestocks", "livestock", "poultry"];
  
    const lowerAnimalCategory = category.toLowerCase();
    
    const detectedCategory = validCategories.find(validCategories => lowerAnimalCategory.includes(validCategories));
    
    if (detectedCategory === "pet"){
      category = "pets";
    }
    if (detectedCategory === "livestocks"){
      category = "livestock";
    }
    
    if (detectedCategory) {
      if (detectedCategory === "pets" || detectedCategory === "pet") {
          const message = this.createChatBotMessage("Please enter your pet type (Dog, Cat, Parrot):");
          this.updateChatbotState(message);
          this.setState(state => ({ ...state, nextInputAction: this.handlePetType }));
        } else if(detectedCategory === "livestock" || detectedCategory === "livestocks") {
          const message = this.createChatBotMessage("Please enter your livestock type (Cow, Buffalo, Sheep, Goat):");
          this.updateChatbotState(message);
          this.setState(state => ({ ...state, nextInputAction: this.handleLiveStockType }));
        } else if(detectedCategory === "poultry") {
          const message = this.createChatBotMessage("Please enter your poultry type (Chicken):");
          this.updateChatbotState(message);
          this.setState(state => ({ ...state, nextInputAction: this.handlePoultryType }));
        }
    } else {
      const message = this.createChatBotMessage("Please enter a valid category (Pets, Livestock, or Poultry).");
      this.updateChatbotState(message);
    }
  };

  handlePetType = (petType) => {
    const validPets = ["dog", "dogs", "cats", "cat", "parrots", "parrot"];
    const lowerPetType = petType.toLowerCase();

    const detetctedPetType = validPets.find(validPet => lowerPetType.includes(validPet));

    if (petType === "dogs"){
      petType="dog";
    } 
    if(petType === "cats"){
      petType="cat";
    }
    if(petType === "parrots"){
      petType = "parrot";
    }

    if (detetctedPetType) {
      const message = `your pet type is ${petType}.`;
      const ChatBotMessage = this.createChatBotMessage(message);
      this.updateChatbotState(ChatBotMessage);
      this.handleInfo(petType);
    } else {
      this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
    }
  };

  handleInfo = (animalType) => {
    const infomessage = "Enter information about your animal (age, breed, etc).";
    const message = this.createChatBotMessage(infomessage, {withAvatar: true});
    this.updateChatbotState(message);
    this.setState(state => ({ ...state, currentAnimalType:animalType, nextInputAction: (info) => this.handleInfoInput(info, animalType)}));
  }

  handleInfoInput = (info, animalType) => {
    if (info.trim().split(/\s+/).length === 1){
      this.handleInvalidMessage("information (please provide more details)");
      //this.handleSymptoms(animalType);
    } else {
      //this.setState(state => ({... state, nextInputAction: this.handleSymptoms}));
      console.log(this.state.currentAnimalType);
      this.handleSymptoms(animalType);
    }
  }

  handleLiveStockType = (livestocktype) => {
    const validLivestock = ["cow", "cows", "buffalos", "buffalo", "sheeps", "sheep", "goats", "goat"];
    const lowerLivestockType = livestocktype.toLowerCase();

    const detectedLivestockType = validLivestock.find(validLivestock => lowerLivestockType.includes(validLivestock));

    if (livestocktype === "cows"){
      livestocktype = "cow";
    }
    if (livestocktype === "buffalos"){
      livestocktype = "buffalo";
    }
    if (livestocktype==="sheeps"){
      livestocktype = "sheep";
    }
    if(livestocktype=== "goats"){
      livestocktype = "goat";
    }

    if (detectedLivestockType) {
      const message = `your Livestock type is ${livestocktype}.`;
      const ChatBotMessage = this.createChatBotMessage(message);
      this.updateChatbotState(ChatBotMessage);
      this.handleInfo(livestocktype);
    } else {
      this.handleInvalidMessage("livestock (Cow, Buffalo, Sheep, Goat)");
    }
  };

  handlePoultryType = (poultrytype) => {
    const validPoultry = ["chicken", "chickens"];
    const lowerPoultryType = poultrytype.toLowerCase();

    const detectedPoultryType = validPoultry.find(validPoultry => lowerPoultryType.includes(validPoultry));

    if (poultrytype === "chickens"){
      poultrytype = "chicken";
    }
    if (detectedPoultryType) {
      const message = `Your poultry type is ${poultrytype}`;
      const ChatBotMessage = this.createChatBotMessage(message);
      this.updateChatbotState(ChatBotMessage);
      this.handleSymptoms(poultrytype);
    } else {
      this.handleInvalidMessage("poultry (Chicken)");
    }
  };

  handleInvalidMessage = (context) => {
    const defaultMsg = 'Incorrect input. Please try again.';
    const messageText = context ? `Please enter a valid ${context}.` : defaultMsg;
    const message = this.createChatBotMessage(messageText);
    this.updateChatbotState(message);
  };

  predictDisease = (animalType, symptoms) => {
    const url = 'http://localhost:5000/predict';
    const requestData={
      animal_type: animalType,
      symptoms: symptoms
    }
    axios.post(url, requestData)
    .then(response => {
      console.log('Response from backend: ', response.data);
      const disease = response.data.disease;

      console.log("All Diseases: ", this.diseaseMapping)
      console.log("Disease Mapping: ", this.diseaseMapping[disease]);
      const diseaseName = this.diseaseMapping[disease] || 'Unknown disease';
      const message = this.createChatBotMessage(`Predicted disease: ${diseaseName}`, {withAvatar: true});
      this.updateChatbotState(message);
      this.redirect();
    })
    .catch(error => {
      console.error('Error predicting disease:', error);
      const message = this.createChatBotMessage("Failed to predict disease. Please try again later.");
      this.updateChatbotState(message);
    })
  };

  redirect = () => {
    const linksMessage = this.createChatBotMessage(
      <div>
      <p>What would you like to do next?</p>
      <a href="/" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Home Page</a>
      <a href="/lab-tests" style={{ display: 'block', margin: '10px 0', color: 'blue' }}>Go to Lab Tests Page</a>
    </div>,
    {
      withAvatar: true,
    }
    );
    this.updateChatbotState(linksMessage);
  }

  parseMapping = (mappingText) => {
    const lines = mappingText.split('\n');
    const diseaseMap = {};

    lines.forEach(line => {
      const [encodedValue, diseaseName] = line.split(': ');
      if (encodedValue && diseaseName) {
        diseaseMap[parseInt(encodedValue.trim(), 10)] =diseaseName.trim();
      }
      
    });

    return diseaseMap;
  }
}

export default ActionProvider;
