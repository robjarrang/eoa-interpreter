import React from 'react';
import { PieChart as RechartsChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card } from 'react-bootstrap';

const COLORS = ['#080043', '#004063', '#EEF2FB', '#EAEAEA', '#00DECA'];

const CustomLegend = ({ payload }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, width: '100%' }}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`} style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%'
          }}>
            <div style={{
              width: 12,
              height: 12,
              backgroundColor: entry.color,
              marginRight: '8px'
            }} />
            <span style={{ fontSize: '14px', color: 'white' }}>
              {entry.value} ({entry.payload.percent.toFixed(1)}%)
            </span>
          </div>
        </li>
      ))}
    </ul>
  );
};

const PieChart = ({ data, title, noCard = false }) => {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);
  const dataWithPercent = data.map(entry => ({
    ...entry,
    percent: (entry.value / total) * 100
  }));

  const chart = (
    <ResponsiveContainer width="100%" height={480}>
      <RechartsChart>
        <Pie
          data={dataWithPercent}
          cx="50%"
          cy="50%"
          outerRadius={130}
          fill="#8884d8"
          dataKey="value"
        >
          {dataWithPercent.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value, name, props) => [`${value} (${props.payload.percent.toFixed(1)}%)`, name]}
        />
        <Legend content={<CustomLegend />} verticalAlign="bottom" align="center" />
      </RechartsChart>
    </ResponsiveContainer>
  );

  if (noCard) {
    return chart;
  }

  return (
    <Card className="mb-3">
      <Card.Header>{title}</Card.Header>
      <Card.Body>
        {chart}
      </Card.Body>
    </Card>
  );
};

export default PieChart;