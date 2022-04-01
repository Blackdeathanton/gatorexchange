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
   expect(screen.getByText('')).toBeInTheDocument();
   expect(screen.getByText('PROFILE')).toBeInTheDocument();
   expect(screen.getByTestId('HOME') ).toBeInTheDocument();
   expect(screen.getByTestId('ABOUT') ).toBeInTheDocument();
   expect(screen.getByTestId('MOVIES & SHOWS') ).toBeInTheDocument();
 });
})

