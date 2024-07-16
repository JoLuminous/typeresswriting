// scripts.js

const GITHUB_TOKEN = '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'; // Replace with your actual token
const GITHUB_USER = 'JoLuminous'; // Replace with your GitHub username
const GITHUB_REPO = 'typeresswriting'; // Replace with your repository name
const GITHUB_BRANCH = 'main'; // Replace with your branch name

// Utility function to handle API responses
function handleApiResponse(response) {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
}

// Function to save the story to GitHub
function saveStoryToGitHub(title, content, quotes) {
    const storyData = {
        title: title,
        content: content,
        quotes: quotes
    };

    const storyJson = JSON.stringify(storyData, null, 2);
    const storyPath = `stories/${title.replace(/ /g, '_')}.json`;
    const contentBase64 = btoa(unescape(encodeURIComponent(storyJson)));
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${storyPath}`;

    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `Add story ${title} (${new Date().toISOString()})`,
            content: contentBase64,
            branch: GITHUB_BRANCH
        })
    })
    .then(handleApiResponse)
    .then(data => {
        if (data.content) {
            alert('Story saved to GitHub!');
        }
    })
    .catch(error => {
        console.error('Error saving story to GitHub:', error);
        alert('Error saving story to GitHub. Please try again later.');
    });
}

// Function to load saved stories from GitHub
function loadStoriesFromGitHub() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/stories`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(handleApiResponse)
    .then(data => {
        if (Array.isArray(data)) {
            const stories = data.map(file => ({
                title: file.name.replace(/_/g, ' ').replace('.json', ''),
                path: file.path
            }));
            displayStories(stories);
        }
    })
    .catch(error => {
        console.error('Error loading stories from GitHub:', error);
        alert('Error loading stories from GitHub. Please try again later.');
    });
}

// Function to display stories on the browse page
function displayStories(stories) {
    const storyList = document.getElementById('story-list');
    storyList.innerHTML = '';

    stories.forEach(story => {
        const listItem = document.createElement('li');
        const storyLink = document.createElement('a');
        storyLink.textContent = story.title;
        storyLink.href = '#';
        storyLink.addEventListener('click', () => fetchStoryContent(story.path));
        listItem.appendChild(storyLink);
        storyList.appendChild(listItem);
    });
}

// Function to fetch story content from GitHub
function fetchStoryContent(path) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(handleApiResponse)
    .then(data => {
        if (data.content) {
            const storyJson = JSON.parse(decodeURIComponent(escape(atob(data.content))));
            displayStory(storyJson);
        }
    })
    .catch(error => {
        console.error('Error loading story content from GitHub:', error);
        alert('Error loading story content from GitHub. Please try again later.');
    });
}

// Function to display a story
function displayStory(story) {
    alert(`Title: ${story.title}\n\nStory:\n${story.content}\n\nSample Quotes:\n${story.quotes}`);
}

// Function to display a random featured story
function displayRandomFeaturedStoryFromGitHub() {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/stories`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(handleApiResponse)
    .then(data => {
        if (Array.isArray(data) && data.length > 0) {
            const randomIndex = Math.floor(Math.random() * data.length);
            const randomStoryPath = data[randomIndex].path;
            fetchStoryContentForFeatured(randomStoryPath);
        }
    })
    .catch(error => {
        console.error('Error loading stories from GitHub:', error);
        document.getElementById('featured-story-container').textContent = 'Error loading stories.';
    });
}

// Function to fetch story content from GitHub for featured story
function fetchStoryContentForFeatured(path) {
    const url = `https://api.github.com/repos/${GITHUB_USER}/${GITHUB_REPO}/contents/${path}`;

    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
        }
    })
    .then(handleApiResponse)
    .then(data => {
        if (data.content) {
            const storyJson = JSON.parse(decodeURIComponent(escape(atob(data.content))));
            displayFeaturedStory(storyJson);
        }
    })
    .catch(error => {
        console.error('Error loading story content from GitHub:', error);
        document.getElementById('featured-story-container').textContent = 'Error loading story content.';
    });
}

// Function to display a featured story
function displayFeaturedStory(story) {
    document.getElementById('featured-title').textContent = story.title;
    document.getElementById('featured-text').textContent = story.content;
    document.getElementById('featured-quotes').textContent = story.quotes;
}

// Add event listeners after the DOM content is loaded
document.addEventListener('DOMContentLoaded', () => {
    const saveButton = document.getElementById('save-button');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const title = document.getElementById('story-title').value.trim();
            const text = document.getElementById('story-text').value.trim();
            const quotes = document.getElementById('sample-quotes').value.trim();

            if (title === '' || text === '') {
                alert('Please provide a title and write something in the story before saving.');
                return;
            }

            saveStoryToGitHub(title, text, quotes);
            document.getElementById('story-title').value = '';
            document.getElementById('story-text').value = '';
            document.getElementById('sample-quotes').value = '';
        });
    }

    const thesaurusButton = document.getElementById('thesaurus-button');
    if (thesaurusButton) {
        thesaurusButton.addEventListener('click', fetchThesaurusData);
    }

    if (document.getElementById('story-list')) {
        loadStoriesFromGitHub();
    }

    if (document.getElementById('featured-story-container')) {
        displayRandomFeaturedStoryFromGitHub();
    }
});
