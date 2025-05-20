import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from './App';

// Mock setTimeout to control async behavior in tests
jest.useFakeTimers();

describe('App component', () => {
  describe('Ask AI functionality', () => {
    test('displays error message when transcript is empty', () => {
      render(<App />);
      const askAiButton = screen.getByText('Ask AI');
      fireEvent.click(askAiButton);
      // The output is displayed in a textarea. We can find it by its role.
      // Assuming there are two textareas, the first for transcript and second for output.
      const textareas = screen.getAllByRole('textbox');
      const outputTextarea = textareas[1]; 
      expect(outputTextarea.value).toBe('Please enter some text before asking AI.');
    });

    test('displays AI response when transcript is not empty', async () => {
      render(<App />);
      const askAiButton = screen.getByText('Ask AI');
      const textareas = screen.getAllByRole('textbox');
      const transcriptTextarea = textareas[0];
      const outputTextarea = textareas[1];

      // Simulate user typing into the transcript textarea
      fireEvent.change(transcriptTextarea, { target: { value: 'This is a test transcript.' } });
      
      fireEvent.click(askAiButton);

      // Advance timers to resolve the promise in handleAskAI
      jest.advanceTimersByTime(1000);

      // Wait for the output to update with the AI response
      await waitFor(() => {
        expect(outputTextarea.value).toBe('This is a response from Ask AI.');
      });
    });
  });

  describe('Correctness functionality', () => {
    test('displays error message when transcript is empty', () => {
      render(<App />);
      const correctnessButton = screen.getByText('Correctness');
      fireEvent.click(correctnessButton);
      const textareas = screen.getAllByRole('textbox');
      const outputTextarea = textareas[1];
      expect(outputTextarea.value).toBe('Please enter some text before checking correctness.');
    });

    test('displays Correctness response when transcript is not empty', async () => {
      render(<App />);
      const correctnessButton = screen.getByText('Correctness');
      const textareas = screen.getAllByRole('textbox');
      const transcriptTextarea = textareas[0];
      const outputTextarea = textareas[1];

      // Simulate user typing into the transcript textarea
      fireEvent.change(transcriptTextarea, { target: { value: 'This is a test transcript for correctness.' } });
      
      fireEvent.click(correctnessButton);

      // Advance timers to resolve the promise in handleCorrectness
      jest.advanceTimersByTime(1000);

      // Wait for the output to update with the Correctness response
      await waitFor(() => {
        expect(outputTextarea.value).toBe('No correctness issues found.');
      });
    });
  });

  describe('Readability functionality', () => {
    test('displays error message when transcript is empty', () => {
      render(<App />);
      const readabilityButton = screen.getByText('Readability');
      fireEvent.click(readabilityButton);
      const textareas = screen.getAllByRole('textbox');
      const outputTextarea = textareas[1];
      expect(outputTextarea.value).toBe('Please enter some text before assessing readability.');
    });

    test('displays Readability response when transcript is not empty', async () => {
      render(<App />);
      const readabilityButton = screen.getByText('Readability');
      const textareas = screen.getAllByRole('textbox');
      const transcriptTextarea = textareas[0];
      const outputTextarea = textareas[1];

      // Simulate user typing into the transcript textarea
      fireEvent.change(transcriptTextarea, { target: { value: 'This is a test transcript for readability.' } });
      
      fireEvent.click(readabilityButton);

      // Advance timers to resolve the promise in handleReadability
      jest.advanceTimersByTime(1000);

      // Wait for the output to update with the Readability response
      await waitFor(() => {
        expect(outputTextarea.value).toBe('Readability Score: Good');
      });
    });
  });
});
