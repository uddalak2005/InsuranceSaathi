import axios from 'axios';

export const PolicyHolderSignUpRoute = async (formdata) => {
  try {
    const response = await axios.post('http://192.168.26.12:3000/auth/policyHolder/signUp', formdata,
        {withCredentials : true}
    );
    return response.data; // Already parsed JSON
  } catch (error) {
    console.error('Signup error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};

export const PolicyHolderKYCRoute = async (formdata) => {
  try {
    const response = await axios.post('http://192.168.72.13:3000/auth/policyHolder/onBoard', formdata,
        {withCredentials : true}
    );
    return response.data; // Already parsed JSON
  } catch (error) {
    console.error('KYC error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};

export const PolicyHolderSignInRoute = async (formdata) => {
  try {
    const response = await axios.post('http://192.168.72.13:3000/auth/policyHolder/login', formdata,
        {withCredentials : true}
    );
    return response.data; // Already parsed JSON
  } catch (error) {
    console.error('Signin error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};
