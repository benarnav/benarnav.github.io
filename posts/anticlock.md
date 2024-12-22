---
title: The Anticlock
layout: page
---

<html>
<head>
    <title>Simple Clock</title>
    <style>
        .clock-container {
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background-color: #ffffff;
        }
        
        .clock {
            width: 1200px;
            height: 1200px;
        }
        
        .number {
            font-family: serif;
            font-size: 24px;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="clock-container">
        <select id="script-select" onchange="updateClockNumbers()">
            <option value="arabic">Western/Arabic</option>
            <option value="eastern arabic">Eastern Arabic</option>
            <option value="hebrew">Hebrew</option>
            <option value="syriac">Syriac</option>
            <option value="samaritan">Samaritan</option>
        </select>

        <svg class="clock" viewBox="0 0 200 200">
            <!-- Define checkerboard pattern -->
            <defs>
                <pattern id="checker-pattern" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(45)">
                    <rect width="4" height="4" fill="black"/>
                    <rect x="4" y="4" width="4" height="4" fill="black"/>
                </pattern>
            </defs>
            
            <!-- Clock face with border -->
            <circle cx="100" cy="100" r="90" fill="white"/>
            <circle cx="100" cy="100" r="95" fill="none" stroke="url(#checker-pattern)" stroke-width="20"/>
            
            <!-- Numbers container -->
            <g id="clock-numbers"></g>
            
            <!-- Clock hands -->
            <line id="hour-marker" x1="100" y1="100" x2="100" y2="50" stroke="black" stroke-width="6"/>
            <line id="minute-marker" x1="100" y1="100" x2="100" y2="40" stroke="black" stroke-width="4"/>
            <line id="second-marker" x1="100" y1="100" x2="100" y2="35" stroke="red" stroke-width="2"/>
            
            <!-- Center dot -->
            <circle cx="100" cy="100" r="3" fill="black"/>
        </svg>
    </div>

    <script>
        const NUMBER_SYSTEMS = {
            "arabic": ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
            "eastern arabic": ["۱۲", "۱", "۲", "۳", "٤", "٥", "٦", "۷", "۸", "۹", "۱۰", "۱۱"],
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
                const x = 100 + 75 * Math.cos(angle * Math.PI / 180);
                const y = 100 + 75 * Math.sin(angle * Math.PI / 180);
                
                const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                text.setAttribute("x", x);
                text.setAttribute("y", y);
                text.setAttribute("class", "number");
                text.setAttribute("text-anchor", "middle");
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
</body>
</html>