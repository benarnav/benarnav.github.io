---
title: How AI Reveals the Truth About Police Response to Illegal Parking
layout: page
---

## tl;dr

I repurposed traffic cameras operated by New York City's Department of Transportation to monitor for illegal parking using computer vision, and then filed complaints to the police through an [official city website](https://portal.311.nyc.gov/article/?kanumber=KA-01986) for non-emergency issues. To assess the police response, I compared their reported actions with the actual situation on the ground.

In over half the cases (52.15%), the vehicles were still illegally parked when the police marked the complaint as resolved, and in just 2.87% of cases did they issue a ticket. These numbers highlight serious flaws in the system and make a strong case for more automated ticketing, stricter police oversight, and street designs that naturally deter illegal parking.

<figure class="oversize-figure">
    <img src="/assets/img/parking_monitor_examples.jpg" alt="example images from the object detection model" />
  <figcaption>Scofflaws illegally parked in various locations across NYC</figcaption>
</figure>

## Audio tl;dr

Listen to a podcast version of the research paper, created with Google's NotebookLM:

<audio controls>
  <source src="/assets/audio/parking_monitor_podcast.mp3" type="audio/mpeg">
  Your browser does not support the audio element.
</audio>

## Background

I cycle a lot in New York and no matter how omnipresent the sight of a car parked in the bike lane has become, it's still annoying and it's still dangerous. Occasionally I file complaints on the NYC311 app, but it rarely result in a ticket, or even a meaningful response. And even if the app said police had issued a summons, I had done previous work showing that there's a [significant discrepancy](/posts/nyc_311.md) between NYPD claims and city records. Often, locations that are habitually plagued by illegal parking see no change year after year, no matter how many complaints are filed.

This study is an attempt to assess how the police respond to civilian complaints about illegal parking. I combed through over 900 traffic cameras and selected 21 based on their clear view of areas where parking was unambiguously prohibited, like fire hydrants, bike lanes and no standing zones. I then built a program to monitor these locations for illegal parking and file complaints (officially known as service requests) to 311, which forwards them to the police, and track its status. When the NYPD closes a service request they are required to pick a resolution from a list of predetermined responses. I compared this response to the ground truth captured by the camera and recorded it in a database.

<div class="ifame-container">
<div class="iframe-div">
<iframe src="/assets/iframes/parking_monitor_map.html"></iframe>
  <p>Camera locations and number of complaints (bar height)</p>
</div>
</div>

You may be asking: why does this matter? At first glance, illegal parking might seem like a small issue in the grand scheme of urban problems, but the reality is that it’s closely tied to bigger challenges like traffic safety, congestion, and urban mobility. When cars block bike lanes, for instance, it forces cyclists to merge into traffic, putting them at greater risk. Similarly, when fire hydrants or emergency lanes are blocked, it can slow down response times for first responders. This isn’t just about inconvenience, it’s about safety, the equitable use of public space and a system that effectively incentivizes driving. If there's no consequence for rampant illegal parking, then it signals it's accepted by the police.

