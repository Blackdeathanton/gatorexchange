describe('Cypress test for user profile page', () => {
  it('loads succesfully with user profile information', () => {
    cy.visit('http://localhost:3000/questions')

    // logging in 
    cy.get('.header-right-container > a').click()
    cy.get('[data-testid="login-email"]').type("admin1@abc.com")
    cy.get('[data-testid="login-password"]').type("admin1234")
    cy.get('.auth-login-container > button').click()

    cy.get('[data-testid="user-profile"]').click()
    cy.get('.user-profile-stats').should('be.visible')
    cy.get('.user-profile-tags').should('be.visible')
    cy.get('.user-profile-questions').should('be.visible')

    cy.get('.user-questions-content > .question-item > a').eq(0).click()
    cy.get('.main-question-container').should('be.visible')

    //logging out 
    cy.get('[data-testid="PowerSettingsNewIcon"]').click()
  })
});
