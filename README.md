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

Step01: build stable pixels from Colleciton 7 and save a new asset

Step02: export Landsat with calculated bands and indexes

Step03a:  export balanced training samples for each region
Step03b:  export trained samples for each year

# Classification

Step04: classify and export classification and probability for each region

# Post-processing

Step05a: merge classification of each region and apply Gap fill filter to remove NODATA 
Step0b: merge probability of each region and apply Gap fill filter to remove NODATA 

Step06: spatial filter

Step07a: temporal filter-3year

Step07b: filter regeneration on rare classes

Step07c: stabilizes natural classes

Step08a: temporal filter-4year

Step08b: temporal filter-5year

Step09a: temporal filter on first and last year

Step09b: filter rare classes on the middle years

Step09c: reduce recovery os rare classes

Step09d: apply HAND filter on wetlands

Step09e: filter minimum areas of transitions

Step09f: reduce forert in last year

Step09b: filter rare classes on the middle years

Step10a: remove forest regeneration on last years on agriculture

Step10b: classify Sandbank Vegetation

Step10c: spatial filter

Step10d: temporal filter-3year

Step10e: add more savana in the border with Caatinga

