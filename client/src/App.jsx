import React, { useState, useEffect } from 'react';

const App = () => {
  const [rules, setRules] = useState([]);
  const [newRule, setNewRule] = useState({
    name: '',
    description: '',
    ruleString: ''
  });
  const [evaluationData, setEvaluationData] = useState('');
  const [evaluationResults, setEvaluationResults] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRules();
  }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/rules');
      const data = await response.json();
      setRules(data);
    } catch (err) {
      setError('Failed to fetch rules');
    }
  };

  const handleCreateRule = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/rules', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRule),
      });
      
      if (!response.ok) throw new Error('Failed to create rule');
      
      await fetchRules();
      setNewRule({ name: '', description: '', ruleString: '' });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEvaluate = async (ruleId) => {
    try {
      let data = {};
      try {
        data = JSON.parse(evaluationData);
      } catch {
        throw new Error('Invalid JSON data');
      }

      const response = await fetch('http://localhost:5000/api/rules/evaluate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ruleId, data }),
      });
      
      const result = await response.json();
      setEvaluationResults(prev => ({
        ...prev,
        [ruleId]: result.result
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-8 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Create New Rule</h2>
          <form onSubmit={handleCreateRule} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Rule Name"
                value={newRule.name}
                onChange={e => setNewRule(prev => ({ ...prev, name: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <textarea
                placeholder="Description"
                value={newRule.description}
                onChange={e => setNewRule(prev => ({ ...prev, description: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <div>
              <textarea
                placeholder="Rule String (e.g., (age > 18 AND income >= 50000))"
                value={newRule.ruleString}
                onChange={e => setNewRule(prev => ({ ...prev, ruleString: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
            </div>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Create Rule
            </button>
          </form>
        </div>
      </div>

      <div className="mb-6 bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Evaluation Data</h2>
          <textarea
            placeholder="Enter JSON data (e.g., {'age': 25, 'income': 60000})"
            value={evaluationData}
            onChange={e => setEvaluationData(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Rules List</h2>
          <div className="space-y-4">
            {rules.map(rule => (
              <div key={rule._id} className="border border-gray-200 rounded-lg p-4">
                <h3 className="text-xl font-semibold mb-2">{rule.name}</h3>
                <p className="text-gray-600 mb-2">{rule.description}</p>
                <p className="font-mono bg-gray-50 p-2 rounded mb-2">{rule.originalString}</p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleEvaluate(rule._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    Evaluate
                  </button>
                  {evaluationResults[rule._id] !== undefined && (
                    <div className={`px-4 py-2 rounded-lg ${
                      evaluationResults[rule._id] 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      Result: {evaluationResults[rule._id] ? 'True' : 'False'}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;