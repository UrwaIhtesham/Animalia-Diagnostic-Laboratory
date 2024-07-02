

class ActionProvider {
    constructor(createChatBotMessage, setStateFunc) {
      this.createChatBotMessage = createChatBotMessage;
      this.setState = setStateFunc;
    }
    handleInvalidMessage = (context) => {
        const defaultMsg = 'Incorrect input. Please try again.';
        const messageText = context ? `Please enter a valid ${context}.` : defaultMsg;
        const message = this.createChatBotMessage(messageText);
        this.updateChatbotState(message);
    }
    
  
    handleAnimalCategory = (category) => {
      // Define valid categories
      const validCategories = ["pets", "livestock", "poultry"];
  
      // Check if the entered category is valid
      if (validCategories.includes(category.toLowerCase())) {
        if (category.toLowerCase() === "pets") {
            const message = this.createChatBotMessage("Please enter your pet type (Dog, Cat, Parrot):");
            this.updateChatbotState(message);
            this.setState(state => ({ ...state, nextInputAction: this.handlePetType }));
          } else if(category.toLowerCase() === "livestock") {
            // Handle other categories similarly
            const message = this.createChatBotMessage("Please enter your livestock type (Cow, Buffalo, Sheep, Goat):");
            this.updateChatbotState(message);
            this.setState(state => ({ ...state, nextInputAction: this.handleLiveStockType }));
            
          }
          else if(category.toLowerCase() === "poultry"){
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
          const message = this.createChatBotMessage("Please enter your pet's symptoms:");
          this.updateChatbotState(message);
          // Set the next expected input action to collect symptoms
          this.setState(state => ({ ...state, nextInputAction: this.handleSymptoms }));
        } else {
          /*const message = this.createChatBotMessage("Please enter a valid pet (Dog, Cat, Parrot).");
          this.updateChatbotState(message);*/
          this.handleInvalidMessage("pet (Dog, Cat, Parrot)");
        }
      };
    handleLiveStockType = (livestocktype) => {
        const validLivestock = ["cow", "buffalo", "sheep", "goat"];
        if (validLivestock.includes(livestocktype.toLowerCase())) {
          const message = this.createChatBotMessage("Please enter your livestock's symptoms:");
          this.updateChatbotState(message);
          // Set the next expected input action to collect symptoms
          this.setState(state => ({ ...state, nextInputAction: this.handleSymptoms }));
        } else {
         /* const message = this.createChatBotMessage("Please enter a valid livestock (Cow, Buffalo, Sheep, Goat).");
          this.updateChatbotState(message);*/
          this.handleInvalidMessage("livestock (Cow, Buffalo, Sheep, Goat)");
        }
    }
    handlePoultryType = (poultrytype) => {
        const validpoultry =["chicken"];
        if (validpoultry.includes(poultrytype.toLowerCase())) {
            const message = this.createChatBotMessage("Please enter your poultry's symptoms:");
            this.updateChatbotState(message);
            // Set the next expected input action to collect symptoms
            this.setState(state => ({ ...state, nextInputAction: this.handleSymptoms }));
          } else {
           /* const message = this.createChatBotMessage("Please enter a valid poultry (Chicken).");
            this.updateChatbotState(message);*/
            this.handleInvalidMessage("poultry (Chicken)");
          }
    }

      updateChatbotState(message) {
        this.setState(prevState => ({
          ...prevState,
          messages: [...prevState.messages, message]
        }));
      }
    
  }
export default ActionProvider;