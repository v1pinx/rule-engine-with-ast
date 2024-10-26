# Rule Engine

A dynamic rule creation and evaluation system with a React frontend and Express backend.

## What This Application Does

1. **Create Rules**: Users can create complex logical rules using a simple string syntax.
   Example: `(age > 18 AND income >= 50000)`

2. **Store Rules**: Created rules are stored in a MongoDB database with their parsed Abstract Syntax Tree (AST) representation.

3. **List Rules**: The application displays all created rules, showing their names, descriptions, and original rule strings.

4. **Evaluate Rules**: Users can input JSON data and evaluate it against any stored rule. The system processes the data through the rule's AST and returns a boolean result.

5. **Real-time Feedback**: After evaluation, the application immediately displays whether the input data satisfies the rule conditions.

## Key Features

- Intuitive UI for rule creation and management
- Dynamic rule evaluation against user-provided data
- RESTful API for rule operations (create, retrieve, evaluate)
- MongoDB integration for persistent storage of rules

## Technologies Used

- Frontend: React, Vite, Tailwind CSS
- Backend: Express.js, MongoDB (mongoose)
- API: RESTful endpoints

