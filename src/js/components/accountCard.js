import "../../styles/accountCard.scss";
import { el } from "redom";
import createButton from "./button";
import { formationDate } from "../helpers";

export default function createAccountCard(data, router) {
  const openButton = createButton("Открыть", "account-card");
  openButton.addEventListener("click", () => {
    router.navigate(`/accounts/${data.account}`);
  });
  return el(
    "div.account-card",
    el("span.account-card__number", data.account),
    el("span.account-card__balance", `${data.balance} ₽`),
    el(
      "div.account-card__bottom",
      el(
        "div.account-card__trasaction",
        el("span.account-card__text", "Последняя транзакция:"),
        el(
          "span.account-card__date",
          data.transactions.length > 0
            ? formationDate(data.transactions[0].date)
            : "Нет транзакции",
        ),
      ),
      el("div.account-card__right", openButton),
    ),
  );
}
