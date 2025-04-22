function drawViz(data, element) {
  const rows = data.tables.DEFAULT;
  const chartData = [];
  
  // Extract headers
  chartData.push(['Day', 'Viable Cell Density']);
  
  // Convert rows and handle nulls
  rows.forEach(row => {
    const day = row['Day'];
    const density = row['Viable Cell Density'];
    chartData.push([day, density !== null ? density : null]);
  });

  // Linear interpolation
  for (let i = 1; i < chartData.length - 1; i++) {
    if (chartData[i][1] === null) {
      let prevIdx = i - 1;
      let nextIdx = i + 1;

      // Find previous non-null
      while (prevIdx >= 1 && chartData[prevIdx][1] === null) prevIdx--;

      // Find next non-null
      while (nextIdx < chartData.length && chartData[nextIdx][1] === null) nextIdx++;

      if (prevIdx >= 1 && nextIdx < chartData.length) {
        const prevVal = chartData[prevIdx][1];
        const nextVal = chartData[nextIdx][1];
        const gap = nextIdx - prevIdx;
        chartData[i][1] = prevVal + ((nextVal - prevVal) / gap) * (i - prevIdx);
      }
    }
  }

  // Draw chart
  const dataTable = google.visualization.arrayToDataTable(chartData);
  const chart = new google.visualization.LineChart(element);
  chart.draw(dataTable, { title: 'Viable Cell Density (Interpolated)' });
}

// Render function
function buildViz(data, element) {
  google.charts.load('current', { packages: ['corechart'] });
  google.charts.setOnLoadCallback(() => drawViz(data, element));
}

lookerstudio.visualizations.register('linear-interpolation-chart', buildViz);
