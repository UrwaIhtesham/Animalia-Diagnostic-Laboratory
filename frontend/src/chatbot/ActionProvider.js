// ActionProvider.js

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;

    this.state = {
      currentAnimalType: null,
      nextInputAction: null,
    };

    this.symptomsByAnimalType = {
      dog: ["Barking", "Lethargy", "Aggression"],
      cat: ["Meowing", "Sleepiness", "Irritability"],
      parrot: ["Screaming", "Feather Plucking", "Biting"],
      cow: ["Limping", "Coughing", "Low Milk Production"],
      chicken: ["Pecking", "Feather Loss", "Lameness"]
    };
  }

  handleInvalidMessage = (context) => {
    const defaultMsg = 'Incorrect input. Please try again.';
    const messageText = context ? `Please enter a valid ${context}.` : defaultMsg;
    const message = this.createChatBotMessage(messageText);
    this.updateChatbotState(message);
  };

  handleInfo = (animalType) => {
    const infomessage = 'Enter Information about your animal (age, breed, etc).';
    const message = this.createChatBotMessage(infomessage);
    this.updateChatbotState(message);
    this.state.currentAnimalType = animalType;
    this.state.nextInputAction = this.handleSymptoms;
  };

  greetUser = () => {
    const greetingMessage = this.createChatBotMessage("Hello.");
    this.updateChatbotState(greetingMessage);
  };

  handleAnimalCategory = (category) => {
    // Define valid categories
    const validCategories = ["pets", "livestock", "poultry"];

    // Check if the entered category is valid
    if (validCategories.includes(category.toLowerCase())) {
      if (category.toLowerCase() === "pets") {
        const message = this.createChatBotMessage("Please enter your pet type (Dog, Cat, Parrot):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handlePetType }));
      } else if (category.toLowerCase() === "livestock") {
        const message = this.createChatBotMessage("Please enter your livestock type (Cow, Buffalo, Sheep, Goat):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handleLiveStockType }));
      } else if (category.toLowerCase() === "poultry") {
        const message = this.createChatBotMessage("Please enter your poultry type (Chicken):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handlePoultryType }));
      }
    } else {
      const message = this.createChatBotMessage("Please enter a valid category (Pets, Livestock, or Poultry).");
      this.updateChatbotState(message);
    }
  };

  handleSymptoms = () => {
    const { currentAnimalType } = this.state.currentAnimalType;
    if (!currentAnimalType) {
      this.handleInvalidMessage("animal type");
      return;
    }


    const symptoms = this.symptomsByAnimalType[currentAnimalType.toLowerCase()];

    const dropdownMessage = this.createChatBotMessage(
      "Please select a symptom:",
      {
        widget: "SymptomsDropdown",
        options: symptoms.map(symptom => ({ value: symptom, label: symptom })),
        handleSelect: this.handleSelectedSymptom,
        data: { animalType: currentAnimalType }
      }
    );

    this.updateChatbotState(dropdownMessage);
  };

  handlePetType = (petType) => {
    const validPets = ["dog", "cat", "parrot"];
    if (validPets.includes(petType.toLowerCase())) {
      this.handleInfo(petType);
    } else {
      this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
    }
  };

  handleLiveStockType = (livestocktype) => {
    const validLivestock = ["cow", "buffalo", "sheep", "goat"];
    if (validLivestock.includes(livestocktype.toLowerCase())) {
      this.handleInfo(livestocktype);
    } else {
      this.handleInvalidMessage("livestock (Cow, Buffalo, Sheep, Goat)");
    }
  };

  handlePoultryType = (poultrytype) => {
    const validPoultry = ["chicken"];
    if (validPoultry.includes(poultrytype.toLowerCase())) {
      this.handleInfo(poultrytype);
    } else {
      this.handleInvalidMessage("poultry (Chicken)");
    }
  };

  updateChatbotState = (message) => {
    this.setState(prevState => ({
      ...prevState,
      messages: [...prevState.messages, message]
    }));
  };

  handleSelectedSymptom = (symptom) => {
    const message = this.createChatBotMessage(`You have selected the following symptom: ${symptom}`);
    this.updateChatbotState(message);
  };
}

export default ActionProvider;
