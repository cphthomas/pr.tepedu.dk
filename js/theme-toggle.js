// Theme Toggle Functionality
(function () {
    'use strict';

    // Theme state management
    const THEME_STORAGE_KEY = 'makro-theme';
    const THEME_LIGHT = 'light';
    const THEME_DARK = 'dark';

    // Get current theme from localStorage or default to light
    function getCurrentTheme() {
        const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        return savedTheme || THEME_LIGHT;
    }

    // Set theme
    function setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem(THEME_STORAGE_KEY, theme);

        // Update Chart.js charts if they exist
        updateChartTheme(theme);
    }

    // Toggle theme
    function toggleTheme() {
        const currentTheme = getCurrentTheme();
        const newTheme = currentTheme === THEME_LIGHT ? THEME_DARK : THEME_LIGHT;
        setTheme(newTheme);
        updateLogoTheme(newTheme);
        updateThemeIcon(newTheme);
    }

    // Update logo based on theme
    function updateLogoTheme(theme) {
        const logo = document.getElementById('site-logo');
        if (!logo) return;

        // Check if the current src is one of our logos before swapping
        // This prevents overwriting if a different image was loaded for some reason
        if (logo.src.includes('tepedulogoanim.svg') || logo.src.includes('logo-dark-mode.svg')) {
            if (theme === THEME_DARK) {
                // Use the new dark mode logo
                logo.src = 'images/logo-dark-mode.svg';
            } else {
                // Use the original logo
                logo.src = 'images/tepedulogoanim.svg';
            }
        }
    }

    // Update theme icon animation
    function updateThemeIcon(theme) {
        const themeToggle = document.getElementById('theme-toggle');
        if (!themeToggle) return;

        const sunIcon = themeToggle.querySelector('.theme-icon-sun');
        const moonIcon = themeToggle.querySelector('.theme-icon-moon');

        if (theme === THEME_DARK) {
            sunIcon.classList.remove('active');
            moonIcon.classList.add('active');
        } else {
            sunIcon.classList.add('active');
            moonIcon.classList.remove('active');
        }
    }

    // Update Chart.js charts to match theme
    function updateChartTheme(theme) {
        // Update chartConfig in charts-api.js if available
        if (typeof window.updateChartConfig === 'function') {
            window.updateChartConfig();
        }

        const isDark = theme === THEME_DARK;
        const colors = isDark ? {
            grid: 'rgba(255, 255, 255, 0.3)',
            text: '#ffffff',
            tooltipBg: 'rgba(255, 255, 255, 0.92)',
            tooltipText: '#000000',
            labelBg: 'rgba(30, 30, 46, 0.8)'
        } : {
            grid: 'rgba(0, 0, 0, 0.05)',
            text: '#333333',
            tooltipBg: 'rgba(0, 0, 0, 0.85)',
            tooltipText: '#ffffff',
            labelBg: 'rgba(255, 255, 255, 0.8)'
        };

        const updateSpecificChart = (chart) => {
            if (!chart || !chart.options) return;

            // Update scales
            if (chart.options.scales) {
                Object.keys(chart.options.scales).forEach(scaleKey => {
                    const scale = chart.options.scales[scaleKey];
                    if (scale.grid) {
                        scale.grid.color = colors.grid;
                        scale.grid.lineWidth = 1;
                    }
                    if (scale.ticks) {
                        scale.ticks.color = colors.text;
                    }
                    if (scale.title) {
                        scale.title.color = colors.text;
                    }
                    if (scale.pointLabels) {
                        scale.pointLabels.color = colors.text;
                    }
                });
            }

            // Update legend
            if (chart.options.plugins && chart.options.plugins.legend && chart.options.plugins.legend.labels) {
                chart.options.plugins.legend.labels.color = colors.text;
            }

            // Update title
            if (chart.options.plugins && chart.options.plugins.title) {
                chart.options.plugins.title.color = colors.text;
            }

            // Update tooltip
            if (chart.options.plugins && chart.options.plugins.tooltip) {
                chart.options.plugins.tooltip.backgroundColor = colors.tooltipBg;
                chart.options.plugins.tooltip.titleColor = colors.tooltipText;
                chart.options.plugins.tooltip.bodyColor = colors.tooltipText;
            }

            // Update annotations
            if (chart.options.plugins && chart.options.plugins.annotation && chart.options.plugins.annotation.annotations) {
                const annotations = chart.options.plugins.annotation.annotations;
                Object.keys(annotations).forEach(key => {
                    const ann = annotations[key];
                    if (ann.label) {
                        ann.label.color = colors.text;
                        ann.label.backgroundColor = colors.labelBg;
                        ann.label.borderRadius = 0; // Square corners
                    }
                    if (ann.type === 'line' && (ann.borderColor === '#333' || ann.borderColor === '#ffffff' || ann.borderColor === '#e0e0e0')) {
                        ann.borderColor = colors.text;
                    }
                });
            }

            // Update Sankey chart colors (specific handling for chartjs-chart-sankey)
            if (chart.config && chart.config.type === 'sankey') {
                if (chart.config.data && chart.config.data.datasets) {
                    chart.config.data.datasets.forEach(dataset => {
                        dataset.color = colors.text;
                        if (dataset.font) {
                            dataset.font.color = colors.text;
                        }
                    });
                }
                // Also update options level color
                if (chart.options) {
                    chart.options.color = colors.text;
                }
            }

            chart.update('none');
        };

        // 1. Get all Chart.js instances (Standard way)
        if (typeof Chart !== 'undefined' && Chart.instances) {
            Object.keys(Chart.instances).forEach(id => updateSpecificChart(Chart.instances[id]));
        }

        // 2. Fallback for custom chartInstances arrays
        if (window.chartInstances) {
            if (Array.isArray(window.chartInstances)) {
                window.chartInstances.forEach(updateSpecificChart);
            } else if (typeof window.chartInstances === 'object') {
                Object.keys(window.chartInstances).forEach(key => updateSpecificChart(window.chartInstances[key]));
            }
        }
    }

    // Initialize theme on page load
    function initTheme() {
        const currentTheme = getCurrentTheme();
        setTheme(currentTheme);
        updateThemeIcon(currentTheme);
        updateLogoTheme(currentTheme); // Also update logo on init

        // Add event listener to theme toggle button
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', function (e) {
                e.preventDefault();
                toggleTheme();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initTheme);
    } else {
        initTheme();
    }

    // Expose toggleTheme for external use
    window.toggleTheme = toggleTheme;
    window.getCurrentTheme = getCurrentTheme;
})();
