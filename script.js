// Global variables for charts
let barChart = null;
let pieChart = null;
let currentColors = []; // Keep track of assigned colors

// Generate dynamic color list to match data length
function generateColors(length, currentLength = 0) {
    const baseColors = [
        'rgba(0, 114, 178, 0.8)',  // Blue (CUD)
        'rgba(213, 94, 0, 0.8)',   // Vermilion (CUD)
        'rgba(75, 0, 130, 0.8)',   // Indigo
        'rgba(0, 158, 115, 0.8)',  // Green (CUD)
        'rgba(230, 159, 0.8)',     // Orange (CUD)
        'rgba(165, 42, 42, 0.8)',  // Brown
        'rgba(0, 0, 0, 0.8)',      // Black
        'rgba(255, 69, 0, 0.8)',   // Red-Orange
        'rgba(128, 0, 128, 0.8)',  // Purple
        'rgba(255, 105, 180, 0.8)',// Hot Pink
        'rgba(64, 224, 208, 0.8)', // Turquoise
        'rgba(86, 180, 233, 0.8)', // Sky Blue (CUD)
        'rgba(204, 121, 167, 0.8)',// Pink (CUD)
        'rgba(240, 228, 66, 0.8)', // Yellow (CUD)
        'rgba(127, 255, 0, 0.8)'   // Lime Green
    ];

    // Cycle through colors if data exceeds available colors
    for (let i = currentLength; i < length; i++) {
        currentColors.push(baseColors[i % baseColors.length]);
    }

    const borderColorsList = currentColors.map(color => color.replace('0.8', '1')); // Full opacity for borders
    return { backgroundColors: currentColors, borderColors: borderColorsList };
}

function updateCharts(data) {
    const labels = data.map((_, i) => `Item ${i + 1}`);
    const { backgroundColors, borderColors } = generateColors(data.length, currentColors.length);

    // Create or Update Bar Chart
    const barCtx = document.getElementById('barChart').getContext('2d');
    if (!barChart) {
        barChart = new Chart(barCtx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Values',
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                layout: {
                    padding: {
                        top: 50,
                        bottom: 50,
                        left: 20,
                        right: 20
                    }
                },
                scales: {
                    y: { beginAtZero: true }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
    } else {
        barChart.data.labels = labels;
        barChart.data.datasets[0].data = data;
        barChart.data.datasets[0].backgroundColor = backgroundColors;
        barChart.data.datasets[0].borderColor = borderColors;
        barChart.update();
    }

    // Create or Update Pie Chart with Labels Just Inside the Slices
    const pieCtx = document.getElementById('pieChart').getContext('2d');
    if (!pieChart) {
        pieChart = new Chart(pieCtx, {
            type: 'pie',
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: backgroundColors,
                    borderColor: borderColors,
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: { display: false },
                    datalabels: {
                        anchor: 'end',  // Position labels towards the center of each slice
                        align: 'start',   // Align labels within the slice
                        color: '#fff',     // White text for better contrast inside slices
                        font: {
                            weight: 'bold',
                            size: 14
                        },
                        formatter: (value, ctx) => {
                            const labelIndex = ctx.dataIndex;
                            return ctx.chart.data.labels[labelIndex]; // Always return the item label
                        },
                        padding: 5
                    }
                }
            },
            plugins: [ChartDataLabels]
        });
    } else {
        pieChart.data.labels = labels;
        pieChart.data.datasets[0].data = data;
        pieChart.data.datasets[0].backgroundColor = backgroundColors;
        pieChart.data.datasets[0].borderColor = borderColors;
        pieChart.update();
    }
}

// Update the URL with the entered numbers
function updateURL(numbers) {
    const queryString = `?numbers=${numbers.join(',')}`;
    window.history.pushState(null, '', queryString);
}

// Load numbers from the URL
function loadNumbersFromURL() {
    const params = new URLSearchParams(window.location.search);
    const numbersParam = params.get('numbers');
    if (numbersParam) {
        return numbersParam.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));
    }
    return [];
}

// Event listener for user input
document.getElementById('numberInput').addEventListener('input', (event) => {
    const value = event.target.value.trim();
    const numbers = value.split(',').map(num => parseFloat(num.trim())).filter(num => !isNaN(num));

    if (numbers.length >= 1) {
        updateCharts(numbers); // Update the charts
        updateURL(numbers);    // Update the URL
    }
});

// Initialize the page on load
window.addEventListener('DOMContentLoaded', () => {
    const numbers = loadNumbersFromURL();
    if (numbers.length >= 1) {
        document.getElementById('numberInput').value = numbers.join(', ');
        updateCharts(numbers);
    } else {
        const defaultNumbers = [10, 20, 30, 40];
        document.getElementById('numberInput').value = defaultNumbers.join(', ');
        updateCharts(defaultNumbers);
        updateURL(defaultNumbers);
    }
});

// Handle back/forward navigation and URL changes
window.addEventListener('popstate', () => {
    const numbers = loadNumbersFromURL();
    if (numbers.length >= 1) {
        document.getElementById('numberInput').value = numbers.join(', ');
        updateCharts(numbers);
    }
});
