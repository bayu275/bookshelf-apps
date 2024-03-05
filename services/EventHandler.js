import BookManager from './BookManager';

const EventHandler = (() => {
    const formSubmitHandler = (event) => {
        event.preventDefault();
        BookManager.addBook();
    };

    const searchInputHandler = () => BookManager.searchBooks();
    const checkboxHandler = () => document.getElementById('read').classList.toggle('checked');
    const checkboxEditHandler = () => document.getElementById('edit-read').classList.toggle('checked');

    return { formSubmitHandler, searchInputHandler, checkboxHandler, checkboxEditHandler };
})();

export default EventHandler;
