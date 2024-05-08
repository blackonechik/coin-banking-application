describe("Проверка авторизации пользователя", () => {
  beforeEach(() => {
    cy.visit(Cypress.config('baseUrl'))
  });
  it(`Авторизация проходит при вводе данных пользователя`, () => {
    cy.get(".login-form__input").eq(0).type('developer');
    cy.get(".login-form__input").eq(1).type('skillbox');
    cy.get(".login-form__button").click();
    cy.url().should('include', '/accounts')
  });
});
