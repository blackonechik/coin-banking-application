/* eslint-disable consistent-return */
import "../../styles/account.scss";
import { el, mount } from "redom";
import API from "../api";
import { pushNotify, formationDate } from "../helpers";
import createButton from "./button";
import createDropdown from "./dropdown";
import createBalanceChart from "./balanceChart";

let recipientsAccountNumber =  getRecipientAccountForAutocomplete();

function saveRecipientAccountForAutocomplete(account) {
  localStorage.setItem("accountforautocomplete", account);
}

function getRecipientAccountForAutocomplete() {
  return localStorage.getItem("accountforautocomplete");
}

function getSavedAccounts() {
  return JSON.parse(localStorage.getItem("accounts")).map((a) => a.account);
}

async function renderAccountDetails(
  balance,
  accountBalanceItem,
  transactions,
  accountBalanceGraph,
  accountTransactionsTable,
) {
  accountBalanceItem.textContent = `${balance} ₽`;
  accountTransactionsTable.innerHTML = "";
  transactions
    .slice(-10)
    .reverse()
    .forEach((transaction) => {
      mount(
        accountTransactionsTable,
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

  createBalanceChart(accountBalanceGraph, { balance, transactions }, 6);
}

export default async function createAccount(id, router) {
  try {
    const { account, balance, transactions, mine } = await API.getAccount(id);

    if (!mine) {
      router.navigate(`/accounts/`);
      pushNotify("У вас нет доступа к этому счёту", "error");
    }

    const dropdown = createDropdown(
      getRecipientAccountForAutocomplete() || "Выберите счёт",
      getSavedAccounts(),
    );

    const input = el("input.account__input", {
      placeholder: "Введите сумму перевода",
    });

    const backButton = createButton("Вернуться назад", "account");
    const payButton = createButton("Отправить", "account");
    const accountBalanceItem = el("span.account__balance");
    const accountBalanceGraph = el("canvas.account__graph-container");
    const accountTransactionsTable = el("tbody.table__body");
    const inputTooltip = el("span.account__tooltip");
    const inputLabel = el(
      "div.account__label",
      el("span.account__description", "Сумма перевода"),
      el("span.account__error-info", inputTooltip),
      input,
    );

    const container = el(
      "div.container.account__container",
      el(
        "div.account__top",
        el(
          "div.account__left",
          el("h1.title", "Просмотр счёта"),
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
          // Форма нового перевода
          "div.account__wrapper.account__wrapper_pay",
          el("h2.account__title", "Новый перевод"),
          el(
            "div.account__pay-form",
            el(
              "div.account__label",
              el("span.account__description", "Номер счёта получателя"),
              dropdown.item,
            ),
            inputLabel,
            payButton,
          ),
        ),
        el(
          "div.account__section",
          el("h2.account__title", "Динамика баланса"),
          el("div.account__graph-container", accountBalanceGraph),
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
            accountTransactionsTable,
          ),
        ),
      ),
    );

    function accountActions() {
      renderAccountDetails(
        balance,
        accountBalanceItem,
        transactions,
        accountBalanceGraph,
        accountTransactionsTable,
        id,
        router,
      );
      backButton.addEventListener("click", () => {
        router.navigate(`/accounts`);
      });

      dropdown.selectionItems.forEach((item) => {
        item.addEventListener("click", () => {
          dropdown.toggleDropdown(dropdown.item);
          dropdown.typeName.textContent = item.textContent;
          recipientsAccountNumber = item.textContent;
        });
      });
      input.addEventListener("blur", () => {
        try {
          if (input.value.trim() === "") throw new Error("Вы не ввели сумму");
          if (Number.isNaN(Number(input.value)))
            throw new Error("Сумма должна быть числом");
          if (Number(input.value) > balance)
            throw new Error("Недостаточно средств на счёте");
          inputLabel.classList.remove("account__label_error");
          payButton.disabled = false;
        } catch (error) {
          pushNotify(error.message, "error");
          inputLabel.classList.add("account__label_error");
          inputTooltip.textContent = error.message;
          input.value = "";
          payButton.disabled = true;
        }
      });

      payButton.disabled = true;
      payButton.addEventListener("click", async () => {
        try {
          if (!recipientsAccountNumber) throw new Error("Вы не выбрали счёт");
          if (recipientsAccountNumber === account)
            throw new Error("Вы не можете сделать перевод на этот же счёт");
          const { balance: newBalance, transactions: newTransactions } =
            await API.transferFunds({
              from: account,
              to: recipientsAccountNumber,
              amount: input.value,
            });

          renderAccountDetails(
            newBalance,
            accountBalanceItem,
            newTransactions,
            accountBalanceGraph,
            accountTransactionsTable,
          );
          saveRecipientAccountForAutocomplete(recipientsAccountNumber);
        } catch (e) {
          pushNotify(e.message, "error");
        }
      });

      accountBalanceGraph.addEventListener("click", () => {
        router.navigate(`/balance-history/${id}`);
      });

      accountTransactionsTable.addEventListener("click", () => {
        router.navigate(`/balance-history/${id}`);
      });
    }
    accountActions();

    return container;
  } catch (e) {
    pushNotify(e.message, "error");
  }
}
