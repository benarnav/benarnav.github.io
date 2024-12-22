---
title: The Anticlock
layout: anticlock
---

<div class="clock-container" markdown="0">
    <svg class="clock" viewBox="0 0 200 200">
        <circle cx="100" cy="100" r="95" fill="transparent" stroke="white" stroke-width="2"/>
        
        <g id="clock-numbers"></g>
        
        <line id="hour-marker"
            class="hand" 
              x1="100" y1="115" 
              x2="100" y2="53" 
              stroke-width="6"
              fill="none"
              stroke-linecap="round"/>
        
        <line id="minute-marker" 
        class="hand"
              x1="100" y1="110" 
              x2="100" y2="35" 
              stroke-width="4"
              fill="none"
              stroke-linecap="round"/>
        
        <line id="second-marker"
        class="second-hand" 
              x1="100" y1="105" 
              x2="100" y2="30" 
              stroke-width="2"
              fill="none"
              stroke-linecap="round"/>
        
        <circle class="center-dot" cx="100" cy="100" r="2.5"/>
    </svg>

    <select id="script-select" onchange="updateClockNumbers()">
        <option value="eastern-arabic">Eastern Arabic</option>
        <option value="hebrew">Hebrew</option>
        <option value="syriac">Syriac</option>
        <option value="samaritan">Samaritan</option>
    </select>
</div>

<script>
    const NUMBER_SYSTEMS = {
        "arabic": ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
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
            const radius = selectedScript === 'samaritan' ? 75 : 85;
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
</script>