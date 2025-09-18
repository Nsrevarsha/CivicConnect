import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Download, 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  Users, 
  Clock, 
  CheckCircle,
  AlertTriangle,
  Filter,
  Calendar,
  FileDown,
  Activity
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Area,
  AreaChart,
  Legend,
  ComposedChart
} from 'recharts';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

// Using color variables from index.css for consistency
const COLORS = {
  primary: 'var(--color-chart-1)',
  secondary: 'var(--color-chart-2)',
  tertiary: 'var(--color-chart-3)',
  accent1: 'var(--color-chart-4)',
  accent2: 'var(--color-chart-5)',
  accent3: 'var(--color-primary)',
  accent4: 'var(--color-accent)',
  accent5: 'var(--color-muted)',
  accent6: 'var(--color-secondary)',
  neutral1: '#333333',
  neutral2: '#666666',
  neutral3: '#999999',
  success: 'var(--color-chart-2)',
  warning: 'var(--color-chart-4)',
  danger: 'var(--color-destructive)',
  light: 'var(--color-background)'
};

// Sample data for charts - Adapted for Indian government context
const monthlyData = [
  { month: 'Jan', tickets: 1420, resolved: 1280, sla: 89.2, digital: 65.3, paperless: 42.8 },
  { month: 'Feb', tickets: 1580, resolved: 1410, sla: 87.5, digital: 68.7, paperless: 45.2 },
  { month: 'Mar', tickets: 1730, resolved: 1620, sla: 91.8, digital: 72.4, paperless: 48.9 },
  { month: 'Apr', tickets: 1950, resolved: 1780, sla: 88.7, digital: 75.8, paperless: 52.3 },
  { month: 'May', tickets: 2100, resolved: 1920, sla: 92.1, digital: 78.2, paperless: 56.7 },
  { month: 'Jun', tickets: 1890, resolved: 1750, sla: 90.4, digital: 80.5, paperless: 59.4 }
];

const departmentData = [
  { name: 'Public Works', performance: 87, tickets: 890, avgTime: 2.1, digitalAdoption: 72.5, citizenSatisfaction: 3.8 },
  { name: 'Rural Development', performance: 92, tickets: 760, avgTime: 1.8, digitalAdoption: 68.3, citizenSatisfaction: 4.2 },
  { name: 'Urban Housing', performance: 78, tickets: 450, avgTime: 3.2, digitalAdoption: 65.7, citizenSatisfaction: 3.5 },
  { name: 'Water Resources', performance: 95, tickets: 1020, avgTime: 1.5, digitalAdoption: 81.2, citizenSatisfaction: 4.5 },
  { name: 'Health & Family Welfare', performance: 89, tickets: 670, avgTime: 2.4, digitalAdoption: 75.8, citizenSatisfaction: 4.1 },
  { name: 'Education', performance: 84, tickets: 580, avgTime: 2.9, digitalAdoption: 70.3, citizenSatisfaction: 3.9 }
];

const categoryData = [
  { name: 'Infrastructure', value: 450, percentage: 25.4, color: COLORS.primary },
  { name: 'Healthcare', value: 320, percentage: 18.1, color: COLORS.secondary },
  { name: 'Education', value: 280, percentage: 15.8, color: COLORS.tertiary },
  { name: 'Agriculture', value: 250, percentage: 14.1, color: COLORS.accent1 },
  { name: 'Water & Sanitation', value: 220, percentage: 12.4, color: COLORS.accent2 },
  { name: 'Digital Services', value: 180, percentage: 10.2, color: COLORS.accent3 },
  { name: 'Others', value: 70, percentage: 4.0, color: COLORS.accent4 }
];

const priorityData = [
  { priority: 'Critical', count: 80, percentage: 4.2, responseTime: '< 2 hours' },
  { priority: 'High', count: 310, percentage: 16.3, responseTime: '< 6 hours' },
  { priority: 'Medium', count: 890, percentage: 46.8, responseTime: '< 24 hours' },
  { priority: 'Low', count: 620, percentage: 32.6, responseTime: '< 72 hours' }
];

