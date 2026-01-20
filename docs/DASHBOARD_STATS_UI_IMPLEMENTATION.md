# Admin Dashboard Stats Cards - UI Implementation Guide

## 🎨 Design Specifications

### Color Scheme (Grey Theme)
- **Primary Grey:** `#374151` (text, icons)
- **Light Grey:** `#F3F4F6` (background)
- **Medium Grey:** `#9CA3AF` (secondary text)
- **Dark Grey:** `#1F2937` (hover states)
- **Success Green:** `#10B981` (up trend)
- **Error Red:** `#EF4444` (down trend)
- **Accent Grey:** `#6B7280` (borders, dividers)

### Icon Requirements
- Use **Lucide React** icons (or similar professional icon library)
- Real admin dashboard icons (not AI-generated)
- Consistent icon style

---

## 📦 Required Icons (Lucide React)

Install Lucide React:
```bash
npm install lucide-react
```

### Icon Mapping
- **Total Revenue:** `DollarSign` or `TrendingUp`
- **Active Students:** `Users` or `UserCheck`
- **Enrollments:** `BookOpen` or `GraduationCap`
- **Refund Rate:** `RefreshCcw` or `RotateCcw`

---

## 💻 Complete React Component

### Stats Cards Component

```tsx
import React from 'react';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  const trendColor = isPositive ? '#10B981' : '#EF4444';
  const trendBg = isPositive ? '#D1FAE5' : '#FEE2E2';

  return (
    <div className="stat-card">
      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            {/* Icon Container */}
            <div className="bg-gray-100 p-3 rounded-lg">
              <div className="text-gray-600">
                {icon}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                {title}
              </h3>
            </div>
          </div>
        </div>

        {/* Value */}
        <div className="mb-3">
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === 'number' ? formatValue(value, title) : value}
          </p>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center space-x-2">
          <div 
            className="flex items-center space-x-1 px-2 py-1 rounded-md"
            style={{ 
              backgroundColor: trendBg,
              color: trendColor 
            }}
          >
            {isPositive ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="text-sm font-semibold">
              {trend.value}
            </span>
          </div>
          <span className="text-sm text-gray-500">
            {isPositive ? 'Higher' : 'Lower'} than Last Month
          </span>
        </div>
      </div>

      <style jsx>{`
        .stat-card {
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
      `}</style>
    </div>
  );
};

// Helper function to format values
const formatValue = (value: number, title: string): string => {
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

// Main Stats Grid Component
interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  refundRate: number;
  revenueTrend: { direction: 'up' | 'down'; value: string };
  usersTrend: { direction: 'up' | 'down'; value: string };
  ordersTrend: { direction: 'up' | 'down'; value: string };
  refundRateTrend: { direction: 'up' | 'down'; value: string };
}

const DashboardStatsCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
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
    <div className="stats-grid">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </div>

      <style jsx global>{`
        .stats-grid {
          margin-bottom: 2rem;
        }
      `}</style>
    </div>
  );
};

export default DashboardStatsCards;
```

---

## 🎨 Tailwind CSS Version (Recommended)

```tsx
import React from 'react';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  trend: {
    direction: 'up' | 'down';
    value: string;
  };
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  
  const formatValue = () => {
    if (title.toLowerCase().includes('revenue')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value as number);
    }
    
    if (title.toLowerCase().includes('rate')) {
      return `${(value as number).toFixed(1)}%`;
    }
    
    return (value as number).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      {/* Icon and Title */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
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
          {typeof value === 'number' ? formatValue() : value}
        </p>
      </div>

      {/* Trend */}
      <div className="flex items-center space-x-2">
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

// Main Component
interface DashboardStats {
  totalRevenue: number;
  totalUsers: number;
  totalOrders: number;
  refundRate: number;
  revenueTrend: { direction: 'up' | 'down'; value: string };
  usersTrend: { direction: 'up' | 'down'; value: string };
  ordersTrend: { direction: 'up' | 'down'; value: string };
  refundRateTrend: { direction: 'up' | 'down'; value: string };
}

const DashboardStatsCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
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
```

---

## 🎨 CSS-Only Version (Without Tailwind)

```css
/* Dashboard Stats Cards Styles */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.stat-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.stat-card-icon-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.stat-card-icon-bg {
  background: #f3f4f6;
  padding: 0.75rem;
  border-radius: 0.5rem;
}

.stat-card-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: #374151;
}

.stat-card-title {
  font-size: 0.875rem;
  font-weight: 500;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.stat-card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  margin-bottom: 0.75rem;
}

.stat-card-trend {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stat-card-trend-badge {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.625rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.stat-card-trend-badge.up {
  background: #d1fae5;
  color: #10b981;
}

.stat-card-trend-badge.down {
  background: #fee2e2;
  color: #ef4444;
}

.stat-card-trend-icon {
  width: 1rem;
  height: 1rem;
}

.stat-card-trend-text {
  font-size: 0.875rem;
  color: #6b7280;
}
```

```tsx
// React Component with CSS Classes
import React from 'react';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  
  const formatValue = () => {
    if (title.toLowerCase().includes('revenue')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value as number);
    }
    
    if (title.toLowerCase().includes('rate')) {
      return `${(value as number).toFixed(1)}%`;
    }
    
    return (value as number).toLocaleString();
  };

  return (
    <div className="stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon-container">
          <div className="stat-card-icon-bg">
            <div className="stat-card-icon">
              {icon}
            </div>
          </div>
          <h3 className="stat-card-title">{title}</h3>
        </div>
      </div>
      
      <div className="stat-card-value">
        {typeof value === 'number' ? formatValue() : value}
      </div>
      
      <div className="stat-card-trend">
        <div className={`stat-card-trend-badge ${isPositive ? 'up' : 'down'}`}>
          {isPositive ? (
            <TrendingUp className="stat-card-trend-icon" />
          ) : (
            <TrendingDown className="stat-card-trend-icon" />
          )}
          <span>{trend.value}</span>
        </div>
        <span className="stat-card-trend-text">
          {isPositive ? 'Higher' : 'Lower'} than Last Month
        </span>
      </div>
    </div>
  );
};

const DashboardStatsCards: React.FC<{ stats: DashboardStats }> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Revenue',
      value: stats.totalRevenue,
      trend: stats.revenueTrend,
      icon: <DollarSign />,
    },
    {
      title: 'Active Students',
      value: stats.totalUsers,
      trend: stats.usersTrend,
      icon: <Users />,
    },
    {
      title: 'Enrollments',
      value: stats.totalOrders,
      trend: stats.ordersTrend,
      icon: <BookOpen />,
    },
    {
      title: 'Refund Rate',
      value: stats.refundRate,
      trend: stats.refundRateTrend,
      icon: <RefreshCcw />,
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};
```

---

## 🎨 Alternative Icons (Other Options)

### Heroicons (Alternative)
```bash
npm install @heroicons/react
```

```tsx
import { 
  CurrencyDollarIcon,
  UsersIcon,
  AcademicCapIcon,
  ArrowPathIcon 
} from '@heroicons/react/24/outline';
```

### Material Icons (Alternative)
```bash
npm install @mui/icons-material
```

```tsx
import { 
  AttachMoney,
  People,
  School,
  Refresh 
} from '@mui/icons-material';
```

---

## 📐 Design Specifications

### Spacing
- Card Padding: `1.5rem` (24px)
- Gap between cards: `1.5rem` (24px)
- Icon size: `1.5rem` (24px)
- Icon container padding: `0.75rem` (12px)

### Typography
- Title: `0.875rem` (14px), uppercase, medium weight, gray-600
- Value: `2rem` (32px), bold, gray-900
- Trend text: `0.875rem` (14px), gray-500

### Colors (Tailwind Classes)
- Background: `bg-white`
- Border: `border-gray-200`
- Icon background: `bg-gray-100`
- Icon color: `text-gray-600`
- Title: `text-gray-600`
- Value: `text-gray-900`
- Up trend: `bg-green-50 text-green-700`
- Down trend: `bg-red-50 text-red-700`

### Effects
- Hover shadow: `hover:shadow-md`
- Hover lift: `hover:-translate-y-1`
- Transition: `transition-all duration-200`

---

## 📱 Responsive Design

```css
/* Mobile: 1 column */
@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Tablet: 2 columns */
@media (min-width: 768px) and (max-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop: 4 columns */
@media (min-width: 1024px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

---

## 🎯 Complete Example with API Integration

```tsx
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  DollarSign, 
  Users, 
  BookOpen, 
  RefreshCcw, 
  TrendingUp, 
  TrendingDown 
} from 'lucide-react';
import apiService from '../services/api';

