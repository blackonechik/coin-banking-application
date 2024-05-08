import { el, mount } from "redom";
import Navigo from "navigo";
import Cookies from "js-cookie";

// Импорт компонентов
import createHeader from "./components/header";
import createLoginForm from "./components/login";
import createAccounts from "./components/accounts";
import createMap from "./components/map";
import createAccount from "./components/account";
import createCurrency from "./components/currency";
import createBalanceHistory from "./components/balance-history";
import "../styles/main.scss";

const router = new Navigo("/");

function clearContent() {
  document.body.innerHTML = "";
}

function isAuthorized() {
  return !!Cookies.get("access_token");
}

function secureRoute(target) {
  return () => {
    if (!isAuthorized()) {
      router.navigate("/login");
      return;
    }
    target();
  };
}

function mountContent(component) {
  mount(document.body, createHeader(isAuthorized(), router));
  mount(document.body, el("main.main", component));
}

router.on(
  "/",
  secureRoute(() => {
    router.navigate("/accounts");
  }),
);

router.on(
  "/accounts",
  secureRoute(async () => {
    clearContent();
    mountContent(await createAccounts(router));
  }),
);

router.on(
  "/map",
  secureRoute(async () => {
    clearContent();
    mountContent(await createMap());
  }),
);

router.on(
  "/currency",
  secureRoute(async () => {
    clearContent();
    mountContent(await createCurrency());
  }),
);

router.on("/login", () => {
  clearContent();
  mountContent(createLoginForm(router));
});

router.on(`/accounts/:id`, ({ data: { id } }) => {
  secureRoute(async () => {
    clearContent();
    mountContent(await createAccount(id, router));
  })();
});

router.on(`/balance-history/:id`, ({ data: { id } }) => {
  secureRoute(async () => {
    clearContent();
    mountContent(await createBalanceHistory(id, router));
  })();
});
router.resolve();
