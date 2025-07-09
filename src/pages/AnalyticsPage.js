import React, { useEffect, useState } from 'react';
import { ResponsiveLine } from '@nivo/line';
import { ResponsiveBar } from '@nivo/bar';
import { ResponsivePie } from '@nivo/pie';
import { usePremium } from '../contexts/PremiumContext';
import { Crown, DollarSign, FileText, Users, BarChart2 } from 'lucide-react';
import analyticsService from '../services/analyticsService';

function AnalyticsPage() {
  const { isPremium } = usePremium();
  const [isDark, setIsDark] = useState(false);

  // Analytics state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [overview, setOverview] = useState(null);
  const [spendingOverTime, setSpendingOverTime] = useState([]);
  const [billFrequency, setBillFrequency] = useState([]);
  const [topParticipants, setTopParticipants] = useState([]);
  const [commonProducts, setCommonProducts] = useState([]);
  const [participantOwes, setParticipantOwes] = useState([]);

  // Detect dark mode (Tailwind dark class on html)
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();
    window.addEventListener('storage', checkDark);
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => {
      window.removeEventListener('storage', checkDark);
      observer.disconnect();
    };
  }, []);

  // Fetch analytics data
  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    Promise.all([
      analyticsService.getOverview(),
      analyticsService.getSpendingOverTime(),
      analyticsService.getBillFrequency(),
      analyticsService.getTopParticipants(),
      analyticsService.getCommonProducts(),
      analyticsService.getParticipantOwes(),
    ])
      .then(([
        overviewData,
        spendingData,
        billFreqData,
        topPartData,
        commonProdData,
        partOwesData,
      ]) => {
        if (!mounted) return;
        setOverview(overviewData);
        setSpendingOverTime(
          (spendingData || []).map(d => ({ x: d.month, y: d.total }))
        );
        setBillFrequency(billFreqData || []);
        setTopParticipants(topPartData || []);
        setCommonProducts(commonProdData || []);
        setParticipantOwes(partOwesData || []);
        setLoading(false);
      })
      .catch(err => {
        if (!mounted) return;
        setError('Failed to load analytics.');
        setLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  // Theme-aware color palette
  const chartColors = [
    '#facc15', // yellow-400
    '#6366f1', // indigo-500
    '#34d399', // green-400
    '#60a5fa', // blue-400
    '#f472b6', // pink-400
    '#fbbf24', // yellow-300
    '#a78bfa', // purple-400
    '#f87171', // red-400
  ];
  const darkText = '#e5e7eb'; // Tailwind gray-200
  const darkSubtle = '#9ca3af'; // Tailwind gray-400
  const darkBg = '#1f2937'; // Tailwind gray-800
  const darkCard = '#111827'; // Tailwind gray-900
  const darkBorder = '#374151'; // Tailwind gray-700

  if (!isPremium) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <Crown className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Premium Required</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-4">Upgrade to Premium to unlock analytics and insights.</p>
        <a href="/premium" className="btn-primary">Upgrade Now</a>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 font-semibold mb-2">{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Nivo theme config for dark/light
  const nivoTheme = isDark
    ? {
        background: darkCard,
        textColor: darkText,
        axis: {
          domain: { line: { stroke: darkBorder } },
          legend: { text: { fill: darkSubtle } },
          ticks: {
            line: { stroke: darkBorder },
            text: { fill: darkText },
          },
        },
        grid: { line: { stroke: darkBorder, strokeDasharray: '2 4' } },
        tooltip: {
          container: {
            background: darkCard,
            color: darkText,
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
          },
        },
      }
    : {
        background: '#fff',
        textColor: '#222',
        axis: {
          domain: { line: { stroke: '#e5e7eb' } },
          legend: { text: { fill: '#6b7280' } },
          ticks: {
            line: { stroke: '#e5e7eb' },
            text: { fill: '#222' },
          },
        },
        grid: { line: { stroke: '#e5e7eb', strokeDasharray: '2 4' } },
        tooltip: {
          container: {
            background: '#fff',
            color: '#222',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          },
        },
      };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-8">Visualize your grocery spending, bill activity, and participant stats. All analytics are private and only visible to you.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Stat Cards */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow group">
            <DollarSign className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">${overview ? overview.totalSpent.toFixed(2) : '0.00'}</span>
            <span className="text-gray-600 dark:text-gray-300 mt-2">Total Spent</span>
          </div>
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow group">
            <FileText className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">${overview ? overview.avgBill.toFixed(2) : '0.00'}</span>
            <span className="text-gray-600 dark:text-gray-300 mt-2">Average Bill Size</span>
          </div>
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 flex flex-col items-center hover:shadow-lg transition-shadow group">
            <Users className="h-8 w-8 text-primary-600 dark:text-primary-400 mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-4xl font-bold text-primary-600 dark:text-primary-400">{overview ? overview.activeParticipants : 0}</span>
            <span className="text-gray-600 dark:text-gray-300 mt-2">Active Participants</span>
          </div>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 my-8"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Spending Over Time */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <BarChart2 className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Spending Over Time</h2>
            </div>
            <div className="h-64">
              {spendingOverTime.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">No data</div>
              ) : (
                <ResponsiveLine
                  data={[{ id: 'Spending', data: spendingOverTime }]}
                  margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                  xScale={{ type: 'point' }}
                  yScale={{ type: 'linear', min: 0, max: 'auto', stacked: false }}
                  axisBottom={{ legend: 'Month', legendOffset: 32, legendPosition: 'middle', tickSize: 8, tickPadding: 5, tickRotation: 0 }}
                  axisLeft={{ legend: 'Amount', legendOffset: -40, legendPosition: 'middle', tickSize: 8, tickPadding: 5, tickRotation: 0 }}
                  colors={chartColors}
                  lineWidth={3}
                  pointSize={10}
                  pointColor={{ theme: 'background' }}
                  pointBorderWidth={2}
                  pointBorderColor={{ from: 'serieColor' }}
                  enableArea={true}
                  areaOpacity={0.15}
                  useMesh={true}
                  theme={nivoTheme}
                />
              )}
            </div>
          </div>
          {/* Bill Frequency */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Bill Frequency</h2>
            </div>
            <div className="h-64">
              {billFrequency.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">No data</div>
              ) : (
                <ResponsiveBar
                  data={billFrequency}
                  keys={["bills"]}
                  indexBy="month"
                  margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                  padding={0.3}
                  colors={chartColors}
                  axisBottom={{ legend: 'Month', legendOffset: 32, legendPosition: 'middle' }}
                  axisLeft={{ legend: 'Bills', legendOffset: -40, legendPosition: 'middle' }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  theme={nivoTheme}
                />
              )}
            </div>
          </div>
          {/* Top Participants */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 md:col-span-2 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Top Participants</h2>
            </div>
            <div className="h-64">
              {topParticipants.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">No data</div>
              ) : (
                <ResponsivePie
                  data={topParticipants}
                  margin={{ top: 20, right: 20, bottom: 40, left: 20 }}
                  innerRadius={0.5}
                  padAngle={0.7}
                  cornerRadius={3}
                  colors={chartColors}
                  borderWidth={1}
                  borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
                  radialLabelsSkipAngle={10}
                  radialLabelsTextColor={isDark ? darkSubtle : '#333333'}
                  radialLabelsLinkColor={{ from: 'color' }}
                  sliceLabelsSkipAngle={10}
                  sliceLabelsTextColor={isDark ? darkText : '#333333'}
                  theme={nivoTheme}
                />
              )}
            </div>
          </div>
          {/* Most Common Products */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Most Common Products</h2>
            </div>
            <div className="h-64">
              {commonProducts.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">No data</div>
              ) : (
                <ResponsiveBar
                  data={commonProducts}
                  keys={["count"]}
                  indexBy="product"
                  margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                  padding={0.3}
                  colors={chartColors}
                  axisBottom={{ legend: 'Product', legendOffset: 32, legendPosition: 'middle' }}
                  axisLeft={{ legend: 'Count', legendOffset: -40, legendPosition: 'middle' }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  theme={nivoTheme}
                />
              )}
            </div>
          </div>
          {/* Participant Owes/Paid */}
          <div className="bg-white dark:bg-gray-900 border dark:border-gray-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-5 w-5 text-primary-600 dark:text-primary-400" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Participant Owes/Paid</h2>
            </div>
            <div className="h-64">
              {participantOwes.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400 dark:text-gray-600">No data</div>
              ) : (
                <ResponsiveBar
                  data={participantOwes}
                  keys={["amount"]}
                  indexBy="participant"
                  margin={{ top: 20, right: 20, bottom: 40, left: 50 }}
                  padding={0.3}
                  colors={chartColors}
                  axisBottom={{ legend: 'Participant', legendOffset: 32, legendPosition: 'middle' }}
                  axisLeft={{ legend: 'Amount', legendOffset: -40, legendPosition: 'middle' }}
                  labelSkipWidth={12}
                  labelSkipHeight={12}
                  labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
                  theme={nivoTheme}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsPage; 