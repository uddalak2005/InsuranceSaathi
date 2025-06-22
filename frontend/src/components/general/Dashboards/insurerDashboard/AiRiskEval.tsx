import { useState } from 'react';
import { Bot, AlertTriangle, CheckCircle, FileText, TrendingUp } from 'lucide-react';

export const AIRiskEvaluation = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [results, setResults] = useState<any>(null);

  const runAIEvaluation = async () => {
    setIsProcessing(true);
    // Simulate AI processing
    setTimeout(() => {
      setResults({
        riskScore: 0.73,
        confidence: 0.89,
        flaggedDocuments: ['driver_license.pdf', 'medical_report.pdf'],
        riskFactors: [
          { factor: 'Inconsistent timestamps in documents', severity: 'high' },
          { factor: 'Unusual claim amount for incident type', severity: 'medium' },
          { factor: 'Previous claims history', severity: 'low' },
        ],
        recommendation: 'FLAG_FOR_REVIEW'
      });
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <Bot className="h-8 w-8 text-purple-400" />
        <div>
          <h3 className="text-xl font-semibold text-black">AI Risk Evaluation</h3>
          <p className="text-gray-400">Automated analysis of claim risk factors</p>
        </div>
      </div>

      {!results && !isProcessing && (
        <div className="text-center py-8">
          <TrendingUp className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <button
            onClick={runAIEvaluation}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg text-white font-medium transition-colors"
          >
            Start AI Risk Evaluation
          </button>
          <p className="text-gray-400 mt-2">
            This will analyze documents and claim data for risk indicators
          </p>
        </div>
      )}

      {isProcessing && (
        <div className="text-center py-8">
          <div className="inline-flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            <span className="text-white">AI is analyzing claim...</span>
          </div>
          <div className="mt-4 space-y-2">
            <div className="text-sm text-gray-400">Checking document authenticity...</div>
            <div className="text-sm text-gray-400">Analyzing claim patterns...</div>
            <div className="text-sm text-gray-400">Calculating risk score...</div>
          </div>
        </div>
      )}

      {results && (
        <div className="space-y-6">
          {/* Risk Score */}
          <div className="bg-gray-100 shadow-md p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-black mb-4">Risk Assessment</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Risk Score</span>
                  <span className={`font-bold ${
                    results.riskScore > 0.7 ? 'text-red-400' :
                    results.riskScore > 0.4 ? 'text-yellow-400' : 'text-green-400'
                  }`}>
                    {(results.riskScore * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className={`h-3 rounded-full ${
                      results.riskScore > 0.7 ? 'bg-red-500' :
                      results.riskScore > 0.4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${results.riskScore * 100}%` }}
                  ></div>
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-700">Confidence</span>
                  <span className="font-bold text-blue-400">
                    {(results.confidence * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-3">
                  <div
                    className="h-3 rounded-full bg-blue-500"
                    style={{ width: `${results.confidence * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Flagged Documents */}
          <div className="bg-gray-100 shadow-md p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-black mb-4 flex items-center">
              <FileText className="h-5 w-5 mr-2 text-gray-400" />
              Flagged Documents
            </h4>
            <div className="space-y-2">
              {results.flaggedDocuments.map((doc: string, index: number) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-red-700/30 border border-red-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-500" />
                  <span className="text-gray-700">{doc}</span>
                  <span className="text-red-500 text-sm">Suspected forgery</span>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Factors */}
          <div className="bg-white shadow-md p-6 rounded-lg">
            <h4 className="text-lg font-semibold text-black mb-4">Risk Factors</h4>
            <div className="space-y-3">
              {results.riskFactors.map((factor: any, index: number) => (
                <div key={index} className="flex items-center justify-between p-3 shadow-sm bg-gray-100 rounded-lg">
                  <span className="text-gray-800">{factor.factor}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    factor.severity === 'high' ? 'bg-red-500 text-white' :
                    factor.severity === 'medium' ? 'bg-yellow-500 text-black' :
                    'bg-green-500 text-white'
                  }`}>
                    {factor.severity.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendation */}
          <div className={`p-6 rounded-lg border-2 ${
            results.recommendation === 'FLAG_FOR_REVIEW' 
              ? 'bg-red-900/20 border-red-600' 
              : 'bg-green-900/20 border-green-600'
          }`}>
            <div className="flex items-center space-x-3">
              {results.recommendation === 'FLAG_FOR_REVIEW' ? (
                <AlertTriangle className="h-8 w-8 text-red-400" />
              ) : (
                <CheckCircle className="h-8 w-8 text-green-400" />
              )}
              <div>
                <h4 className="text-lg font-semibold text-red-400">AI Recommendation</h4>
                <p className={`${
                  results.recommendation === 'FLAG_FOR_REVIEW' ? 'text-red-400' : 'text-green-400'
                }`}>
                  {results.recommendation === 'FLAG_FOR_REVIEW' 
                    ? 'This claim requires manual review due to high risk indicators'
                    : 'This claim appears legitimate and can proceed to approval'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};