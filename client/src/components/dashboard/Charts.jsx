
import { useSelector } from 'react-redux';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = () => {
  
    const { transactions } = useSelector((state) => state.plaid);
    const categoryData = {};
  
transactions.forEach((account) => {
    account.transactions.forEach((transaction) => {
      
      const categories = transaction.category ? transaction.category : [];
      categories.forEach((category) => {
        if (category) {
          if (categoryData[category]) {
            categoryData[category] += transaction.amount;
          } else {
            categoryData[category] = transaction.amount;
          }
        }
      });
    });
  });
  
    const data = {
      labels: Object.keys(categoryData),
      datasets: [
        {
          label: '$',
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
        plugins: {
          legend: {
            position: 'top',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect'
            }
          }
        }
      }
      
      
      

    return (
      <div>
       <h5>
          <b>Transactions by Category</b>
        </h5>
        <div style=   {{ width: '65%', height: '70vh', margin: '0 auto' }} >
            <Doughnut data={data} options={options}/>
        </div>
      </div>
    );
  };
  
  export default Chart;