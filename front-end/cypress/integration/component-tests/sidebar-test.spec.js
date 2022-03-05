describe('Cypress test for sidebar', () => {
  it('loads succesfully with navigation options shown', () => {
    cy.visit('http://localhost:3000')
    cy.get('.sidebar').should('be.visible')
    cy.get('.sidebar-options').should('be.visible')
    cy.get('.sidebar-option').should('have.length', 3)
    cy.get('.sidebar-option').eq(0).should('contain.text', 'Home')
    cy.get('.sidebar-option').eq(1).should('contain.text', 'Questions')
    cy.get('.sidebar-option').eq(2).should('contain.text', 'Tags')
  })
});