---
title: "How to (almost) never miss the subway again"
layout: post
---
I've [posted the code](https://github.com/benarnav/arrivals-board) for the display and invite you to contribute by adding support for your local transit agency!

## tl;dr
I live about a block away from a subway station and if I move quickly, I can get from my apartment to the platform in about 3 minutes. I've found myself frequently checking arrival times for the next trains, but manually hitting refresh on a website as I'm getting ready to leave is not ideal. So I built a wall-mounted display that shows transit information.
<div class="img-solo-div">
    <img src="/assets/img/arrivals_default.jpeg" alt="default screen for arrivals display" />
</div>

## Overview

New York City has the most extensive public transportation system in the United States, but due to its age (over 100 years old!) it is frequently in need of major maintenance which significantly disrupts or delays service. To avoid needlessly waiting for trains on the platform, I built this display to show the next two trains traveling in one direction (the way I'm usually going) from the station closest to my apartment. Pushing the built-in `UP` button on the microcontroller displays the next four trains going in both directions. The display is a 64x32 RGB LED matrix panel powered by an Adafruit Matrixportal S3 microcontroller, and I wrote the code for the display using CircuitPython. I originally used a Matrixportal M4, but that unit doesn't have enough memory to reliably run the transit display.

The default screen also shows the time, current temperature and AQI level. The AQI icon is color coded to signal the [recommendations](https://www.airnow.gov){:target="_blank" rel="noopener"} put out by the US Environmental Protection Agency. While on the default/clock screen, the subway line icons (known as 'bullets' in official MTA parlance), will flash an alert symbol if the transit agency has issued an alert for that line. Pushing the onboard `DOWN` button will scroll the alerts along the bottom of the display.

## Data fit for a microcontroller
The NYC Subway API uses protocol buffers for their data. The packages needed to decode the datafeeds are too large for a microcontroller, so I built a `Flask` webapp that prepares the data for the display. That app is hosted on [Python Anywhere](www.pythonanywhere.com){:target="_blank" rel="noopener"}. This setup only requires you obtain a [free API key](https://new.mta.info/developers){:target="_blank" rel="noopener"} from the MTA. Specifying the subway lines and station info that's displayed is handled by headers in the API call to the Flask app. The webapp sends the data in `json` format and organizes arrivals into Northbound and Southbound trains and alerts.  

<figure>
    <img src="/assets/img/arrivals_board.gif" alt="expanded arrivals screen" />
  <figcaption></figcaption>
</figure>

I also added support for Washington DC's Metro Rail, which uses a separate API endpoint handled by the `Flask` app and can be set up after obtaining a free API key from the [transit agency](https://developer.wmata.com).


## Next steps, future plans
I've been thinking about adding a dial that would allow switching between more than just two screens, but I haven't thought of what other sort of information I'd like to display.

The data delivered by the `Flask` app includes information on the terminal station, and displaying this or filtering trains based on it could be useful for users who need that level of specificity. 

I'd also like to add support for other transit agencies, so if you live in a city where this would be useful, [please contribute](https://github.com/benarnav/arrivals-board)!