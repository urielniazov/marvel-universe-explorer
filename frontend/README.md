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


## Known Limitations and Future Improvements

### User Experience Challenges
1. **Lack of Pagination**
   - Currently, the application displays comprehensive lists without pagination
   - Long lists of actors, movies, or characters can:
     * Slow down page rendering
     * Degrade user experience
     * Make navigation and information discovery difficult
   - **Recommended Improvement:** Implement server-side or client-side pagination to:
     * Limit initial data load
     * Improve performance
     * Enhance user navigation

2. **Search and Filtering Limitations**
   - No advanced search functionality
   - Limited ability to quickly find specific actors, characters, or movies
   - **Recommended Improvement:** Add robust search and filter mechanisms
     * Implement full-text search
     * Add filtering options (by movie year, character type, etc.)
     * Create autocomplete and quick-filter features

3. **Performance Bottlenecks**
   - Large datasets may cause significant client-side rendering delays
   - No lazy loading or virtualization for extensive lists
   - **Recommended Improvement:** 
     * Implement virtualized lists
     * Add progressive loading techniques
     * Optimize database queries for large datasets

4. **Responsive Design Limitations**
   - Current design may not be fully optimized for mobile devices
   - Tables and lists might not adapt well to smaller screen sizes
   - **Recommended Improvement:**
     * Implement fully responsive layouts
     * Create mobile-friendly table and list views
     * Use responsive design techniques (media queries, flexible grids)

5. **Error Handling and User Feedback**
   - Basic error handling with minimal user guidance
   - Lack of comprehensive error states and user-friendly error messages
   - **Recommended Improvement:**
     * Implement detailed error messaging
     * Add error boundary components
     * Provide clear guidance for error recovery

6. **Data Visualization Limitations**
   - Current implementation focuses on tabular data
   - No graphical representations of actor/character relationships
   - **Recommended Improvement:**
     * Add network graphs showing actor-character connections
     * Create interactive visualizations
     * Implement data exploration features

### Technical Debt
- Potential optimization of database queries
- Enhance state management 
- Implement more robust type checking
- Add comprehensive unit and integration tests

### Security Considerations
- Implement input validation
- Add rate limiting for API requests
- Enhance error logging without exposing sensitive information

### Accessibility
- Improve keyboard navigation
- Add ARIA attributes
- Ensure color contrast and screen reader compatibility

---

## Contribution Guidelines
Interested in helping improve the Marvel Universe Explorer? Great! Please check our contribution guidelines for details on how you can help address these limitations and enhance the project.