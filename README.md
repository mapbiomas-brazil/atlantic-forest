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

Step06: apply spatial filter to remove noise

Step07: apply frequency filter

Step08: apply temporal filter

Step09: apply incidents filter

Step10: apply second spatial filter

Step11: add Herbaceous Sandbank Vegetation class
