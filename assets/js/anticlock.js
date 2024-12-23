const NUMBER_SYSTEMS = {
    "eastern-arabic": ["۱۲", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹", "۱۰", "۱۱"],
    "hebrew": ["יב", "א", "ב", "ג", "ד", "ה", "ו", "ז", "ח", "ט", "י", "יא"],
    "syriac": ["ܝܒ", "ܐ", "ܒ", "ܓ", "ܕ", "ܗ", "ܘ", "ܙ", "ܚ", "ܛ", "ܝ", "ܝܐ"],
    "samaritan": ["ࠉࠁ", "ࠀ", "ࠁ", "ࠂ", "ࠃ", "ࠄ", "ࠅ", "ࠆ", "ࠇ", "ࠈ", "ࠉ", "ࠉࠀ"]
};

function updateClockNumbers() {
    const selectedScript = document.getElementById('script-select').value;
    const numbers = NUMBER_SYSTEMS[selectedScript];
    const numbersGroup = document.getElementById('clock-numbers');
    numbersGroup.innerHTML = '';

    for (let i = 0; i < 12; i++) {
        const angle = -i * 30 - 90;
        const radius = 85
        const x = 100 + radius * Math.cos(angle * Math.PI / 180);
        const y = 100 + radius * Math.sin(angle * Math.PI / 180);
        
        const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
        text.setAttribute("x", x);
        text.setAttribute("y", y);
        text.setAttribute("class", "number");
        text.setAttribute("text-anchor", "middle");
        text.setAttribute("data-script", selectedScript);
        text.setAttribute("dominant-baseline", "middle");
        text.textContent = numbers[i];
        
        numbersGroup.appendChild(text);
    }
}

function updateClockHands() {
    const now = new Date();
    const hours = now.getHours() % 12;
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    
    const hourAngle = -(hours + minutes/60) * 30;
    const minuteAngle = -minutes * 6;
    const secondAngle = -seconds * 6;
    
    document.getElementById('hour-marker').setAttribute('transform', 
        `rotate(${hourAngle}, 100, 100)`);
    document.getElementById('minute-marker').setAttribute('transform', 
        `rotate(${minuteAngle}, 100, 100)`);
    document.getElementById('second-marker').setAttribute('transform', 
        `rotate(${secondAngle}, 100, 100)`);
}

// Initialize the clock
updateClockNumbers();
setInterval(updateClockHands, 1000);
updateClockHands();