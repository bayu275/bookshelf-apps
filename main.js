const $ = (selector) => {
    const element = document.querySelectorAll(selector);
    return element.length === 1 ? element[0] : element;
};

const checkbox = $('#read');

checkbox.addEventListener('click', function () {
    checkbox.classList.toggle('checked');
});

checkbox.addEventListener('keydown', function (event) {
    const { key } = event;
    if (key === 'Enter') {
        checkbox.classList.toggle('checked');
    }
});
