# Vehicle Info API(Veezy)

## Overview
The Vehicle Info API allows users to fetch and store vehicle-related data from government sources. It retrieves details such as mileage, registration dates, manufacturer, model, fuel type, and more. The data is then stored securely in a PostgreSQL database using Supabase.

## Features
- Fetches vehicle data from two external government APIs.
- Stores vehicle information in a PostgreSQL database.
- Uses Supabase for database management.
- Implements authentication policies to restrict data modification.
- Supports tracking of data updates via `created_at` and `updated_at` timestamps.
- Designed for scalability with configurable field mappings.

## Tech Stack
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (via Supabase)
- **Authentication:** Supabase Auth (planned)
- **Hosting:** Render (planned)
- **Package Manager:** npm

## Installation
### Prerequisites
- Node.js (v22+ recommended)
- npm or yarn
- Supabase account
- Git

### Setup
1. Clone the repository:
   ```sh
   git clone <your-repo-url>
   cd <your-project-folder>
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Create a `.env` file and configure environment variables:
   ```sh
   API_URL=https://data.gov.il/api/3/action/datastore_search
   SUPABASE_URL=<your-supabase-url>
   SUPABASE_KEY=<your-supabase-key>
   ```
4. Run the server:
   ```sh
   npm start
   ```

## API Endpoints
### Fetch and Store Vehicle Data
#### `POST /api/vehicle/:vehicleNumber`
Fetches vehicle data and details from government sources and stores them in the database.

**Response:**
```json
{
    "vehicleNumber": 68722302,
    "lastTestMileage": 22589,
    "firstRegistrationDate": "2022-01-24 00:00:00",
    "make": "סקודה צ'כיה",
    "model": "3V3RXC",
    "trim": "SPORTLINE",
    "color": "שחור",
    "fuelType": "חשמל/בנזין",
    "manufactureYear": 2022,
    "registrationDate": "2023-01-17"
}
```

## Database Schema (Supabase)
| Column                 | Type      | Description |
|------------------------|----------|-------------|
| `id`                  | UUID (PK)| Unique identifier |
| `vehicle_number`      | INT      | Vehicle license number |
| `last_test_mileage`   | INT      | Last recorded mileage |
| `first_registration_date` | TIMESTAMP | First registration date |
| `make`                | TEXT     | Manufacturer name |
| `model`               | TEXT     | Vehicle model |
| `trim`                | TEXT     | Trim level |
| `color`               | TEXT     | Color of the vehicle |
| `fuel_type`           | TEXT     | Type of fuel used |
| `manufacture_year`    | INT      | Year of manufacture |
| `registration_date`   | TIMESTAMP | Last registration date |
| `created_at`          | TIMESTAMP | Record creation time |
| `updated_at`          | TIMESTAMP | Last update time |

## Security
- **Row-Level Security (RLS)** is enabled in Supabase.
- Policies restrict data modifications to authenticated users.
- API keys should be kept secure and not exposed in the frontend.

## Future Enhancements
- Implement user authentication (Supabase Auth)
- Optimize data fetching with caching
- Add frontend UI for easy vehicle search

## Contributing
1. Fork the repository.
2. Create a feature branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -m "Add new feature"`).
4. Push to your branch (`git push origin feature-branch`).
5. Create a Pull Request.

## License
MIT License.

---
Let me know if you need any modifications!

