class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse = (message) => {
      const lowerCaseMessage = message.toLowerCase();

      // Check for greetings
      if (["hi", "hello"].includes(lowerCaseMessage)) {
          this.actionProvider.greetUser();
      } else {
          // Proceed with other parsing logic
          if (this.state.nextInputAction) {
              this.state.nextInputAction(lowerCaseMessage);
          } else {
              this.actionProvider.handleAnimalCategory(lowerCaseMessage);
          }
      }
    }
  }
  
  export default MessageParser;
  