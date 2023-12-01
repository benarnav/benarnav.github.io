---
title: Understanding New York's Traffic Violence with Machine Learning
layout: page
---
## tl;dr
I built a custom dataset and trained a machine learning model to understand how transportation planners can reduce traffic deaths in New York City. I found neighborhoods with a higher percentage of people who commute by public transit tended to contribute to the model predicting a crash as non-fatal and crashes within zones designated as a priority by policy makers has a similar effect.

## Background
Machine learning models are becoming [increasingly popular](https://www.sciencedirect.com/science/article/pii/S2095756420301410?ref=pdf_download&fr=RR-2&rr=829af43178be4282) for use in traffic modeling, where traditionally statistical models were used. In 2014, New York City implemented the Vision Zero program, aiming to eliminate all traffic deaths and serious injuries by 2024. The city is nowhere near meeting that goal and the data is trending in the wrong direction. Traffic violence has killed 223 people in 2023, a 25% increase over 2018 which was the safest year under Vision Zero. This year is also set to be the [deadliest year for cyclists](https://transalt.org/press-releases/new-york-city-is-on-track-to-have-the-deadliest-year-for-bike-riders-since-1999-new-data-from-transportation-alternatives-and-families-for-safe-streets-shows) since 1999. At the same time, New York City was recently granted powers by the state government to expand the use of ticket-issuing speed cameras, which have been shown to [reduce dangerous driving](https://home.nyc.gov/html/dot/downloads/pdf/speed-camera-report.pdf) in their vicinity.

With this in mind, and having also looking into [reduced traffic enforcement](https://benjaminarnav.com/nyc_311/) by the police, I was curious to see if I could find other methods for keeping pedestrians and cyclists safe. 

## Data and Methods
In order to understand what New York City could do to increase safety, I built a custom dataset that included features such as distance from a speed/red light camera, if the crash was near a traffic calming project or if the crash occurred within zones targeted by city officials for safety improvements. I also included demographic features to see if commuting patterns and wealth could be contributing factors, as well as the number of complaints to the city’s municipal hotline, NYC311, about street safety issues. Since the city doesn't publish the location of speed cameras, I had to reverse engineer this information for parking ticket records. There are two violation codes related to camera-issued fines, which also have basic intersection information. I then geocoded these locations to obtain latitude and longitude data. A key to determining if a crash was near a camera was to compare the dates the camera was operations, based on a date range when it issued tickets, and the crash date. Cameras were considered "near" a crash if they were within 200 meters, a distance selected [based on previous studies](https://www.researchgate.net/publication/359045054_Unveiling_the_relevance_of_traffic_enforcement_cameras_on_the_severity_of_vehicle-pedestrian_collisions_in_an_urban_environment_with_machine_learning_models). Here's the full list of sources used to create the dataset:

- [NYPD Motor Vehicle Collisions](https://data.cityofnewyork.us/Public-Safety/NYPD-Motor-Vehicle-Collisions/h9gi-nx95)
- [US Census Bureau](https://data.census.gov/)
- [NYC Department of Transportation Vision Zero](https://data.cityofnewyork.us/Transportation/VZV_Priority-Zones-or-Areas/n4hs-fahn)
- [NYC Department of Transportation Turn Calming](https://data.cityofnewyork.us/Transportation/VZV_Turn-Traffic-Calming/hz4p-9f7s)
- [NYC 311 Complaints](https://data.cityofnewyork.us/Social-Services/311-Service-Requests-from-2010-to-Present/erm2-nwe9)
- [NOAA Global Historical Climatology Network](https://www.ncei.noaa.gov/products/land-based-station/global-historical-climatology-network-daily)
- [NYC Parking Violations Database](https://data.cityofnewyork.us/City-Government/Parking-Violations-Issued-Fiscal-Year-2023/869v-vr48)

A major challenge is the imbalanced nature of the dataset, where (thankfully) only about 1 percent of crashes were fatal. This was overcome with a combination of under sampling the majority class and over sampling the minority with SMOTE to create a 2:1 ratio in the training data. Further experimentation showed improved performance outside this framework, such as a Logistic Regression model using only random undersampling. I also experimented with [using SMOTEBoost](https://www3.nd.edu/~nchawla/papers/ECML03.pdf), which combines the SMOTE algorithm and boosting classifiers. I'm trying to tell you I spent a lot of time trying to overcome the data imbalance. While there are many other ways to overcome imbalances in data, these were selected for achieving improved results given the available compute. I ultimately compared ten different classifiers using these two training pipelines (I removed `random_state` setting for readability):
```python
sampler = {"over_first": 
             [('over', SMOTE(sampling_strategy=.1)), 
              ('under', RandomUnderSampler(sampling_strategy=.5)), 
              ('model', classifier)],
           "under_first": 
             [('under', RandomUnderSampler(sampling_strategy=.1)), 
              ('over', SMOTE(sampling_strategy=.5)), 
              ('model', classifier)]}
```

## Results
After trying a range of models and sampling techniques, I selected a `Catboost` classifier based on it achieving the highest average precision score of 0.088. While this seems low, it must be compared against a dummy classifier which for this dataset would have a score of 0.010 (representing the 1 percent of the positive class or Killed). This represents a roughly nine fold improvement over a random guesser. A `Logistic Regression` model was also trained due to achieving the highest recall, although for real-world deployment the Catboost model would be more appropriate.  

Interpreting the Catboost model using `SHAP` values showed the single most important feature for predicting a fatal crash was the age of the victim. That older people tend to die when hit by a vehicle in unsurprising but still relevant for decreasing collision fatalities. Transportation planners could focus on locations where older people were hit to learn more about how to prevent deaths in the future or target older New Yorkers in education campaigns.

A particular interaction that was revealing was related to public transportation use in the area where a crash occurred. If a collision happened in a ZIP code where a higher percentage of people commute by public transport, it pushed the prediction of the Catboost model toward classifying the crash as non-fatal. Moreover, these ZIP codes also tended to have more complaints to 311 within the vicinity of a crash. This could suggest more citizen complaints would invite greater traffic enforcement, although more detailed research would be necessary to establish this. 
<figure style="text-align: center;">
  <a href="/assets/img/nyc_streets_shap_plots.png">
    <img style="max-width: 700px;" src="/assets/img/nyc_streets_shap_plots.png" alt="shap plots for four features" />
  </a>
  <figcaption>(SHAP plots for four features)</figcaption>
</figure>
As part of the Vision Zero program the NYC Department of Transportation has created several zones marked as "priority" under the program. If a crash was outside these zones, it contributed to the model predicting a fatal crash, while collisions inside these zones had the opposite effect. And while speed/red light cameras have decreased dangerous driving according to city studies, proximity to a cameras was associated with increasing the likelihood of a fatal prediction. But being within 200 meters of a camera generally contributed to the model predicting a non-fatal crash. This could be a sign transportation planners need to focus on other measures near cameras to improve safety in other respects.

## Next Steps, Improvements, Recommendations
Perfect is the enemy of good, and at a certain point I had to stop tinkering with this model. I would like to do more work to improve the model's performance, and investigate what features, tuning or sampling techniques could work. In a real-world scenario this would depend on stakeholder input and needs. Ultimately the results provide actionable guidance to policymakers for educational campaigns, traffic engineering, and infrastructure improvements aimed at reducing traffic deaths.
- In a future version I would want to change this to a multiclassificaiton problem with the minimum categories being: property damage only, injured, severely injured, and killed. New York's Department of Transportation has a program for reporting [more granular](https://www.nyc.gov/html/dot/downloads/pdf/sirta-report-q2-2023.pdf) injury statistics, but it only began reporting in 2022.
