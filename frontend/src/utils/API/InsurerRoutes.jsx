import axios from 'axios';

//Sign-up two parts - Signup and onboarding
export const InsurerSignupRoute = async (formdata) => {
  try {
    const response = await axios.post('https://smvm6k8p-3000.inc1.devtunnels.ms/auth/insurer/signUp', formdata,
        {withCredentials : true}
    );
    return response.data; // Already parsed JSON
  } catch (error) {
    console.error('Signup error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};

export const InsurerKYCRoute = async (formdata) => {
    try {
      const response = await axios.patch(
        'https://smvm6k8p-3000.inc1.devtunnels.ms/onboarding/insurer',
        formdata,
        { withCredentials: true }
      );
      return response; // ✅ full response, not just response.data
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    }
  };


//Signin route
export const InsurerSignInRoute = async (formdata) => {
  try {
    const response = await axios.post('https://smvm6k8p-3000.inc1.devtunnels.ms/insurer/login', formdata,
        {withCredentials : true}
    );
    return response.data; // Already parsed JSON
  } catch (error) {
    console.error('Signup error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};