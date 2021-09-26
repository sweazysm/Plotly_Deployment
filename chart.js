function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {
  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("samples.json").then((data) => {
    // 3. Create a variable that holds the samples array. 
      var bb_samples = data.samples;
    // 4. Create a variable that filters the samples for the object with the desired sample number.
      var bb_samplesNumber = bb_samples.filter(sampleID => sampleID.id == sample);
    
    
    
      // ----- Gauge for Deliverable 3 goes below here ------

      // ----- first the metadata Array ------
      var metadataArray = data.metadata;
      console.log(metadataArray);
      
      // ----- second thee metadata Numbers ------
      var metadataNumbers = metadataArray.filter(metadataObject => metadataObject.id == sample);
      console.log(metadataNumber);
    
    
    
    
      //  5. Create a variable that holds the first sample in the array.
      var first_sample = bb_samplesNumber[0];
      console.log(first_sample.otu_ids);



      // ------ metadata array sample goes below here ------

      var metadataResults = metadataNumbers[0];
      console.log(metadataResults);

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otu_ids = first_sample.otu_ids,
      var otu_labels = first_sample.otu_labels,
      var sample_values = first_sample.sample_values;





    // ------ Making a variable to hold the washiing frequency (gosh this is so weird) ------
    var metadataFrequency = parseFloat(metadataResults.wfreq);
    console.log(metadataFrequency);

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    //  so the otu_ids with the most bacteria are last. 

    var yticks = otu_ids.slice(0, 10).reverse().map(x => "OTU" + x);
    console.log(yticks);

    // 8. Create the trace for the bar chart. 
    var barData = [{
      x: sample_value.slice(0, 10).reverse(),
      y: yticks,
      type: "bar", 
      text: otu_label,
      orientation: "h"
    }     
    ];
    // 9. Create the layout for the bar chart. 
    var barLayout = {
      title: "Top 10 Bacteria Cultures Found"
    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot('bar', barData, barLayout);
  });
}



// ---- Bubble Chart information goes below this line -----

    // 1. Create the trace for the bubble chart.
    var bubbleData = [{
      x: otu_id,
      y: sample_value,
      text: otu_label,
      mode: 'markers',
      marker:{
        size: sample_value,
        color: otu_id,
        colorscale: "Earth"
      }
    }
    ];

    // 2. Create the layout for the bubble chart.
    var bubbleLayout = {
      title: "Bacteria Cultures Per Sample",
      xaxis: {
        title: {text: "OTU IDs"}
      } 
    };

    // 3. Use Plotly to plot the data with the layout.
    Plotly.newPlot('bubble', bubbleData, bubbleLayout); 



// ------ traces for the gauge chart -------
// ----- create the gauge and ranges -------

var gaugeData = [{
  value: metadataFrequency,
  type: "indicator",
  mode: "gauge+number",
  title: {text: "Scrubs Conducted Per Week"},
  gauge: {
    axis: {range: [null, 10], tick0: 0, dtick: 2},
    bar: {color: "black"},
    steps: [
      {range: [0,2], color: "red"},
      {range: [2,4], color: "orange"},
      {range: [4,6], color: "yellow"},
      {range: [6,8], color: "lightgreen"},
      {range: [8,10], color: "green"}
    ]
  }
}
];

// ----- below here I will create the gauge chart layout ------

var gaugeLayout = {
  title: {
    text: "<b>Belly Button Washing Frequency</b>"}
};

// ----- us plotly to wrap everything up with the data and layout -----
Plotly.newPlot(gauge, gaugeData, gaugeLayout);

init();