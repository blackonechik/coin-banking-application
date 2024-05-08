/* eslint-disable consistent-return */
import "../../styles/login.scss";
import { el } from "redom";
import Cookies from "js-cookie";
import API from "../api";
import { pushNotify } from "../helpers";

export default function createLoginForm(router) {
  const loginInput = el("input.login-form__input", {
    name: "login",
    type: "text",
    placeholder: "Placeholder",
  });

  const passwordInput = el("input.login-form__input", {
    name: "password",
    type: "text",
    placeholder: "Placeholder",
  });

  const loginTooltip = el("span.login-form__tooltip");
  const passwordTooltip = el("span.login-form__tooltip");

  const loginLabel = el(
    "label.login-form__label",
    el("span.login-form__description", "Логин"),
    el("span.login-form__error-info", loginTooltip),
    loginInput,
  );

  const passwordLabel = el(
    "label.login-form__label",
    el("span.login-form__description", "Пароль"),
    el("span.login-form__error-info", passwordTooltip),
    passwordInput,
  );

  const button = el("button.login-form__button", "Войти");

  const labels = [loginLabel, passwordLabel];
  const loginForm = el(
    "section.login",
    el(
      "div.container.login__container",
      el(
        "form.login-form",
        el("h1.login-form__title", "Вход в аккаунт"),
        ...labels,
        button,
      ),
    ),
  );

  loginInput.addEventListener("blur", () => {
    try {
      if (loginInput.value.length < 6)
        throw new Error("Логин должен быть не меньше 6 символов");

      if (loginInput.value.includes(" "))
        throw new Error("Логин не должен содержать пробелов");

      loginLabel.classList.remove("login-form__label_error");
    } catch (error) {
      pushNotify(error.message, "error");
      loginLabel.classList.add("login-form__label_error");
      loginTooltip.textContent = error.message;
    }
  });

  passwordInput.addEventListener("blur", () => {
    try {
      if (passwordInput.value.length < 6)
        throw new Error("Пароль должен быть не меньше 6 символов");

      if (passwordInput.value.includes(" "))
        throw new Error("Пароль не должен содержать пробелов");

      passwordLabel.classList.remove("login-form__label_error");
    } catch (error) {
      pushNotify(error.message, "error");
      passwordLabel.classList.add("login-form__label_error");
      passwordTooltip.textContent = error.message;
    }
  });

  button.addEventListener("click", async (e) => {
    e.preventDefault();
    const login = loginInput.value;
    const password = passwordInput.value;

    try {
      const data = await API.authorization({ login, password });

      Cookies.set("access_token", data.token, {
        expires: 7,
        secure: true,
      });

      router.navigate(`/accounts`);
    } catch (error) {
      pushNotify(error.message, "error");
    }
  });

  return loginForm;
}
