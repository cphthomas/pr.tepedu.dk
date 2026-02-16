export const tepeduChartConfig = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                usePointStyle: true,
                font: {
                    family: "'Open Sans', sans-serif"
                }
            }
        },
        tooltip: {
            enabled: true,
            backgroundColor: 'rgba(44, 62, 80, 0.9)', // Academic Navy
            titleFont: { family: "'Source Sans Pro', sans-serif" },
            bodyFont: { family: "'Open Sans', sans-serif" }
        }
    },
    scales: {
        x: {
            grid: {
                color: '#e5e5e5',
                borderDash: [5, 5]
            },
            ticks: {
                color: '#333333'
            }
        },
        y: {
            grid: {
                color: '#e5e5e5',
                borderDash: [5, 5]
            },
            ticks: {
                color: '#333333'
            }
        }
    }
};

export const tepeduColors = {
    supply: '#3498db',
    demand: '#e74c3c',
    equilibrium: '#2ecc71'
};
