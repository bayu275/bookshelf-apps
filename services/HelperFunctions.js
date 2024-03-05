const HelperFunctions = (() => {
    /**
     * Creates and appends an HTML element with specified classNames.
     *
     * @param {string} el - the type of HTML element to create
     * @param {Array<string>} classNames - array of class names to add to the element
     * @param {HTMLElement} append - the parent element to append the created element to
     * @return {HTMLElement} the created HTML element
     */
    const createElement = (el, classNames, append) => {
        const element = document.createElement(el);
        if (Array.isArray(classNames)) classNames.forEach((name) => element.classList.add(name));
        if (append) append.appendChild(element);
        return element;
    };

    return { createElement };
})();

export default HelperFunctions;
