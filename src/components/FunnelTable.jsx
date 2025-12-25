import { ArrowUp, ArrowDown } from 'lucide-react';

const FunnelTable = ({ data }) => {
  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Leads</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bot Triggered</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Interacted</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">QL</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">SV</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Bookings</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">% Response</th>
            <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">% Booking</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row) => (
            <tr key={row.date} className="hover:bg-gray-50">
              <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">{row.date}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{row.leads}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{row.bot_triggered}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{row.interacted}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{row.ql}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">{row.sv}</td>
              <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap font-bold text-green-600">{row.bookings}</td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${row.funnel_percentages.response_rate > 20 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {row.funnel_percentages.response_rate}%
                  </span>
              </td>
              <td className="px-6 py-4 text-sm whitespace-nowrap">
                   <div className="flex items-center text-sm text-gray-900">
                      {row.funnel_percentages.booking_rate}%
                   </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FunnelTable;
