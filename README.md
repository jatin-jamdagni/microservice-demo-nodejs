Node.js Microservices with SQLite
This project demonstrates a simple microservices architecture using Node.js and SQLite. It includes three services: Authentication Service, Book Service, and Author Service. Each service interacts with its own SQLite database. The Book and Author services are protected, requiring a valid JWT token for access.

Project Structure
markdown
Copy code
microservices/
├── auth-service/
│   └── index.js
├── book-service/
│   └── index.js
└── author-service/
    └── index.js
Prerequisites
Node.js installed on your machine.
Postman or any other API testing tool for testing the services.
Installation
Clone the repository:

bash
Copy code
git clone https://github.com/your-username/microservices.git
cd microservices
Install dependencies for each service:

bash
Copy code
# For auth-service
cd auth-service
npm install

# For book-service
cd ../book-service
npm install

# For author-service
cd ../author-service
npm install
Running the Services
Start each service in separate terminals:

bash
Copy code
# Start the Authentication Service
cd auth-service
node index.js

# Start the Book Service
cd ../book-service
node index.js

# Start the Author Service
cd ../author-service
node index.js
The Authentication Service runs on port 3001.
The Book Service runs on port 3002.
The Author Service runs on port 3003.
API Endpoints
Authentication Service
Register a new user:

arduino
Copy code
POST /register
Request Body:

json
Copy code
{
  "username": "testuser",
  "password": "testpassword"
}
Response:

201 Created if registration is successful.
500 Internal Server Error if registration fails.
Login a user:

bash
Copy code
POST /login
Request Body:

json
Copy code
{
  "username": "testuser",
  "password": "testpassword"
}
Response:

json
Copy code
{
  "token": "your_jwt_token_here"
}
200 OK with a JWT token if login is successful.
401 Unauthorized if the credentials are invalid.
Book Service (Protected)
Get all books:

bash
Copy code
GET /books
Authorization:

Include the token in the Authorization header as Bearer your_jwt_token_here.
Response:

200 OK with a list of books.
401 Unauthorized if the token is missing or invalid.
Add a new book:

bash
Copy code
POST /books
Request Body:

json
Copy code
{
  "title": "Book Title",
  "authorId": 1
}
Authorization:

Include the token in the Authorization header as Bearer your_jwt_token_here.
Response:

201 Created with the created book's details.
401 Unauthorized if the token is missing or invalid.
Author Service (Protected)
Get all authors:

bash
Copy code
GET /authors
Authorization:

Include the token in the Authorization header as Bearer your_jwt_token_here.
Response:

200 OK with a list of authors.
401 Unauthorized if the token is missing or invalid.
Add a new author:

bash
Copy code
POST /authors
Request Body:

json
Copy code
{
  "name": "Author Name"
}
Authorization:

Include the token in the Authorization header as Bearer your_jwt_token_here.
Response:

201 Created with the created author's details.
401 Unauthorized if the token is missing or invalid.
Testing with Postman
Register a User:

Send a POST request to http://localhost:3001/register with the registration details.
Login and Obtain JWT:

Send a POST request to http://localhost:3001/login with the login details.
Copy the JWT token from the response.
Access Protected Endpoints:

For each request to the Book or Author service, include the JWT token in the Authorization header as Bearer your_jwt_token_here.
Notes
The SQLite databases are in-memory and will not persist after the service stops. For persistence, change ':memory:' to a file path in the SQLite database connection.
The JWT secret key (SECRET_KEY) is hardcoded for simplicity. In a production environment, store secrets securely.