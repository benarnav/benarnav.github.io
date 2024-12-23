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

<script src="assets/js/anticlock.js"></script>

I recently spent several hours watching Christian Marclay's [*The Clock*](https://www.moma.org/calendar/exhibitions/5746?){:target="_blank" rel="noopener"}, a hypnotic collage of watches, bedside alarms, public clocks that demand attention, inventive cuckoo clocks—and everything in between. There were ticking hands, glowing digits, and clock faces without numbers at all.

Inspired by Marclay’s meditation on time, I began to wonder: how much of our perception of it is shaped by convention rather than necessity? This led me to create the Anticlock—a timepiece that reimagines how we interpret and engage with temporal markers, drawing on writing systems read from right to left: [Arabic](https://www.omniglot.com/writing/arabic.htm), [Hebrew](https://www.omniglot.com/writing/hebrew.htm), [Syriac](https://www.omniglot.com/writing/syriac.htm), and [Samaritan](https://www.omniglot.com/writing/samaritan.htm). By reversing the motion of the hands, the Anticlock subtly disrupts our habitual way of reading the clock face. Even in Arabic-speaking countries on clocks where Eastern Arabic numerals are used, the hands traditionally move clockwise, reinforcing a universal pattern.

This disruption is particularly potent given that readers of left-to-right languages tend to [mentally represent](https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0011667){:target="_blank" rel="noopener"} events as unfolding from left to right in space. The familiar circular face maintains a connection to traditional timepieces, even as the reversed motion challenges our ingrained temporal associations.

While Marclay's work shows us how time permeates our visual culture through film, the Anticlock demonstrates how the very symbols we use to represent time can shape our perception of it. In reversing time's arrow, the Anticlock encourages us to question the narratives we impose on something as universal as time.
