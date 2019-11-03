let apiCall;
let CSVData = {};

$(document).ready(function() {
    // apiHandler();
    getCSV();
});

function getCSV() {
    let today = moment().format('DD-MM-YYYY');
    apiHandler(today);
    apiCall = setInterval(function() {
        apiHandler(today);
    } ,5000);  
    //SHOULD CALL clearInterval(apiCall) when previous days chart is shown
}
function apiHandler(date) {
    console.log("API CALL......",date);
    // let today = moment().format('DD-MM-YYYY');
    $.ajax({
        type: "GET",
        url: "data/"+date+".csv",
        dataType: "text",
        success: function(data) {processData(data);}
     });
}

function getPrevData(date) {
    console.log("getPrevData called()*****************");
    clearInterval(apiCall);
    apiHandler(date);
}

function getCurrentData() {
    console.log("getCurrentData() called")
    getCSV();
}


function processData(allText) {
    let allTextLines = allText.split(/\r\n|\n/);
    // console.log("alltextlines",allTextLines)
    let headers = allTextLines[0].split(',');
    for (let i=1; i<allTextLines.length; i++) {
        let data = allTextLines[i].split(',');
        // console.log("data",data)
        CSVData[data[0]] = parseInt(data[1]);  
    }
    console.log("CSVData",CSVData);
    addGraph(headers);
}

function addGraph(headers){
        var chart = nv.models.multiBarChart();
        chart.xAxis
            .tickFormat(function(d){
                return d;
            }).axisLabel(headers[0]).
            axisLabelDistance(10);
        chart.yAxis
            .tickFormat(d3.format('1f')).
            axisLabel(headers[1]).
            axisLabelDistance(-10);

        chart.showControls(false);
        d3.select('#chart svg')
            .datum(processChartData(CSVData)).transition().duration(500) .call(chart);
            //.transition().duration(500)
            // .call(chart);
            // datum(data) 
      nv.utils.windowResize(chart.update);
    }



function processChartData(CSVData) { 
console.log("processChartData called",CSVData)
    let dataOfBarGraph = [];
    let dataObj = {};
    dataObj.key = "Order count";
    dataObj.values = [];
    for (let key in CSVData) {
            console.log("key value",key,CSVData[key])
            dataObj.values.push({
                "x": key,
                "y": CSVData[key],
            })
    }
    dataOfBarGraph.push(dataObj);
    console.log("dataOfBarGraph*************",dataOfBarGraph)
    return dataOfBarGraph;
}

