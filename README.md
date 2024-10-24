```markdown
# Diskuss Backend


## Project Structure

- **Language**: JavaScript (ES6+)
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Dependencies**:
  - Express
  - Mongoose
  - CORS
  - Cookie-parser
  - Bcrypt
  - Dotenv
  - JSON Web Token (JWT)
- **Dev Dependencies**:
  - Nodemon
  - Prettier

## Prerequisites

Before running the backend application, ensure that you have the following installed:

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/)

## Getting Started

### Installation

1. Clone the repository:

   ```bash
   git clone (https://github.com/Raghu3-3102/Diskussss.git)
   ```

2. Navigate to the backend directory:

   ```bash
   cd backend
   ```

3. Install the backend dependencies:

   ```bash
   npm install
   ```

### Running the Project

#### In Development Mode

To start the backend in development mode with live-reloading using Nodemon:

   ```bash
   npm run dev
   ```

### Environment Variables

Make sure to create a `.env` file in the `backend` folder and configure your environment variables:

```makefile
PORT=8000
MONGODB_URI=your_mongo_db_uri
CORS_ORIGIN=*
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=7d
```

### Scripts

- **`npm run dev`**: Starts the server in development mode with live-reloading using Nodemon.
- **`npm run start`**: Starts the server in production mode.

### Code Style

This project uses **Prettier** for code formatting. You can apply the formatting rules by running:

```bash
npx prettier --write .
```

The Prettier config:

```json
{
  "singleQuote": false,
  "tabWidth": 2,
  "semi": true,
  "bracketSpacing": true,
  "trailingComma": "es5"
}
```

## Repository

- **Type**: Git
- **URL**: [GitHub Repository](https://github.com/Raghu3-3102/Diskussss.git)

## Issues

If you find any bugs or have feature requests, please file them [here](https://github.com/Raghu3-3102/Diskussss).

## Author

- **Raghu**

## License

This project is licensed under the **ISC License**.
```
