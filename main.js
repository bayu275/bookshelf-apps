import BookManager from './services/BookManager';
import EventHandler from './services/EventHandler';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form');
    const searchInput = document.querySelector('.bookshelf__search');
    const checkbox = document.getElementById('read');
    const checkboxEdit = document.getElementById('edit-read');
    
    document.addEventListener('render', BookManager.fetchBooks);
    form.addEventListener('submit', EventHandler.formSubmitHandler);
    searchInput.addEventListener('input', EventHandler.searchInputHandler);
    checkbox.addEventListener('click', EventHandler.checkboxHandler);
    checkboxEdit.addEventListener('click', EventHandler.checkboxEditHandler);

    BookManager.fetchBooks();
});
