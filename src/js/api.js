import "nprogress/nprogress.css";
import Cookies from "js-cookie";
import nProgress from "nprogress";

const backendUrl = "https://api-coin.blackonechik.ru";

async function fetchData(url, options) {
  nProgress.start();
  try {
    const response = await fetch(backendUrl + url, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": options.isAuth ? `Basic ${Cookies.get("access_token")}` : null,
      },
      body: options.body ? JSON.stringify(options.body) : null,
    });

    if (!response.ok) {
      throw new Error('Произошла ошибка');
    }

    return responseProcessing(response);
  } catch (error) {
    if (error.message === 'Failed to fetch') {
      throw new Error('Проверьте подключение к интернету');
    }
    throw error;
  } finally {
    nProgress.done();
  }
}

async function responseProcessing(response) {
  const { payload, error } = await response.json();
  if (!error) {
    return payload;
  }
  throw new Error(error);
}

const authorization = async ({ login, password }) => await fetchData('/login', {
  method: "POST",
  body: { login, password },
});

const getAccountsOfUser = async () => await fetchData('/accounts', { method: "GET", isAuth: true });

const createNewAccount = async () => await fetchData('/create-account', { method: "POST", isAuth: true });

const getAccount = async (id) => await fetchData(`/account/${id}`, { method: "GET", isAuth: true });

const getUserCurrencies = async () => await fetchData('/currencies', { method: "GET", isAuth: true });

const getAllCurrencies = async () => await fetchData('/all-currencies', { method: "GET", isAuth: true });

const currencyBuy = async ({ from, to, amount }) => await fetchData('/currency-buy', {
  method: "POST",
  body: { from, to, amount },
  isAuth: true
});

const getBanksPlaces = async () => await fetchData('/banks', { method: "GET", isAuth: true });

const transferFunds = async ({ from, to, amount }) => await fetchData('/transfer-funds', {
  method: "POST",
  body: { from, to, amount },
  isAuth: true
});


const API = {
  authorization,
  getAccountsOfUser,
  getAccount,
  createNewAccount,
  getUserCurrencies,
  getAllCurrencies,
  currencyBuy,
  getBanksPlaces,
  transferFunds,
};

export default API;
