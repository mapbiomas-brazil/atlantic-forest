<div class="fluid-row" id="header">
    <img src='./misc/arcplan-logo.jpeg' height='70' width='auto' align='right'>
    <h1 class="title toc-ignore">Atlantic Forest</h1>
    <h4 class="author"><em>Developed by  ArcPlan - mrosa@arcplan.com.br</em></h4>
</div>

# About
This folder contains the scripts to classify and post-process the Atlantic Forest Biome.

We recommend that you read the Atlantic Forest Biome Appendix of the Algorithm Theoretical Basis Document (ATBD).
[Link to ATBD](https://mapbiomas-br-site.s3.amazonaws.com/Metodologia/MataAtlantica_Appendix_-_ATBD_Col7_v1-1.pdf)

# How to use
First, you need to copy these scripts (including those in p04 folder) to your Google Earth Engine (GEE) account.

# Pre-processing

Step01: build stable pixels from Colleciton 6 and save a new asset

Step02:  export balanced training samples for each region

Step03:  export trained samples for each year

# Classification

Step04: classify and export classification for each region

# Post-processing

Step05: merge classification of each region and apply Gap fill filter to remove NODATA 

Step06: spatial filter

Step07a: temporal filter-3year
Step07b: filter regeneration on rare classes
Step07c: stabilizes natural classes

Step08a: temporal filter-4year
Step08b: temporal filter on first and last year
Step08c: temporal filter-5year

Step09a: temporal filter on first and last year on rare classes
Step09b: filter rare classes on the middle years
Step09c: filter minimum areas of transitions
Step09d: apply HAND filter on wetlands
Step09e: remove forest regeneration in forest plantation from Sentinel classification

Step10a: classify Sandbank Vegetation
Step10b: remove forest regeneration on last years on agriculture
Step10c: spatial filter
