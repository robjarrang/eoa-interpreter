export const parseCSV = (text) => {
  console.log('Starting CSV parsing');
  console.log('CSV text length:', text.length);

  const lines = text.split('\n').filter(line => line.trim() !== '');
  console.log('Number of lines:', lines.length);

  if (lines.length === 0) {
    console.error("CSV file is empty");
    throw new Error("CSV file is empty");
  }

  const headers = lines[0].split(',').map(header => header.trim());
  console.log('Headers:', headers);

  const result = [];

  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i].split(',');
    if (currentLine.length === headers.length) {
      const obj = {};
      for (let j = 0; j < headers.length; j++) {
        let value = currentLine[j].trim();
        if (value === '') {
          value = null;
        } else if (!isNaN(value) && headers[j] !== 'Opened') {
          value = Number(value);
        } else if (headers[j] === 'Opened' && value !== '') {
          const [datePart, timePart] = value.split(' ');
          if (datePart && timePart) {
            const [day, month, year] = datePart.split('/');
            const [hour, minute] = timePart.split(':');
            value = new Date(year, month - 1, day, hour, minute);
            if (isNaN(value.getTime())) {
              value = null;
            }
          } else {
            value = null;
          }
        }
        obj[headers[j]] = value;
      }
      result.push(obj);
    }
  }

  if (result.length === 0) {
    console.error("No valid data rows found in CSV");
    throw new Error("No valid data rows found in CSV");
  }

  console.log('Number of parsed rows:', result.length);
  console.log('Sample parsed row:', result[0]);

  return result;
};