import axios from "axios";

class GetAIInsights {

    async getAIClaimCheckVehicle(insuranceDoc) {
        try {
            const response = await axios.post(`${process.env.FLASK_API}/process_vehicle`, insuranceDoc);
            return {
                aiScore: response.data.aiScore,
                aiConfidence: response.data.aiConfidence,
                aiSuggestions: response.data.aiSuggestions
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }

    async getAIClaimCheckLife(insuranceDoc) {
        try {
            const response = await axios.post(`${process.env.FLASK_API}/lifeinsurance`, insuranceDoc);
            return {
                aiScore: response.data.aiScore,
                aiConfidence: response.data.aiConfidence,
                aiSuggestions: response.data.aiSuggestions
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }

    async getAIClaimCheckHealth(insuranceDoc) {
        try {
            const response = await axios.post(`${process.env.FLASK_API}/healthinsurance`, insuranceDoc);
            console.log("response ->", response.data);
            return {
                aiScore: response.data.aiScore,
                aiConfidence: response.data.aiConfidence,
                aiSuggestions: response.data.aiSuggestions
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }

    async evaluateRiskVehicle(insuranceDoc) {
        try {
            // Convert Mongoose document to plain object to avoid serialization issues
            const plainDoc = insuranceDoc.toObject ? insuranceDoc.toObject() : insuranceDoc;
            const response = await axios.post(`${process.env.FLASK_API}/evaluateRisk`, plainDoc);
            return {
                risk_factors: response.data.risk_factors,
                suspicious_files: response.data.suspicious_files
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }

    async evaluateRiskHealth(insuranceDoc) {
        try {
            console.log("insuranceDoc ->", insuranceDoc);
            // Convert Mongoose document to plain object to avoid serialization issues
            const plainDoc = insuranceDoc.toObject ? insuranceDoc.toObject() : insuranceDoc;
            const response = await axios.post(`${process.env.FLASK_API}/fraudDetection_health`, plainDoc);
            console.log("response ->", response.data);
            return {
                risk_factors: response.data.risk_factors,
                suspicious_files: response.data.suspicious_files
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }
}

const getAIInsights = new GetAIInsights();

export default getAIInsights;

