import React from 'react';
import { BarChart as RechartsChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const BarChart = ({ data }) => {
return (
<ResponsiveContainer width="100%" height={300}>
<RechartsChart data={data}>
<CartesianGrid strokeDasharray="3 3" />
<XAxis dataKey="name" />
<YAxis />
<Tooltip />
<Bar dataKey="value" fill="#59DBCA" />
</RechartsChart>
</ResponsiveContainer>
 );
};
export default BarChart;