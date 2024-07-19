import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import { scaleLinear } from "d3-scale";
import { Tooltip } from "react-tooltip";
import Spinner from 'react-bootstrap/Spinner';

const geoUrl = "https://raw.githubusercontent.com/BolajiBI/topojson-maps/master/world-countries-sans-antarctica.json";

const WorldMap = ({ data }) => {
  const [geographies, setGeographies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [timeoutId, setTimeoutId] = useState(null);

  useEffect(() => {
    console.log('Fetching map data...');
    fetch(geoUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(geoData => {
        console.log('Map data received:', geoData);
        setGeographies(geoData);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error loading map data:", error);
        setError(error.message);
        setIsLoading(false);
      });
  }, []);

  const { colorScale, maxValue, top10Countries, totalValue } = useMemo(() => {
    if (!data || data.length === 0) return { colorScale: null, maxValue: 0, top10Countries: [], totalValue: 0 };
    
    const maxVal = Math.max(...data.map(d => d.value));
    const total = data.reduce((sum, d) => sum + d.value, 0);
    const top10 = data.sort((a, b) => b.value - a.value).slice(0, 10);
    
    return {
      colorScale: scaleLinear().domain([0, maxVal]).range(["#EEF2FB", "#004063"]),
      maxValue: maxVal,
      top10Countries: top10,
      totalValue: total
    };
  }, [data]);

  const handleZoomIn = useCallback(() => {
    setZoom((prevZoom) => Math.min(prevZoom + 0.5, 3));
    resetTimeout();
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoom((prevZoom) => Math.max(prevZoom - 0.5, 1));
    resetTimeout();
  }, []);

  const resetTimeout = useCallback(() => {
    if (timeoutId) clearTimeout(timeoutId);
    setShowControls(true);
    const newTimeoutId = setTimeout(() => setShowControls(false), 3000); // Hide after 3 seconds
    setTimeoutId(newTimeoutId);
  }, [timeoutId]);

  const handleMouseEnter = useCallback(() => {
    setShowControls(true);
    resetTimeout();
  }, [resetTimeout]);

  const handleMouseLeave = useCallback(() => {
    resetTimeout();
  }, [resetTimeout]);

  if (isLoading) return <Spinner animation="border" />;
  if (error) return <div>Error loading map: {error}</div>;
  if (!data || data.length === 0) return <div>No data available for the map</div>;
  if (!geographies.objects) return <div>Loading map...</div>;

  return (
    <div 
      style={{ width: '100%', height: '400px', position: 'relative', overflow: 'hidden' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div style={{ position: 'absolute', width: '70%', height: '100%' }}>
        <ComposableMap
          projection="geoMercator"
          projectionConfig={{ scale: 150 }}
          style={{ width: '100%', height: '100%' }}
        >
          <ZoomableGroup
            center={[0, 0]}
            zoom={zoom}
            onZoomEnd={({ zoom }) => setZoom(zoom)}
            minZoom={1}
            maxZoom={3}
            translateExtent={[[0, 0], [800, 400]]}
          >
            <Geographies geography={geographies}>
              {({ geographies }) =>
                geographies.map((geo) => {
                  const d = data.find(s => s.id === geo.id);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(d.value) : "#F5F4F6"}
                      data-tooltip-id="my-tooltip"
                      data-tooltip-content={d ? `${geo.properties.name}: ${d.value.toLocaleString()}` : geo.properties.name}
                      style={{
                        default: { outline: 'none' },
                        hover: { outline: 'none', fill: d ? colorScale(d.value * 1.2) : "#F5F4F6" },
                        pressed: { outline: 'none' },
                      }}
                      aria-label={geo.properties.name}
                    />
                  );
                })
              }
            </Geographies>
          </ZoomableGroup>
        </ComposableMap>
        {showControls && (
          <div style={{
            position: 'absolute',
            left: '10px',
            top: '10px',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: 'rgba(255, 255, 255, 0.7)',
            borderRadius: '4px',
            padding: '5px',
          }}>
            <button onClick={handleZoomIn} style={{ marginBottom: '5px' }} aria-label="Zoom in">+</button>
            <button onClick={handleZoomOut} aria-label="Zoom out">-</button>
          </div>
        )}
      </div>
      <div style={{ position: 'absolute', right: '0', top: '0', width: '30%', height: '100%', overflowY: 'auto', padding: '10px', color: 'rgba(255,255,255,0.8)' }}>
        <h6>Top 10 Countries</h6>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {top10Countries.map((country, index) => (
            <li key={index} style={{ marginBottom: '5px', fontSize: '0.9em' }}>
              <span style={{ display: 'inline-block', width: '10px', height: '10px', backgroundColor: colorScale(country.value), marginRight: '5px' }}></span>
              {country.name}: {((country.value / totalValue) * 100).toFixed(2)}%
            </li>
          ))}
        </ul>
      </div>
      <Tooltip id="my-tooltip" />
    </div>
  );
};

export default React.memo(WorldMap);