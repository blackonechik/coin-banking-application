/* eslint-disable prettier/prettier */
/* eslint-disable no-new */
import Chart from "chart.js/auto";

let chartInstance; // добавляем ссылку на график

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

export default async function createBalanceChart(container, data, months) {
  const transactions = [...data.transactions];

  const currentMonthsAgo = new Date();
  currentMonthsAgo.setMonth(currentMonthsAgo.getMonth() - months);

  const filteredTransactions = transactions.filter((transaction) => {
    const transactionDate = new Date(transaction.date);
    return transactionDate >= currentMonthsAgo;
  });

  const monthlyBalances = [];

  let currentBalanceAtTheBeginningOfTheMonth = data.balance;

  filteredTransactions.forEach((transaction) => {
    const transactionDate = new Date(transaction.date);
    const month = transactionDate.getMonth();
    const year = transactionDate.getFullYear();
    const monthIndex = monthlyBalances.findIndex(
      (balance) =>
        balance.month === `${year}-${(month + 1).toString().padStart(2, "0")}`,
    );

    if (monthIndex === -1) {
      // если месяц еще не существует в массиве monthlyBalances, создаем новый объект для него
      const monthString = `${year}-${(month + 1).toString().padStart(2, "0")}`;
      monthlyBalances.push({
        month: monthString,
        balance: currentBalanceAtTheBeginningOfTheMonth + transaction.amount,
      });
    } else {
      // если месяц уже существует в массиве monthlyBalances, обновляем баланс
      monthlyBalances[monthIndex].balance += transaction.amount;
    }

    if (transactionDate.getDate() === 1) {
      // если транзакция произошла в первый день месяца, обновляем текущий баланс на начало месяца
      currentBalanceAtTheBeginningOfTheMonth += transaction.amount;
    }
  });

  // добавляем текущий баланс к балансу первого месяца
  if (monthlyBalances.length > 0) {
    monthlyBalances[0].balance = currentBalanceAtTheBeginningOfTheMonth;
  }

  // рассчитываем изменение баланса за каждый месяц
  for (let i = 1; i < monthlyBalances.length; i++) {
    monthlyBalances[i].balance = monthlyBalances[i - 1].balance + monthlyBalances[i].balance - monthlyBalances[i - 1].balance;
  }

  if (container.style.length) { // проверяем, существует ли график
    chartInstance.data.labels = monthlyBalances.map((row) => monthNumberToName(row.month)); // обновляем метки осей
    chartInstance.data.datasets[0].data = monthlyBalances.map((row) => row.balance); // обновляем данные
    chartInstance.update(); // обновляем график
  } else { // если графика еще нет, создаем его
    chartInstance = new Chart(container, {
      type: "bar",
      data: {
        labels: monthlyBalances.map((row) => monthNumberToName(row.month)),
        datasets: [
          {
            label: `Динамика баланса за ${months} месяцев`,
            data: monthlyBalances.map((row) => row.balance),
            backgroundColor: "#116ACC",
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {
              display: false // Отключает вертикальные линии
            }
          },
          y: {
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
  }
  if (months === 6) {
    container.addEventListener("click", () => {
      chartInstance.destroy();
    });
  }
  return chartInstance;
}
