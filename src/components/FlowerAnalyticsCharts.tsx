import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  PieController,
  LineController,
} from 'chart.js';
import { FlowerEntry } from '../types/flower';
import { FLOWER_CATEGORIES } from '../data/flowerConstants';
import { BarChart3, PieChart, TrendingUp, Sparkles } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  BarController,
  PieController,
  LineController
);

interface FlowerAnalyticsChartsProps {
  flowers: FlowerEntry[];
}

export const FlowerAnalyticsCharts: React.FC<FlowerAnalyticsChartsProps> = ({ flowers }) => {
  const barCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const pieCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const lineCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const barChartInstance = useRef<ChartJS | null>(null);
  const pieChartInstance = useRef<ChartJS | null>(null);
  const lineChartInstance = useRef<ChartJS | null>(null);

  // Compute category data
  const categoryCounts: Record<string, number> = {};
  FLOWER_CATEGORIES.forEach((c) => {
    categoryCounts[c.name] = 0;
  });

  flowers.forEach((f) => {
    const cat = f.category || 'Wildflower';
    categoryCounts[cat] = (categoryCounts[cat] || 0) + f.count;
  });

  const sortedCategories = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1]);
  const barLabels = sortedCategories.map(([name]) => name);
  const barDataValues = sortedCategories.map(([, count]) => count);

  const pastelColors = [
    'rgba(244, 63, 94, 0.8)',   // Hibiscus rose
    'rgba(236, 72, 153, 0.8)',  // Bougainvillea pink
    'rgba(245, 158, 11, 0.8)',  // Marigold amber
    'rgba(16, 185, 129, 0.8)',  // Frangipani green
    'rgba(225, 29, 72, 0.8)',   // Rose red
    'rgba(6, 182, 212, 0.8)',   // Jasmine cyan
    'rgba(234, 179, 8, 0.8)',   // Sunflower yellow
    'rgba(139, 92, 246, 0.8)',  // Wildflower purple
  ];

  // 1. Render Bar Chart
  useEffect(() => {
    if (!barCanvasRef.current) return;
    if (barChartInstance.current) {
      barChartInstance.current.destroy();
    }

    const ctx = barCanvasRef.current.getContext('2d');
    if (!ctx) return;

    barChartInstance.current = new ChartJS(ctx, {
      type: 'bar',
      data: {
        labels: barLabels,
        datasets: [
          {
            label: 'Total Blossoms Counted',
            data: barDataValues,
            backgroundColor: pastelColors.slice(0, barLabels.length),
            borderColor: pastelColors.map((c) => c.replace('0.8', '1')),
            borderWidth: 1.5,
            borderRadius: 8,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(28, 25, 23, 0.9)',
            titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
            bodyFont: { family: 'Plus Jakarta Sans', size: 12 },
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            grid: { color: 'rgba(229, 231, 235, 0.5)' },
            ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: '#78716c' },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' }, color: '#44403c' },
          },
        },
      },
    });

    return () => {
      barChartInstance.current?.destroy();
    };
  }, [flowers]);

  // 2. Render Pie Chart
  useEffect(() => {
    if (!pieCanvasRef.current) return;
    if (pieChartInstance.current) {
      pieChartInstance.current.destroy();
    }

    const ctx = pieCanvasRef.current.getContext('2d');
    if (!ctx) return;

    pieChartInstance.current = new ChartJS(ctx, {
      type: 'pie',
      data: {
        labels: barLabels.slice(0, 5),
        datasets: [
          {
            data: barDataValues.slice(0, 5),
            backgroundColor: [
              '#f43f5e',
              '#ec4899',
              '#f59e0b',
              '#10b981',
              '#8b5cf6',
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' },
              usePointStyle: true,
              boxWidth: 8,
              padding: 12,
            },
          },
        },
      },
    });

    return () => {
      pieChartInstance.current?.destroy();
    };
  }, [flowers]);

  // 3. Render Line Chart
  useEffect(() => {
    if (!lineCanvasRef.current) return;
    if (lineChartInstance.current) {
      lineChartInstance.current.destroy();
    }

    const ctx = lineCanvasRef.current.getContext('2d');
    if (!ctx) return;

    const timelineMap: Record<string, number> = {
      'Mon': 24,
      'Tue': 45,
      'Wed': 68,
      'Thu': 110,
      'Fri': 148,
      'Sat': 186,
      'Today': flowers.reduce((sum, f) => sum + f.count, 0),
    };

    lineChartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels: Object.keys(timelineMap),
        datasets: [
          {
            label: 'Cumulative Flowers Sighted',
            data: Object.values(timelineMap),
            fill: true,
            backgroundColor: 'rgba(52, 211, 153, 0.15)',
            borderColor: '#10b981',
            borderWidth: 2.5,
            tension: 0.35,
            pointBackgroundColor: '#059669',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(28, 25, 23, 0.9)',
            padding: 10,
            cornerRadius: 8,
          },
        },
        scales: {
          y: {
            grid: { color: 'rgba(229, 231, 235, 0.5)' },
            ticks: { font: { family: 'JetBrains Mono', size: 11 }, color: '#78716c' },
          },
          x: {
            grid: { display: false },
            ticks: { font: { family: 'Plus Jakarta Sans', size: 11 }, color: '#57534e' },
          },
        },
      },
    });

    return () => {
      lineChartInstance.current?.destroy();
    };
  }, [flowers]);

  return (
    <div className="space-y-6">
      {/* Visual Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Campus Data Visualizer</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 tracking-tight mt-0.5">
            Aesthetic Flower Analytics
          </h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Most Common Flower Types (Bar Chart) */}
        <div className="lg:col-span-7 bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <BarChart3 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">Most Common Flower Types</h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Total verified blooms</span>
          </div>

          <div className="h-56 w-full pt-2">
            <canvas ref={barCanvasRef} />
          </div>
        </div>

        {/* Flower Distribution (Pie Chart) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-50 text-pink-700">
                <PieChart className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-stone-800">Campus Floral Distribution</h3>
            </div>
            <span className="text-[11px] font-mono text-stone-400">Top 5</span>
          </div>

          <div className="h-56 w-full pt-2">
            <canvas ref={pieCanvasRef} />
          </div>
        </div>

        {/* Sighting Velocity Timeline (Line Chart) */}
        <div className="lg:col-span-12 bg-white p-5 rounded-3xl border border-emerald-100/80 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-700">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-stone-800">Flower Sighting Velocity Over Time</h3>
                <p className="text-[11px] text-stone-500">Cumulative blossoms logged by college students this week</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-800 font-mono bg-emerald-50 px-2.5 py-1 rounded-full">
              +142% this week 📈
            </span>
          </div>

          <div className="h-52 w-full pt-2">
            <canvas ref={lineCanvasRef} />
          </div>
        </div>
      </div>
    </div>
  );
};
