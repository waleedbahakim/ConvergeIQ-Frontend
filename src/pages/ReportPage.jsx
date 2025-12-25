import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, ChevronDown, BarChart3, TrendingUp, Users, MessageSquare, CheckCircle, Calculator, PhoneCall } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const ReportPage = () => {
    const { user } = useAuth();
    const [dateFilter, setDateFilter] = useState('today'); // today, yesterday, week, month, custom
    const [customRange, setCustomRange] = useState({ start: '', end: '' });
    const [reportData, setReportData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const getDates = (filter) => {
        const today = new Date();
        const start = new Date(today);
        const end = new Date(today);

        if (filter === 'yesterday') {
            start.setDate(today.getDate() - 1);
            end.setDate(today.getDate() - 1);
        } else if (filter === 'week') {
            start.setDate(today.getDate() - 7);
        } else if (filter === 'month') {
            start.setDate(today.getDate() - 30);
        } else if (filter === 'custom') {
            return {
                startDate: customRange.start,
                endDate: customRange.end
            };
        }
        
        // formatDate to YYYY-MM-DD
        const formatDate = (d) => d.toISOString().split('T')[0];
        return { startDate: formatDate(start), endDate: formatDate(end) };
    };

    const fetchReport = async () => {
        if (dateFilter === 'custom' && (!customRange.start || !customRange.end)) return;

        setLoading(true);
        setError(null);
        try {
            const { startDate, endDate } = getDates(dateFilter);
            // Assuming client_id is available in user context or hardcoded for MVP
            const clientId = user?.client_id || '675c20da22cc596d66e51172'; // Fallback for dev

            const res = await axios.post('http://localhost:5000/api/analytics/report', {
                client_id: clientId,
                startDate,
                endDate
            }, {
                headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
            });
            setReportData(res.data);
        } catch (err) {
            console.error(err);
            setError('Failed to fetch report data');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (dateFilter !== 'custom') {
            fetchReport();
        }
    }, [dateFilter]);

    const MetricCard = ({ title, value, subtext, icon: Icon, color = "blue" }) => (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex flex-col items-start transition-all hover:shadow-md">
            <div className={`p-3 rounded-lg bg-${color}-50 mb-3`}>
                <Icon className={`w-6 h-6 text-${color}-600`} />
            </div>
            <h3 className="text-slate-500 text-sm font-medium mb-1">{title}</h3>
            <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-800">{value}</span>
                {subtext && <span className="text-xs text-slate-400 font-medium">{subtext}</span>}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50">
             <nav className="bg-white shadow mb-8">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center gap-8">
                        <h1 className="text-xl font-bold text-blue-600">ConvergeIQ</h1>
                        <div className="flex gap-4">
                            <a href="/" className="text-gray-500 hover:text-blue-600 font-medium">Dashboard</a>
                            <a href="/report" className="text-blue-600 font-medium">Reports</a>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-sm text-gray-500">
                           {user?.username} ({user?.role})
                       </span>
                    </div>
                </div>
                </div>
            </nav>

            <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 pb-10">
                <header className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-800 mb-2">Detailed Performance Report</h1>
                    <p className="text-slate-500">Analyze your funnel metrics across different time periods.</p>
                </header>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 mb-8 flex flex-wrap items-center gap-4">
                <div className="flex bg-slate-100 p-1 rounded-lg">
                    {['today', 'yesterday', 'week', 'month'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setDateFilter(f)}
                            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                                dateFilter === f 
                                ? 'bg-white text-blue-600 shadow-sm' 
                                : 'text-slate-500 hover:text-slate-700'
                            }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </button>
                    ))}
                    <button
                        onClick={() => setDateFilter('custom')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                            dateFilter === 'custom' 
                            ? 'bg-white text-blue-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        Custom
                    </button>
                </div>

                {dateFilter === 'custom' && (
                    <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-4">
                        <input 
                            type="date" 
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={customRange.start}
                            onChange={(e) => setCustomRange({...customRange, start: e.target.value})}
                        />
                        <span className="text-slate-400">-</span>
                        <input 
                            type="date" 
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            value={customRange.end}
                            onChange={(e) => setCustomRange({...customRange, end: e.target.value})}
                        />
                        <button 
                            onClick={fetchReport}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition"
                        >
                            Apply
                        </button>
                    </div>
                )}
            </div>

            {/* Report Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
            ) : error ? (
                <div className="bg-red-50 text-red-600 p-4 rounded-lg">{error}</div>
            ) : reportData ? (
                <div className="space-y-8">
                    
                    {/* Top Funnel */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                             <Users className="w-5 h-5 text-blue-500"/> Acquisition & Engagement
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard title="Leads Received" value={reportData.leads} icon={Users} color="blue" />
                            <MetricCard title="Messages Triggered" value={reportData.bot_triggered} subtext={`${reportData.trigger_rate}% of Leads`} icon={MessageSquare} color="indigo" />
                            <MetricCard title="Interacted with AI" value={reportData.interacted} icon={MessageSquare} color="purple" />
                            <MetricCard title="AI Interaction rate" value={`${reportData.response_rate}%`} icon={TrendingUp} color="emerald" />
                        </div>
                    </div>

                    {/* Qualification */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                             <CheckCircle className="w-5 h-5 text-orange-500"/> Qualification
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard title="MQL Leads" value={reportData.mql} subtext={`${reportData.mql_rate}% of Interacted`} icon={CheckCircle} color="amber" />
                            <MetricCard title="SQL Leads" value={reportData.sql} subtext={`${reportData.sql_rate}% of MQL`} icon={CheckCircle} color="orange" />
                            <MetricCard title="QL Generated" value={reportData.ql} icon={CheckCircle} color="pink" />
                            <MetricCard title="QL Rate" value={`${reportData.ql_rate}%`} icon={TrendingUp} color="rose" />
                        </div>
                    </div>

                    {/* Bottom Funnel */}
                    <div>
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                             <Calendar className="w-5 h-5 text-green-500"/> Conversion & Revenue
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <MetricCard title="SV Scheduled" value={reportData.sv_scheduled} icon={Calendar} color="cyan" />
                            <MetricCard title="SV Done" value={reportData.sv_done} subtext={`${reportData.sv_rate}% Completion`} icon={Calendar} color="teal" />
                            <MetricCard title="Bookings" value={reportData.bookings} subtext={`${reportData.booking_rate}% of SV`} icon={CheckCircle} color="green" />
                            <MetricCard title="Prebookings" value={reportData.prebookings} icon={CheckCircle} color="lime" />
                        </div>
                    </div>
                     <div>
                         <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                             <PhoneCall className="w-5 h-5 text-red-500"/> Direct Actions
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                             <MetricCard title="Direct Bookings (No SV)" value={reportData.direct_bookings} icon={CheckCircle} color="red" />
                        </div>
                     </div>

                     {/* AI Decision Intelligence */}
                     <div className="mt-8">
                        <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-purple-600"/> Decision Intelligence
                        </h2>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Drop Reasons */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="text-slate-600 font-medium mb-4">Top Drop Reasons</h3>
                                <div className="space-y-3">
                                    {reportData.drop_reasons && Object.entries(reportData.drop_reasons).sort((a,b) => b[1]-a[1]).slice(0,5).map(([reason, count]) => (
                                        <div key={reason}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-700">{reason}</span>
                                                <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
                                            </div>
                                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-red-400 rounded-full" style={{ width: `${(count / Math.max(...Object.values(reportData.drop_reasons)))*100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!reportData.drop_reasons || Object.keys(reportData.drop_reasons).length === 0) && <p className="text-slate-400 text-sm italic">No drop data available yet.</p>}
                                </div>
                            </div>

                            {/* Intent Distribution */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="text-slate-600 font-medium mb-4">Lead Intent</h3>
                                <div className="space-y-3">
                                    {reportData.intent_distribution && Object.entries(reportData.intent_distribution).sort((a,b) => b[1]-a[1]).map(([intent, count]) => (
                                        <div key={intent}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-700">{intent}</span>
                                                <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
                                            </div>
                                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-400 rounded-full" style={{ width: `${(count / Math.max(...Object.values(reportData.intent_distribution)))*100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!reportData.intent_distribution || Object.keys(reportData.intent_distribution).length === 0) && <p className="text-slate-400 text-sm italic">No intent data available yet.</p>}
                                </div>
                            </div>

                            {/* Sentiment */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                                <h3 className="text-slate-600 font-medium mb-4">Sentiment Analysis</h3>
                                <div className="space-y-3">
                                    {reportData.sentiment_distribution && Object.entries(reportData.sentiment_distribution).map(([sentiment, count]) => (
                                        <div key={sentiment}>
                                            <div className="flex justify-between text-sm mb-1">
                                                <span className="text-slate-700">{sentiment}</span>
                                                <span className="text-slate-500 text-xs font-semibold bg-slate-100 px-2 py-0.5 rounded-full">{count}</span>
                                            </div>
                                            <div className="h-2 bg-slate-50 rounded-full overflow-hidden">
                                                <div className={`h-full rounded-full ${sentiment==='Positive'?'bg-emerald-400':sentiment==='Negative'?'bg-red-400':'bg-slate-400'}`} style={{ width: `${(count / Math.max(...Object.values(reportData.sentiment_distribution)))*100}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                    {(!reportData.sentiment_distribution || Object.keys(reportData.sentiment_distribution).length === 0) && <p className="text-slate-400 text-sm italic">No sentiment data available yet.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="text-center py-20 text-slate-400">Select a date range to view metrics</div>
            )}
        </div>
    </div>
    );
};

export default ReportPage;
