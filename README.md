# Albion Refining Calculator

A comprehensive refining calculator for Albion Online that helps players calculate costs, profits, and material requirements for refining operations.

## Features

### 🎯 **Core Functionality**

- **Material Selection**: Choose from all 5 material types (Ore, Hide, Fiber, Wood, Stone)
- **Tier Support**: Full T2-T8 refining calculations
- **Accurate Mechanics**: Follows official Albion Online refining formulas

### 💰 **Price Management**

- **Manual Input**: Set custom prices for raw and refined materials
- **Live Data**: Fetch real-time prices from Albion Data Project API
- **Multi-City**: Support for all major cities (Caerleon, Martlock, Bridgewatch, etc.)

### ⚙️ **Advanced Configuration**

- **Return Rate Toggle**: Switch between Bonus City (36.7%) and Non-Bonus City (15.2%)
- **Refining Day Bonus**: Additional toggle for Refining Day (+10% bonus = 46.7% total)
- **Mastery Integration**: Input your mastery level for accurate return rate calculations
- **Focus System**: Enable focus usage with profit-per-focus calculations
- **Station Fees**: Configurable refining station fees
- **Market Tax**: Include market tax calculations
- **Premium Account**: Automatic 50% fee reduction for premium users

### 📊 **Comprehensive Analysis**

- **Material Requirements**: Exact raw materials and lower-tier refined needed
- **Return Calculations**: Materials returned based on your settings
- **Cost Breakdown**: Detailed cost analysis including all fees
- **Profit Analysis**: Gross profit, net profit, and per-unit calculations
- **Material Inventory**: Track available materials and get shortage warnings

### 🎨 **Modern UI/UX**

- **Dark Mode**: Beautiful dark theme with modern aesthetics
- **Responsive Design**: Works perfectly on desktop and mobile
- **Smooth Animations**: Polished transitions and loading states
- **Intuitive Interface**: Clean, organized layout with visual feedback

## Refining Mechanics

The calculator implements the exact Albion Online refining mechanics:

### Material Requirements

- **T2**: 2 raw materials
- **T3**: 1 T2 refined + 2 T3 raw materials
- **T4**: 1 T3 refined + 2 T4 raw materials
- **T5**: 1 T4 refined + 3 T5 raw materials
- **T6**: 1 T5 refined + 4 T6 raw materials
- **T7**: 1 T6 refined + 5 T7 raw materials
- **T8**: 1 T7 refined + 6 T8 raw materials

### Return Rates

- **Bonus City**: 36.7% base return rate
- **Bonus City + Refining Day**: 46.7% return rate (36.7% + 10% bonus)
- **Non-Bonus City**: 15.2% base return rate
- **Mastery Bonus**: +4% per 20 mastery levels
- **Focus Bonus**: +15.3% return rate when using focus

## Installation & Usage

### Prerequisites

- Node.js 18+ and npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Using the Calculator

1. **Select Material & Tier**: Choose your material type and tier from the dropdowns
2. **Set Target Quantity**: Enter how many refined materials you want to produce
3. **Configure Prices**: Either input manual prices or fetch live data from API
4. **Adjust Settings**: Configure return rates, mastery level, focus usage, and fees
5. **Set Available Materials**: Input how many raw/refined materials you have
6. **View Results**: Check the detailed breakdown of costs, profits, and requirements

## Technical Details

### Built With

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Vite** for fast development
- **Lucide React** for icons
- **Axios** for API calls

## License

This project is licensed under the MIT License.

## Disclaimer

This tool is not officially affiliated with Sandbox Interactive or Albion Online. All game data and mechanics are based on publicly available information and community research.
