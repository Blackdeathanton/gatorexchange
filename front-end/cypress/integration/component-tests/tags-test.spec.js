describe('Cypress test for sidebar', () => {
    it('loads succesfully with navigation options shown', () => {
      cy.visit('http://localhost:3000/questions')
      
      cy.get('.sidebar-option').eq(2).click()
      cy.get('.all-tags-view-top > h2').should('contain.text', 'Tags')
      cy.get('.all-tags-view-content > .tag-view-content').should('be.visible')
    })
  });
