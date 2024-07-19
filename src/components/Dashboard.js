import React, { useState, useRef } from 'react';
import { Container, Row, Col, Form, Alert, Button, Navbar, Nav, Card, Table } from 'react-bootstrap';
import { parseCSV } from '../utils/csvParser';
import * as DataPrep from '../utils/dataPreparation';
import PieChart from './charts/PieChart';
import LineChart from './charts/LineChart';
import BarChart from './charts/BarChart';
import WorldMap from './WorldMap';
import { exportAllCharts } from '../utils/exportUtils';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Refs for charts
  const readTimeFalloffRef = useRef(null);
  const engagementDistributionRef = useRef(null);
  const dailyActivityRef = useRef(null);
  const topEmailClientsRef = useRef(null);
  const readingEnvironmentRef = useRef(null);
  const renderingEnginesRef = useRef(null);
  const browserUsageRef = useRef(null);
  const worldMapRef = useRef(null);

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setIsLoading(true);
    reader.onload = (e) => {
      const text = e.target.result;
      console.log('File content length:', text.length);
      try {
        const parsedData = parseCSV(text);
        console.log('Parsed data:', parsedData);
        setData(parsedData);
        setError(null);
      } catch (err) {
        console.error("Error parsing CSV:", err);
        setError("Error parsing CSV: " + err.message);
      } finally {
        setIsLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString();
    } else if (typeof value === 'string') {
      return value;
    } else {
      return JSON.stringify(value);
    }
  };

  const handleExportAllCharts = () => {
    const chartRefs = {
      readTimeFalloff: readTimeFalloffRef,
      engagementDistribution: engagementDistributionRef,
      dailyActivity: dailyActivityRef,
      topEmailClients: topEmailClientsRef,
      readingEnvironment: readingEnvironmentRef,
      renderingEngines: renderingEnginesRef,
      browserUsage: browserUsageRef,
      worldMap: worldMapRef,
    };
    exportAllCharts(chartRefs);
  };

  return (
    <>
      <Navbar expand="lg" className="mb-3">
      <Container fluid>
        <Navbar.Brand className="d-flex align-items-center">
          <img
            src="https://www.jarrang.com/brand/apple-touch-icon.png"
            width="30"
            height="30"
            className="d-inline-block align-top me-2"
            alt="Jarrang Logo"
          />
          Email Analytics Dashboard
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
            <Nav>
              <Form.Group controlId="formFile" className="me-2">
                <Form.Label className="visually-hidden">Upload CSV file</Form.Label>
                <Button
                  as="label"
                  htmlFor="file-upload"
                  variant="primary"
                  size="sm"
                >
                  Upload CSV file
                </Button>
                <Form.Control
                  id="file-upload"
                  type="file"
                  onChange={handleFileUpload}
                  accept=".csv"
                  disabled={isLoading}
                  className="d-none"
                />
              </Form.Group>
              {data.length > 0 && (
                <Button 
                  onClick={handleExportAllCharts} 
                  variant="success"
                  size="sm"
                >
                  Export All Charts
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Container fluid>
        {isLoading && <Alert variant="info">Processing file...</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}

      {data.length > 0 && (
        <>

          <Row>
            <Col lg={6} md={12}>
              <Card className="mb-3">
                <Card.Header>Activity Summary</Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <tbody>
                      {DataPrep.prepareActivitySummary(data).map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{formatValue(item.value)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} md={12}>
              <Card className="mb-3">
                <Card.Header>Engagement</Card.Header>
                <Card.Body>
                  <Row className="align-items-start">
                    <Col md={12} className="mb-3">
                      <Row>
                        <Col md={6}>
                          <h6>Read Time Falloff</h6>
                        </Col>
                        <Col md={6}>
                          <h6>Engagement Time Distribution</h6>
                        </Col>
                      </Row>
                    </Col>
                    <Col md={6}>
                      <div ref={readTimeFalloffRef}>
                        <LineChart data={DataPrep.prepareReadTimeFalloff(data)} xKey="time" yKey="percentage" title="Read Time Falloff" />
                      </div>
                    </Col>
                    <Col md={6}>
                      <div ref={engagementDistributionRef}>
                        <PieChart data={DataPrep.prepareEngagementDistribution(data)} noCard={true} title="Engagement Time Distribution" />
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={6} md={12}>
              <Card className="mb-3">
                <Card.Header>Daily Activity</Card.Header>
                <Card.Body>
                  <div ref={dailyActivityRef}>
                    <LineChart data={DataPrep.prepareDailyActivity(data)} xKey="date" yKey="opens" title="Daily Activity" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} md={12}>
              <Card className="mb-3">
                <Card.Header>Top Email Clients</Card.Header>
                <Card.Body>
                  <div ref={topEmailClientsRef}>
                    <BarChart data={DataPrep.prepareEmailClientData(data)} title="Top Email Clients" />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg={4} md={6} sm={12}>
              <div ref={readingEnvironmentRef}>
                <PieChart data={DataPrep.prepareReadingEnvironmentData(data)} title="Reading Environment" />
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div ref={renderingEnginesRef}>
                <PieChart data={DataPrep.prepareRenderingEnginesData(data)} title="Rendering Engines" />
              </div>
            </Col>
            <Col lg={4} md={6} sm={12}>
              <div ref={browserUsageRef}>
                <PieChart data={DataPrep.prepareBrowserUsageData(data)} title="Browser Usage" />
              </div>
            </Col>
          </Row>

          <Row>
            <Col md={12}>
              <Card className="mb-3">
                <Card.Header>Top Countries</Card.Header>
                <Card.Body>
                  <div ref={worldMapRef} style={{ height: '400px' }}>
                    <WorldMap data={DataPrep.prepareCountryData(data)} />
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          </>
        )}
      </Container>
    </>
  );
};


export default Dashboard;