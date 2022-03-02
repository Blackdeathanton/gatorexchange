describe('Cypress test for sidebar', () => {
  it('loads succesfully with question cards displayed', () => {
    cy.visit('http://localhost:3000')
    cy.get('.all-questions-view').should('be.visible')
    cy.get('.all-questions-view-top').should('contain.text', 'All Questions')
    cy.get('.all-questions-view-top > a').should('contain.text', 'Ask questions')
    cy.get('.question-left > .all-options').should('be.visible').within(() => {
      cy.get('div').should('be.visible')
    })
    cy.get('.question-answer').should('be.visible')

    // ask question button click test
    cy.get('.all-questions-view-top > a > button').click()
    cy.get('.ask-question-container').should('be.visible')
    cy.get('.header-left > a').click()

    // click question card test
    cy.get('.question-answer > a').eq(0).click()
    cy.get('.main-question-container').should('be.visible')
  })
});