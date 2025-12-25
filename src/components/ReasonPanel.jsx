import React from 'react';

const ReasonPanel = ({ title, data, type }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow h-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
        <p className="text-gray-500 italic">No significant drops detected yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow h-full overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
             <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
        </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
              {type === 'bot' && (
                  <>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impact</th>
                  </>
              )}
               {type === 'ql' && (
                  <>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drop Rate</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keywords</th>
                  </>
              )}
               {type === 'booking' && (
                  <>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Count</th>
                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Loss Rate</th>
                  </>
              )}
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Recommendation</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.reason}</td>
                
                {type === 'bot' && (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.impact === 'High' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {item.impact}
                            </span>
                        </td>
                    </>
                )}

                {type === 'ql' && (
                    <>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.drop_rate}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 truncate max-w-xs">{item.keywords?.join(', ')}</td>
                    </>
                )}

                {type === 'booking' && (
                    <>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.count}</td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.booking_loss_rate}</td>
                    </>
                )}

                <td className="px-6 py-4 whitespace-normal text-sm text-gray-500">{item.recommendation}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ReasonPanel;
