describe('Cypress test for sidebar', () => {
  it('loads the single question detail view page successfully', () => {
    cy.visit('http://localhost:3000')
    cy.get('.question-answer > a').eq(0).click() 

    cy.get('.sidebar').should('be.visible')
    cy.get('.main-top > a > button').should('contain.text', 'Ask Question')
    cy.get('.question-body').should('be.visible')
    cy.get('.question-body-container .comments').should('be.visible').should('contain.text', 'Add a comment')

    cy.get('.main-answer').should('be.visible').should('contain.text', 'Your answer')
    cy.get('button').should('be.visible').should('contain.text', 'Post your answer')
  })
});