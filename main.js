var zone = null;
var scale = 1;

$(function() {
  initSvg();
  var tooltip = createSeatPopUp();
  svgZoom();
  changeSeatsColor();
  clickOnSeats(tooltip);
  setSectionName();
  createSlider();
});

function initSvg(){
  d3.select(document.getElementById("seats").contentDocument).selectAll("path.seat").style("display", "none");
  d3.select(document.getElementById("seats").contentDocument).selectAll("path.seat + path").style("display", "none");
}

function createSeatPopUp(){
  return d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "#eee")
  .text("-");
}

function svgZoom() {
  var zoom = d3.zoom();
  var svg = d3.select(document.getElementById("seats").contentDocument).select("#venue-g").call(zoom.on("zoom", function () {
    scale = d3.event.transform.k;
    var seats = d3.select(document.getElementById("seats").contentDocument).selectAll("path.seat");
    seats.each(function(){
      if (scale >= 1.5 ) {
        $(this).css("display", "block");
        $(this).next().css("display", "block");
      } else {
        $(this).css("display", "none");
        $(this).next().css("display", "none");
      }
    });
    svg.attr("transform", d3.event.transform);
  }));

  // Add Controls
  var zoomIn = d3.select("#zoom-in");
  zoomIn.on("click", function() {
    zoom.scaleBy(svg, 1.5);
    
  });

  var zoomOut = d3.select("#zoom-out");
  zoomOut.on("click", function() {
    zoom.scaleBy(svg, 0.75);
  });

  var reset = d3.select("#reset");
  reset.on("click", function() {
    reverse = 1 / scale;
    zoom.scaleBy(svg, reverse);
  });
}

function changeSeatsColor() {
  var sel = d3.select(document.getElementById("seats").contentDocument).selectAll("path.seat");
  sel.on("mouseover", function () {
      $(this).css("fill", "#CCC");
  });
}

function setSectionName(){
  var sel = d3.select(document.getElementById("seats").contentDocument).selectAll(".section");
  var color = null;
  sel.on("mouseenter", function(){
    color = $(this).css("fill");
    if (scale < 1.5 ){
      $(this).css("fill", "#009CDE");
    }
    if ($(this).attr("id") == "expensive") {
      zone = "Premium";
    }
    if ($(this).attr("id") == "average") {
      zone = "Regular";
    }
    if ($(this).attr("id") == "cheap") {
      zone = "Basic";
    }
    
  }).on("mouseleave", function(){ 
    $(this).css("fill", color);
  });
}

function clickOnSeats(tooltip) {
  var sel = d3.select(document.getElementById("seats").contentDocument)
              .selectAll("path.seat");
  
  sel.on("click", function () {
      $(this).css("fill", "#CCC");
      tooltip.text("Seat : " +  $(this).index() + " Section : " + zone);
      tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px").style("padding", "10px").style("font-family","helvetica");
      return tooltip.style("visibility", "visible");
  })
  .on("mouseout", function(){ 
    $(this).css("fill", "#cfe2f3");
    return tooltip.style("visibility", "hidden");
  });
}

function createSlider(){
  $( "#slider" ).slider({
    range: true,
    min: 100,
    max: 500,
    values: [ 100, 500 ],
    slide: function( event, ui ) {
      $("#minValue" ).val(ui.values[ 0 ]);
      $("#maxValue").val(ui.values[ 1 ]);

      if (ui.values[ 0 ] >= 100 && ui.values[ 1 ] <= 500) {
        updateSectionFromFilter("#80ceef", "#80ceef", "#80ceef");
      }

      if (ui.values[ 0 ] >= 100 && ui.values[ 1 ] <= 400) {
        updateSectionFromFilter("#ccc", "#80ceef", "#80ceef");
      }

      if (ui.values[ 0 ] >= 100 && ui.values[ 1 ] <= 300) {
        updateSectionFromFilter("#ccc", "#ccc", "#80ceef");
      }
      
      if (ui.values[ 0 ] >= 200 && ui.values[ 1 ] <= 500) {
        updateSectionFromFilter("#80ceef", "#80ceef", "#ccc");
      }

      if (ui.values[ 0 ] >= 200 && ui.values[ 1 ] <= 400) {
        updateSectionFromFilter("#ccc", "#80ceef", "#ccc");
      }

      if (ui.values[ 0 ] >= 300 && ui.values[ 1 ] <= 500 ) {
        updateSectionFromFilter("#80ceef", "#ccc", "#ccc");
      }
    }
  });
}


function updateSectionFromFilter(color1, color2, color3){
  d3.select(document.getElementById("seats").contentDocument).select(".section#expensive").style("fill", color1);
  d3.select(document.getElementById("seats").contentDocument).select(".section#average").style("fill", color2);
  d3.select(document.getElementById("seats").contentDocument).select(".section#cheap").style("fill", color3);
}
