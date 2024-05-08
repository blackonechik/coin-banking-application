import "../../styles/header.scss";
import { el, mount } from "redom";
import Cookies from "js-cookie";
import logoSvg from "../../assets/images/header/logo.svg";
import createButton from "./button";

function importLogo() {
  const logo = el("img.login__logo", {
    src: logoSvg,
  });
  return logo;
}

function createLeftMenu(router) {
  const buttons = {
    map: createButton("Банкоматы", "header"),
    accounts: createButton("Счета", "header"),
    currency: createButton("Валюта", "header"),
    logout: createButton("Выйти", "header"),
  };
  const leftMenu = el(
    "div.header__left-menu",
    ...Object.keys(buttons).map((key) => buttons[key]),
  );

  buttons.map.addEventListener(`click`, (e) => {
    e.preventDefault();
    router.navigate(`/map`);
  });

  buttons.accounts.addEventListener(`click`, (e) => {
    e.preventDefault();
    router.navigate(`/accounts`);
  });

  buttons.currency.addEventListener(`click`, (e) => {
    e.preventDefault();
    router.navigate(`/currency`);
  });

  buttons.logout.addEventListener(`click`, (e) => {
    e.preventDefault();
    Cookies.remove("access_token");
    router.navigate(`/login`);
  });

  return leftMenu;
}

export default function createHeader(isAuthorized, router) {
  const header = el(
    "header.header",
    el(
      "div.container.header__container",
      importLogo(),
      isAuthorized ? createLeftMenu(router) : null,
    ),
  );
  return header;
}
