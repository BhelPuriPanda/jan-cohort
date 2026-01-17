import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';

async function testUpload() {
  const form = new FormData();
  // Using the dummy.pdf file we saw earlier in the file list
  if (!fs.existsSync('../dummy.pdf')) {
      console.log("dummy.pdf not found in parent dir, creating one...");
      fs.writeFileSync('dummy.pdf', 'Dummy PDF Content for Testing');
      form.append('resume', fs.createReadStream('dummy.pdf'));
  } else {
      form.append('resume', fs.createReadStream('../dummy.pdf'));
  }

  try {
    const response = await axios.post('http://localhost:4001/api/resume/parse', form, {
      headers: {
        ...form.getHeaders(),
      },
    });
    console.log('Success! Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response ? error.response.data : error.message);
  }
}

testUpload();
