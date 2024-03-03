document.addEventListener('DOMContentLoaded', function () {
    const AppState = {
        books: [],
        read: [],
        unread: [],
        searchQuery: '',
    };

    fetchBooks();

    const form = document.getElementById('form');
    const searchInput = document.querySelector('.bookshelf__search');
    const bookshelfContent = document.querySelector('.bookshelf__content');
    const checkbox = document.getElementById('read');
    const checkboxEdit = document.getElementById('edit-read');

    document.addEventListener('RENDER', () => displayBooks(AppState.books));
    form.addEventListener('submit', addBook);
    searchInput.addEventListener('input', searchBooks);
    checkbox.addEventListener('click', () => checkbox.classList.toggle('checked'));
    checkboxEdit.addEventListener('click', () => checkboxEdit.classList.toggle('checked'));

    function triggerRenderEvent() {
        const event = new Event('RENDER');
        document.dispatchEvent(event);
    }

    async function fetchBooks() {
        try {
            const results = await fetch('http://localhost:3000/api/books');
            if (!results.ok) throw new Error(`Failed to fetch books: ${results.status} ${results.statusText}`);

            const { data } = await results.json();
            if (!data) throw new Error('No data received from server');

            AppState.books = data;
            AppState.read = data.filter((book) => book.completed);
            AppState.unread = data.filter((book) => !book.completed);
            console.log(AppState.books);
            displayBooks(AppState.books);
        } catch (error) {
            console.error('Error fetching books:', error.message);
        }
    }

    async function addBook() {
        event.preventDefault();
        const title = String(document.getElementById('title').value);
        const author = String(document.getElementById('author').value);
        const year = Number(document.getElementById('year').value);
        const completed = Boolean(document.getElementById('read').classList.contains('checked'));

        const newBook = {
            title,
            author,
            year,
            completed,
        };

        openAddModal(newBook);
        form.reset();
    }

    function searchBooks() {
        const searchQuery = searchInput.value.trim();
        AppState.searchQuery = searchQuery;

        if (searchQuery === '') displayBooks(AppState.books);

        const filteredBooks = AppState.books.filter((book) =>
            book.title.toLowerCase().includes(searchQuery.toLowerCase())
        );

        AppState.read = filteredBooks.filter((book) => book.completed);
        AppState.unread = filteredBooks.filter((book) => !book.completed);

        displayBooks(filteredBooks);
    }

    async function toggleBook(bookId) {
        const book = AppState.books.find((b) => b.id === bookId);
        book.completed = !book.completed;

        if (book.completed) {
            AppState.read.push(book);
            AppState.unread = AppState.unread.filter((b) => b.id !== bookId);
        } else {
            AppState.unread.push(book);
            AppState.read = AppState.read.filter((b) => b.id !== bookId);
        }

        try {
            const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ completed: book.completed }),
            });
            if (!response.ok) throw new Error(`Failed to toggle book: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error('Error toggling book:', error.message);
        }
        triggerRenderEvent();
    }

    function editBook(bookId) {
        const book = AppState.books.find((b) => b.id === bookId);
        if (!book) throw new Error(`Book with ID ${bookId} not found in the list of books`);
        openEditModal(book);
    }

    async function deleteBook(bookId) {
        const book = AppState.books.find((b) => b.id === bookId);
        if (!book) throw new Error(`Book with ID ${bookId} not found in the list of books`);

        AppState.books = AppState.books.filter((b) => b.id !== bookId);
        AppState.read = AppState.read.filter((b) => b.id !== bookId);
        AppState.unread = AppState.unread.filter((b) => b.id !== bookId);
        triggerRenderEvent();

        try {
            const response = await fetch(`http://localhost:3000/api/books/${bookId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error(`Failed to delete book: ${response.status} ${response.statusText}`);
        } catch (error) {
            console.error('Error deleting book:', error.message);
        }
    }

    function displayBooks(books) {
        bookshelfContent.innerHTML = '';

        const contentTitle = createElement('h2', ['bookshelf__content-title'], bookshelfContent);
        contentTitle.innerHTML = 'My <span class="bookshelf__subtitle">Books</span>';

        if (books.length === 0) {
            const emptyMessage = createElement('div', ['bookshelf__info'], bookshelfContent);
            emptyMessage.innerHTML =
                '<div class="bookshelf__empty"><h3 class="bookshelf__empty-message">No books</h3></div>';
        }

        if (books.length > 0) {
            const booksCategory = createElement('div', ['bookshelf__category'], bookshelfContent);
            const categoryUnread = createElement('div', ['bookshelf__category-item', 'category-unread']);
            const categoryRead = createElement('div', ['bookshelf__category-item', 'category-read']);

            if (AppState.unread.length > 0) {
                const titleUnread = createElement('h3', ['bookshelf__category-title'], categoryUnread);
                titleUnread.textContent = 'Unread';
                booksCategory.appendChild(categoryUnread);
            }

            if (AppState.read.length > 0) {
                const titleRead = createElement('h3', ['bookshelf__category-title'], categoryRead);
                titleRead.textContent = 'Read';
                booksCategory.appendChild(categoryRead);
            }

            books.forEach((book) => {
                if (book.completed === false) {
                    const bookInfoUnread = createElement('div', ['bookshelf__book-info'], categoryUnread);
                    return displayBook(book, bookInfoUnread);
                }
                const bookInfoRead = createElement('div', ['bookshelf__book-info'], categoryRead);
                return displayBook(book, bookInfoRead);
            });
        }
    }

    function displayBook(book, bookInfo) {
        const title = createElement('p', ['bookshelf__title'], bookInfo);
        title.textContent = `Title: ${book.title}`;

        const author = createElement('p', ['bookshelf__author'], bookInfo);
        author.textContent = `Author: ${book.author}`;

        const year = createElement('p', ['bookshelf__year'], bookInfo);
        year.textContent = `Year: ${book.year}`;

        const icons = createElement('div', ['bookshelf__icons'], bookInfo);

        const toggle = createElement('span', ['bookshelf__icon', `${book.completed ? 'return' : 'finish'}`], icons);
        toggle.innerHTML = `<img src="/images/${book.completed ? 'return-icon.svg' : 'finish-icon.svg'}" alt="${
            book.completed ? 'return icon' : 'finish icon'
        }" />`;
        toggle.addEventListener('click', () => {
            toggleBook(book.id);
        });

        const edit = createElement('span', ['bookshelf__icon', 'edit'], icons);
        edit.innerHTML = `<img src="/images/edit-icon.svg" alt="edit icon" />`;
        edit.addEventListener('click', () => editBook(book.id));

        const deleteIcon = createElement('span', ['bookshelf__icon', 'delete'], icons);
        deleteIcon.innerHTML = `<img src="/images/delete-icon.svg" alt="delete icon" />`;
        deleteIcon.addEventListener('click', () => deleteBook(book.id));
    }

    function clearForm() {
        document.getElementById('title').value = '';
        document.getElementById('author').value = '';
        document.getElementById('year').value = '';
        document.getElementById('read').classList.remove('checked');
    }

    function openAddModal(newBook) {
        const modal = document.querySelector('.modal');
        modal.classList.add('active');

        modal.addEventListener('click', async (event) => {
            if (event.target.classList.contains('modal__submit')) {
                try {
                    const response = await fetch('http://localhost:3000/api/books', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(newBook),
                    });
                    if (!response.ok) throw new Error(`Failed to add book: ${response.status} ${response.statusText}`);

                    const { data } = await response.json();
                    if (!data) throw new Error('No data received from server');

                    AppState.books.push(data);
                    data.completed ? AppState.read.push(data) : AppState.unread.push(data);
                    triggerRenderEvent();
                } catch (error) {
                    console.error('Error adding book:', error.message);
                }
                modal.classList.remove('active');
            }
        });
    }

    function openEditModal(book) {
        const editModal = document.getElementById('edit-modal');
        editModal.classList.add('active');

        document.getElementById('edit-title').value = book.title;
        document.getElementById('edit-author').value = book.author;
        document.getElementById('edit-year').value = book.year;
        if (book.completed) document.getElementById('edit-read').classList.add('checked');

        editModal.addEventListener('click', async (event) => {
            if (event.target.classList.contains('edit-modal__close')) editModal.classList.remove('active');

            if (event.target.classList.contains('edit-modal__submit')) {
                event.preventDefault();
                book.title = document.getElementById('edit-title').value;
                book.author = document.getElementById('edit-author').value;
                book.year = document.getElementById('edit-year').value;
                if (document.getElementById('edit-read').classList.contains('checked')) {
                    book.completed = true;
                } else {
                    book.completed = false;
                }

                if (book.completed) {
                    AppState.read.push(book);
                    AppState.unread = AppState.unread.filter((b) => b.id !== book.id);
                } else {
                    AppState.unread.push(book);
                    AppState.read = AppState.read.filter((b) => b.id !== book.id);
                }

                try {
                    const { id, title, author, year, completed } = book;
                    const response = await fetch(`http://localhost:3000/api/books/${id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ title, author, year, completed }),
                    });
                    if (!response.ok) {
                        throw new Error(`Failed to edit book: ${response.status} ${response.statusText}`);
                    }
                } catch (error) {
                    console.error('Error editing book:', error.message);
                }
                triggerRenderEvent();
                editModal.classList.remove('active');
            }
        });
    }
});

/**
 * Creates a new HTML element with optional class names and appends it to a specified parent element.
 *
 * @param {string} el - The type of HTML element to create.
 * @param {Array<string>} classNames - An array of class names to add to the new element.
 * @param {HTMLElement} append - The parent element to which the new element will be appended.
 * @return {HTMLElement} The newly created HTML element.
 */
const createElement = (el, classNames, append) => {
    const element = document.createElement(el);
    if (Array.isArray(classNames)) {
        classNames.forEach((name) => element.classList.add(name));
    }
    if (append) {
        append.appendChild(element);
    }
    return element;
};
