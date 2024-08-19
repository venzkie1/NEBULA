var padding = {top:20, right:40, bottom:0, left:0},
    w = 500 - padding.left - padding.right,
    h = 500 - padding.top  - padding.bottom,
    r = Math.min(w, h)/2,
    rotation = 0,
    oldrotation = 0,
    picked = 100000,
    oldpick = [],
    color = d3.scale.category20();

var svg, container, vis, data;

// Function to display the members in the memberList div
function displayMembers(peopleList) {
    var memberListDiv = document.getElementById('memberList');
    memberListDiv.innerHTML = ''; // Clear any existing content

    // Create and append checkboxes directly
    peopleList.forEach(function(person, index) {
        // Create the checkbox
        var checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = 'member-' + index; // Unique ID for each checkbox
        checkbox.value = person.name || 'Unknown'; // Value of the checkbox

        // Create the label
        var label = document.createElement('label');
        label.htmlFor = checkbox.id; // Associate the label with the checkbox
        label.textContent = person.name || 'Unknown'; // Display name or 'Unknown'

        // Append checkbox and label to the member list div
        memberListDiv.appendChild(checkbox);
        memberListDiv.appendChild(label);
    });
}

// Function to initialize the spinner and chart
function initializeSpinner() {
    let peopleList = JSON.parse(localStorage.getItem("peopleList")) || [];
    data = peopleList; // Store data globally

    // Display members in the memberList div
    displayMembers(peopleList);

    if (svg) {
        svg.remove(); // Remove existing SVG if present
    }

    svg = d3.select('#chart')
        .append("svg")
        .attr("width",  w + padding.left + padding.right)
        .attr("height", h + padding.top + padding.bottom);

    container = svg.append("g")
        .attr("class", "chartholder")
        .attr("transform", "translate(" + (w/2 + padding.left) + "," + (h/2 + padding.top) + ")");

    vis = container.append("g");

    var pie = d3.layout.pie().sort(null).value(function(d){return 1;});
    var arc = d3.svg.arc().outerRadius(r);

    var arcs = vis.selectAll("g.slice")
        .data(pie(data))
        .enter()
        .append("g")
        .attr("class", "slice");

    arcs.append("path")
        .attr("fill", function(d, i){ return color(i); })
        .attr("d", function (d) { return arc(d); });

    arcs.append("text")
        .attr("transform", function(d){
            d.innerRadius = 0;
            d.outerRadius = r;
            d.angle = (d.startAngle + d.endAngle)/2;
            return "rotate(" + (d.angle * 180 / Math.PI - 90) + ")translate(" + (d.outerRadius -10) +")";
        })
        .attr("text-anchor", "end")
        .style("font-size", "20px") // Increase the font size here
        .text(function(d, i) {
            return data[i].name || 'Unknown';
        });

    // Update arrow
    svg.append("g")
        .attr("transform", "translate(" + (w + padding.left + padding.right) + "," + ((h/2)+padding.top) + ")")
        .append("path")
        .attr("d", "M-" + (r*.15) + ",0L0," + (r*.05) + "L0,-" + (r*.05) + "Z")
        .style({"fill":"black"});

    // Draw spin circle
    container.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 80) // Increase the radius here
        .style({"fill":"white","cursor":"pointer"});

    // Spin text
    container.append("text")
        .attr("x", 0)
        .attr("y", 20) // Adjust the y position if needed
        .attr("text-anchor", "middle")
        .text("SPIN")
        .style({"font-weight":"bold", "font-size":"40px"}); // Increase the font size here

    // Add event listener for spinning
    container.on("click", spin);
}

// Initialize spinner and checklist on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSpinner();
});


// Function to show the modal
function showModal(winnerName) {
    var modal = document.getElementById("winnerModal");
    var winnerElement = document.getElementById("winnerName");
    var closeButton = document.getElementsByClassName("close-button")[0];

    winnerElement.textContent = winnerName;
    modal.style.display = "block";

    closeButton.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

// Function to spin the wheel
function spin() {
    container.on("click", null);

    console.log("OldPick: " + oldpick.length, "Data length: " + data.length);
    if(oldpick.length == data.length){
        console.log("done");
        container.on("click", null);
        return;
    }

    var ps = 360/data.length,
        pieslice = Math.round(1440/data.length),
        rng = Math.floor((Math.random() * 1440) + 360);

    rotation = (Math.round(rng / ps) * ps);
    picked = Math.round(data.length - (rotation % 360)/ps);
    picked = picked >= data.length ? (picked % data.length) : picked;

    if(oldpick.indexOf(picked) !== -1){
        d3.select(this).call(spin);
        return;
    } else {
        oldpick.push(picked);
    }

    rotation += 90 - Math.round(ps/2);

    var transitionDuration = 3000; // Duration in milliseconds

    vis.transition()
        .duration(transitionDuration)
        .attrTween("transform", rotTween)
        .each("end", function () {
            d3.select(".slice:nth-child(" + (picked + 1) + ") path")
                .attr("fill", "#111");
            d3.select("#question h1")
                .text(data[picked].question);
            oldrotation = rotation;
            showModal(data[picked].name); // Show the modal with the winner's name
            container.on("click", spin);
        });
}

// Function to rotate the wheel
function rotTween(to) {
    var i = d3.interpolate(oldrotation % 360, rotation);
    return function(t) {
        return "rotate(" + i(t) + ")";
    };
}

// Function to get random numbers (unchanged)
function getRandomNumbers(){
    var array = new Uint16Array(1000);
    var scale = d3.scale.linear().range([360, 1440]).domain([0, 100000]);
    if(window.hasOwnProperty("crypto") && typeof window.crypto.getRandomValues === "function"){
        window.crypto.getRandomValues(array);
        console.log("works");
    } else {
        for(var i=0; i < 1000; i++){
            array[i] = Math.floor(Math.random() * 100000) + 1;
        }
    }
    return array;
}

// Initialize spinner and checklist on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSpinner();
});