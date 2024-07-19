import html2canvas from 'html2canvas';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// Function to export a single chart
export const exportChart = async (chartRef, fileName) => {
  if (chartRef.current) {
    const canvas = await html2canvas(chartRef.current);
    const dataURL = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataURL;
    link.click();
  }
};

// Function to export all charts
export const exportAllCharts = async (chartRefs) => {
  const zip = new JSZip();
  
  for (const [chartName, ref] of Object.entries(chartRefs)) {
    if (ref.current) {
      const canvas = await html2canvas(ref.current);
      const dataURL = canvas.toDataURL('image/png');
      const base64Data = dataURL.split(',')[1];
      zip.file(`${chartName}.png`, base64Data, {base64: true});
    }
  }

  const content = await zip.generateAsync({type: 'blob'});
  saveAs(content, 'all_charts.zip');
};