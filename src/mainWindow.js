const splashScreen = document.getElementById('splash-screen');

// Event handler functions
function handleFadeOut() {
    splashScreen.style.opacity = '0';

    splashScreen.addEventListener('transitionend', () => {
        splashScreen.style.display = 'none';

        // Remove event listeners after the splash screen disappears
        document.removeEventListener('click', handleFadeOut);
        document.removeEventListener('keydown', handleKeydown);
    }, { once: true });
}

function handleKeydown(event) {
    if (event.key === 'Enter') {
        handleFadeOut();
    }
}

// Add event listeners
document.addEventListener("DOMContentLoaded", function() {
    document.addEventListener('click', handleFadeOut);
    document.addEventListener('keydown', handleKeydown);
});
