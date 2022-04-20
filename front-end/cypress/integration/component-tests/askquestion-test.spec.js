describe('Cypress test for post question', () => {
  it('loads the post question page succesfully', () => {
    cy.visit('http://localhost:3000/questions')
    // ask question button click
    cy.get('.all-questions-view-top > a > button').click()
    cy.get('.ask-question-container').should('be.visible')
    cy.get('.ask-question-top').should('contain.text', 'Ask a public question')
    cy.get('.question-option .title').should('have.length', 3)
    cy.get('.question-option .title').eq(0).should('contain.text', 'Title')
    cy.get('.question-option .title').eq(1).should('contain.text', 'Body')
    cy.get('.question-option .title').eq(2).should('contain.text', 'Tags')

    cy.get('.ask-question-container > button').should('contain.text', 'Add your question')

  })
});