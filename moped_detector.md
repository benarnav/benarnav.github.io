---
title: Quantifying the Surge in Illegal Mopeds Using Computer Vision
layout: page
---

A version of this research published in the journal [Vital City](). And if you'd like to see the code/data behind this, [click here](https://github.com/benarnav/nyc_streets/).
## tl;dr
I trained a custom object detection model using data collected ad hoc from a network of traffic cameras to in an attempt to quantify the deluge of illegal gas-powered mopeds operating on New York's streets. It recorded over a thousand mopeds being operated illegally, with particular concern on an already congested bridge crossing.
<figure style="text-align: center;">
  <a href="/assets/img/moped_examples_citywide.jpg">
    <img style="max-width: 700px;" src="/assets/img/moped_examples_citywide.jpg" alt="mopeds found using object detection" />
  </a>
  <figcaption>Results from the object detection model</figcaption>
</figure>

## Background
New York City's streets have seen a surge of e-bikes and illegal gas-powered mopeds in recent years, mostly caused by an increase in use of food delivery apps. There are a host of problems associated with the industry as it is currently configured, but I focused on the effects on street safety in the city. While delivery workers initially chose e-bikes, a string of high-profile fires caused by substandard batteries and high costs mean more and more are switching to gas-powered mopeds. The vast majority of scooters are not registered and do not have license plates, making them illegal. Drivers frequently [illegally ride in the bike lane](https://www.nyc.gov/html/dot/html/bicyclists/ebikes.shtml), on sidewalks or against the flow of traffic. While there is no data specifically on mopeds, there has been a flurry of [anecdotal evidence](https://www.curbed.com/2023/10/bike-lane-manhattan-queensboro-bridge-cyclists-crashes.html) of crashes and close calls, with some people deciding to forgo cycling in response. All of this has created a dangerous situation on New York's already densely packed streets.

## Data and Methods
The New York City Department of Transportation (DOT) maintains a [network of cameras](https://webcams.nyctmc.org/map) designed to monitor traffic conditions. These cameras produce a still image every two to four seconds, there is no video. Although access to the DOT camera feeds is supposed to be [available to the public](https://webcams.nyctmc.org/subscribers), I was not given access despite repeated attempts. To overcome this bureaucratic obstacle, I built a simple web scraper to download static images, and to cycle through a list of cameras to capture various locations where a bike lane was visible in the frame. This method ensured minimal loss of information since the cameras only produce still images every few seconds. The web scraper organized images by location, date and time to ensure accurate reporting of results, especially since time stamps displayed on the images were sometimes incorrect.
```python
image_element = driver.find_element(By.XPATH, "/html/body/img")
image_url = image_element.get_attribute("src")
response = requests.get(image_url)

if response.status_code == 200:
    timestamp = time.strftime("%Y%m%d_%H%M%S")
    image_filename = f"{key}/image_{timestamp}.jpg"
    if not os.path.exists(f"{key}/"):
        os.makedirs(f"{key}/")
    with open(image_filename, "wb") as file:
        file.write(response.content)
```
I collected images in three hour blocks in the afternoon, partially overlapping with rush hour, for one week in autumn. After collecting the images I created a custom dataset using [Roboflow](https://roboflow.com) to draw bounding boxes and create additional images (modifying existing images with techniques like shear, reversing or adding noise) and trained a YOLOv8 model. The model achieved a mAP50 of 0.9 and a mAP50-95 of 0.6, which as you will see was sufficient for this task.

## Results
I found over a thousand instances of mopeds operating illegally in Manhattan and Brooklyn. The object detection model revealed mopeds riding in bike lanes, pedestrian plazas and across bridges, all spaces that prohibit motorized vehicles. It's imperfect but allows us to begin to understand the problem and formulate solutions beyond occasional [police stings](https://www.thecity.nyc/2023/09/07/migrant-moped-nypd-raid-tasers/) that burden delivery workers, some of the most vulnerable New Yorkers. There were severe limitations which I address in the next section, but after reviewing the initial results from the model, I decided to focus on one particularly dangerous area where camera placement was optimal: the Manhattan entrance to the shared pedestrian/bicycle path across the 59th Street/Queensboro Bridge.
<figure style="text-align: center;">
  <a href="/assets/img/mopeds_queensboro_bridge.jpg">
    <img style="max-width: 700px;" src="/assets/img/mopeds_queensboro_bridge.jpg" alt="mopeds found using object detection" />
  </a>
  <figcaption>Mopeds illegally using the 59th Street/Queensboro Bridge bike lane</figcaption>
</figure>
I recorded <i>one moped roughly every five minutes</i> using the narrow span. That essentially guarantees encountering one since it typically takes longer to cross the bridge by foot or bicycle. I also recorded about 50 mopeds using the bike lane on the iconic Brooklyn Bridge, seemingly undeterred by the police cruiser permanently stationed at the foot of the Brooklyn side of the path. 

## Next Steps, Improvements, Recommendations
The major limitation in this project was the image quality of the cameras which was only 352 x 240 pixels. Static images also also far inferior to video, which would allow for object tracking and speed estimation to further bolster results. Ultimately this was a proof of concept using a network of cameras designed for a very different purpose, mainly monitoring traffic flow for cars. The technology already exists to create an improved version of the model, it just needs to be implemented. Here are some other thoughts and recommendations:
- Cameras meant for monitoring bike lanes should be widely installed and paired with software to track vehicle types and issued violations when appropriate. New York's DOT already has a [pilot program](https://www.curbed.com/2023/04/nyc-dot-street-sensors-viva.html), but there are few details.
- The New York State legislature should allow automated ticketing for bike lanes, as it already does for bus lanes. Studies of the city's [red light and speed cameras](https://home.nyc.gov/html/dot/downloads/pdf/speed-camera-report.pdf) have already shown it has an impact on safety.
- New York State lawmakers must immediately close a loophole that allows mopeds to be sold unregistered. New York City in partnership with the state Department of Motor Vehicles must make a push to resister the currently illegal mopeds that are already in use throughout the city. This could be done at pop-up locations or checkpoints. So far punitive measures that focus on police confiscating illegal mopeds have not been effective.