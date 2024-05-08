/* eslint-disable prettier/prettier */
import Chart from "chart.js/auto";

let chartInstance;

function monthNumberToName(monthNumber) {
  const monthNames = {
    "01": "Январь",
    "02": "Февраль",
    "03": "Март",
    "04": "Апрель",
    "05": "Май",
    "06": "Июнь",
    "07": "Июль",
    "08": "Август",
    "09": "Сентябрь",
    "10": "Октябрь",
    "11": "Ноябрь",
    "12": "Декабрь",
  };

  return monthNames[monthNumber.slice(-2)];
}

export default async function createIncomeOutcomeChart(
  container,
  data,
  months,
) {

  const transactions = [...data.transactions];
  const monthlyIncomes = [];
  const monthlyOutcomes = [];

  const currentMonthsAgo = new Date();
  currentMonthsAgo.setMonth(currentMonthsAgo.getMonth() - months);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= currentMonthsAgo;
  });

  const incomeTransactions = filteredTransactions.filter(transaction => transaction.from !== data.id);
  const outcomeTransactions = filteredTransactions.filter(transaction => transaction.from === data.id);

  incomeTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const month = transactionDate.getMonth();
    const year = transactionDate.getFullYear();

    const monthIndex = monthlyIncomes.findIndex(
      (balance) =>
        balance.month === `${year}-${(month + 1).toString().padStart(2, "0")}`,
    );

    if (monthIndex === -1) {
      // если месяц еще не существует в массиве monthlyBalances, создаем новый объект для него
      monthlyIncomes.push({
        month: `${year}-${(month + 1).toString().padStart(2, "0")}`,
        amount: transaction.amount,
      })
    } else {
      // если месяц уже существует в массиве monthlyBalances, обновляем баланс
      monthlyIncomes[monthIndex].amount += transaction.amount;
    }
  });

  outcomeTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const month = transactionDate.getMonth();
    const year = transactionDate.getFullYear();

    const monthIndex = monthlyOutcomes.findIndex(
      (balance) =>
        balance.month === `${year}-${(month + 1).toString().padStart(2, "0")}`,
    );

    if (monthIndex === -1) {
      // если месяц еще не существует в массиве monthlyBalances, создаем новый объект для него
      monthlyOutcomes.push({
        month: `${year}-${(month + 1).toString().padStart(2, "0")}`,
        amount: transaction.amount,
      })
    } else {
      // если месяц уже существует в массиве monthlyBalances, обновляем баланс
      monthlyOutcomes[monthIndex].amount += transaction.amount;
    }
  });

  chartInstance = new Chart(container, {
    type: "bar",
    data: {
      labels: monthlyIncomes.map((row) => monthNumberToName(row.month)),
      datasets: [
        {
          label: 'Исходящие переводы',
          data: monthlyOutcomes.map((row) => row.amount),
          backgroundColor: "#FD4E5D",
        },
        {
          label: `Входящие переводы`,
          data: monthlyIncomes.map((row) => row.amount),
          backgroundColor: "#76CA66",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          grid: {
            display: false // Отключает вертикальные линии
          }
        },
        y: {
          stacked: true,
          grid: {
            display: false // Отключает горизонтальные линии
          },
          position: 'right',
          ticks: {
            beginAtZero: true,
            callback(value) {
              return `${value} ₽`; // Добавляет символ рубля к значению
            }
          }
        }
      }
    }
  });

  if (months === 6) {
    container.addEventListener("click", () => {
      chartInstance.destroy();
    });
  }
}
