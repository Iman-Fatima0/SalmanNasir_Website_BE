/**
 * Admin Dashboard Stats Cards Component
 * 
 * Professional grey-themed stats cards with real admin dashboard icons
 * Uses Lucide React icons (professional icon library)
 */

import React from 'react';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface TrendData {
  direction: 'up' | 'down';
  value: string;
}

interface StatCardProps {
  title: string;
  value: number;
  trend: TrendData;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  
  const formatValue = (): string => {
    if (title.toLowerCase().includes('revenue')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value);
    }
    
    if (title.toLowerCase().includes('rate')) {
      return `${value.toFixed(1)}%`;
    }
    
    return value.toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Header with Icon and Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          {/* Icon Container - Grey background */}
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-gray-600">
              {icon}
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      {/* Value */}
      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">
          {formatValue()}
        </p>
      </div>

      {/* Trend Indicator */}
      <div className="flex items-center space-x-2 flex-wrap">
        <div 
          className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-sm font-semibold ${
            isPositive 
              ? 'bg-green-50 text-green-700' 
              : 'bg-red-50 text-red-700'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
          <span>{trend.value}</span>
        </div>
        <span className="text-sm text-gray-500">
          {isPositive ? 'Higher' : 'Lower'} than Last Month
        </span>
      </div>
    </div>
  );
};

interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  refundRate: number;
  revenueTrend: TrendData;
  usersTrend: TrendData;
  ordersTrend: TrendData;
  refundRateTrend: TrendData;
}

interface DashboardStatsCardsProps {
  stats: DashboardStats;
}

const DashboardStatsCards: React.FC<DashboardStatsCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      trend: stats.revenueTrend,
      icon: <DollarSign className="w-6 h-6" />,
    },
    {
      title: 'Active Students',
      value: stats.totalUsers,
      trend: stats.usersTrend,
      icon: <Users className="w-6 h-6" />,
    },
    {
      title: 'Enrollments',
      value: stats.totalOrders,
      trend: stats.ordersTrend,
      icon: <BookOpen className="w-6 h-6" />,
    },
    {
      title: 'Refund Rate',
      value: stats.refundRate,
      trend: stats.refundRateTrend,
      icon: <RefreshCcw className="w-6 h-6" />,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};

export default DashboardStatsCards;

/**
 * Usage Example:
 * 
 * import DashboardStatsCards from './components/DashboardStatsCards';
 * 
 * const AdminDashboard = () => {
 *   const { data: stats } = useQuery({
 *     queryKey: ['adminDashboardStats'],
 *     queryFn: () => apiService.getDashboardStats(),
 *   });
 * 
 *   if (!stats) return <div>Loading...</div>;
 * 
 *   return (
 *     <div>
 *       <h1>Admin Dashboard</h1>
 *       <DashboardStatsCards stats={stats} />
 *       {/* Rest of dashboard */}
 *     </div>
 *   );
 * };
 */

