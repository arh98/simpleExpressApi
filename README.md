
This is a simple api to managing users and their posts with three communication protocol/style:\
Rest , WebSocket , Graphql

## Getting Started

To get started with the project, clone the repository to your local machine and install the dependencies:

`npm install`

To start the server, run:

`npm start` or `npm run start:dev` for development mode or `npm run start:prod` for production mode

this will start the server on `http://localhost:3000`

## Features and Functionality

- CRUD operations for posts
- User authentication and authorization using JWT tokens
- Password encryption using the bcrypt library
  
## Technologies Used

- `Node.js`: a server-side JavaScript runtime environment for building scalable and efficient network applications
- `Express`: a popular Node.js web application framework for building APIs and web applications
- `Socket.IO` :  a library that enables low-latency, bidirectional and event-based communication between a client and a server.
- `Graphql` : GraphQL is a query language for APIs and a runtime for fulfilling those queries with your existing data.
- `express-graphql` : Create a GraphQL HTTP server with any HTTP web framework that supports connect styled middleware, including Connect itself and Express.
- `MongoDB`: a popular NoSQL database for storing and querying large volumes of unstructured data
- `Mongoose`: an Object Data Modeling (ODM) library for MongoDB and Node.js that provides a more intuitive way to interact with MongoDB
- `JWT`: a widely-used standard for representing and transmitting secure authentication and authorization information
- `Multer`: a Node.js middleware for handling multipart/form-data, which is primarily used for uploading files
