// Aplica solo a los elementos de la sección correspondiente
document.querySelectorAll('#acompanyaments ul li').forEach((li, index) => {
    li.style.setProperty('--delay', `${index * 0.3}s`); // Ajusta el timing
});