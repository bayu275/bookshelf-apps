const $ = (selector) => {
    const element = document.querySelectorAll(selector);
    return element.length === 1 ? element[0] : Array.from(element);
};

const checkbox = $('#read');
const filterBooks = $('.bookshelf__filter');

checkbox.addEventListener('click', function () {
    checkbox.classList.toggle('checked');
});

checkbox.addEventListener('keydown', function (event) {
    const { key } = event;
    if (key === 'Enter') {
        checkbox.classList.toggle('checked');
    }
});

filterBooks.forEach((filterBook) => {
    filterBook.addEventListener('click', (e) => {
        const filterActive = filterBooks.filter((chunks) => chunks.classList.contains('active'));
        filterActive.forEach((item) => item.classList.remove('active'));
        filterBook.classList.add('active');
    });
});

const books = [];

const form = $('#form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const title = $('#title').value;
    const author = $('#author').value;
    const year = $('#year').value;
    const read = checkbox.classList.contains('checked');
    const newBook = { title, author, year, read };
    books.push(newBook);
    console.log(books);
});
