// import React from 'react';
// import renderer from 'react-test-renderer';
// import QuestionCard from '../AllQuestionsView/QuestionCard';

// test('Link changes the class when hovered', () => {
//   const component = renderer.create(
//     <AllQuestions questions={}></AllQuestions>
//   );
//   let tree = component.toJSON();
//   expect(tree).toMatchSnapshot();
// });

// it("renders without crashing", () => {
//   shallow(<QuestionCard />);
// });

import { render, screen } from '@testing-library/react';
import AllQuestions from '../components/AllQuestionsView';

describe('Header component', () => {
 test('it renders', () => {
   render(<AllQuestions />);
   expect(screen.getByText('All Questions')).toBeInTheDocument();
   expect(screen.getByTestId('Home') ).toBeInTheDocument();
   expect(screen.getByTestId('Questions') ).toBeInTheDocument();
   expect(screen.getByTestId('Tags') ).toBeInTheDocument();
 });
})

