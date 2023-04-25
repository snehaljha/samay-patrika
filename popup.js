window.addEventListener("DOMContentLoaded", (event) => {
    console.log("popup fully loaded and parsed");

    let configBtn = document.querySelector('#config-btn');
    configBtn.addEventListener('click', () => {
        console.log('config clicked...')
        window.open('./index.html', '_blank');
    });
});