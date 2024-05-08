describe("Возможность перевести сумму со счёта на счёт", () => {
  let newAccountId;
  const TEST_VALUE_AMOUNT = 100;

  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'));
    cy.get(".login-form__input").eq(0).type('developer');
    cy.get(".login-form__input").eq(1).type('skillbox');
    cy.get(".login-form__button").click();
  });

  it("Пользователь может создать новый счёт", () => {
    cy.contains('.accounts__button', 'Создать новый счет').click();

    // Получаем текст из элемента .account__number
    cy.get('.account__number').then(($el) => {
      newAccountId = $el.text().slice(2);
    });
  });
  it("Пользователь может перевести сумму со счёта на счёт", () => {
    cy.visit(Cypress.config('baseUrl') + 'accounts/');
    cy.get(".account-card__button").eq(0).click();
    cy.get(".dropdown__title").click();
    cy.contains('.dropdown__item', newAccountId).click();
    cy.get(".account__input").type(TEST_VALUE_AMOUNT);
    cy.contains('.account__button', 'Отправить').click();
  });
  it("Перевод приходит на новый счёт", () => {
    cy.visit(Cypress.config('baseUrl') + 'accounts/' + newAccountId);
    cy.get(".account__balance").should("contain", `${TEST_VALUE_AMOUNT} ₽`);
  });
});
