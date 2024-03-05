const ApiService = (() => {
    const API_URL = 'https://bookshelf-apps-server.vercel.app/api/books';

    /**
     * A function to handle errors in the response.
     *
     * @param {Response} response - the response object
     * @return {Response} the response object if it's ok
     */
    const handleErros = (response) => {
        if (!response.ok) throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
        return response;
    };

    /**
     * Fetches books from the API_URL using async function.
     *
     * @return {type} the result of handleErros(response)
     */
    const fetchBooks = async () => {
        try {
            const response = await fetch(API_URL);
            return handleErros(response);
        } catch (error) {
            console.error('Error fetching books:', error.message);
            throw error;
        }
    };

    /**
     * Asynchronously adds a new book using the given newBook object.
     *
     * @param {Object} newBook - The new book object to be added.
     * @return {Promise} A promise that resolves with the result of adding the book, or rejects with an error.
     */
    const addBook = async (newBook) => {
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook),
            });
            return handleErros(response);
        } catch (error) {
            console.error('Error adding book:', error.message);
            throw error;
        }
    };

    /**
     * Asynchronously updates a book using the provided book ID and updated book data.
     *
     * @param {string} bookId - The ID of the book to be updated.
     * @param {object} updatedBook - The updated book data.
     * @return {Promise} A Promise that resolves with the result of the update operation.
     */
    const updateBook = async (bookId, updatedBook) => {
        try {
            if (!bookId) throw new Error('Book ID is required');
            if (!updateBook) throw new Error('Updated book is required');
            const response = await fetch(`${API_URL}/${bookId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedBook),
            });
            return handleErros(response);
        } catch (error) {
            console.error('Error updating book:', error.message);
            throw error;
        }
    };

    /**
     * Asynchronously deletes a book by its ID from the server.
     *
     * @param {number} bookId - The ID of the book to be deleted
     * @return {Promise} A Promise that resolves with the result of the deletion
     */
    const deleteBook = async (bookId) => {
        try {
            if (!bookId) throw new Error('Book ID is required');
            const response = await fetch(`${API_URL}/${bookId}`, { method: 'DELETE' });
            return handleErros(response);
        } catch (error) {
            console.error('Error deleting book:', error.message);
            throw error;
        }
    };
    return { fetchBooks, addBook, updateBook, deleteBook };
})();

export default ApiService;
