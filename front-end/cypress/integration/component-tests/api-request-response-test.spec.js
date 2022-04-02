describe('Cypress tests for api request and response', () => {

  //GET requests
  context('GET /questions', () => {
      it('should return a list of all questions', () => {
          cy.request({
              method: 'GET',
              url: 'http://localhost:3000/api/v1/questions'
          }).should((response) => {
              expect(response.status).to.eq(200)
              Cypress._.each(response.body, (question) => {
                expect(question.id).to.not.be.null
                expect(question).to.include.keys('email', '_id', 'author', 'body', 'createdtime', 'downvotes', 'upvotes', 'tags', 'title', 'views')
              })
            });
      });
  });

  context('GET /tags', () => {
      it('should return a list of all tags used in questions', () => {
          cy.request({
              method: 'GET',
              url: 'http://localhost:3000/api/v3/tags'
          }).should((response) => {
              expect(response.status).to.eq(200)
              Cypress._.each(response.body, (tag) => {
                expect(tag._id).to.not.be.null
                expect(tag).to.include.keys('_id', 'count')
              })
            });
      });
  });

  context('GET /questions/tagged/:tagname', () => {
      it('should return a list of all questions tagged with the tagname', () => {
          cy.request({
              method: 'GET',
              url: 'http://localhost:3000/api/v3/questions/tagged/go'
          }).should((response) => {
              expect(response.status).to.eq(200)
              Cypress._.each(response.body, (ques) => {
                expect(ques.id).to.not.be.null
                expect(ques).to.include.keys('email', '_id', 'author', 'body', 'createdtime', 'downvotes', 'upvotes', 'tags', 'title', 'views', 'updatedtime')
              })
            });
      });
  });

  context('GET /questions?q=${search_query}', () => {
      it('should return a list of all questions matching the search query given in search bar', () => {
          cy.request({
              method: 'GET',
              url: 'http://localhost:3000/api/v2/search?q=good'
          }).should((response) => {
              expect(response.status).to.eq(200)
              Cypress._.each(response.body, (res) => {
                expect(res.id).to.not.be.null
                expect(res).to.include.keys('email', '_id', 'author', 'body', 'createdtime', 'downvotes', 'upvotes', 'tags', 'title', 'views', 'updatedtime')
              })
            });
      });
  });

  //POST requests
  
  context('POST requests', () => {
    let token = "";
    it('should send login request using POST api', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/users/login',
        body: {
          email: "admin1@abc.com",
          password: "admin1234"
        }
      })
        .should((response) => {
          expect(response.status).eq(200)
          token = response.body.refresh_token
        });
    });

    it('should post or add a question using POST request', () => {
      cy.request({
        method: 'POST',
        url: 'http://localhost:3000/api/v1/questions',
        headers: {
          token: token
        },
        body: {
          author: "admin2",
          author_email: "admin2@abc.com",
          title: "Test question title",
          body: "Test question <b>body</b>",
          tags: ["test"]
        }
      })
        .should((response) => {
          expect(response.status).eq(201)
          expect(response.body).to.include.keys('InsertedID')
        });
    });

    it('should post an upvote and/or a downvote for question', () => {
      cy.request({
        method: 'POST',
        url: ' http://localhost:3000/api/v2/questions/6247686b33ef57dcc70d43f4/vote/upvote',
        headers: {
          token: token
        },
        body: {}
      }).should((response) => {
        expect(response.status).eq(200)
        expect(response.body.status).eq("Vote updated successfully")
      });

      cy.request({
        method: 'POST',
        url: ' http://localhost:3000/api/v2/questions/6247686b33ef57dcc70d43f4/vote/downvote',
        headers: {
          token: token
        },
        body: {}
      }).should((response) => {
        expect(response.status).eq(200)
        expect(response.body.status).eq("Vote updated successfully")
      });
    });
  });
});