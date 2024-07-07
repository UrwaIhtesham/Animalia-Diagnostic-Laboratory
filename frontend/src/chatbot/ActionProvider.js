import React from 'react';
import SymptomsDropdown from './SymptomsDropdown';

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.symptomsByAnimalType = {};
    this.maxSymptoms = 4;
    this.selectedSymptoms = [];
  }

  handleSymptoms = (animalType) => {
    const fileName = `${animalType.toLowerCase()}.txt`;
    const filePath = `${process.env.PUBLIC_URL}/files/${fileName}`; // Adjust path as per your project structure
  
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
          <SymptomsDropdown options={symptoms} data={{ animalType: animalType }} onSelect={this.handleSelectSymptom} />,
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

  handleSelectSymptom = (selectedSymptom) => {
    // Ensure selectedSymptom is not empty and is not already in selectedSymptoms array
    if (selectedSymptom && !this.selectedSymptoms.includes(selectedSymptom)) {
      if (this.selectedSymptoms.length < 4) {
        this.selectedSymptoms.push(selectedSymptom);
      } else {
        const message = this.createChatBotMessage("You can only select up to 4 symptoms.");
        this.updateChatbotState(message);
      }
    }
  
    // Update chatbot state to display selected symptoms
    this.displaySelectedSymptoms();
  };
  
  handleConfirmSelection = () => {
    if (this.selectedSymptoms.length === 4) {
      const confirmationMessage = `These are the selected symptoms: ${this.selectedSymptoms.join(', ')}. Confirm selection?`;
      const confirmSelection = window.confirm(confirmationMessage);
      if (confirmSelection) {
        // Process the confirmed symptoms
        this.displaySelectedSymptoms();
        // Optionally, clear the selected symptoms array for the next selection
        this.selectedSymptoms = [];
      }
    } else {
      const message = this.createChatBotMessage("Please select exactly 4 symptoms.");
      this.updateChatbotState(message);
    }
  };
  displaySelectedSymptoms() {
    const message = this.createChatBotMessage(`Selected symptoms: ${this.selectedSymptoms.join(', ')}`);
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
    const validCategories = ["pets", "livestock", "poultry"];
  
    if (validCategories.includes(category.toLowerCase())) {
      if (category.toLowerCase() === "pets") {
          const message = this.createChatBotMessage("Please enter your pet type (Dog, Cat, Parrot):");
          this.updateChatbotState(message);
          this.setState(state => ({ ...state, nextInputAction: this.handlePetType }));
        } else if(category.toLowerCase() === "livestock") {
          const message = this.createChatBotMessage("Please enter your livestock type (Cow, Buffalo, Sheep, Goat):");
          this.updateChatbotState(message);
          this.setState(state => ({ ...state, nextInputAction: this.handleLiveStockType }));
        } else if(category.toLowerCase() === "poultry") {
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
    const validPets = ["dog", "cat", "parrot"];
    if (validPets.includes(petType.toLowerCase())) {
      this.handleSymptoms(petType);
    } else {
      this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
    }
  };

  handleLiveStockType = (livestocktype) => {
    const validLivestock = ["cow", "buffalo", "sheep", "goat"];
    if (validLivestock.includes(livestocktype.toLowerCase())) {
      this.handleSymptoms(livestocktype);
    } else {
      this.handleInvalidMessage("livestock (Cow, Buffalo, Sheep, Goat)");
    }
  };

  handlePoultryType = (poultrytype) => {
    const validPoultry = ["chicken"];
    if (validPoultry.includes(poultrytype.toLowerCase())) {
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
}

export default ActionProvider;
