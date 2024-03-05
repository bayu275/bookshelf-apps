import ApiService from './ApiService';
import HelperFunctions from './HelperFunctions';

const BookManager = (() => {
    const AppState = {
        books: [],
        read: [],
        unread: [],
        searchQuery: '',
    };

    const triggerRenderEvent = () => {
        const event = new CustomEvent('render');
        document.dispatchEvent(event);
    };

    const fetchBooks = async () => {
        const result = await ApiService.fetchBooks();
        const { data } = await result.json();
        const sanitizedData = data.map(({ __v, _id, ...book }) => book);
        AppState.books = sanitizedData;
        AppState.read = sanitizedData.filter((book) => book.completed);
        AppState.unread = sanitizedData.filter((book) => !book.completed);
        displayBooks(AppState.books);
    };

    const addBook = () => {
        const title = String(document.getElementById('title').value);
        const author = String(document.getElementById('author').value);
        const year = Number(document.getElementById('year').value);
        const completed = Boolean(document.getElementById('read').classList.contains('checked'));
        const newBook = { title, author, year, completed };
        openAddModal(newBook);
        form.reset();
    };

    const searchBooks = () => {
        const searchInput = document.querySelector('.bookshelf__search');
        const searchQuery = searchInput.value.trim();
        AppState.searchQuery = searchQuery;
        if (searchQuery === '') displayBooks(AppState.books);

        const filteredBooks = AppState.books.filter((book) => {
            return book.title.toLowerCase().includes(searchQuery.toLowerCase());
        });

        AppState.read = filteredBooks.filter((book) => book.completed);
        AppState.unread = filteredBooks.filter((book) => !book.completed);
        displayBooks(filteredBooks);
    };

    const toggleBook = async (bookId) => {
        const book = AppState.books.find((b) => b.id === bookId);
        await ApiService.updateBook(bookId, { completed: !book.completed });
        triggerRenderEvent();
    };

    const editBook = (bookId) => {
        const book = AppState.books.find((b) => b.id === bookId);
        openEditModal(book);
    };

    const deleteBook = async (bookId) => {
        await ApiService.deleteBook(bookId);
        triggerRenderEvent();
    };

    const openAddModal = async (newBook) => {
        const modal = document.querySelector('.modal');
        modal.classList.add('active');
        await ApiService.addBook(newBook);

        modal.addEventListener('click', async (event) => {
            if (event.target.classList.contains('modal__submit')) {
                modal.classList.remove('active');
                triggerRenderEvent();
            }
        });
    };

    const openEditModal = (book) => {
        const editModal = document.getElementById('edit-modal');
        editModal.classList.add('active');

        document.getElementById('edit-title').value = book.title;
        document.getElementById('edit-author').value = book.author;
        document.getElementById('edit-year').value = book.year;
        if (book.completed) document.getElementById('edit-read').classList.add('checked');
        else document.getElementById('edit-read').classList.remove('checked');

        editModal.addEventListener('click', async (event) => {
            if (event.target.classList.contains('edit-modal__close')) editModal.classList.remove('active');
            if (event.target.classList.contains('edit-modal__submit')) {
                event.preventDefault();
                book.title = document.getElementById('edit-title').value;
                book.author = document.getElementById('edit-author').value;
                book.year = document.getElementById('edit-year').value;
                if (document.getElementById('edit-read').classList.contains('checked')) book.completed = true;
                else book.completed = false;
                await ApiService.updateBook(book.id, { id: book.id, ...book });
                triggerRenderEvent();
                editModal.classList.remove('active');
            }
        });
    };

    const displayBooks = (books) => {
        const bookshelfContent = document.querySelector('.bookshelf__content');
        bookshelfContent.innerHTML = '';

        const contentTitle = HelperFunctions.createElement('h2', ['bookshelf__content-title'], bookshelfContent);
        contentTitle.innerHTML = 'My <span class="bookshelf__subtitle">Books</span>';

        if (books.length === 0) {
            const emptyMessage = HelperFunctions.createElement('div', ['bookshelf__info'], bookshelfContent);
            emptyMessage.innerHTML =
                '<div class="bookshelf__empty"><h3 class="bookshelf__empty-message">No books</h3></div>';
        }

        if (books.length > 0) {
            const booksCategory = HelperFunctions.createElement('div', ['bookshelf__category'], bookshelfContent);
            const categoryUnread = HelperFunctions.createElement('div', [
                'bookshelf__category-item',
                'category-unread',
            ]);
            const categoryRead = HelperFunctions.createElement('div', ['bookshelf__category-item', 'category-read']);

            if (AppState.unread.length > 0) {
                const titleUnread = HelperFunctions.createElement('h3', ['bookshelf__category-title'], categoryUnread);
                titleUnread.textContent = 'Unread';
                booksCategory.appendChild(categoryUnread);
            }

            if (AppState.read.length > 0) {
                const titleRead = HelperFunctions.createElement('h3', ['bookshelf__category-title'], categoryRead);
                titleRead.textContent = 'Read';
                booksCategory.appendChild(categoryRead);
            }

            books.forEach((book) => {
                if (book.completed === false) {
                    const bookInfoUnread = HelperFunctions.createElement(
                        'div',
                        ['bookshelf__book-info'],
                        categoryUnread
                    );
                    return displayBook(book, bookInfoUnread);
                }
                const bookInfoRead = HelperFunctions.createElement('div', ['bookshelf__book-info'], categoryRead);
                return displayBook(book, bookInfoRead);
            });
        }
    };

    const displayBook = (book, bookInfo) => {
        const title = HelperFunctions.createElement('p', ['bookshelf__title'], bookInfo);
        title.textContent = `Title: ${book.title}`;

        const author = HelperFunctions.createElement('p', ['bookshelf__author'], bookInfo);
        author.textContent = `Author: ${book.author}`;

        const year = HelperFunctions.createElement('p', ['bookshelf__year'], bookInfo);
        year.textContent = `Year: ${book.year}`;
        const icons = HelperFunctions.createElement('div', ['bookshelf__icons'], bookInfo);

        const toggle = HelperFunctions.createElement(
            'span',
            ['bookshelf__icon', `${book.completed ? 'return' : 'finish'}`],
            icons
        );
        toggle.innerHTML = `<img src="/images/${book.completed ? 'return-icon.svg' : 'finish-icon.svg'}" alt="${
            book.completed ? 'return icon' : 'finish icon'
        }" />`;
        toggle.addEventListener('click', () => {
            toggleBook(book.id);
        });

        const edit = HelperFunctions.createElement('span', ['bookshelf__icon', 'edit'], icons);
        edit.innerHTML = `<img src="/images/edit-icon.svg" alt="edit icon" />`;
        edit.addEventListener('click', () => editBook(book.id));

        const deleteIcon = HelperFunctions.createElement('span', ['bookshelf__icon', 'delete'], icons);
        deleteIcon.innerHTML = `<img src="/images/delete-icon.svg" alt="delete icon" />`;
        deleteIcon.addEventListener('click', () => deleteBook(book.id));
    };
    return { fetchBooks, addBook, deleteBook, searchBooks, openAddModal, openEditModal };
})();

export default BookManager;
