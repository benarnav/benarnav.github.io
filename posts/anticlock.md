---
title: The Anticlock
layout: mono
load_anticlock_fonts: true
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
</script>

I sat for hours with Christian Marclay's [*The Clock*](https://www.moma.org/calendar/exhibitions/5746?){:target="_blank" rel="noopener"}. Watches, bedside alarms, station clocks high on the wall. Ticking hands, glowing digits, faces with no numbers at all. You forget where you are. The theater was cool but full, the kind of room where you become aware of your own breathing.

At four in the morning, figures drifted between sleep and waking. Someone startled by a phone. Someone smoking in the near-dark, the ember the only sure thing. A hand reaching toward a clock on the nightstand. By seven the light had changed. Blinds drawn up. The sound of a kettle. Slippers on a wooden floor. The whole world resuming at once. You could feel it in the room, too—people shifting in their seats, the day already claiming them.

Afterward I kept thinking about it. Not the film exactly, but the habits it exposed. How much of the way we feel time is convention. Inherited. I made something I call the Anticlock. Its hands move counter-clockwise, after the direction of [Arabic](https://www.omniglot.com/writing/arabic.htm), [Hebrew](https://www.omniglot.com/writing/hebrew.htm), [Syriac](https://www.omniglot.com/writing/syriac.htm), [Samaritan](https://www.omniglot.com/writing/samaritan.htm), some of these ancient. Even in countries where those scripts are read, clocks still turn in the universal way. That seemed worth noticing. The round face is familiar. The motion is not. It's a small disorientation, but it opens something. You watch the hands and for a moment you are outside of everything you know.

There is [research](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0011667){:target="_blank" rel="noopener"} showing that people who read left to right imagine events moving that way in space, a current running beneath thought. Marclay strips the ordinary passage of hours down to its images, its cuts. The Anticlock strips it down to its machinery. Both ask the same question, really. Whether we live inside time or inside the way time has been presented to us.

Time doesn't change. But we might learn to hold it differently.