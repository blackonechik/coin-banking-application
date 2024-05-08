/* eslint-disable no-nested-ternary */
import "../../styles/currency.scss";
import { el, mount } from "redom";
import API from "../api";
import { pushNotify } from "../helpers";
import createButton from "./button";
import createDropdown from "./dropdown";

let valuesTypes = [];
let fromExchangeCurrency;
let toExchangeCurrency;

function filterDataByNegativeBalance(data) {
  const result = [];
  Object.keys(data).forEach((key) => {
    if (data[key].amount > 0) result.push(data[key]);
  });

  return result;
}

function renderCurrencyList(currency, arr) {
  currency.innerHTML = "";
  arr.forEach((item) => {
    mount(
      currency,
      el(
        `li.currency__item${item.change ? (item.change === -1 ? ".currency__item_down" : ".currency__item_up") : ""}`,
        el(
          "span.currency__code",
          item.code ? item.code : `${item.from}/${item.to}`,
        ),
        el("span.currency__amount", item.amount ? item.amount : item.rate),
      ),
    );
  });
}

function currencyActions(
  dropdowns,
  button,
  input,
  inputLabel,
  inputTooltip,
  currenciesList,
  userCurrencies,
) {
  dropdowns.fromExchange.selectionItems.forEach((item) => {
    item.addEventListener("click", () => {
      dropdowns.fromExchange.toggleDropdown(dropdowns.fromExchange.item);
      dropdowns.fromExchange.typeName.textContent = item.textContent;
      fromExchangeCurrency = item.textContent;
    });
  });

  dropdowns.toExchange.selectionItems.forEach((item) => {
    item.addEventListener("click", () => {
      dropdowns.toExchange.toggleDropdown(dropdowns.toExchange.item);
      dropdowns.toExchange.typeName.textContent = item.textContent;
      toExchangeCurrency = item.textContent;
    });
  });

  input.addEventListener("blur", () => {
    try {
      if (input.value.trim() === "") throw new Error("Вы не ввели сумму");

      if (input.value <= 0)
        throw new Error("Сумма не может быть отрицательной или равной нулю");

      if (Number.isNaN(Number(input.value)))
        throw new Error("Сумма должна быть числом");

      if (currenciesList[fromExchangeCurrency].amount < input.value)
        throw new Error("У вас недостаточно средств");

      inputLabel.classList.remove("exchange__label_error");
      button.disabled = false;
    } catch (error) {
      inputLabel.classList.add("exchange__label_error");
      inputTooltip.textContent = error.message;
      input.value = "";
      pushNotify(error.message, "error");
      button.disabled = true;
    }
  });

  button.disabled = true;

  button.addEventListener("click", async () => {
    try {
      if (!(fromExchangeCurrency && toExchangeCurrency))
        throw new Error("Вы не выбрали валюту");

      if (fromExchangeCurrency === toExchangeCurrency)
        throw new Error("Нельзя обменять одинаковые валюты");

      const data = await API.currencyBuy({
        from: fromExchangeCurrency,
        to: toExchangeCurrency,
        amount: input.value,
      });

      valuesTypes = filterDataByNegativeBalance(data);
      renderCurrencyList(userCurrencies, valuesTypes);
      pushNotify("Обмен прошел успешно");
    } catch (e) {
      pushNotify(e.message, "error");
    }
  });
}

export default async function createCurrency() {
  try {
    const data = await API.getUserCurrencies();

    const userCurrencies = el("ul.currency__list");
    const exchangeRateChanges = el("ul.currency__list");
    const currenciesList = await API.getAllCurrencies();

    valuesTypes = filterDataByNegativeBalance(data);

    fromExchangeCurrency = valuesTypes[0].code;
    [toExchangeCurrency] = currenciesList;

    const dropdowns = {
      fromExchange: createDropdown(
        fromExchangeCurrency,
        valuesTypes.map((item) => item.code),
      ),
      toExchange: createDropdown(toExchangeCurrency, currenciesList),
    };
    const button = createButton("Обменять", "exchange");
    const inputTooltip = el("span.exchange__tooltip");
    const input = el("input.exchange__input", {
      placeholder: "Введите сумму",
    });
    const inputLabel = el(
      "div.exchange__label",
      el("span.exchange__text", "Сумма"),
      el("span.exchange__error-info", inputTooltip),
      input,
    );

    const container = el(
      "div.container.currency__container",
      el("h1.title", "Валютный обмен"),
      el(
        "div.currency__wrapper",
        el(
          "div.currency__left",
          el(
            "div.currency__card",
            el("h2.currency__title", "Ваши валюты"),
            userCurrencies,
          ),
          el(
            "div.exchange",
            el("h2.exchange__title", "Обмен валюты"),
            el(
              "div.exchange__wrapper",
              el(
                "div.exchange__left",
                el(
                  "div.exchange__fromTo",
                  el("span.exchange__text", "Из"),
                  dropdowns.fromExchange.item,
                  el("span.exchange__text", "в"),
                  dropdowns.toExchange.item,
                ),
                inputLabel,
              ),
              button,
            ),
          ),
        ),
        el(
          "div.currency__right",
          el("h2.currency__title", "Изменение курсов в реальном времени"),
          exchangeRateChanges,
        ),
      ),
    );

    renderCurrencyList(userCurrencies, valuesTypes);
    currencyActions(
      dropdowns,
      button,
      input,
      inputLabel,
      inputTooltip,
      data,
      userCurrencies,
    );

    const socket = new WebSocket("ws://localhost:3000/currency-feed");
    const currencyRateChangeArray = [];

    socket.addEventListener("message", (event) => {
      const response = JSON.parse(event.data);
      switch (response.type) {
        case "EXCHANGE_RATE_CHANGE":
          currencyRateChangeArray.unshift(response);
          if (currencyRateChangeArray.length > 21) currencyRateChangeArray.pop();
          renderCurrencyList(exchangeRateChanges, currencyRateChangeArray);
          break;
        default:
          break;
      }
    });

    return container;
  } catch (e) {
    pushNotify(e.message, "error")
  }
}
