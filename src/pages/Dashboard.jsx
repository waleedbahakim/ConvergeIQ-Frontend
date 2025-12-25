import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import FunnelTable from '../components/FunnelTable';
import InsightCard from '../components/InsightCard';
import ReasonPanel from '../components/ReasonPanel';
import ChatInsightPanel from '../components/ChatInsightPanel';

const Dashboard = () => {
  const { user, loading, logout } = useAuth();
  const [metrics, setMetrics] = useState([]);
  const [insights, setInsights] = useState([]);
  const [reasoning, setReasoning] = useState({ bot: [], ql: [], booking: [], chat: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
        if (!user || !user.token) return;
        setIsLoading(true);
        try {
            const [metricsRes, insightsRes, reasoningRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/analytics`, { headers: { 'x-auth-token': user.token } }),
                axios.get(`${import.meta.env.VITE_API_URL}/insights?client_id=` + (user.client_id || 'mock_client_id'), { headers: { 'x-auth-token': user.token } }),
                axios.get(`${import.meta.env.VITE_API_URL}/reasoning?client_id=` + (user.client_id || 'mock_client_id'), { headers: { 'x-auth-token': user.token } })
            ]);
            setMetrics(metricsRes.data);
            setInsights(insightsRes.data);
            setReasoning({
                bot: reasoningRes.data.why_bot_drop || [],
                ql: reasoningRes.data.why_ql_drop || [],
                booking: reasoningRes.data.why_booking_drop || [],
                chat: reasoningRes.data.chat_insights || []
            });
            
             if (!reasoningRes.data.why_bot_drop?.length) {
                 await axios.post(`${import.meta.env.VITE_API_URL}/reasoning/trigger?client_id=` + (user.client_id || 'mock_client_id'), {}, { headers: { 'x-auth-token': user.token } });
             }

        } catch (error) {
            console.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!loading) {
        fetchData();
    }
  }, [user, loading]);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-blue-600">ConvergeIQ</h1>
            </div>
            <div className="flex items-center gap-4">
               <a href="/report" className="text-gray-600 hover:text-blue-600 font-medium">Reports</a>
               <span className="text-sm text-gray-500">
                   {user?.username} ({user?.role})
               </span>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm text-gray-700 bg-gray-100 rounded hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="py-10">
        <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <h2 className="mb-6 text-2xl font-bold text-gray-900">Daily Funnel Metrics</h2>
            
            {/* Insights Section */}
            <div className="grid grid-cols-1 gap-4 mb-8 md:grid-cols-3">
                {isLoading ? (
                    <p>Loading AI Insights...</p>
                ) : (
                    insights.map((insight, idx) => (
                        <InsightCard 
                            key={idx}
                            title={insight.title} 
                            description={insight.description} 
                            type={insight.type} 
                        />
                    ))
                )}
                 {!isLoading && insights.length === 0 && (
                     <InsightCard 
                        title="No Insights" 
                        description="Not enough data to generate insights yet." 
                        type="neutral" 
                    />
                )}
            </div>

             {/* Reasoning Section (New Phase 2) */}
             <div className="mb-10">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Root Cause Analysis</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ReasonPanel title="Why Bot Didn't Trigger" data={reasoning.bot} type="bot" />
                    <ReasonPanel title="Why Users Didn't Qualify" data={reasoning.ql} type="ql" />
                    <ReasonPanel title="Why QLs Didn't Book" data={reasoning.booking} type="booking" />
                </div>
            </div>

            {/* Chat Intelligence Section (New Phase 4) */}
            <div className="mb-10">
                <ChatInsightPanel insights={reasoning.chat} />
            </div>

            {/* Funnel Table */}
            {isLoading ? (
                <p>Loading data...</p>
            ) : (
                <>
                    {metrics.length > 0 ? (
                        <FunnelTable data={metrics} />
                    ) : (
                         <div className="border-4 border-gray-200 border-dashed rounded-lg h-64 flex items-center justify-center">
                            <p className="text-gray-500">No data available for this client.</p>
                        </div>
                    )}
                </>
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
