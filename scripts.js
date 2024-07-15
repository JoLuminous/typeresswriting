// scripts.js

// Function to save the story
document.getElementById('save-button').addEventListener('click', () => {
    const title = document.getElementById('story-title').value.trim();
    const text = document.getElementById('story-text').value.trim();
    const quotes = document.getElementById('sample-quotes').value.trim();

    if (title === '' || text === '') {
        alert('Please provide a title and write something in the story before saving.');
        return;
    }

    const story = { title, text, quotes };
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    stories.push(story);
    localStorage.setItem('stories', JSON.stringify(stories));
    alert('Story saved!');
    document.getElementById('story-title').value = '';
    document.getElementById('story-text').value = '';
    document.getElementById('sample-quotes').value = '';
});

// Function to load saved stories
function loadStories() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    const storyList = document.getElementById('story-list');

    stories.forEach((story, index) => {
        const listItem = document.createElement('li');
        const storyLink = document.createElement('a');
        storyLink.textContent = `${story.title}`;
        storyLink.href = `#`;
        storyLink.addEventListener('click', () => displayStory(story));
        listItem.appendChild(storyLink);
        storyList.appendChild(listItem);
    });
}

// Function to display a story
function displayStory(story) {
    alert(`Title: ${story.title}\n\nStory:\n${story.text}\n\nSample Quotes:\n${story.quotes}`);
}

// Function to display a random featured story on the index page
function displayRandomFeaturedStory() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    if (stories.length === 0) {
        document.getElementById('featured-story-container').textContent = 'No stories available.';
        return;
    }

    const randomIndex = Math.floor(Math.random() * stories.length);
    const randomStory = stories[randomIndex];

    document.getElementById('featured-title').textContent = randomStory.title;
    document.getElementById('featured-text').textContent = randomStory.text;
    document.getElementById('featured-quotes').textContent = randomStory.quotes;
}

// Load stories when the browse page is loaded
if (window.location.pathname.endsWith('browse.html')) {
    loadStories();
}

function startdisplay() {
    loadStories();
}

// Display random featured story when the index page is loaded
if (window.location.pathname.endsWith('index.html')) {
    displayRandomFeaturedStory();
}

// API Ninjas Thesaurus API key and URL
const apiNinjasKey = 'Wl8eDozBKRZqli7XSWWtzA==zw7X28TN8K9wmyj7';
const apiNinjasUrl = 'https://api.api-ninjas.com/v1/thesaurus?word=';

// Function to fetch thesaurus data from API Ninjas
document.getElementById('thesaurus-button').addEventListener('click', () => {
    const word = document.getElementById('thesaurus').value.trim();
    if (word === '') {
        alert('Please enter a word to find synonyms.');
        return;
    }

    fetch(`${apiNinjasUrl}${word}`, {
        method: 'GET',
        headers: {
            'X-Api-Key': apiNinjasKey
        }
    })
    .then(response => response.json())
    .then(data => {
        const resultDiv = document.getElementById('thesaurus-result');
        resultDiv.innerHTML = '';
        if (data.synonyms && data.synonyms.length > 0) {
            data.synonyms.forEach(synonym => {
                const p = document.createElement('p');
                p.textContent = synonym;
                resultDiv.appendChild(p);
            });
        } else {
            resultDiv.textContent = 'No synonyms found.';
        }
    })
    .catch(error => {
        console.error('Error fetching thesaurus data:', error);
        alert('Error fetching thesaurus data. Please try again later.');
    });
});
