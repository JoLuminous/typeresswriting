// Function to save a story to Local Storage
function saveStoryToLocalStorage(title, content, quotes) {
    if (!title || !content) {
        alert('Please provide a title and story content.');
        return;
    }

    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    const story = { title, content, quotes };
    stories.push(story);
    localStorage.setItem('stories', JSON.stringify(stories));

    alert('Story saved successfully!');
    document.getElementById('story-title').value = '';
    document.getElementById('story-text').value = '';
    document.getElementById('sample-quotes').value = '';
}

// Function to load stories from Local Storage
function loadStoriesFromLocalStorage() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    displayStories(stories);
}

// Function to display stories in the browse page
function displayStories(stories) {
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = '';

    stories.forEach(story => {
        const listItem = document.createElement('li');
        listItem.textContent = story.title;
        listItem.addEventListener('click', () => {
            alert(`Title: ${story.title}\n\nStory:\n${story.content}\n\nSample Quotes:\n${story.quotes}`);
        });
        storyList.appendChild(listItem);
    });
}

// Function to display a random featured story
function displayRandomFeaturedStoryFromLocalStorage() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    if (stories.length === 0) {
        document.getElementById('featured-story-container').textContent = 'No stories available.';
        return;
    }
    const randomIndex = Math.floor(Math.random() * stories.length);
    const randomStory = stories[randomIndex];
    displayFeaturedStory(randomStory);
}

// Function to display a featured story on the homepage
function displayFeaturedStory(story) {
    document.getElementById('featured-title').textContent = story.title;
    document.getElementById('featured-text').textContent = story.content;
    document.getElementById('featured-quotes').textContent = story.quotes;
}

// Add event listeners after DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const title = document.getElementById('story-title').value.trim();
            const content = document.getElementById('story-text').value.trim();
            const quotes = document.getElementById('sample-quotes').value.trim();
            saveStoryToLocalStorage(title, content, quotes);
        });
    }

    if (document.getElementById('story-list')) {
        loadStoriesFromLocalStorage();
    }

    if (document.getElementById('featured-story-container')) {
        displayRandomFeaturedStoryFromLocalStorage();
    }

    const downloadTxtButton = document.getElementById('download-txt-button');
    if (downloadTxtButton) {
        downloadTxtButton.addEventListener('click', downloadStoriesAsTXT);
    }
});

// Function to convert stories to TXT format
function convertStoriesToTXT(stories) {
    return stories.map(story => {
        return `Title: ${story.title}\n\nStory:\n${story.content}\n\nSample Quotes:\n${story.quotes}\n\n---\n\n`;
    }).join('');
}

// Function to trigger the TXT download
function downloadStoriesAsTXT() {
    const stories = JSON.parse(localStorage.getItem('stories')) || [];
    const txtContent = convertStoriesToTXT(stories);

    const blob = new Blob([txtContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'stories.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
