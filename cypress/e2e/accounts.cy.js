describe("Возможность перевести сумму со счёта на счёт", () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl')); // Используем базовый URL из конфигурации
    cy.get(".login-form__input").eq(0).type('developer');
    cy.get(".login-form__input").eq(1).type('skillbox');
    cy.get(".login-form__button").click();
  });

  it("Пользователь может перевести сумму со счёта на счёт", () => {
    cy.get(".account-card__button").eq(0).click();
    cy.get(".dropdown__title").click();
    cy.get(".dropdown__item").eq(1).click();
    cy.get(".account__input").type("100");
    cy.contains('.account__button', 'Отправить').click();
  });
});