I have previously used Department of Transportation [cameas](https://webcams.nyctmc.org/map){:target="_blank" rel="noopener"} and computer vision to [quantify](/posts/moped_detector.md) illegal driving by gas-powered mopeds, a problem that felt pervasive but had no numbers to back up that feeling. The motivation for this project was very similar: a suspicion the police were ignoring citizen complaints and a search to provide some figures to what is actually happening.

## Data and Methods

<figure class="oversize-figure">
    <img src="/assets/img/parking_monitor_algorithm_graphic.jpg" alt="visual flow chart describing the algorithm" />
  <figcaption>Workflow of illegal parking detection and service request filing to 311</figcaption>
</figure>

This study employs a mixed-methods approach, combining quantitative analysis of camera footage with qualitative assessment of police responses. The 21 cameras were selected to capture a range of urban environments, but we were ultimately limited by the location of DOT cameras and the subset that included areas of unambiguous no parking zones. The areas that were monitored included 11 bicycle lanes, 5 bicycle lanes with an adjacent vehicle turning lane, 4 areas where all parking is prohibited and 1 fire hydrant. I used a YOLOv8 model trained on COCO images for object detection and the service requests were filed to 311 through the official website using selenium. To distinguish between momentary stops and actual illegal parking, vehicles were only considered illegally parked if they remained stationary for more than 3 minutes, chosen based on New York City's [idling law](https://portal.311.nyc.gov/article/?kanumber=KA-02222){:target="_blank" rel="noopener"}.

Since the images are of such low quality, I used intersection over union to track vehicles across images, which were captured at one minute intervals. After a complaint was filed, the program tracked its status until it was closed. Once resolved, the object detection model again assessed the status of illegally parked vehicles at the scene and compared that to the vehicles that were there before the complaint. All of this, along with the service request details, were then recorded in a dataset. When the police close an illegal parking complaint, officers are required to input a “Resolution Description” - chosen from a list of predetermined responses - detailing what action was taken to resolve the situation. The official NYPD response declaration was then compared to the images at the time the complaint was closed to determine the effectiveness of the police action. If the police response stated a summons had been issued, a grace period was set so further complaints were not filed for a vehicle that had already been ticketed.

|Official NYPD Complaint Resolution Description|Resolution Category|No. of Complaints|
|-|-|-|
|The Police Department responded to the complaint and determined that police action was not necessary.|No action necessary|214|
|The Police Department responded to the complaint and took action to fix the condition.|Fix|172|
|The Police Department responded to the complaint and with the information available observed no evidence of the violation at that time.|No violation observed|118|
|The Police Department responded and upon arrival those responsible for the condition were gone.|Gone|40|
|The Police Department issued a summons in response to the complaint.|Summons|16|
|The Police Department reviewed your complaint and provided additional information below.|Other|7|
|Your request can not be processed at this time because of insufficient contact information. Please create a new Service Request on NYC.gov and provide more detailed contact information.|Other|6|
|The Police Department responded to the complaint and a report was prepared.|Other|1|

For the more technically inclined, I've [posted the code](https://github.com/benarnav/parking-monitor). Here's the core logic of the `main` function:

```python
while datetime.now() < end_time:
  for camera in camera_list:
      if camera.open_request is False and (datetime.now() - camera.refresh) > timedelta(minutes=1):
          filtered_detections, image_path = detector.get_detections(camera)

          if filtered_detections is None:
              continue

          camera.update_camera_vehicles(filtered_detections=filtered_detections, image_path=image_path)

          illegal_parking_exists = camera.check_illegal_parking()

          if illegal_parking_exists:
              # Files a service request on the 311 website.
              # Wrapped in a retry helper func in case the
              # selenium workflow fails.
              sr_num = retry(
                  sr.submit_service_request,
                  function_args=camera,
                  error_msg="Failed to submit service request")
              if sr_num is None:
                  continue

              camera.open_request = True
              camera.sr_num = sr_num

      elif camera.open_request and (datetime.now() - camera.refresh) > timedelta(minutes=1):
          check_sr_status(camera=camera, det=detector, sr=sr, csv_path=csv_path)
```

## Results

Analyzing the NYPD's response to these complaints paints a picture of a deeply flawed system. Over half (52.15%) the service requests were closed by the police while vehicles were still illegally parked. But beyond inaction, looking at response times suggests many citizen complaints are simply ignored. I found that 32.62% of service requests were closed in less than 8 minutes and 32 seconds, faster than the NYPD's average [response time](https://www.nyc.gov/site/911reporting/reports/end-to-end-response-time.page){:target="_blank" rel="noopener"} to 911 calls for "Critical Crime in Progress," which includes incidents such as shots fired, assisting a police officer, or assault with a weapon. A total of 51 (9.14%) complaints were closed in under one minute, with one service request closed in just 14 seconds.

<div class="img-solo-div-oversize">
<img src="/assets/img/parking_monitor_persistent_by_resolution.png" alt="chart of service requests by resolution category" />
</div>

This research points to a broader issue of transparency and accountability within the NYPD. If officers are closing cases without actually resolving them, it erodes public trust in the 311 system and law enforcement. Citizens rely on these systems to address quality-of-life issues, and when they fail, it sends a message that certain problems aren’t being taken seriously.

One particularly egregious example came from a camera on Manhattan's Upper East Side. The camera's field of view includes a bicycle lane and the adjacent vehicle turning lane, which is designed to give turning motorists a clear view of bicycle traffic and prevent collisions, a crucial safety feature. Except that turning lane was regularly blocked for hours by delivery trucks from companies like UPS ant Fresh Direct, a grocery service, repurposed into an impromptu logistics hub.

<figure class="oversize-figure">
    <img src="/assets/img/parking_monitor_2ave_74st.png" alt="scofflaws" />
  <figcaption>Images captured from DOT camera on 2nd Avenue and E 74th Street, Manhattan.</figcaption>
</figure>

On three separate days, brown box trucks were illegally parked for between 58 minutes and an hour and 56 minutes at this location, generating three, nine and 11 separate service requests respectively. In all of these cases the police closed the complaint, saying "action was not necessary." On two more occasions, tractor trailers were parked illegally for more than three hours each time, each resulting in seven complaints to the NYPD. The police closed the service requests alternatively claiming that "action was not necessary," that the trucks "were gone" and that officers "took action to fix the condition." All of these statements are contradicted by visual evidence.

## Next Steps, Improvements, Recommendations

The major limitation in this project was the image quality of the cameras which was only 352 x 240 pixels, and the lack of choice in camera placement. Ultimately this was a proof of concept using a network of cameras designed for a very different purpose, mainly monitoring the traffic flow of cars. The technology already exists to create an improved version, and semi-automated parking enforcement is already in use in several [countries](https://algoritmeregister.amsterdam.nl/en/automated-parking-control/){:target="_blank" rel="noopener"}.

Several policy recommendations for New York specifically include:

- Expand the use of automated enforcement to illegal parking, similar to speed and red light cameras.
- Allow citizens to submit evidence of illegal parking and receive a portion of any fines assessed, as is already the case with idling vehicles.
- Shift responsibility for 311 complaints to dedicated traffic officers instead of regular police.
- At a bare minimum, require police to submit evidence they have responded by submitting a photo and GPS evidence.