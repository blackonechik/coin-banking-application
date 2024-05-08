/* eslint-disable consistent-return */
import { gsap } from "gsap";
import "../../styles/accounts.scss";
import { el, mount } from "redom";
import API from "../api";
import createAccountCard from "./accountCard";
import createButton from "./button";
import createDropdown from "./dropdown";
import { pushNotify } from "../helpers";

function appearanceItems(accountCards) {
  const tl = gsap.timeline();

  accountCards.forEach((card, index) => {
    tl.fromTo(
      card,
      { autoAlpha: 0, scale: 0.5 },
      {
        duration: 0.3, // длительность анимации в секундах
        autoAlpha: 1, // установить прозрачность на 1 (полностью видимо)
        scale: 1, // установить масштаб на 1 (полный размер)
        ease: "power2.out", // тип ускорения/замедления анимации
        delay: index * 0.00001, // задержка перед началом анимации для каждого элемента (увеличивается на 0.2 секунды для каждого последующего элемента)
      },
      "-=0.1",
    );
  });
}

function accountActions(
  dropdown,
  createNewAccountButton,
  accounts,
  router,
  renderAccounts,
) {
  const sortKeyMap = {
    "По номеру": "account",
    "По балансу": "balance",
    "По последней транзакции": "transactions",
  };

  function sortAccountList(arr, prop) {
    const newArr = [...arr];
    return newArr.sort((a, b) => (a[prop] > b[prop] ? -1 : 1));
  }

  createNewAccountButton.addEventListener("click", () => {
    API.createNewAccount().then((data) => {
      router.navigate(`/accounts/${data.account}`);
    });
  });

  dropdown.selectionItems.forEach((item) => {
    item.addEventListener("click", () => {
      dropdown.toggleDropdown(item);
      renderAccounts(sortAccountList(accounts, sortKeyMap[item.textContent]));
    });
  });
}

export default function createAccounts(router) {
  let accounts;
  const accountsList = el("div.accounts__list");
  const createNewAccountButton = createButton("Создать новый счет", "accounts");

  const sortTypes = ["По номеру", "По балансу", "По последней транзакции"];

  const dropdown = createDropdown("Сортировка", sortTypes);
  const container = el(
    "div.container.accounts__container",
    el(
      "div.accounts__top",
      el("div.accounts__left", el("h1.title", "Ваши счета"), dropdown.item),
      createNewAccountButton,
    ),
    accountsList,
  );

  function renderAccounts(arr) {
    accountsList.innerHTML = "";
    const accountCards = [];
    arr.forEach((account) => {
      const accountItem = createAccountCard(account, router);
      accountCards.push(accountItem);
      mount(accountsList, accountItem);
    });
    appearanceItems(accountCards);
  }

  API.getAccountsOfUser().then((data) => {
    accounts = data;
    localStorage.setItem("accounts", JSON.stringify(accounts));
    renderAccounts(accounts);
    accountActions(
      dropdown,
      createNewAccountButton,
      accounts,
      router,
      renderAccounts,
    );
  }).catch((e) => pushNotify(e.message, "error"));
  return container;
}
