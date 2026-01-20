# Dashboard Stats Cards - Quick Reference

## 🎨 Quick Copy-Paste Component

### Install Dependencies
```bash
npm install lucide-react
```

### Complete Component (Tailwind CSS)
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

const StatCard = ({ title, value, trend, icon }) => {
  const isPositive = trend.direction === 'up';
  
  const formatValue = () => {
    if (title.includes('Revenue')) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
      }).format(value);
    }
    if (title.includes('Rate')) {
      return `${value.toFixed(1)}%`;
    }
    return value.toLocaleString();
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
        <p className="text-3xl font-bold text-gray-900">{formatValue()}</p>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className={`flex items-center space-x-1 px-2.5 py-1 rounded-md text-sm font-semibold ${
          isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
        }`}>
          {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
          <span>{trend.value}</span>
        </div>
        <span className="text-sm text-gray-500">
          {isPositive ? 'Higher' : 'Lower'} than Last Month
        </span>
      </div>
    </div>
  );
};

const DashboardStatsCards = ({ stats }) => {
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

## 🎨 Color Palette

```css
/* Grey Theme Colors */
--gray-50: #F9FAFB;
--gray-100: #F3F4F6;
--gray-200: #E5E7EB;
--gray-500: #6B7280;
--gray-600: #4B5563;
--gray-700: #374151;
--gray-900: #111827;

/* Trend Colors */
--green-50: #D1FAE5;
--green-700: #10B981;
--red-50: #FEE2E2;
--red-700: #EF4444;
```

---

## 📐 Layout

- **Grid:** 4 columns on desktop, 2 on tablet, 1 on mobile
- **Card Size:** Responsive, min-width 280px
- **Spacing:** 1.5rem gap between cards
- **Padding:** 1.5rem inside cards

---

## ✅ Features

- ✅ Grey color scheme
- ✅ Professional icons (Lucide React)
- ✅ Hover effects
- ✅ Responsive design
- ✅ Value formatting (currency, percentages)
- ✅ Trend indicators
- ✅ Clean, modern UI

---

**Ready to use!** Just copy the component code above.

