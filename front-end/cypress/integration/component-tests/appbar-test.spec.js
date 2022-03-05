
describe('Cypress test for app bar', () => {
  it('loads succesfully', () => {
    cy.visit('http://localhost:3000')
    cy.get('.header-container').should('be.visible')
    cy.get('.header-search-container').should('be.visible')
    cy.get('.header-left-img-container').should('contain.text', 'GatorExchange')
  })
});

