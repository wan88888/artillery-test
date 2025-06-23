const fs = require("fs");
const path = require("path");

const resultsFile = path.resolve(__dirname, "../results.json");
const reportFile = path.resolve(__dirname, "../summary.txt");
const htmlReportFile = path.resolve(__dirname, "report.html");

if (!fs.existsSync(resultsFile)) {
  console.error("❌ results.json not found.");
  process.exit(1);
}

const results = JSON.parse(fs.readFileSync(resultsFile, "utf8"));
const agg = results.aggregate || {};

const durationMs = agg.lastMetricAt && agg.firstMetricAt
  ? agg.lastMetricAt - agg.firstMetricAt
  : null;
const durationSec = durationMs ? (durationMs / 1000).toFixed(2) : "N/A";

const totalRequests = agg.counters?.["http.requests"];
const rps = agg.rates?.["http.request_rate"];
const latencyMean = agg.summaries?.["http.response_time"]?.mean;
const latency = agg.summaries?.["http.response_time"];

const output = `
Artillery Load Test Summary
------------------------------
Duration       : ${durationSec} seconds
Total Requests : ${totalRequests || "N/A"}
RPS            : ${rps || "N/A"}
Latency (avg)  : ${latencyMean || "N/A"} ms
`;

fs.writeFileSync(reportFile, output);
console.log(output);

// Update HTML report
const htmlTemplate = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artillery Load Test Report</title>
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    body { font-family: sans-serif; padding: 2rem; }
    canvas { max-width: 600px; }
  </style>
</head>
<body>
  <h1>Artillery Load Test Report</h1>
  <p><strong>Duration:</strong> <span id="duration">${durationSec}</span> seconds</p>
  <p><strong>Total Requests:</strong> <span id="requests">${totalRequests || "N/A"}</span></p>
  <p><strong>RPS:</strong> <span id="rps">${rps || "N/A"}</span></p>
  <p><strong>Average Latency:</strong> <span id="latency">${latencyMean || "N/A"}</span> ms</p>

  <h2>Latency Distribution</h2>
  <canvas id="latencyChart"></canvas>

  <script>
    const data = ${JSON.stringify(results)};
    const agg = data.aggregate;
    const latency = agg.summaries["http.response_time"];

    if (latency) {
      const ctx = document.getElementById('latencyChart').getContext('2d');
      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['p50', 'p75', 'p90', 'p95', 'p99', 'p999'],
          datasets: [{
            label: 'Latency (ms)',
            data: [
              latency.p50,
              latency.p75,
              latency.p90,
              latency.p95,
              latency.p99,
              latency.p999
            ],
            backgroundColor: 'rgba(54, 162, 235, 0.7)'
          }]
        },
        options: {
          responsive: true,
          scales: { y: { beginAtZero: true } }
        }
      });
    }
  </script>
</body>
</html>`;

fs.writeFileSync(htmlReportFile, htmlTemplate);
console.log("✅ HTML report updated successfully!");