const DashboardStatsCards = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['adminDashboardStats'],
    queryFn: () => apiService.getDashboardStats(),
  });

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (!stats) return null;

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

const StatCard: React.FC<StatCardProps> = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  
  const formatValue = () => {
    if (title.toLowerCase().includes('revenue')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value as number);
    }
    
    if (title.toLowerCase().includes('rate')) {
      return `${(value as number).toFixed(1)}%`;
    }
    
    return (value as number).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200 hover:-translate-y-1">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-gray-100 p-3 rounded-lg">
            <div className="text-gray-600">{icon}</div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 uppercase tracking-wide">
            {title}
          </h3>
        </div>
      </div>

      <div className="mb-3">
        <p className="text-3xl font-bold text-gray-900">
          {typeof value === 'number' ? formatValue() : value}
        </p>
      </div>

      <div className="flex items-center space-x-2">
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

export default DashboardStatsCards;
```

---

## ✅ Final Result

The stats cards will have:
- ✅ Professional grey color scheme
- ✅ Real admin dashboard icons (Lucide React)
- ✅ Clean, modern design
- ✅ Hover effects
- ✅ Responsive layout
- ✅ Proper value formatting (currency, percentages)
- ✅ Trend indicators with up/down icons
- ✅ No AI-generated icons

---

**Use this guide to implement beautiful, professional admin dashboard stats cards!**

