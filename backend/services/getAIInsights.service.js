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

    async evaluateRisk(insuranceDoc) {
        try {
            const response = await axios.post(`${process.env.FLASK_API}/evaluateRisk`, insuranceDoc);
            return {
                aiScore: response.data.aiScore,
                aiConfidence: response.data.aiConfidence,
                riskFactors: response.data.riskFactors,
                aiSuggestions: response.data.aiSuggestions
            }
        } catch (err) {
            console.error("Flask API error:", err.response?.data || err.message);
            throw new Error("Failed to get insights from AI engine");
        }
    }
}

const getAIInsights = new GetAIInsights();

export default getAIInsights;