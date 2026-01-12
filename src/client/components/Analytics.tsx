import React, { useState, useEffect } from 'react';
import './Analytics.css';

interface TaskAnalytics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  averagePriority: number;
  totalEstimatedTime: number;
  totalActualTime: number;
  overdueTasks: number;
  tasksByCategory: Record<string, number>;
  tasksByPriority: Record<number, number>;
}

const Analytics: React.FC = () => {
  const [analytics, setAnalytics] = useState<TaskAnalytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/tasks/analytics');
      const result = await response.json() as { 
        success: boolean; 
        data: {
          totalTasks: number;
          completedTasks: number;
          pendingTasks: number;
          averagePriority: number;
          totalEstimatedTime: number;
          totalActualTime: number;
          overdueTasks: number;
          tasksByCategory: Record<string, number>;
          tasksByPriority: Record<number, number>;
        }
      };
      if (result.success) {
        setAnalytics(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analytics) {
    return <div className="analytics-error">Failed to load analytics</div>;
  }

  const completionRate = analytics.totalTasks > 0
    ? Math.round((analytics.completedTasks / analytics.totalTasks) * 100)
    : 0;

  const timeEfficiency = analytics.totalEstimatedTime > 0
    ? Math.round((analytics.totalActualTime / analytics.totalEstimatedTime) * 100)
    : 0;

  return (
    <div className="analytics">
      <h2>📊 Task Analytics Dashboard</h2>

      <div className="analytics-grid">
        {/* Overview Cards */}
        <div className="analytics-card overview">
          <h3>📈 Overview</h3>
          <div className="metrics">
            <div className="metric">
              <span className="value">{analytics.totalTasks}</span>
              <span className="label">Total Tasks</span>
            </div>
            <div className="metric">
              <span className="value">{analytics.completedTasks}</span>
              <span className="label">Completed</span>
            </div>
            <div className="metric">
              <span className="value">{analytics.pendingTasks}</span>
              <span className="label">Pending</span>
            </div>
            <div className="metric">
              <span className="value">{analytics.overdueTasks}</span>
              <span className="label">Overdue</span>
            </div>
          </div>
        </div>

        {/* Completion Rate */}
        <div className="analytics-card completion">
          <h3>✅ Completion Rate</h3>
          <div className="progress-circle">
            <div className="circle">
              <div className="circle-fill" style={{'--percentage': `${completionRate}%`} as React.CSSProperties}>
                <span className="percentage">{completionRate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Time Tracking */}
        <div className="analytics-card time">
          <h3>⏱️ Time Tracking</h3>
          <div className="time-metrics">
            <div className="metric">
              <span className="value">{analytics.totalEstimatedTime}</span>
              <span className="label">Est. Hours</span>
            </div>
            <div className="metric">
              <span className="value">{analytics.totalActualTime}</span>
              <span className="label">Actual Hours</span>
            </div>
            <div className="metric">
              <span className="value">{timeEfficiency}%</span>
              <span className="label">Efficiency</span>
            </div>
          </div>
        </div>

        {/* Priority Distribution */}
        <div className="analytics-card priority">
          <h3>🎯 Priority Distribution</h3>
          <div className="priority-bars">
            {[5, 4, 3, 2, 1].map(priority => (
              <div key={priority} className="priority-bar">
                <span className="priority-label">P{priority}</span>
                <div className="bar">
                  <div
                    className="bar-fill"
                    style={{
                      width: `${analytics.totalTasks > 0 ? (analytics.tasksByPriority[priority] || 0) / analytics.totalTasks * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="count">{analytics.tasksByPriority[priority] || 0}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analytics-card category">
          <h3>📂 Category Breakdown</h3>
          <div className="category-list">
            {Object.entries(analytics.tasksByCategory).map(([category, count]) => (
              <div key={category} className="category-item">
                <span className="category-name">{category}</span>
                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{
                      width: `${analytics.totalTasks > 0 ? (count / analytics.totalTasks) * 100 : 0}%`
                    }}
                  ></div>
                </div>
                <span className="category-count">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Insights */}
        <div className="analytics-card insights">
          <h3>💡 Insights</h3>
          <div className="insights-list">
            {analytics.overdueTasks > 0 && (
              <div className="insight warning">
                ⚠️ You have {analytics.overdueTasks} overdue task{analytics.overdueTasks > 1 ? 's' : ''}
              </div>
            )}
            {completionRate >= 80 && (
              <div className="insight success">
                🎉 Great job! Your completion rate is {completionRate}%
              </div>
            )}
            {timeEfficiency > 100 && (
              <div className="insight info">
                📊 You're spending {timeEfficiency - 100}% more time than estimated
              </div>
            )}
            {analytics.averagePriority > 3 && (
              <div className="insight priority">
                🔥 Most of your tasks are high priority - consider balancing your workload
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;