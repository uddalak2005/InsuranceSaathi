import axios from 'axios';
const base_url = import.meta.env.VITE_BACKEND_URL;

export const PolicyHolderSignUpRoute = async (formdata) => {
  try {
    console.log("📤 Sending policy holder signup data:", formdata);

    const response = await axios.post(
      `${base_url}/auth/policyHolder/signUp`,
      formdata,
    );

    console.log("✅ Signup successful. Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Signup error:", error);

    if (error.response) {
      console.error("📥 Server responded with:", {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error("📡 No response received. Request was:", error.request);
    } else {
      console.error("⚠️ Error setting up the request:", error.message);
    }

    throw error;
  }
};

export const PolicyHolderKYCRoute = async (formdata) => {
  try {
    console.log("📤 Sending Policy Holder KYC data:", formdata);

    const response = await axios.patch(
      `${base_url}/onboarding/policyHolder`,
      formdata,
      {
        headers: {
        token: localStorage.getItem("JWT"),
      },
      }
    );

    console.log("✅ KYC submission successful. Response data:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ KYC submission failed.");

    if (error.response) {
      // Server responded with a status outside 2xx
      console.error("📥 Server responded with an error:", {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // No response received after request was sent
      console.error("📡 No response received. Request was:", error.request);
    } else {
      // Error during setup (e.g., bad config)
      console.error("⚠️ Error setting up request:", error.message);
    }

    throw error;
  }
}

export const PolicyHolderSignInRoute = async (formdata) => {
  try {
    const response = await axios.post(`${base_url}auth/policyHolder/login`, formdata,
    );
    return response; // Already parsed JSON
  } catch (error) {
    console.error('Signin error:', error);
    throw error; // optional: rethrow if you want to handle it elsewhere
  }
};
