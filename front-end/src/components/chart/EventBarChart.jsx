import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, CartesianGrid, ResponsiveContainer,
} from 'recharts';

const data = [
  { month: 'Dec', attended: 15, total: 5 },
  { month: 'Jan', attended: 13, total: 6 },
  { month: 'Feb', attended: 16, total: 6 },
  { month: 'Mar', attended: 17, total: 6 },
  { month: 'Apr', attended: 18, total: 6 },
  { month: 'May', attended: 19, total: 6 },
];

const EventBarChart = () => (
  <div className="w-full h-96">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 30, right: 30, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="attended" stackId="a" fill="#fca5a5" name="Attended" />
        <Bar dataKey="total" stackId="a" fill="#7dd3fc" name="Total" />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default EventBarChart;
