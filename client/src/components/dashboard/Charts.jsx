
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  
    const { transactions } = useSelector((state) => state.plaid);
    console.log("Transactions from Chart.js component",transactions);
  
    const categoryData = {};

transactions.forEach((account) => {
  account.transactions.forEach((transaction) => {
    const categories = transaction.category ? transaction.category[0] : [];
    const category = categories[0];
    if (categoryData[category]) {
      categoryData[category] += transaction.amount;
    } else {
      categoryData[category] = transaction.amount;
    }
  });
});

console.log("Category data from",categoryData);
    const data = {
      labels: Object.keys(categoryData),
      datasets: [
        {
          data: Object.values(categoryData),
          backgroundColor: [
            '#FF6384',
            '#36A2EB',
            '#FFCE56',
            '#8B008B',
            '#FFA07A',
            '#7B68EE',
          ],
          borderWidth: 1,
        },
      ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
      }
      
      
 
  
    return (
      <div>
       <h5>
          <b>Transactions by Category</b>
        </h5>
        <div style={{ top: '100px', right: '20px',maxWidth: '100%', height: 'auto' , zIndex: 1 }}>
            <Doughnut data={data} options={options}/>
        </div>
      </div>
    );
  };
  
  export default Chart;