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

I recently spent several hours watching Christian Marclay's [*The Clock*](https://www.moma.org/calendar/exhibitions/5746?){:target="_blank" rel="noopener"}, a hypnotic collage of watches, bedside alarms, public clocks that demand attention, inventive cuckoo clocks—and everything in between. There were ticking hands, glowing digits, and clock faces without numbers at all.

Around 4 a.m., figures hovered between sleep and alertness—someone jolts awake at a ringing phone, another smokes in half-light, and yet another glances at a bedside clock. By 7 a.m., the montage shifts: blinds are raised, kettles whistle, slippers shuffle across floors—everyday routines synchronized with dawn’s arrival.

Inspired by Marclay’s meditation, I began to wonder: how much of our perception of time is shaped by convention rather than necessity? I designed the Anticlock—a timepiece that subtly disorients just enough to awaken our time‑worn habits. Its hands move counter-clockwise, guided by right-to-left scripts like [Arabic](https://www.omniglot.com/writing/arabic.htm), [Hebrew](https://www.omniglot.com/writing/hebrew.htm), [Syriac](https://www.omniglot.com/writing/syriac.htm), and [Samaritan](https://www.omniglot.com/writing/samaritan.htm). Even in Arabic-speaking countries, where clocks commonly use Eastern Arabic numerals, the hands still move clockwise, reinforcing a near-universal pattern. The familiar circular face grounds the device; the reversed motion nudges us to question: what if we unlearn how to read time?

This disruption is particularly potent given that readers of left-to-right languages tend to [mentally represent](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0011667){:target="_blank" rel="noopener"} events as unfolding from left to right in space. Marclay’s work makes us conscious of time’s visual and narrative layering. The Anticlock makes us conscious of time’s symbolic infrastructure. Together, I hope to raise the question: are our lives measured, structured—and even narrated—by cinematic conventions and chronometric habits rather than by lived reality?

Time itself doesn't change—but our relationship to it, and how we perceive it, certainly can.
