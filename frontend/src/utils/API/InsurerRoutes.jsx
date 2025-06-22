import axios from 'axios';

// Create axios instance with default configuration

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to log cookies
apiClient.interceptors.request.use(
  (config) => {
    console.log('Request cookies:', document.cookie);
    console.log('Request URL:', config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to log cookies
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response cookies:', document.cookie);
    console.log('Response headers:', response.headers);
    return response;
  },
  (error) => {
    console.error('Response error:', error);
    return Promise.reject(error);
  }
);

//Sign-up two parts - Signup and onboarding
export const InsurerSignupRoute = async (formdata) => {
  try {
    const response = await apiClient.post('/auth/insurer/signUp', formdata);
    // console.log('Signup response status:', response.status);
    // console.log('Signup response cookies:', document.cookie);
    return response;
  } catch (error) {
    console.error('Signup error:', error);
    throw error;
  }
};

export const InsurerKYCRoute = async (formdata) => {
  try {
    const response = await apiClient.patch('/onboarding/insurer', formdata, {
      headers: {
        token: localStorage.getItem("firebase_uid"),
      },
    });
    return response;
  } catch (error) {
    console.error('KYC error:', error);
    throw error;
  }
};

//Signin route
export const InsurerSignInRoute = async (formdata) => {
  try {
    const response = await apiClient.post('/auth/insurer/login', formdata);
    return response;
  } catch (error) {
    console.error('Signin error:', error);
    throw error;
  }
};