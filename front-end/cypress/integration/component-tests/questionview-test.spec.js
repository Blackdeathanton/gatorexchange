describe('Cypress test for a question view', () => {
  it('loads the single question detail view page successfully', () => {
    cy.visit('http://localhost:3000/questions')
    cy.get('.question-answer > a').eq(0).click() 

    cy.get('.sidebar').should('be.visible')
    cy.get('.main-top > a > button').should('contain.text', 'Ask Question')
    cy.get('.question-body').should('be.visible')
    cy.get('.question-body-container .comments').should('be.visible').should('contain.text', 'Add a comment')

    cy.get('.main-answer').should('be.visible').should('contain.text', 'Your answer')
    cy.get('button').should('be.visible').should('contain.text', 'Post your answer')
  })
});

describe('Cypress test for a edit and delete question', () => {
  it('editing a question is done successfully', () => {
    cy.visit('http://localhost:3000/questions')

    // logging in 
    cy.get('.header-right-container > a').click()
    cy.get('[data-testid="login-email"]').type("admin1@abc.com")
    cy.get('[data-testid="login-password"]').type("admin1234")
    cy.get('.auth-login-container > button').click()

    // post a sample question
    cy.get('.all-questions-view-top > a > button').click()
    cy.get('[data-testid="ask-ques-title"]').type("Test-title")
    cy.get('[data-testid="ask-ques-body"] > .react-quill .ql-container').type("Test-body")
    cy.get('.ask-question-container > button').click()

    cy.get('[data-testid="edit-question"]').click()
    cy.get('[data-testid="save-edit"]').click()
    cy.get('.main-question-container').should('be.visible', 'Question updated successfully') 

    cy.get('[data-testid="delete-question"]').click()
    cy.get('.all-questions-view').should('be.visible', 'Question deleted successfully')

    //logging out 
    cy.get('[data-testid="PowerSettingsNewIcon"]').click()
  })
});

describe('Cypress test for a edit and delete answer', () => {
  it('editing a question is done successfully', () => {
    cy.visit('http://localhost:3000/questions')

    // logging in 
    cy.get('.header-right-container > a').click()
    cy.get('[data-testid="login-email"]').type("admin1@abc.com")
    cy.get('[data-testid="login-password"]').type("admin1234")
    cy.get('.auth-login-container > button').click()

    // post a sample question
    cy.get('.all-questions-view-top > a > button').click()
    cy.get('[data-testid="ask-ques-title"]').type("Test-question-title")
    cy.get('[data-testid="ask-ques-body"] > .react-quill .ql-container').type("Test-question-body")
    cy.get('.ask-question-container > button').click()

    cy.get('.main-answer > .react-quill > .ql-container').type("Test-answer body!!!")
    cy.get('[data-testid="post-answer-button"]').click()
    cy.get('[data-testid="edit-answer"]').should('be.visible', "Answer posted successfully")

    cy.get('[data-testid="edit-answer"]').click()
    cy.get('.ask-question-top > h1').should('contain.text', 'Edit answer')
    cy.get('[data-testid="save-edit"]').click()
    cy.get('.main-question-container').should('be.visible', 'Answer updated successfully') 

    cy.get('[data-testid="delete-answer"]').click()
    cy.get('[data-testid="answers-count"]').should('contain.text', '0 Answer(s)')

    //logging out 
    cy.get('[data-testid="PowerSettingsNewIcon"]').click()
  })
});
