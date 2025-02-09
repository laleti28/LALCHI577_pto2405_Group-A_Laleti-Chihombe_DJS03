import { books, authors, genres, BOOKS_PER_PAGE } from './data.js'
class BookPreview {
    constructor(book) {
        this.book = book;
        this.element = this.createElement();
    }

    createElement() {
        const { author, id, image, title } = this.book;
        const element = document.createElement('button');
        element.classList.add('preview');
        element.setAttribute('data-preview', id);
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        return element;
    }
}


let page = 1;

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})
document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})
document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})


let matches = books;


// Section 1
// Function to render a list of book previews on the page
const renderBooks = (bookList) => {
    const fragment = document.createDocumentFragment();
    for (const { author, id, image, title } of bookList.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button'); // Create a button for each book
        element.classList = 'preview';
        element.setAttribute('data-preview', id);

        // Build the button's inner HTML with book details
        element.innerHTML = ` 
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
            event.preventDefault()
            const formData = new FormData(event.target)
            const { theme } = Object.fromEntries(formData)
                fragment.appendChild(element);
            });
            document.querySelector('[data-list-items]').appendChild(fragment);
            updateShowMoreButton(); // Update the button text after rendering
        };

// Section 2
// Function to update the "Show More" button based on remaining books
const updateShowMoreButton = () => {
    const remaining = matches.length - (page * BOOKS_PER_PAGE); // Calculate remaining books
    const button = document.querySelector('[data-list-button]');
    button.innerHTML = `
        <span>Show more</span>
        <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
    `;
    button.disabled = remaining <= 0; // Disable button if no more books
};
// Section 3
// Function to populate select dropdowns for genres and authors
const populateSelectOptions = (selectElement, options, defaultText) => {
    const fragment = document.createDocumentFragment();
    const firstOption = document.createElement('option'); // Default option
    firstOption.value = 'any';
    firstOption.innerText = defaultText;
    fragment.appendChild(firstOption);
 // Loop through options and create option elements
 for (const [id, name] of Object.entries(options)) {
    const option = document.createElement('option');
    option.value = id;
    option.innerText = name;
    fragment.appendChild(option);
}
selectElement.appendChild(fragment);
}};

// Section 5
// Function to handle search
const handleSearch = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const filters = Object.fromEntries(formData);
    // Filter books based on genre, title, and author
    matches = books.filter(book => {
        const genreMatch = filters.genre === 'any' || book.genres.includes(filters.genre);
        const titleMatch = filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase());
        const authorMatch = filters.author === 'any' || book.author === filters.author;
        return titleMatch && authorMatch && genreMatch;
    });
    page = 1;
    document.querySelector('[data-list-items]').innerHTML = ''; // Clear current book list
    renderBooks(matches);
    document.querySelector('[data-search-overlay]').open = false; // Close overlay
};

// Section 6
// Function to load more books when the button is clicked
const loadMoreBooks = () => {
    const fragment = document.createDocumentFragment();
    for (const { author, id, image, title } of matches.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE)) {
        const element = document.createElement('button');
        element.classList = 'preview';
        element.setAttribute('data-preview', id); // Set the book ID for preview

         // Build button HTML for each book
        element.innerHTML = `
            <img class="preview__image" src="${image}" />
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `;
        fragment.appendChild(element);
    }
    document.querySelector('[data-list-items]').appendChild(fragment);
    page += 1; 
    updateShowMoreButton(); // Update the button text after loading more
};
// Section 7
// Function to handle displaying book details on preview click
const handleBookPreview = (event) => {
    const pathArray = Array.from(event.path || event.composedPath());
    let active = null;

    // Loop through the path to find the clicked book's data
    for (const node of pathArray) {
        if (node?.dataset?.preview) { 
            active = books.find(book => book.id === node.dataset.preview); // Find the corresponding book
            break; // Exit loop if found
        }
    }

    if (active) {
        // Populate the detailed view with the active book's data
        document.querySelector('[data-list-active]').open = true;
        document.querySelector('[data-list-blur]').src = active.image;
        document.querySelector('[data-list-image]').src = active.image;
        document.querySelector('[data-list-title]').innerText = active.title;
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        document.querySelector('[data-list-description]').innerText = active.description;
    }
};

// Define query selectors in an object
const selectors = {
    listItems: document.querySelector('[data-list-items]'),
    searchCancel: document.querySelector('[data-search-cancel]'),
    settingsCancel: document.querySelector('[data-settings-cancel]'),
    headerSearch: document.querySelector('[data-header-search]'),
    headerSettings: document.querySelector('[data-header-settings]'),
    listClose: document.querySelector('[data-list-close]'),
    settingsForm: document.querySelector('[data-settings-form]'),
    searchForm: document.querySelector('[data-search-form]'),
    listButton: document.querySelector('[data-list-button]'),
    listMessage: document.querySelector('[data-list-message]'),
    searchOverlay: document.querySelector('[data-search-overlay]'),
    settingsOverlay: document.querySelector('[data-settings-overlay]'),
    listActive: document.querySelector('[data-list-active]'),
    listBlur: document.querySelector('[data-list-blur]'),
    listImage: document.querySelector('[data-list-image]'),
    listTitle: document.querySelector('[data-list-title]'),
    listSubtitle: document.querySelector('[data-list-subtitle]'),
    listDescription: document.querySelector('[data-list-description]'),
    settingsTheme: document.querySelector('[data-settings-theme]'),
    searchGenres: document.querySelector('[data-search-genres]'),
    searchAuthors: document.querySelector('[data-search-authors]'),
};


// Function to render initial books
const renderInitialBooks = () => {}
const starting = document.createDocumentFragment();
matches.slice(0, BOOKS_PER_PAGE).forEach(book => {
    const bookPreview = new BookPreview(book);
    starting.appendChild(bookPreview.element);

});

document.querySelector('[data-list-items]').appendChild(starting);
selectors.listItems.appendChild(starting);



document.querySelector('[data-list-items]').appendChild(starting)


const renderGenres = () => {}
    // Function to populate genres dropdown
    const populateGenres = () => {
const genreHtml = document.createDocumentFragment();
const firstGenreElement = document.createElement('option');
firstGenreElement.value = 'any';
firstGenreElement.innerText = 'All Genres'
genreHtml.appendChild(firstGenreElement);

for (const [id, name] of Object.entries(genres)) {
    const element = document.createElement('option');
    element.value = id;
    element.innerText = name;
    genreHtml.appendChild(element);
}

document.querySelector('[data-search-genres]').appendChild(genreHtml);
    };

    const renderAuthors = () => {}
        // Function to populate authors dropdown
        const populateAuthors = () => {
const authorsHtml = document.createDocumentFragment()
const firstAuthorElement = document.createElement('option')
firstAuthorElement.value = 'any'
firstAuthorElement.innerText = 'All Authors'
authorsHtml.appendChild(firstAuthorElement)

for (const [id, name] of Object.entries(authors)) {
    const element = document.createElement('option')
    element.value = id
    element.innerText = name
    authorsHtml.appendChild(element)
}

document.querySelector('[data-search-authors]').appendChild(authorsHtml)
selectors.searchAuthors.appendChild(authorsHtml);
};
// Function to set theme based on user preference
const setTheme = () => {
    const themeSelector = document.querySelector('[data-settings-theme]');

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    document.querySelector('[data-settings-theme]').value = 'night'
    document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
    document.documentElement.style.setProperty('--color-light', '10, 10, 20');
} else {
    document.querySelector('[data-settings-theme]').value = 'day'
    document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', '255, 255, 255');
}

const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const themeValue = isDarkMode ? 'night' : 'day';
    
    document.querySelector('[data-settings-theme]').value = themeValue;
    document.documentElement.style.setProperty('--color-dark', isDarkMode ? '255, 255, 255' : '10, 10, 20');
    document.documentElement.style.setProperty('--color-light', isDarkMode ? '10, 10, 20' : '255, 255, 255');
};

document.querySelector('[data-list-button]').innerText = `Show more (${books.length - BOOKS_PER_PAGE})`
document.querySelector('[data-list-button]').disabled = (matches.length - (page * BOOKS_PER_PAGE)) > 0

document.querySelector('[data-list-button]').innerHTML = `
    <span>Show more</span>
    <span class="list__remaining"> (${(matches.length - (page * BOOKS_PER_PAGE)) > 0 ? (matches.length - (page * BOOKS_PER_PAGE)) : 0})</span>
`

document.querySelector('[data-search-cancel]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = false
})

document.querySelector('[data-settings-cancel]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-header-search]').addEventListener('click', () => {
    document.querySelector('[data-search-overlay]').open = true 
    document.querySelector('[data-search-title]').focus()
})

document.querySelector('[data-header-settings]').addEventListener('click', () => {
    document.querySelector('[data-settings-overlay]').open = true 
})

document.querySelector('[data-list-close]').addEventListener('click', () => {
    document.querySelector('[data-list-active]').open = false
})

document.querySelector('[data-settings-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const { theme } = Object.fromEntries(formData)

    if (theme === 'night') {
        document.documentElement.style.setProperty('--color-dark', '255, 255, 255');
        document.documentElement.style.setProperty('--color-light', '10, 10, 20');
    } else {
        document.documentElement.style.setProperty('--color-dark', '10, 10, 20');
        document.documentElement.style.setProperty('--color-light', '255, 255, 255');
    }
    
    document.querySelector('[data-settings-overlay]').open = false
})

document.querySelector('[data-search-form]').addEventListener('submit', (event) => {
    event.preventDefault()
    const formData = new FormData(event.target)
    const filters = Object.fromEntries(formData)
    const result = []

    for (const book of books) {
        let genreMatch = filters.genre === 'any'

        for (const singleGenre of book.genres) {
            if (genreMatch) break;
            if (singleGenre === filters.genre) { genreMatch = true }
        }

        if (
            (filters.title.trim() === '' || book.title.toLowerCase().includes(filters.title.toLowerCase())) && 
            (filters.author === 'any' || book.author === filters.author) && 
            genreMatch
        ) {
            result.push(book)
        }
    }

    page = 1;
    matches = result

    const messageElement = document.querySelector('[data-list-message]');
    if (result.length < 1) {
        messageElement.classList.add('list__message_show');
            selectors.listMessage.classList.add('list__message_show');
        } else {
            messageElement.classList.remove('list__message_show');
            selectors.listMessage.classList.remove('list__message_show');
        }

    document.querySelector('[data-list-items]').innerHTML = ''
    selectors.listItems.innerHTML = '';
    const newItems = document.createDocumentFragment()
    result.slice(0, BOOKS_PER_PAGE).forEach(book => {
        const bookPreview = new BookPreview(book);
        newItems.appendChild(bookPreview.element);
    });


    for (const { author, id, image, title } of result.slice(0, BOOKS_PER_PAGE)) {
        const element = document.createElement('button')
        element.classList = 'preview'
        element.setAttribute('data-preview', id)
    
        element.innerHTML = `
            <img
                class="preview__image"
                src="${image}"
            />
            
            <div class="preview__info">
                <h3 class="preview__title">${title}</h3>
                <div class="preview__author">${authors[author]}</div>
            </div>
        `

        newItems.appendChild(element)
    }

    document.querySelector('[data-list-items]').appendChild(newItems)
    
    updateShowMoreButton();
    
    

    window.scrollTo({top: 0, behavior: 'smooth'});
    document.querySelector('[data-search-overlay]').open = false
});

// Event listeners
// Load more books on button click
document.querySelector('[data-list-button]').addEventListener('click', loadMoreBooks);



document.querySelector('[data-list-items]').addEventListener('click', (event) => {
    const pathArray = Array.from(event.path || event.composedPath())
    let active = null

    for (const node of pathArray) {
        if (active) break

        if (node?.dataset?.preview) {
            let result = null
    
            for (const singleBook of books) {
                if (result) break;
                if (singleBook.id === node?.dataset?.preview) result = singleBook
            } 
        
            active = result;
        }
    }
    function initializeApp() {
        updateShowMoreButton();
    }
    
    function updateShowMoreButton() {
        const remaining = matches.length - (page * BOOKS_PER_PAGE);
        const button = document.querySelector('[data-list-button]');
        button.innerHTML = `
          <span>Show more</span>
          <span class="list__remaining"> (${remaining > 0 ? remaining : 0})</span>
        `;
        button.disabled = remaining <= 0;
      }
      
    
    // Call initializeApp to start the app
    initializeApp();
    
      
    if (active) {
        document.querySelector('[data-list-active]').open = true
        document.querySelector('[data-list-blur]').src = active.image
        document.querySelector('[data-list-image]').src = active.image
        document.querySelector('[data-list-title]').innerText = active.title
        document.querySelector('[data-list-subtitle]').innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`
        document.querySelector('[data-list-description]').innerText = active.description
        selectors.listActive.open = true;
        selectors.listBlur.src = active.image;
        selectors.listImage.src = active.image;
        selectors.listTitle.innerText = active.title;
        selectors.listSubtitle.innerText = `${authors[active.author]} (${new Date(active.published).getFullYear()})`;
        selectors.listDescription.innerText = active.description;
    }
});
// Initialize the application
const initializeApp = () => {
    renderInitialBooks();
    renderGenres();
    renderAuthors();
    populateGenres();
    populateAuthors();
    setTheme();
    updateShowMoreButton();
    setupEventListeners();
};

initializeApp();