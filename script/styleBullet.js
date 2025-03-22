document.querySelectorAll('ul li').forEach((li, index) => {
    li.style.setProperty('--delay', `${index * 0.5}s`);
});