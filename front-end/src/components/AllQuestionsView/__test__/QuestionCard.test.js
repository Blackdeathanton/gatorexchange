import React from 'react';
import renderer from 'react-test-renderer';
import QuestionCard from '../QuestionCard';

// test('Link changes the class when hovered', () => {
//   const component = renderer.create(
//     <AllQuestions questions={}></AllQuestions>
//   );
//   let tree = component.toJSON();
//   expect(tree).toMatchSnapshot();
// });

it("renders without crashing", () => {
  shallow(<QuestionCard />);
});

