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


// // 1. Create the buildCharts function.
// function buildCharts(sample) {
//   // 2. Use d3.json to load and retrieve the samples.json file 
//   d3.json("samples.json").then((data) => {
//     // 3. Create a variable that holds the samples array. 
//     var samplesArray = data.samples;
//     // 4. Create a variable that filters the samples for the object with the desired sample number.
//     var sampleFilter = samplesArray.filter(sampleObj => sampleObj.id == sample);
//     //  5. Create a variable that holds the first sample in the array.
//     var sampleFirst = sampleFilter[0];

//     // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
//     var otu_ids = sampleFirst.otu_ids;
//     var otu_lables = sampleFirst.otu_lables;
//     var sample_values = sampleFirst.sample_values;

//     // 7. Create the yticks for the bar chart.
//     // Hint: Get the the top 10 otu_ids and map them in descending order  
//     //  so the otu_ids with the most bacteria are last. 
//     otuId = otu_ids.sort((a, b) => b-a);

//     var yticks = otuId.map(otuId => "OTU ${otu_ids}");
//     // var yticks = otu_ids.slice(0, 10).reverse();
//     // var yticks = otu_ids.slice(0, 10).map(otuIds => 'OTU ${otuIds}').reverse();
//     // 8. Create the trace for the bar chart. 
//     var barData = [
//       { x: sample_values.slice(0,10).reverse(),
//         y: yticks,
//         // text: otu_lables.slice(0,10).reverse(),
//         type: "bar",
//         orientation: "h"
//       }
      
//     ];
//     // 9. Create the layout for the bar chart. 
//     var barLayout = {
//       title: "My Original Top 10 Bacteria Cultures Found",
//       // margin: {t:30, 1:150}     
//     };

//     // 10. Use Plotly to plot the data with the layout. 
//     Plotly.newPlot("bar", barData, barLayout)
//   });
// }

  // 1. Create the buildCharts function.
  function buildCharts(sample) {
    // 2. Use d3.json to load and retrieve the samples.json file 
    d3.json("samples.json").then((data) => {
      // 3. Create a variable that holds the samples array. 
      var sampleArray = data.samples;
      // 4. Create a variable that filters the samples for the object with the desired sample number.
      var sampleFiltered = sampleArray.filter(sampleObject => sampleObject.id == sample);
      //  5. Create a variable that holds the first sample in the array.
      var sample1 = sampleFiltered[0];
  
      // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
      var otuIds = sample1.otu_ids;
      var otuLabels = sample1.otu_labels;
      var sampleValues = sample1.sample_values;
  
      // 7. Create the yticks for the bar chart.
      // Hint: Get the the top 10 otu_ids and map them in descending order  
      //  so the otu_ids with the most bacteria are last. 
  
      var yticks = otuIds.slice(0,10).reverse();
      //var ySorted = yticks.sort((a,b) => a.yticks - a.yticks);
  
      // 8. Create the trace for the bar chart. 
      var trace = [{
        x : sampleValues.slice(0,10).reverse(),
        y : yticks.map(otuIds => `otu${otuIds}`),
        text : otuLabels.slice(0,10).reverse(),
        type : "bar",
        orientation : "h"
      }];
      // 9. Create the layout for the bar chart. 
      var barLayout = {
        title: { 
          text: "The Top 10 Bacteria Cultures Found", font: { size: 24 }
        },
        xaxis : {title: "OTU IDs"},
        yaxis : {title: "Amount Found"}
      };
      // 10. Use Plotly to plot the data with the layout. 
      Plotly.newPlot("bar", trace, barLayout);
  
  
     // 1. Create the trace for the bubble chart.
     var traceBubble = {
      x: otuIds,
      y: sampleValues,
      text: otuLabels,
      mode: 'markers',
      marker: {
        size: sampleValues,
        color: otuIds,
        colorscale: "Earth"
      }
     }; 
     var bubbleData = [traceBubble];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
        title: { 
          text: "Bacteria Cultures per Sample", font: { size: 24 }
        },
        xaxis: { title: "OTU ID" },
        hovermode: 'closest',
        showlegend: false,
        height: 600,
        width: 1200
      };
  
      // 3. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
  
       // 1. Create a variable that filters the metadata array for the object with the desired sample number.
      var metadataToFilter = data.metadata
      var metaArray = metadataToFilter.filter(sampleObject => sampleObject.id == sample);
  
      // 2. Create a variable that holds the first sample in the metadata array.
      var metaResult = metaArray[0];
  
  
      // 3. Create a variable that holds the washing frequency.
      var washFreq = parseFloat(metaResult.wfreq);
     
      
      // 4. Create the trace for the gauge chart.
      var gaugeData = [
        {
          value: washFreq,
          title: { 
            text: "Belly Button Washing Frequency", font: { size: 24 }
          },
          type: "indicator",
          mode: "gauge+number", 
          gauge: {
            axis: {range: [null, 10]},
            bar: { color: "black" },
            steps: [
              { range: [0, 2], color: "red" },
              { range: [2, 4], color: "orange" },
              { range: [4, 6], color: "yellow" },
              { range: [6, 8], color: "yellowgreen" },
              { range: [8, 10], color: "green" },
            ]
          },
        } 
      ];
      
      // 5. Create the layout for the gauge chart.
      var gaugeLayout = { 
        width: 500,
        height: 450,
        margin: { t: 25, b: 25, l: 25, r: 25 },
      };
  
      // 6. Use Plotly to plot the gauge data and layout.
      Plotly.newPlot("gauge", gaugeData, gaugeLayout);
     });
    };      