const satisfactionData = [
  { month: 'Jan', score: 4.2, digitalScore: 3.8, paperlessScore: 3.5 },
  { month: 'Feb', score: 4.1, digitalScore: 3.9, paperlessScore: 3.6 },
  { month: 'Mar', score: 4.4, digitalScore: 4.1, paperlessScore: 3.8 },
  { month: 'Apr', score: 4.3, digitalScore: 4.2, paperlessScore: 3.9 },
  { month: 'May', score: 4.6, digitalScore: 4.4, paperlessScore: 4.1 },
  { month: 'Jun', score: 4.5, digitalScore: 4.5, paperlessScore: 4.2 }
];

export default function Analytics() {
  const [dateRange, setDateRange] = useState('6months');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  const generateCSV = () => {
    // Enhanced CSV with more comprehensive data
    const headers = [
      'Month', 
      'Total Tickets', 
      'Resolved Tickets', 
      'SLA Compliance (%)', 
      'Digital Adoption (%)', 
      'Paperless Transactions (%)',
      'Citizen Satisfaction Score',
      'Response Time (Days)',
      'Resolution Rate (%)'
    ];
    
    const csvContent = [
      headers.join(','),
      ...monthlyData.map(row => {
        const resolutionRate = ((row.resolved / row.tickets) * 100).toFixed(1);
        return `${row.month},${row.tickets},${row.resolved},${row.sla},${row.digital},${row.paperless},${satisfactionData.find(s => s.month === row.month)?.score || 'N/A'},${(row.tickets / row.resolved * 0.021).toFixed(2)},${resolutionRate}`;
      })
    ].join('\n');
    
    // Add department data
    const deptHeaders = [
      '\n\nDepartment Performance',
      'Department,Performance Score (%),Total Tickets,Avg Resolution Time (Days),Digital Adoption (%),Citizen Satisfaction'
    ];
    
    const deptContent = departmentData.map(dept => 
      `${dept.name},${dept.performance},${dept.tickets},${dept.avgTime},${dept.digitalAdoption},${dept.citizenSatisfaction}`
    );
    
    // Add category data
    const categoryHeaders = [
      '\n\nIssue Categories',
      'Category,Count,Percentage (%)'
    ];
    
    const categoryContent = categoryData.map(cat => 
      `${cat.name},${cat.value},${cat.percentage}`
    );
    
    // Add priority data
    const priorityHeaders = [
      '\n\nPriority Distribution',
      'Priority,Count,Percentage (%),Target Response Time'
    ];
    
    const priorityContent = priorityData.map(p => 
      `${p.priority},${p.count},${p.percentage},${p.responseTime}`
    );
    
    const fullCSVContent = [
      csvContent,
      ...deptHeaders,
      ...deptContent,
      ...categoryHeaders,
      ...categoryContent,
      ...priorityHeaders,
      ...priorityContent
    ].join('\n');
    
    const blob = new Blob([fullCSVContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'indian-govt-analytics-report.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const generatePDF = async () => {
    // Calculate total tickets and average metrics for summary
    const totalTickets = monthlyData.reduce((sum, month) => sum + month.tickets, 0);
    const avgSLA = monthlyData.reduce((sum, month) => sum + month.sla, 0) / monthlyData.length;
    const avgDigitalAdoption = monthlyData.reduce((sum, month) => sum + month.digital, 0) / monthlyData.length;
    const avgResolutionTime = departmentData.reduce((sum, dept) => sum + dept.avgTime, 0) / departmentData.length;
    const avgSatisfaction = satisfactionData.reduce((sum, month) => sum + month.score, 0) / satisfactionData.length;
    
    // Create SVG charts for the PDF
    const monthlyTrendsChart = `
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .axis { font: 10px sans-serif; }
          .axis-label { font-size: 12px; font-weight: bold; }
          .line { fill: none; stroke-width: 2; }
          .line-tickets { stroke: #FF671F; }
          .line-digital { stroke: #046A38; }
          .grid { stroke: #e0e0e0; stroke-width: 0.5; }
        </style>
        <rect width="600" height="300" fill="#f8f9fa" />
        
        <!-- X and Y Axes -->
        <line x1="50" y1="250" x2="550" y2="250" stroke="#333" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#333" />
        
        <!-- X-axis labels -->
        ${monthlyData.map((d, i) => 
          `<text x="${50 + i * 100}" y="270" text-anchor="middle" class="axis">${d.month}</text>`
        ).join('')}
        
        <!-- Y-axis labels -->
        <text x="40" y="250" text-anchor="end" class="axis">0</text>
        <text x="40" y="200" text-anchor="end" class="axis">500</text>
        <text x="40" y="150" text-anchor="end" class="axis">1000</text>
        <text x="40" y="100" text-anchor="end" class="axis">1500</text>
        <text x="40" y="50" text-anchor="end" class="axis">2000</text>
        
        <!-- Grid lines -->
        <line x1="50" y1="200" x2="550" y2="200" class="grid" />
        <line x1="50" y1="150" x2="550" y2="150" class="grid" />
        <line x1="50" y1="100" x2="550" y2="100" class="grid" />
        <line x1="50" y1="50" x2="550" y2="50" class="grid" />
        
        <!-- Data lines -->
        <polyline class="line line-tickets" points="${monthlyData.map((d, i) => 
          `${50 + i * 100},${250 - (d.tickets / 2500) * 200}`
        ).join(' ')}" />
        
        <polyline class="line line-digital" points="${monthlyData.map((d, i) => 
          `${50 + i * 100},${250 - (d.digital / 100) * 200}`
        ).join(' ')}" />
        
        <!-- Legend -->
        <rect x="400" y="20" width="12" height="12" fill="#FF671F" />
        <text x="420" y="30" class="axis">Tickets</text>
        <rect x="480" y="20" width="12" height="12" fill="#046A38" />
        <text x="500" y="30" class="axis">Digital Adoption %</text>
        
        <!-- Title -->
        <text x="300" y="30" text-anchor="middle" class="axis-label">Monthly Trends - Tickets & Digital Adoption</text>
      </svg>
    `;
    
    const departmentPerformanceChart = `
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .axis { font: 10px sans-serif; }
          .axis-label { font-size: 12px; font-weight: bold; }
          .bar { fill: #046A38; }
          .bar-label { font-size: 9px; fill: white; text-anchor: middle; }
        </style>
        <rect width="600" height="300" fill="#f8f9fa" />
        
        <!-- X and Y Axes -->
        <line x1="150" y1="250" x2="550" y2="250" stroke="#333" />
        <line x1="150" y1="50" x2="150" y2="250" stroke="#333" />
        
        <!-- Title -->
        <text x="300" y="30" text-anchor="middle" class="axis-label">Department Performance</text>
        
        <!-- Bars and labels -->
        ${departmentData.map((d, i) => `
          <rect x="${160 + i * 65}" y="${250 - (d.performance / 100) * 200}" width="50" height="${(d.performance / 100) * 200}" class="bar" />
          <text x="${185 + i * 65}" y="${245 - (d.performance / 100) * 200}" class="bar-label">${d.performance}%</text>
          <text x="${185 + i * 65}" y="270" text-anchor="middle" class="axis" transform="rotate(45, ${185 + i * 65}, 270)">${d.name.substring(0, 10)}</text>
        `).join('')}
        
        <!-- Y-axis labels -->
        <text x="140" y="250" text-anchor="end" class="axis">0%</text>
        <text x="140" y="200" text-anchor="end" class="axis">25%</text>
        <text x="140" y="150" text-anchor="end" class="axis">50%</text>
        <text x="140" y="100" text-anchor="end" class="axis">75%</text>
        <text x="140" y="50" text-anchor="end" class="axis">100%</text>
      </svg>
    `;
    
    const categoryPieChart = `
      <svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .axis { font: 10px sans-serif; }
          .axis-label { font-size: 12px; font-weight: bold; }
          .slice-label { font-size: 9px; fill: white; text-anchor: middle; }
        </style>
        <rect width="400" height="300" fill="#f8f9fa" />
        
        <!-- Title -->
        <text x="200" y="30" text-anchor="middle" class="axis-label">Issue Categories Distribution</text>
        
        <!-- Pie chart -->
        ${(() => {
          let startAngle = 0;
          const total = categoryData.reduce((sum, cat) => sum + cat.value, 0);
          const radius = 100;
          const cx = 200;
          const cy = 150;
          
          // Define explicit colors for the pie slices
          const pieColors = ['#FF671F', '#046A38', '#0073CF', '#6B5B95', '#88B04B'];
          
          return categoryData.map((cat, i) => {
            const percentage = cat.value / total;
            const endAngle = startAngle + percentage * 2 * Math.PI;
            
            // Calculate the SVG arc path
            const x1 = cx + radius * Math.cos(startAngle);
            const y1 = cy + radius * Math.sin(startAngle);
            const x2 = cx + radius * Math.cos(endAngle);
            const y2 = cy + radius * Math.sin(endAngle);
            
            // Determine if the arc is large or small
            const largeArcFlag = percentage > 0.5 ? 1 : 0;
            
            // Create the path for the slice
            const pathData = `M ${cx},${cy} L ${x1},${y1} A ${radius},${radius} 0 ${largeArcFlag} 1 ${x2},${y2} Z`;
            
            // Calculate position for the label
            const labelAngle = startAngle + (endAngle - startAngle) / 2;
            const labelRadius = radius * 0.7;
            const labelX = cx + labelRadius * Math.cos(labelAngle);
            const labelY = cy + labelRadius * Math.sin(labelAngle);
            
            // Calculate position for the legend item
            const legendX = 320;
            const legendY = 80 + i * 20;
            
            // Use explicit color from array or fallback to a default
            const sliceColor = pieColors[i % pieColors.length];
            
            const result = `
              <path d="${pathData}" fill="${sliceColor}" />
              <text x="${labelX}" y="${labelY}" class="slice-label">${cat.percentage}%</text>
              <rect x="${legendX - 15}" y="${legendY - 8}" width="10" height="10" fill="${sliceColor}" />
              <text x="${legendX}" y="${legendY}" class="axis">${cat.name}</text>
            `;
            
            startAngle = endAngle;
            return result;
          }).join('');
        })()}
      </svg>
    `;
    
    const satisfactionChart = `
      <svg width="600" height="300" xmlns="http://www.w3.org/2000/svg">
        <style>
          .axis { font: 10px sans-serif; }
          .axis-label { font-size: 12px; font-weight: bold; }
          .line { fill: none; stroke-width: 2; }
          .line-satisfaction { stroke: #FF671F; }
          .line-digital { stroke: #046A38; }
          .line-paperless { stroke: #0073CF; }
          .grid { stroke: #e0e0e0; stroke-width: 0.5; }
        </style>
        <rect width="600" height="300" fill="#f8f9fa" />
        
        <!-- X and Y Axes -->
        <line x1="50" y1="250" x2="550" y2="250" stroke="#333" />
        <line x1="50" y1="50" x2="50" y2="250" stroke="#333" />
        
        <!-- X-axis labels -->
        ${satisfactionData.map((d, i) => 
          `<text x="${50 + i * 100}" y="270" text-anchor="middle" class="axis">${d.month}</text>`
        ).join('')}
        
        <!-- Y-axis labels -->
        <text x="40" y="250" text-anchor="end" class="axis">0</text>
        <text x="40" y="200" text-anchor="end" class="axis">1</text>
        <text x="40" y="150" text-anchor="end" class="axis">2</text>
        <text x="40" y="100" text-anchor="end" class="axis">3</text>
        <text x="40" y="50" text-anchor="end" class="axis">4</text>
        <text x="40" y="25" text-anchor="end" class="axis">5</text>
        
        <!-- Grid lines -->
        <line x1="50" y1="200" x2="550" y2="200" class="grid" />
        <line x1="50" y1="150" x2="550" y2="150" class="grid" />
        <line x1="50" y1="100" x2="550" y2="100" class="grid" />
        <line x1="50" y1="50" x2="550" y2="50" class="grid" />
        
        <!-- Data lines -->
        <polyline class="line line-satisfaction" points="${satisfactionData.map((d, i) => 
          `${50 + i * 100},${250 - (d.score / 5) * 200}`
        ).join(' ')}" />
        
        <polyline class="line line-digital" points="${satisfactionData.map((d, i) => 
          `${50 + i * 100},${250 - (d.digitalScore / 5) * 200}`
        ).join(' ')}" />
        
        <polyline class="line line-paperless" points="${satisfactionData.map((d, i) => 
          `${50 + i * 100},${250 - (d.paperlessScore / 5) * 200}`
        ).join(' ')}" />
        
        <!-- Legend -->
        <rect x="350" y="20" width="12" height="12" fill="#FF671F" />
        <text x="370" y="30" class="axis">Overall</text>
        <rect x="420" y="20" width="12" height="12" fill="#046A38" />
        <text x="440" y="30" class="axis">Digital</text>
        <rect x="490" y="20" width="12" height="12" fill="#0073CF" />
        <text x="510" y="30" class="axis">Paperless</text>
        
        <!-- Title -->
        <text x="300" y="30" text-anchor="middle" class="axis-label">Citizen Satisfaction Scores (out of 5)</text>
      </svg>
    `;
    
    // Create a comprehensive HTML report for PDF generation with actual SVG charts
    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Indian Government Services Analytics Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
            .header { text-align: center; border-bottom: 2px solid #FF671F; padding-bottom: 20px; }
            .header h1 { color: #046A38; }
            .header img { height: 60px; margin-bottom: 10px; }
            .subtitle { color: #06038D; font-style: italic; }
            .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin: 20px 0; }
            .metric { border: 1px solid #ddd; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
            .metric-value { font-size: 24px; font-weight: bold; color: #FF671F; }
            .metric-trend-up { color: #046A38; }
            .metric-trend-down { color: #FF671F; }
            .chart-section { margin: 30px 0; border: 1px solid #eee; padding: 20px; border-radius: 8px; }
            .chart-title { font-size: 18px; font-weight: bold; margin-bottom: 10px; color: #06038D; }
            .chart-container { margin: 15px 0; text-align: center; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            th { background-color: #046A38; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 1px solid #ddd; padding-top: 20px; }
            .performance-bar { height: 15px; background-color: #eee; border-radius: 10px; overflow: hidden; }
            .performance-value { height: 100%; background-color: #FF671F; }
            .digital-initiatives { margin: 30px 0; }
            .initiative { margin-bottom: 15px; }
            .initiative-title { font-weight: bold; color: #06038D; }
            .initiative-progress { margin-top: 5px; }
            .two-column { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
            @media print {
              .chart-section { break-inside: avoid; }
              .metrics { break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Indian Government Services Analytics Report</h1>
            <p class="subtitle">Digital India Initiative Performance Metrics</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>
          
          <div class="metrics">
            <div class="metric">
              <h3>Total Grievances</h3>
              <div class="metric-value">${totalTickets.toLocaleString()}</div>
              <p class="metric-trend-up">+12.3% from last period</p>
            </div>
            <div class="metric">
              <h3>SLA Compliance</h3>
              <div class="metric-value">${avgSLA.toFixed(1)}%</div>
              <p class="metric-trend-up">+2.1% from last period</p>
            </div>
            <div class="metric">
              <h3>Digital Adoption</h3>
              <div class="metric-value">${avgDigitalAdoption.toFixed(1)}%</div>
              <p class="metric-trend-up">+5.8% from last period</p>
            </div>
            <div class="metric">
              <h3>Avg Resolution Time</h3>
              <div class="metric-value">${avgResolutionTime.toFixed(1)} days</div>
              <p class="metric-trend-down">-0.3 days from last period</p>
            </div>
          </div>

          <div class="chart-section">
            <h2 class="chart-title">Monthly Trends - Grievances & Digital Adoption</h2>
            <div class="chart-container">
              ${monthlyTrendsChart}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Total Grievances</th>
                  <th>Resolved</th>
                  <th>SLA Compliance</th>
                  <th>Digital Adoption</th>
                  <th>Paperless</th>
                </tr>
              </thead>
              <tbody>
                ${monthlyData.map(row => `
                  <tr>
                    <td>${row.month}</td>
                    <td>${row.tickets.toLocaleString()}</td>
                    <td>${row.resolved.toLocaleString()}</td>
                    <td>${row.sla}%</td>
                    <td>${row.digital}%</td>
                    <td>${row.paperless}%</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="two-column">
            <div class="chart-section">
              <h2 class="chart-title">Department Performance</h2>
              <div class="chart-container">
                ${departmentPerformanceChart}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Department</th>
                    <th>Performance</th>
                    <th>Digital Adoption</th>
                  </tr>
                </thead>
                <tbody>
                  ${departmentData.map(dept => `
                    <tr>
                      <td>${dept.name}</td>
                      <td>
                        <div class="performance-bar">
                          <div class="performance-value" style="width: ${dept.performance}%"></div>
                        </div>
                        ${dept.performance}%
                      </td>
                      <td>${dept.digitalAdoption}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>

            <div class="chart-section">
              <h2 class="chart-title">Issue Categories Distribution</h2>
              <div class="chart-container">
                ${categoryPieChart}
              </div>
              <table>
                <thead>
                  <tr>
                    <th>Category</th>
                    <th>Count</th>
                    <th>Percentage</th>
                  </tr>
                </thead>
                <tbody>
                  ${categoryData.map(cat => `
                    <tr>
                      <td>${cat.name}</td>
                      <td>${cat.value}</td>
                      <td>${cat.percentage}%</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>

          <div class="chart-section">
            <h2 class="chart-title">Citizen Satisfaction Trends</h2>
            <div class="chart-container">
              ${satisfactionChart}
            </div>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Overall Score</th>
                  <th>Digital Services</th>
                  <th>Paperless Processes</th>
                </tr>
              </thead>
              <tbody>
                ${satisfactionData.map(row => `
                  <tr>
                    <td>${row.month}</td>
                    <td>${row.score}/5</td>
                    <td>${row.digitalScore}/5</td>
                    <td>${row.paperlessScore}/5</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="chart-section">
            <h2 class="chart-title">Digital India Initiatives Progress</h2>
            <div class="digital-initiatives">
              <div class="initiative">
                <div class="initiative-title">DigiLocker Adoption</div>
                <div class="initiative-progress">
                  <div class="performance-bar">
                    <div class="performance-value" style="width: 72%; background-color: #0073CF;"></div>
                  </div>
                  <div>72% of target achieved</div>
                </div>
              </div>
              <div class="initiative">
                <div class="initiative-title">UMANG App Services</div>
                <div class="initiative-progress">
                  <div class="performance-bar">
                    <div class="performance-value" style="width: 85%; background-color: #FF671F;"></div>
                  </div>
                  <div>85% of target achieved</div>
                </div>
              </div>
              <div class="initiative">
                <div class="initiative-title">Aadhaar Enabled Services</div>
                <div class="initiative-progress">
                  <div class="performance-bar">
                    <div class="performance-value" style="width: 94%; background-color: #046A38;"></div>
                  </div>
                  <div>94% of target achieved</div>
                </div>
              </div>
              <div class="initiative">
                <div class="initiative-title">e-Governance Implementation</div>
                <div class="initiative-progress">
                  <div class="performance-bar">
                    <div class="performance-value" style="width: 68%; background-color: #06038D;"></div>
                  </div>
                  <div>68% of target achieved</div>
                </div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This report is generated automatically by the Civic Connect platform.</p>
            <p>For more information, please contact the Digital India Initiative team.</p>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(reportHTML);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
          <p className="text-gray-600 mt-1">Comprehensive insights and performance metrics</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between">
                  {dateRange === "1month" && "Last Month"}
                  {dateRange === "3months" && "Last 3 Months"}
                  {dateRange === "6months" && "Last 6 Months"}
                  {dateRange === "1year" && "Last Year"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]">
                <DropdownMenuRadioGroup
                  value={dateRange}
                  onValueChange={setDateRange}
                >
                  <DropdownMenuRadioItem value="1month">
                    Last Month
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="3months">
                    Last 3 Months
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="6months">
                    Last 6 Months
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="1year">
                    Last Year
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-[150px] justify-between">
                  {selectedDepartment === "all" && "All Departments"}
                  {selectedDepartment === "public-works" && "Public Works"}
                  {selectedDepartment === "transportation" && "Transportation"}
                  {selectedDepartment === "utilities" && "Utilities"}
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[150px]">
                <DropdownMenuRadioGroup
                  value={selectedDepartment}
                  onValueChange={setSelectedDepartment}
                >
                  <DropdownMenuRadioItem value="all">
                    All Departments
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="public-works">
                    Public Works
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="transportation">
                    Transportation
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="utilities">
                    Utilities
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={generateCSV}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={generatePDF}>
              <FileDown className="h-4 w-4 mr-2" />
              PDF Report
            </Button>
          </div>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-slate-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Tickets</p>
                <p className="text-3xl font-bold text-gray-900">1,067</p>
                <p className="text-sm text-emerald-600 mt-1">+12.3% from last month</p>
              </div>
              <Activity className="h-8 w-8 text-slate-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">SLA Compliance</p>
                <p className="text-3xl font-bold text-gray-900">90.2%</p>
                <p className="text-sm text-emerald-600 mt-1">+2.1% from last month</p>
              </div>
              <CheckCircle className="h-8 w-8 text-emerald-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-indigo-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Avg Resolution Time</p>
                <p className="text-3xl font-bold text-gray-900">2.1 days</p>
                <p className="text-sm text-emerald-600 mt-1">-0.3 days improvement</p>
              </div>
              <Clock className="h-8 w-8 text-indigo-400" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-400">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Satisfaction Score</p>
                <p className="text-3xl font-bold text-gray-900">4.5/5</p>
                <p className="text-sm text-emerald-600 mt-1">+0.2 from last month</p>
              </div>
              <Users className="h-8 w-8 text-amber-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="h-5 w-5 mr-2" />
              Monthly Grievance Trends & SLA Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="monthly-chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <ComposedChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Bar yAxisId="left" dataKey="tickets" fill={COLORS.primary} name="Total Grievances" barSize={40} />
                <Line yAxisId="right" type="monotone" dataKey="sla" stroke={COLORS.secondary} strokeWidth={3} name="SLA %" />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <BarChart3 className="h-5 w-5 mr-2" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent className="department-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={departmentData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="name" type="category" width={120} />
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                <Bar dataKey="performance" fill={COLORS.tertiary} barSize={20} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Issue Categories */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <PieChart className="h-5 w-5 mr-2" />
              Issue Categories Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="category-chart-container">
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({name, percentage}) => `${name}: ${percentage}%`}
                >
                  {categoryData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={[COLORS.primary, COLORS.secondary, COLORS.tertiary, COLORS.accent1, COLORS.accent2][index % 5]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
              </RechartsPieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Priority Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {priorityData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${
                      item.priority === 'Critical' ? 'bg-rose-400' :
                      item.priority === 'High' ? 'bg-amber-400' :
                      item.priority === 'Medium' ? 'bg-yellow-300' : 'bg-emerald-400'
                    }`}></div>
                    <span className="text-sm font-medium">{item.priority}</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold">{item.count}</div>
                    <div className="text-xs text-gray-500">{item.percentage}%</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction Trend */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Customer Satisfaction Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={satisfactionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[3.5, 5]} />
                <Tooltip formatter={(value) => [`${value}/5`, 'Satisfaction Score']} />
                <Area 
                  type="monotone" 
                  dataKey="score" 
                  stroke="#64748b" 
                  fill="#64748b" 
                  fillOpacity={0.2} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Department Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3 font-semibold">Department</th>
                  <th className="text-left p-3 font-semibold">Performance Score</th>
                  <th className="text-left p-3 font-semibold">Total Tickets</th>
                  <th className="text-left p-3 font-semibold">Resolved</th>
                  <th className="text-left p-3 font-semibold">Avg Resolution Time</th>
                  <th className="text-left p-3 font-semibold">SLA Compliance</th>
                </tr>
              </thead>
              <tbody>
                {departmentData.map((dept, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="p-3 font-medium">{dept.name}</td>
                    <td className="p-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-slate-500 h-2 rounded-full" 
                            style={{ width: `${dept.performance}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{dept.performance}%</span>
                      </div>
                    </td>
                    <td className="p-3">{dept.tickets}</td>
                    <td className="p-3">{Math.round(dept.tickets * 0.92)}</td>
                    <td className="p-3">{dept.avgTime} days</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        dept.performance >= 90 ? 'bg-emerald-100 text-emerald-700' :
                        dept.performance >= 80 ? 'bg-amber-100 text-amber-700' :
                        'bg-rose-100 text-rose-700'
                      }`}>
                        {dept.performance >= 90 ? 'Excellent' :
                         dept.performance >= 80 ? 'Good' : 'Needs Improvement'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}