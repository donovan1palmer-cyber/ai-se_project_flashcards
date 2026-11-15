# FlashCard App

Brain Fuel is a flashcard study app built as my first project in TripleTen’s AI-Assisted Software Engineering program. It helps beginning software engineers review topics like HTML, CSS, JavaScript, and Git.

## Deployed Site

[Open Brain Fuel on GitHub Pages](https://donovan1palmer-cyber.github.io/ai-se_project_flashcards/)

## Project Pitch Videos

Check out these videos, where I describe my project
and some challenges I faced while building it:

- [First Video Pitch](https://drive.google.com/file/d/1knMLXQYDIcIdh_zhYV6RvmnSjHp935M5/view?usp=sharing)
- [Second Video Pitch](https://drive.google.com/file/d/1HdQ8OVmyx6DhJqje35r2wn-AHxd9UY0u/view?usp=sharing)



## Features

- Browse flashcard decks loaded from the API
- Open decks to view their cards
- Create a deck by submitting JSON and choosing a color
- Delete decks
- Practice with a carousel: flip cards and move between them
- Responsive layout for desktop and mobile
- About page with an example deck JSON format

## Creating a Deck

On the **New Deck** page, select a color and paste sample deck JSON in this format:

```json
{
  "name": "Sample Deck",
  "color": "#64d583",
  "cards": [
    {
      "question": "What does HTML stand for?",
      "answer": "HyperText Markup Language"
    },
    {
      "question": "What does CSS stand for?",
      "answer": "Cascading Style Sheets"
    }
  ]
}
```

## Technologies

- HTML
- CSS
- JavaScript
- Fetch API
- Flashcards API
- Git and GitHub
