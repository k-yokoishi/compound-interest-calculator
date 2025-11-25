# Investment Simulator

*English | [日本語](README.ja.md)*

A web application for simulating compound interest calculations for monthly investment contributions.

## 🚀 Demo

https://k-yokoishi.github.io/compound-interest-calculator/

## ✨ Features

- **Compound Interest Simulation**: Calculate future asset values by entering initial investment, monthly contributions, expected annual return rate, and investment period
- **Visual Graph Display**: Bar chart showing investment progress by year (principal and interest color-coded)
- **Multi-language Support**: Supports Japanese and English with automatic browser language detection
- **Currency Display Toggle**: Shows yen (¥) for Japanese and dollars ($) for English
- **Real-time Calculation**: Results update instantly when parameters are changed
- **Data Persistence**: Input parameters are automatically saved to localStorage
- **URL Sharing**: Share settings via query parameters

## 📊 Display Content

### Input Fields

- Initial Investment (¥/USD)
- Monthly Contribution (¥/USD)
- Expected Annual Return Rate (%)
- Investment Period (Years)

### Results Display

- Total Principal: Total amount actually invested
- Total Interest: Total interest earned through compound interest
- Grand Total: Principal + Interest final amount
- Investment Progress Graph: Visualize asset progress by year

## 🛠️ Tech Stack

- **React 18** - UI Framework
- **TypeScript** - Type-safe Development
- **Vite** - Fast Build Tool
- **Recharts** - Chart Library
- **React Router** - URL Parameter Management
- **i18next** - Internationalization
- **Google Analytics** - Web Analytics
- **GitHub Pages** - Hosting
- **GitHub Actions** - Automated Deployment

## 💻 Local Development

### Requirements

- Node.js 20 or higher
- npm

### Setup

```bash
# Clone the repository
git clone https://github.com/k-yokoishi/compound-interest-calculator.git
cd compound-interest-calculator

# Install dependencies
npm install

# Start development server
npm run dev
```

Open your browser and navigate to <http://localhost:5173>

### Build

```bash
# Production build
npm run build

# Preview build results
npm run preview
```

## 📝 Calculation Logic

Compound interest is calculated using the following logic:

1. Monthly rate = Annual rate ÷ 12
2. For each month:
   - Previous month's total + This month's contribution
   - Current total × Monthly rate = This month's interest
   - Add interest to total

Amounts are displayed as integers for yen and with 2 decimal places for dollars.

## 📄 License

This project is open source.

## 🤝 Contributing

Issues and Pull Requests are welcome!
