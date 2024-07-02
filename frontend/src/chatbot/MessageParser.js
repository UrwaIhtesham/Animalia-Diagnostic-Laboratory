

/*const MessageParser = ({ children, actions }) => {
  const parse = (message) => {
    console.log(message);
  };

  return (
    <div>
      {React.Children.map(children, (child) => {
        return React.cloneElement(child, {
          parse: parse,
          actions: {},
        });
      })}
    </div>
  );
};*/
// MessageParser.js
class MessageParser {
    constructor(actionProvider, state) {
      this.actionProvider = actionProvider;
      this.state = state;
    }
  
    parse = (message) => {
      const { nextInputAction } = this.state; // Get current state of expected input
  
      // Check if there's a specific next input action expected
      if (nextInputAction) {
        // Use the stored function reference from the state to handle the input
        nextInputAction(message);
      } else {
        // Default to handling category if no specific input action is set
        this.actionProvider.handleAnimalCategory(message);
      }
    }
  }
  
  export default MessageParser;
  