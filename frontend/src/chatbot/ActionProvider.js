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

  handleInfo = (animalType)=>{
    const infomessage = 'Enter information about your animal (age, breed, etc).';
    const message = this.createChatBotMessage(infomessage);
    this.updateChatbotState(message);
    this.setState(state=> ({
      ...state,
      currentAnimalType:animalType,
      nextInputAction: (info) => this.handleInfoInput(info, animalType)
    }));
  };

  handleInfoInput = (info, animalType) => {
    if (info.trim().split(/\s+/).length === 1) {
      this.handleInvalidMessage("information (please provide more details)");
    } else {
      console.log(this.state.currentAnimalType);
      this.handleSymptoms(animalType);
    }
  };

  greetUser = () => {
    const greetingMessage = this.createChatBotMessage("Hello.");
    this.updateChatbotState(greetingMessage);
  };

  handleAnimalCategory = (category) => {
    // Define valid categories
    const validCategories = ["pets", "pet", "livestock", "poultry"];
    const lower = category.toLowerCase();
    const detectedcategory = validCategories.find(validCategory => lower.includes(validCategory)
    );

    // Check if the entered category is valid
    if (detectedcategory) {
      if (detectedcategory.toLowerCase() === "pets" || detectedcategory.toLowerCase(0 === "pet")) {
        const message = this.createChatBotMessage("Please enter your pet type (Dog, Cat, Parrot):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handlePetType }));
      } else if (detectedcategory.toLowerCase() === "livestock") {
        const message = this.createChatBotMessage("Please enter your livestock type (Cow, Buffalo, Sheep, Goat):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handleLiveStockType }));
      } else if (detectedcategory.toLowerCase() === "poultry") {
        const message = this.createChatBotMessage("Please enter your poultry type (Chicken):");
        this.updateChatbotState(message);
        this.setState(state => ({ ...state, nextInputAction: this.handlePoultryType }));
      }
    } else {
      const message = this.createChatBotMessage("Please enter a valid category (Pets, Livestock, or Poultry).");
      this.updateChatbotState(message);
    }
  };

  handleSymptoms = (animalType) => {
    const symptoms = this.symptomsByAnimalType[animalType.toLowerCase()];
    console.log("Symptom before dropdown: ",symptoms);
      // Create a dropdown message
      console.log("animalType:", animalType);
      console.log("data object to pass:", { animalType: animalType });
      const dropdownMessage = this.createChatBotMessage(
        "Please Select a symptom:",
        {
          widget: "SymptomsDropdown",
          options: symptoms.map(symptom => ({ value: symptom, label: symptom })),
          data:{animalType:animalType}
        }
      );
      this.updateChatbotState(dropdownMessage);
    };

  // handlePetType = (petType) => {
  //   const validPets = ["dog", "dogs", "cats", "cat", "parrots", "parrot"];
  //   const lowerPetType = petType.toLowerCase();

  //   const detectedPetType = validPets.find(validPet => lowerPetType.includes(validPet)
  //   );

  //   if (detectedPetType === "dogs"){
  //     petType = "dog";
  //     const message = "Your pet type is ${petType}";
  //     this.createChatBotMessage()
  //     console.log(petType);
  //   }

  //   if (detectedPetType === "cats"){
  //     petType = "cat";
  //     console.log(petType);
  //   }

  //   if (detectedPetType=== "parrots"){
  //     petType = "parrot";
  //     console.log(petType);
  //   }

  //   if (detectedPetType) {
  //     this.handleInfo(petType);
  //   } else {
  //     this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
  //   }
  // };

  handlePetType = (petType) => {
    const validPets = ["dog", "dogs", "cat", "cats", "parrot", "parrots"];
    const lowerPetType = petType.toLowerCase();

    const detectedPetType = validPets.find(validPet => lowerPetType.includes(validPet));
  
    if (detectedPetType === "dogs"){
          petType = "dog";
          const chatmessage=this.createChatBotMessage("Your pet type is ${petType}")
          this.updateChatbotState(chatmessage);
          console.log(petType);
    }
    
    if (detectedPetType === "cats"){
          petType = "cat";
          const message = "Your pet type is ${petType}";
          const chatmessage=this.createChatBotMessage(message)
          this.updateChatbotState(chatmessage);
          console.log(petType);
    }
    
    if (detectedPetType=== "parrots"){
          petType = "parrot";
          const message = "Your pet type is ${petType}";
          const chatmessage=this.createChatBotMessage(message)
          this.updateChatbotState(chatmessage);
          console.log(petType);
    }
  
    if (detectedPetType) {
      this.handleInfo(detectedPetType);
    } else {
      this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
    }
  };
  

  handleLiveStockType = (livestocktype) => {
    const validLivestock = ["cow", "cows", "buffalos", "buffalo", "sheeps", "sheep", "goats", "goat"];
    const lowerLivestockType = livestocktype.toLowerCase();

    const singularLivestockTypeMap = {
      cows: "cow",
      buffalos: "buffalo",
      sheeps: "sheep",
      goats: "goat"
    };

    const detectedLivestockType = validLivestock.find(validLivestock => lowerLivestockType.includes(validLivestock));
    if (detectedLivestockType) {
      const mappedLivestockType = singularLivestockTypeMap[detectedLivestockType] || detectedLivestockType;
      const message = `Your Livestock type is ${mappedLivestockType}.`;
      const chatbotMessage = this.createChatBotMessage(message);
      this.updateChatbotState(chatbotMessage);
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
