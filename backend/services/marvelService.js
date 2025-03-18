// services/vehicleService.mjs (or vehicleService.js if you use ESM)
import fetch from "node-fetch";  // Use dynamic import
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

// const supabase = createClient(
//     process.env.SUPABASE_URL,
//     process.env.SUPABASE_API_KEY
// );
// src/services/marvelService.js

export const fetchMoviesPerActor = async () => {
    // Logic for fetching movies per actor (e.g., from a database or external API)
    return {
      "actorName": ["movieName1", "movieName2"],
      "anotherActorName": ["movieName3", "movieName4"]
    };
  };
  
  export const fetchActorsWithMultipleCharacters = async () => {
    // Logic for fetching actors with multiple characters (e.g., from a database or external API)
    return {
      "actorName": [
        { "movieName": "movie1", "characterName": "characterA" },
        { "movieName": "movie2", "characterName": "characterB" }
      ],
      "anotherActorName": [
        { "movieName": "movie3", "characterName": "characterC" },
        { "movieName": "movie4", "characterName": "characterD" }
      ]
    };
  };
  
  export const fetchCharactersWithMultipleActors = async () => {
    // Logic for fetching characters with multiple actors (e.g., from a database or external API)
    return {
      "characterName": [
        { "movieName": "movie1", "actorName": "actorA" },
        { "movieName": "movie2", "actorName": "actorB" }
      ],
      "anotherCharacterName": [
        { "movieName": "movie3", "actorName": "actorC" },
        { "movieName": "movie4", "actorName": "actorD" }
      ]
    };
  };
  

// const isDataOutdated = (updatedAt) => {
//     if (!updatedAt) return true;
//     const lastUpdated = new Date(updatedAt);
//     const now = new Date();
//     return (now - lastUpdated) / (1000 * 60 * 60 * 24) > DATA_EXPIRATION_DAYS;
// };

// const getExistingVehicleFromDb = async (vehicleNumber) => {
//     const { data, error } = await supabase
//         .from('vehicles')
//         .select('*')
//         .eq('vehicle_number', vehicleNumber)
//         .single();

//     if (error && error.code !== 'PGRST116') {
//         console.error('Error checking existing vehicle:', error);
//         throw error;
//     }

//     return data;
// };

// const fetchFreshVehicleData = async (vehicleNumber) => {
//     const vehicleData = await fetchVehicleData(vehicleNumber, VEHICLE_DATA_RESOURCE_ID);
//     const vehicleDetails = await fetchVehicleDetails(vehicleNumber, VEHICLE_DETAILS_RESOURCE_ID);
//     return { ...vehicleData, ...vehicleDetails };
// };

// const fetchDataFromApi = async (vehicleNumber, resourceId) => {
//     const url = process.env.API_URL;

//     const body = JSON.stringify({
//         "resource_id": resourceId,
//         "q": "",
//         "filters": {
//             "mispar_rechev": [vehicleNumber],
//             "not_count_request": "0"
//         },
//         "limit": 100,
//         "offset": 0
//     });

//     try {
//         // Sending POST request to the API
//         const response = await fetch(url, {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: body
//         });

//         // Checking if the request was successful
//         if (!response.ok) {
//             throw new Error('Failed to fetch data');
//         }

//         // Parsing the response as JSON
//         const data = await response.json();

//         if (!data.success) {
//             console.error('Error fetching data:', data.result);
//             throw new Error("error fetching from API");
//         }

//         return data.result.records[0];  // Return the first record
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         throw error;
//     }
// };

// const fetchVehicleData = async (vehicleNumber) => {
//     const vehicleResourceId = process.env.VEHICLE_DATA_RESOURCE_ID;  // Resource ID for Vehicle Data

//     const vehicleData = await fetchDataFromApi(vehicleNumber, vehicleResourceId);

//     const mappedData = {
//         vehicleNumber: vehicleData.mispar_rechev,
//         lastTestMileage: vehicleData.kilometer_test_aharon,
//         firstRegistrationDate: vehicleData.rishum_rishon_dt
//     };

//     return mappedData;
// };

// const fetchVehicleDetails = async (vehicleNumber) => {
//     const vehicleDetailsResourceId = process.env.VEHICLE_DETAILS_RESOURCE_ID;  // Resource ID for Vehicle Details

//     const vehicleDetails = await fetchDataFromApi(vehicleNumber, vehicleDetailsResourceId);

//     const mappedDetails = {
//         make: vehicleDetails.tozeret_nm,
//         model: vehicleDetails.degem_nm,
//         trim: vehicleDetails.ramat_gimur,
//         color: vehicleDetails.tzeva_rechev,
//         fuelType: vehicleDetails.sug_delek_nm,
//         manufactureYear: vehicleDetails.shnat_yitzur,
//         registrationDate: vehicleDetails.mivchan_acharon_dt
//     };

//     return mappedDetails;
// };

// export const fetchCompleteVehicleInfo = async (vehicleNumber) => {
//     console.log('Checking database for existing data:', vehicleNumber);

//     const existingVehicle = await getExistingVehicleFromDb(vehicleNumber);

//     if (existingVehicle && !isDataOutdated(existingVehicle.updated_at)) {
//         console.log('Returning cached data:', existingVehicle);
//         return existingVehicle;
//     }

//     console.log('Fetching fresh data from API for:', vehicleNumber);
//     const freshVehicleInfo = await fetchFreshVehicleData(vehicleNumber);

//     if (existingVehicle) {
//         return updateVehicleData(freshVehicleInfo)
//     }
//     return saveVehicleDataToDb(freshVehicleInfo);
// };
// const updateVehicleData = async (vehicleData) => {
//     console.log('Updating existing vehicle:', vehicleData.vehicleNumber);

//     const { data, error } = await supabase
//         .from('vehicles')
//         .update({
//             last_test_mileage: vehicleData.lastTestMileage,
//             registration_date: vehicleData.registrationDate,
//             updated_at: new Date().toISOString()
//         })
//         .eq('vehicle_number', vehicleData.vehicleNumber);

//     if (error) {
//         console.error('Error updating vehicle data:', error);
//         throw error;
//     }

//     return vehicleData;
// }
// const saveVehicleDataToDb = async (vehicleData) => {
//     const { data, error } = await supabase
//         .from('vehicles')
//         .insert([
//             {
//                 vehicle_number: vehicleData.vehicleNumber,
//                 last_test_mileage: vehicleData.lastTestMileage,
//                 first_registration_date: vehicleData.firstRegistrationDate,
//                 make: vehicleData.make,
//                 model: vehicleData.model,
//                 trim: vehicleData.trim,
//                 color: vehicleData.color,
//                 fuel_type: vehicleData.fuelType,
//                 manufacture_year: vehicleData.manufactureYear,
//                 registration_date: vehicleData.registrationDate,
//                 created_at: new Date().toISOString(),  // Set the created_at timestamp
//                 updated_at: new Date().toISOString()   // Set the updated_at timestamp
//             }
//         ]);

//     if (error) {
//         console.error('Error inserting vehicle data:', error);
//         throw error;
//     }

//     console.log('Vehicle data inserted successfully:', data);
//     return vehicleData; // Return the data after insertion
// };
