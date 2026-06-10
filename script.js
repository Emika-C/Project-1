// Array of fun cat facts
const catFacts = [
    "Cats have over 20 vocalizations to communicate with each other and humans!",
    "A cat's purr vibrates at a frequency that can promote bone healing and muscle growth.",
    "Cats can rotate their ears 180 degrees independently.",
    "A cat's sense of smell is 14 times more powerful than a human's.",
    "Cats spend 70% of their lives sleeping or in a state of rest.",
    "A group of cats is called a 'clowder' or a 'glaring'.",
    "Cats have a third eyelid called the nictitating membrane.",
    "The Turkish Van cat is one of the few cat breeds that actually enjoys swimming!",
    "A cat's nose print is unique, just like a human's fingerprint.",
    "Cats can jump up to 6 times their body length.",
    "A cat's purr has been shown to reduce stress and lower blood pressure in humans.",
    "Cats have been domesticated for over 9,500 years.",
    "A cat's heart beats almost twice as fast as a human's heart.",
    "Cats can see in near darkness with only 1/6th the light needed by humans.",
    "The first cat in space was French, launched in 1963.",
    "Cats have a special collarbone that allows them to squeeze through tight spaces.",
    "A cat's brain is 90% similar to a human's brain.",
    "Cats have scent glands on their face, so when they rub against you, they're marking you as part of their family.",
    "Cats can run up to 30 mph in short bursts.",
    "A tabby cat's 'M' marking on its forehead stands for 'MEOW'!"
];

function showRandomFact() {
    const randomIndex = Math.floor(Math.random() * catFacts.length);
    const randomFact = catFacts[randomIndex];
    
    const factText = document.getElementById('fact-text');
    
    // Add fade animation
    factText.style.opacity = '0';
    setTimeout(() => {
        factText.textContent = randomFact;
        factText.style.opacity = '1';
    }, 200);
}

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add CSS transition for smooth fade effect
const style = document.createElement('style');
style.textContent = `
    #fact-text {
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
