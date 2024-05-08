import "../../styles/account.scss";
import { el, mount } from "redom";
import API from "../api";
import { pushNotify, formationDate } from "../helpers";
import createButton from "./button";
import createBalanceChart from "./balanceChart";
import createIncomeOutcomeChart from "./incomeOutcomeChart";

export default async function createBalanceHistory(id, router) {
  const { account, balance, transactions, mine } = await API.getAccount(id);

  if (!mine) {
    router.navigate(`/accounts/`);
    pushNotify("У вас нет доступа к этому счёту", "error");
  }
  const backButton = createButton("Вернуться назад", "account");
  const previousPageButton = createButton("Предыдущая страница", "account");
  const nextPageButton = createButton("Следующая страница", "account");
  const accountBalanceItem = el("span.account__balance");
  const accountBalanceGraph = el("canvas.account__graph");
  const accountIncomeOutcomeGraph = el("canvas.account__graph");
  const accountIncomeOutcomeTable = el("tbody.table__body");

  const container = el(
    "div.container.account__container",
    el(
      "div.account__top",
      el(
        "div.account__left",
        el("h1.title", "История баланса"),
        el("span.account__number", `№ ${account}`),
      ),
      el(
        "div.account__right",
        backButton,
        el(
          "div.account__balance-container",
          el("span.account__balance-title", "Баланс:"),
          accountBalanceItem,
        ),
      ),
    ),
    el(
      "div.account__bottom",
      el(
        "div.account__section.account__section_big",
        el("h2.account__title", "Динамика баланса"),
        el("div.account__graph-container", accountBalanceGraph),
      ),
      el(
        "div.account__section.account__section_big",
        el("h2.account__title", "Соотношение входящих исходящих транзакций"),
        el("div.account__graph-container", accountIncomeOutcomeGraph),
      ),
      el(
        "div.account__wrapper.account__wrapper_transactions",
        el("h2.account__title", "История переводов"),
        el(
          "table.account__table table",
          el(
            "thead.table__top",
            el(
              "tr.table__row",
              el("th.table__column", "Счёт отправителя"),
              el("th.table__column", "Счёт получателя"),
              el("th.table__column", "Сумма"),
              el("th.table__column", "Дата"),
            ),
          ),
          accountIncomeOutcomeTable,
        ),
        el("div.account__button-container", previousPageButton, nextPageButton),
      ),
    ),
  );

  function renderPaymentsHistory(page) {
    accountIncomeOutcomeTable.innerHTML = "";
    const startIndex = Math.max(transactions.length - page * 25, 0);
    const endIndex = startIndex + 25;
    const pageTransactions = transactions.slice(startIndex, endIndex).reverse();

    pageTransactions.forEach((transaction) => {
      mount(
        accountIncomeOutcomeTable,
        el(
          "tr.table__row",
          el("td.table__cell", transaction.from),
          el("td.table__cell", transaction.to),
          transaction.amount > 0
            ? el("td.table__cell.table__cell_down", `- ${transaction.amount} ₽`)
            : el("td.table__cell.table__cell_up", `+ ${transaction.amount} ₽`),
          el("td.table__cell", formationDate(transaction.date)),
        ),
      );
    });
  }

  async function balanceHistoryActions() {
    let pageNumber = 1;
    accountBalanceItem.textContent = `${balance} ₽`;
    renderPaymentsHistory(1);
    createBalanceChart(accountBalanceGraph, { balance, transactions }, 12);
    createIncomeOutcomeChart(
      accountIncomeOutcomeGraph,
      { balance, transactions, id },
      12,
    );

    previousPageButton.classList.add("account__button_disabled");

    previousPageButton.addEventListener("click", () => {
      if (pageNumber === 2)
        previousPageButton.classList.add("account__button_disabled");
      if (pageNumber === 1) return;
      renderPaymentsHistory(--pageNumber);
    });

    nextPageButton.addEventListener("click", () => {
      previousPageButton.classList.remove("account__button_disabled");
      if (transactions.length / 25 < pageNumber) return;
      renderPaymentsHistory(++pageNumber);
    });
  }

  backButton.addEventListener("click", () => {
    router.navigate(`/accounts/${id}`);
  });

  await balanceHistoryActions();

  return container;
}
