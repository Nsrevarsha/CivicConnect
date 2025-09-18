import { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'compact' | 'detailed' | 'minimal';
}

export default function DashboardCard({ 
  title, 
  value, 
  icon, 
  description, 
  trend,
  size = 'md',
  variant = 'default'
}: DashboardCardProps) {
  // Dynamic sizing based on size prop
  const sizeClasses = {
    sm: {
      card: 'min-h-[170px]',
      title: 'text-sm font-semibold',
      value: 'text-2xl font-bold',
      icon: 'p-2',
      description: 'text-xs',
      trend: 'text-sm'
    },
    md: {
      card: 'min-h-[190px]',
      title: 'text-base font-semibold',
      value: 'text-3xl sm:text-4xl font-bold',
      icon: 'p-3',
      description: 'text-xs',
      trend: 'text-sm'
    },
    lg: {
      card: 'min-h-[210px]',
      title: 'text-lg font-semibold',
      value: 'text-4xl sm:text-5xl font-bold',
      icon: 'p-4',
      description: 'text-sm',
      trend: 'text-base'
    }
  };

  // Dynamic layout based on variant
  const variantClasses = {
    default: 'flex flex-row items-center justify-between space-y-0',
    compact: 'flex flex-col items-center text-center space-y-2',
    detailed: 'flex flex-col space-y-3',
    minimal: 'flex flex-row items-center gap-2'
  };

  const currentSize = sizeClasses[size];
  const currentVariant = variantClasses[variant];

  return (
    <Card className={`${variant === 'minimal' ? 'shadow-none border-neutral-200' : 'shadow-lg hover:shadow-xl border-primary-200'} border transition-all duration-200 h-full ${currentSize.card} p-0`}>
      <CardHeader className={`${currentVariant} p-2`}>
        <CardTitle className={`${currentSize.title} text-primary-800 leading-tight`}>
          {title}
        </CardTitle>
        <div className={`${currentSize.icon} ${variant === 'minimal' ? '' : 'rounded-lg bg-primary-50'} flex-shrink-0`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent className="p-2 flex flex-col justify-between flex-1">
        <div>
          <div className={`${currentSize.value} text-primary-900 ${variant === 'minimal' ? 'mb-1' : 'mb-3'}`}>
            {value}
          </div>
          {description && (
            <p className={`${currentSize.description} ${variant === 'minimal' ? 'text-primary-500' : 'text-primary-500'} leading-relaxed ${variant === 'minimal' ? '' : 'line-clamp-2'}`}>
              {description}
            </p>
          )}
        </div>
        {trend && (
          <div className={`${currentSize.trend} mt-3 flex items-center gap-1 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <span className="font-medium">
              {trend.isPositive ? '↗' : '↘'} {Math.abs(trend.value)}%
            </span>
            <span className="text-primary-500">from last period</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
