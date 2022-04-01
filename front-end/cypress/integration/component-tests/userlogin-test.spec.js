describe('Cypress test for user login register page', () => {
    it('loads succesfully with login and register options', () => {
      cy.visit('http://localhost:3000/questions')
      
      cy.get('.header-right-container').click()
      cy.get('.auth-login-container > .input-field').should('have.length', 2)
      cy.get('.auth-login-container > button').should('contain.text', "Login")

      cy.get('.auth-login-container > p').click()
      cy.get('.auth-login-container > .input-field').should('have.length', 5)
      cy.get('.auth-login-container > button').should('contain.text', "Register")

      //sample login check
      cy.get('.auth-login-container > p').click()
      cy.get('[data-testid="login-email"]').type("admin1@abc.com")
      cy.get('[data-testid="login-password"]').type("admin1234")
      cy.get('.auth-login-container > button').click()
      cy.get('.header-right-container > .MuiAvatar-circular').should('be.visible')
      cy.get('[data-testid="PowerSettingsNewIcon"]').should('be.visible')

      //logging out 
      cy.get('[data-testid="PowerSettingsNewIcon"]').click()
    })
  });