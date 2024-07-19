import React from 'react';
import { LineChart as RechartsChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const LineChart = ({ data, xKey, yKey }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsChart data={data}>
        <XAxis dataKey={xKey} />
        <YAxis />
        <CartesianGrid strokeDasharray="3 3" />
        <Tooltip />
        <Line type="monotone" dataKey={yKey} stroke="#00DECA" />
      </RechartsChart>
    </ResponsiveContainer>
  );
};

export default LineChart;