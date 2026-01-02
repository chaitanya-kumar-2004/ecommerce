// Step 1: Import the 'events' module
const EventEmitter = require('events');

// Step 2: Create a new instance of EventEmitter
const myEmitter = new EventEmitter();

// Step 3: Define an event and register a listener for that event
myEmitter.on('greet', () => {
  console.log('Hello, world!');
});

// Step 4: Emit the event
myEmitter.emit('greet'); // Output: Hello, world!