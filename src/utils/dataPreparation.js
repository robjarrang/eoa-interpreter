export const prepareActivitySummary = (data) => {
  console.log('Starting prepareActivitySummary');
  console.log('Number of data rows:', data.length);

  const summary = {
    totalOpens: 0,
    uniqueOpens: new Set(),
    totalReadTime: 0,
    uniqueEmailClients: new Set(),
    uniqueEnvironments: new Set(),
    uniquePlatforms: new Set(),
    uniqueBrowsers: new Set(),
    uniqueRenderingEngines: new Set(),
    uniqueCountries: new Set(),
  };

  data.forEach((item, index) => {
    if (index === 0) console.log('Sample data item:', item);

    if (item.Opened) {
      summary.totalOpens += 1;
      summary.uniqueOpens.add(item.Customer);
    }
    
    // Parse Seconds as a number and add to totalReadTime
    const seconds = parseInt(item.Seconds, 10);
    if (!isNaN(seconds)) {
      summary.totalReadTime += seconds;
    } else {
      console.warn(`Invalid Seconds value at row ${index + 1}:`, item.Seconds);
    }

    if (item['Email Client']) summary.uniqueEmailClients.add(item['Email Client']);
    if (item.Environment) summary.uniqueEnvironments.add(item.Environment);
    if (item.Platform) summary.uniquePlatforms.add(item.Platform);
    if (item.Browser) summary.uniqueBrowsers.add(item.Browser);
    if (item['Rendering Engine']) summary.uniqueRenderingEngines.add(item['Rendering Engine']);
    if (item['Country Name']) summary.uniqueCountries.add(item['Country Name']);
  });

  const result = [
    { name: "Total Opens", value: summary.totalOpens },
    { name: "Unique Opens", value: summary.uniqueOpens.size },
    { name: "Total Read Time (seconds)", value: summary.totalReadTime },
    { name: "Unique Email Clients", value: summary.uniqueEmailClients.size },
    { name: "Unique Environments", value: summary.uniqueEnvironments.size },
    { name: "Unique Platforms", value: summary.uniquePlatforms.size },
    { name: "Unique Browsers", value: summary.uniqueBrowsers.size },
    { name: "Unique Rendering Engines", value: summary.uniqueRenderingEngines.size },
    { name: "Unique Countries", value: summary.uniqueCountries.size },
  ];

  console.log('Activity Summary:', result);

  return result;
};
  
  export const prepareReadTimeFalloff = (data) => {
    const totalReads = data.length;
    const timePoints = [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20];
    
    return timePoints.map(time => ({
      time: `${time}s`,
      percentage: (data.filter(item => (item['Seconds'] || 0) >= time).length / totalReads) * 100
    }));
  };
  
  export const prepareEngagementDistribution = (data) => {
    const distribution = data.reduce((acc, item) => {
      const seconds = item['Seconds'];
      if (seconds === null || seconds === undefined) {
        acc.Unknown++;
      } else if (seconds < 2) {
        acc.Delete++;
      } else if (seconds < 8) {
        acc.Skim++;
      } else {
        acc.Read++;
      }
      return acc;
    }, { Read: 0, Skim: 0, Delete: 0, Unknown: 0 });
  
    return Object.entries(distribution)
      .filter(([_, value]) => value > 0)
      .map(([name, value]) => ({ name, value }));
  };
  
  export const prepareDailyActivity = (data) => {
    const dailyCounts = data.reduce((acc, item) => {
      if (item['Opened'] instanceof Date) {
        const date = item['Opened'].toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + 1;
      }
      return acc;
    }, {});
  
    return Object.entries(dailyCounts)
      .map(([date, opens]) => ({ date, opens }))
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };
  
  export const prepareEmailClientData = (data) => {
    const clientCounts = data.reduce((acc, item) => {
      let client = item['Email Client'] || 'Unknown';
      if (client.includes('iOS Mail')) {
        client = 'iOS Mail';
      } else if (client.includes('Apple Mail')) {
        client = 'Apple Mail';
      } else if (client.includes('Gmail')) {
        client = 'Gmail';
      } else if (client.includes('Outlook')) {
        client = 'Outlook';
      } else if (client.includes('Yahoo')) {
        client = 'Yahoo';
      } else if (client.includes('Android')) {
        client = 'Android Mail';
      } else if (client === 'Other' || client === 'Other ') {
        client = 'Other';
      }
      acc[client] = (acc[client] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(clientCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);
  };
  
  export const prepareReadingEnvironmentData = (data) => {
    const environmentCounts = data.reduce((acc, item) => {
      let environment = 'Unknown';
      const emailClient = item['Email Client'] || '';
      const platformEnvironment = item['Environment'] || '';
      const platform = item['Platform'] || '';
  
      if (emailClient.includes('Apple Mail Privacy Protection') || emailClient.includes('Gmail Image Cache')) {
        environment = 'Image Cache';
      } else if (platformEnvironment === 'Web Client' || emailClient.includes('Gmail') || emailClient.includes('Yahoo')) {
        environment = 'Webmail';
      } else if (platformEnvironment === 'Mobile' || platform.includes('iOS') || platform.includes('Android')) {
        environment = 'Mobile';
      } else if (platformEnvironment === 'Desktop' || platform.includes('Macintosh') || platform.includes('Windows')) {
        environment = 'Desktop';
      }
      acc[environment] = (acc[environment] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(environmentCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  export const prepareRenderingEnginesData = (data) => {
    const engineCounts = data.reduce((acc, item) => {
      let engine = item['Rendering Engine'] || 'Other';
      acc[engine] = (acc[engine] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(engineCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  export const prepareBrowserUsageData = (data) => {
    const browserCounts = data.reduce((acc, item) => {
      let browser = 'Other';
      const emailClient = item['Email Client'] || '';
      const browserName = item['Browser'] || '';
  
      if (emailClient.includes('Gmail')) {
        browser = "Via Gmail's Image Cache";
      } else if (emailClient.includes('Yahoo') || emailClient.includes('AOL')) {
        browser = "Via Yahoo/AOL's Image Cache";
      } else if (browserName === 'Chrome') {
        browser = 'Using Chrome';
      } else if (browserName === 'Firefox') {
        browser = 'Using Firefox';
      } else if (browserName === 'Safari') {
        browser = 'Using Safari';
      }
      acc[browser] = (acc[browser] || 0) + 1;
      return acc;
    }, {});
  
    return Object.entries(browserCounts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  };
  
  const getCountryCode = (countryName) => {
    const countryMap = {
      'United Kingdom': 'GBR',
      'Great Britain': 'GBR',
      'United States': 'USA',
      'Germany': 'DEU',
      'Switzerland': 'CHE',
      'Ireland': 'IRL',
      'Luxembourg': 'LUX',
      'France': 'FRA',
      'Spain': 'ESP',
      'Italy': 'ITA',
      'Netherlands': 'NLD',
      'Belgium': 'BEL',
      'Sweden': 'SWE',
      'Norway': 'NOR',
      'Denmark': 'DNK',
      'Finland': 'FIN',
      'Portugal': 'PRT',
      'Austria': 'AUT',
      'Greece': 'GRC',
      'Poland': 'POL',
      'Czech Republic': 'CZE',
      'Hungary': 'HUN',
      'Romania': 'ROU',
      'Bulgaria': 'BGR',
      'Croatia': 'HRV',
      'Canada': 'CAN',
      'Mexico': 'MEX',
      'Brazil': 'BRA',
      'Argentina': 'ARG',
      'Australia': 'AUS',
      'New Zealand': 'NZL',
      'Japan': 'JPN',
      'South Korea': 'KOR',
      'China': 'CHN',
      'India': 'IND',
      'Russia': 'RUS',
      'South Africa': 'ZAF'
    };
    const code = countryMap[countryName];
    console.log(`Getting country code for "${countryName}": ${code}`);
    return code;
  };
  
  export const prepareCountryData = (data) => {
    console.log('Raw data received:', data);
  
    const countryCounts = data.reduce((acc, item) => {
      const country = item['Country Name'];
      const code = getCountryCode(country);
      if (code) {
        acc[code] = (acc[code] || 0) + 1;
      } else {
        console.log(`No country code found for: ${country}`);
      }
      return acc;
    }, {});
  
    console.log('Country counts:', countryCounts);
  
    const result = Object.entries(countryCounts)
      .map(([id, value]) => {
        const entry = { id, name: id, value };
        console.log('Created entry:', entry);
        return entry;
      })
      .sort((a, b) => b.value - a.value);
  
    console.log('Final prepared country data:', result);
    return result;
  };