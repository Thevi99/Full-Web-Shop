import {
    Chart as ChartJS,
    BarElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Bar } from "react-chartjs-2";
  
  // Register components for chart.js
  ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);
  
  const Chart = () => {
    const data = {
      labels: ["6am", "9am", "12pm", "3pm", "6pm", "9pm"],
      datasets: [
        {
          label: "Sales",
          data: [300, 500, 800, 1200, 1500, 1800],
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    };
  
    return <Bar data={data} />;
  };
  
  export default Chart;
  