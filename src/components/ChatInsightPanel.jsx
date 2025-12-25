import React from 'react';

const ChatInsightPanel = ({ insights }) => {
  if (!insights || insights.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full">
         <h3 className="text-xl font-bold text-gray-800 mb-4">Chat Intelligence</h3>
        <p className="text-gray-500 italic">No chat insights analyzed yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6 h-full overflow-hidden">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Chat Intelligence (Last 50)</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Outcome</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Intent</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {insights.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        item.outcome === 'success' ? 'bg-green-100 text-green-800' : 
                        item.outcome === 'noOutcome' ? 'bg-gray-100 text-gray-800' : 'bg-red-100 text-red-800'
                    }`}>
                        {item.outcome}
                    </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.primary_intent}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.drop_reason || '-'}</td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                     {item.sentiment === 'positive' ? '😊' : item.sentiment === 'negative' ? '😟' : '😐'} {item.sentiment}
                 </td>
                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{item.suggested_action}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChatInsightPanel;
