
import axios from 'axios';

const testLogin = async () => {
  try {
    const response = await axios.post('http://localhost:4001/api/auth/login', {
      email: 'john@example.com', // Assuming this user exists or I should use one that does
      password: 'password123',
      role: 'employer'
    });
    console.log('Login Response:', response.data);
  } catch (error) {
    console.error('Login Error:', error.response ? error.response.data : error.message);
    
    // If user doesn't exist, try signup to see response there too
    if (error.response && error.response.status === 401) {
        console.log("User might not exist, trying Signup...");
        try {
            const signupResp = await axios.post('http://localhost:4001/api/auth/signup', {
                name: "Test User",
                email: "test_" + Date.now() + "@example.com",
                password: "password123",
                role: "employer"
            });
            console.log('Signup Response:', signupResp.data);
        } catch (signupErr) {
            console.error('Signup Error:', signupErr.response ? signupErr.response.data : signupErr.message);
        }
    }
  }
};

testLogin();
