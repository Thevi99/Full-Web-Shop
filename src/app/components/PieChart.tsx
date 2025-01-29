import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
  } from "chart.js";
  import { Pie } from "react-chartjs-2";
  
  // Register components for pie chart
  ChartJS.register(ArcElement, Tooltip, Legend);
  
  const PieChart = () => {
    const data = {
      labels: ["Very Satisfied", "Satisfied", "Not Satisfied", "Stressed"],
      datasets: [
        {
          data: [26, 39, 20, 15],
          backgroundColor: ["#4caf50", "#2196f3", "#ffc107", "#f44336"],
        },
      ],
    };
  
    return <Pie data={data} />;
  };
  
  export default PieChart;
  