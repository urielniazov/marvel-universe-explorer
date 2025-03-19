# Marvel Movies Information App

## Overview
This React application displays Marvel movie information using MobX for state management and fetching data from local API endpoints.

## Features
- View Movies Per Actor
- List Actors with Multiple Characters
- Show Characters Played by Multiple Actors

## Prerequisites
- Node.js (v14 or later)
- npm or yarn

## Setup Instructions

1. Clone the repository
```bash
git clone <your-repo-url>
cd marvel-movies-app
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Start the development server
```bash
npm start
# or
yarn start
```

4. Ensure your backend API is running on `http://localhost:3000/api`

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite

## Technologies Used
- React
- MobX
- Axios
- Tailwind CSS

## API Endpoints
- `/moviesPerActor`
- `/actorsWithMultipleCharacters`
- `/charactersWithMultipleActors`