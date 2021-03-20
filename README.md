# WORKING LEGALLY ON THE U.S
## A dynamic overview over the origin of Permanent Labor Petitioner's

This project was created with the intention of analyzing graphically the location around the world where the PERM Petitioners are coming.

#### You can find the live page on this address: https://macaguzman.github.io/Dynamic_PERM/

#### What is a PERM petition?
A Permanent Labor Certification, well-known as PERM (Program Electronic Review Management),is usuallly the first step of three steps to obtain a permanentely work authorization in the US. This is one of the most important steps because after the certification of a PERM the employer demostrates that there are no U.S. workers who are able, willing, qualified, and available to perform the work being given to the foreign worker and that the employment of the foreign worker will not adversely affect the wages and working conditions of similarly employed U.S. workers. When this step is already completed and CERTIFIED the employer can apply for a green card from the USCIS on behalf of a foreign national.

### Project Structure of the WebPage
The project has 5 main sections:
- Introduction
- Petitions between years 2015 to 2019
- Analysis of the country of origin of the applicants.
- Annual distribution (between 2015 and 2019) of the total PERM requests.
- Credits

### Files on Github
On the main folder you will find:
- Html with all the structure of the webpage
- Data folder: Contains the json files with the main data to create the graphs and visualizations.
- Node Modules folder: Intalled packages used to run my visualizations.
- scr folder: On this folder you will find,<br>
     app.js that is a javascript file with the code for each of the vizualizations and to run the scroller.<br>
     main.css configuration of the style of the webpage<br>

### npm installations
For this job I installed the following packages:
- npm install intersection-observer;
- npm install scrollama
- npm install d3-fetch
- npm install d3
- npm install d3-collection
- npm install d3-time-format

### Data
I get my data from https://www.dol.gov/agencies/eta/foreign-labor/performance, under the PERM Program fiscal year 2015-2019. After get thedata I used google colab to create each of my tables to use on my Data visualization (Google Colab: https://colab.research.google.com/drive/1g_yRryzI-uX9T3qN-1re9YVfV0USkfGI?usp=sharing)

### Sources
- Main Source: Lectures and videos from CAPP 30239 - Data Visualization for Policy Analysis - Andrew McNutt.Winter 2021
- Source 1: https://medium.com/@kj_schmidt/making-an-animated-donut-chart-with-d3-js-17751fde4679 - Donut Chart Creation
- Source 2: https://www.w3schools.com/css/default.asp - CSS Tutorial
- Source 3: https://www.d3-graph-gallery.com/graph/custom_color.html - Color Pallete
- Source 4: https://stackoverflow.com/questions/24193593/d3-how-to-change-dataset-based-on-drop-down-box-selection - drop down
- Source 5: https://www.w3schools.com/howto/howto_css_three_columns.asp - Div sections
- Source 6: https://www.d3-graph-gallery.com/graph/custom_legend.html - Legends
- Source 7: https://observablehq.com/@johnhaldeman/tutorial-on-d3-basics-and-circle-packing-heirarchical-bubb - Circle Packing
- Source 8: https://www.d3-graph-gallery.com/circularpacking.html - Circle Pack
- Source 9: https://github.com/russellgoldenberg/scrollama - Instructions for Scrollama
- Source 10: https://www.npmjs.com/package/scrollama - npm scrollama
- Source 11: http://jsfiddle.net/ur5rx/1/ - Simulation
- Source 12: https://observablehq.com/@d3/d3-hierarchy - Understand Hierarchical elements
- Source 13: https://bl.ocks.org/LemoNode/a9dc1a454fdc80ff2a738a9990935e9d - Multichart

