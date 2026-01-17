/**
 * Resume Parser Test Script
 * 
 * Tests the resume parsing API endpoint by uploading a PDF file
 * and verifying the server's response.
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

/**
 * Test resume upload and parsing
 * 
 * Procedure:
 * 1. Create FormData object for multipart file upload
 * 2. Check if dummy.pdf exists in parent directory
 * 3. If not found, create a dummy PDF file for testing
 * 4. Append resume file to FormData
 * 5. Send POST request to resume parsing endpoint
 * 6. Log success response or error message
 * 
 * @async
 * @returns {Promise<void>}
 */
async function testUpload() {
  // Create FormData object for multipart/form-data request
  const form = new FormData();
  
  // Check if dummy.pdf exists in parent directory
  if (!fs.existsSync('../dummy.pdf')) {
      console.log("dummy.pdf not found in parent dir, creating one...");
      // Create a dummy PDF file for testing if it doesn't exist
      fs.writeFileSync('dummy.pdf', 'Dummy PDF Content for Testing');
      // Append the newly created file to the form
      form.append('resume', fs.createReadStream('dummy.pdf'));
  } else {
      // Append existing dummy.pdf from parent directory
      form.append('resume', fs.createReadStream('../dummy.pdf'));
  }

  try {
    // Send POST request to resume parsing endpoint with file
    const response = await axios.post('http://localhost:4001/api/resume/parse', form, {
      headers: {
        // Include FormData headers for multipart upload
        ...form.getHeaders(),
      },
    });
    
    // Log successful response with formatted JSON
    console.log('Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    // Log error response data or error message
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

// Execute the test function
testUpload();
