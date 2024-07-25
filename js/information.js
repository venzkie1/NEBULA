function updateLocalStorageData() {
    let peopleList;
    if (localStorage.getItem("peopleList") != null) {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
        peopleList.forEach(function(element) {
            if (!element.jobClass) {
                element.jobClass = ''; // or provide a default value like 'Unknown'
            }
        });
        localStorage.setItem("peopleList", JSON.stringify(peopleList));
    }
}

function validateForm() {
    let name = document.getElementById(`name`).value;
    let growth = document.getElementById(`growth`).value;
    let server = document.getElementById(`server`).value;
    let guild = document.getElementById(`guild`).value;
    let jobClass = document.getElementById(`jobClass`).value;
    let wallet = document.getElementById(`wallet`).value;
    let attendance = document.getElementById(`attendance`).value;

    if (name == "") {
        alert("IGN is required");
        return false;
    }

    if (growth == "") {
        alert("Growth rate is required");
        return false;
    } else if (isNaN(growth) || growth <= 100000) {
        alert("Please input a valid growth rate");
        return false;
    }

    if (server == "") {
        alert("Server is required");
        return false;
    }

    if (guild == "") {
        alert("Guild is required");
        return false;
    }

    if (jobClass == "") {
        alert("Job class is required");
        return false;
    }

    // if(wallet == "" ) {
    //     alert("Wallet is required");
    //     return false;
    // }

    if(attendance == "") {
        alert("Attendance is required");
        return false;
    } else if (isNaN(attendance) || attendance <= 0) {
        alert("Please input a valid number")
        return false;
    }

    return true;
}

function showData() {
    let peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    } else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    let html = "";

    peopleList.forEach(function(element, index) {
        let formattedGrowth = parseFloat(element.growth).toLocaleString();
        let upperCaseServer = element.server ? element.server.toUpperCase() : '';
        let upperCaseGuild = element.guild ? element.guild.toUpperCase() : '';
        let upperCaseJobClass = element.jobClass ? element.jobClass.toUpperCase() : '';

        html += "<tr>";
        html += "<td>" + (element.name || '') + "</td>";
        html += "<td>" + (formattedGrowth || '') + "</td>";
        html += "<td>" + upperCaseServer + "</td>";
        html += "<td>" + upperCaseJobClass + "</td>";
        html += "<td>" + upperCaseGuild + "</td>";
        html += "<td>" + (element.wallet || '') + "</td>";
        html += "<td>" + (element.attendance || '') + "</td>";
        html += '<td><button onclick="deleteData(' + index + ')" class="btn btn-danger">Delete</button><button onclick="updateData(' + index + ')" class="btn btn-warning m-2">Edit</button></td>';
        html += "</tr>";
    });

    document.querySelector("#crudTable tbody").innerHTML = html;
}

document.onload = showData();

function AddData() {
    if (validateForm() == true) {
        let name = document.getElementById("name").value;
        let growth = document.getElementById("growth").value;
        let server = document.getElementById("server").value;
        let guild = document.getElementById("guild").value;
        let jobClass = document.getElementById("jobClass").value;
        let wallet = document.getElementById("wallet").value;
        let attendance = document.getElementById("attendance").value;

        let peopleList;
        if (localStorage.getItem("peopleList") == null) {
            peopleList = [];
        } else {
            peopleList = JSON.parse(localStorage.getItem("peopleList"));
        }

        peopleList.push({
            name: name,
            growth: growth,
            server: server,
            guild: guild,
            jobClass: jobClass,
            wallet: wallet,
            attendance: attendance,
        });

        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        showData();
        document.getElementById(`name`).value = "";
        document.getElementById(`growth`).value = "";
        document.getElementById(`server`).value = "";
        document.getElementById(`guild`).value = "";
        document.getElementById(`jobClass`).value = "";
        document.getElementById(`wallet`).value = "";
        document.getElementById(`attendance`).value = "";
    }
}

function deleteData(index) {
    let peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    } else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    peopleList.splice(index, 1);
    localStorage.setItem(`peopleList`, JSON.stringify(peopleList));
    showData();
}

function updateData(index) {
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    let peopleList;
    if (localStorage.getItem("peopleList") == null) {
        peopleList = [];
    } else {
        peopleList = JSON.parse(localStorage.getItem("peopleList"));
    }

    document.getElementById("name").value = peopleList[index].name;
    document.getElementById("growth").value = peopleList[index].growth;
    document.getElementById("server").value = peopleList[index].server;
    document.getElementById("guild").value = peopleList[index].guild;
    document.getElementById("jobClass").value = peopleList[index].jobClass;
    document.getElementById("wallet").value = peopleList[index].wallet;
    document.getElementById("attendance").value = peopleList[index].attendance;

    document.querySelector("#Update").onclick = function() {
        if (validateForm() == true) {
            peopleList[index].name = document.getElementById("name").value;
            peopleList[index].growth = document.getElementById("growth").value;
            peopleList[index].server = document.getElementById("server").value;
            peopleList[index].guild = document.getElementById("guild").value;
            peopleList[index].jobClass = document.getElementById("jobClass").value;
            peopleList[index].wallet = document.getElementById("wallet").value;
            peopleList[index].attendance = document.getElementById("attendance").value;

            localStorage.setItem("peopleList", JSON.stringify(peopleList));
            showData();

            document.getElementById("name").value = "";
            document.getElementById("growth").value = "";
            document.getElementById("server").value = "";
            document.getElementById("guild").value = "";
            document.getElementById("jobClass").value = "";
            document.getElementById("wallet").value = "";
            document.getElementById("attendance").value = "";

            document.getElementById("Submit").style.display = "block";
            document.getElementById("Update").style.display = "none";
        }
    }
}

function sortData(order) {
    let peopleList = JSON.parse(localStorage.getItem("peopleList")) || [];

    peopleList.sort((a, b) => {
        let growthA = parseFloat(a.growth);
        let growthB = parseFloat(b.growth);

        if (order === 'asc') {
            return growthA - growthB;
        } else {
            return growthB - growthA;
        }
    });

    localStorage.setItem("peopleList", JSON.stringify(peopleList));
    showData();
}

document.addEventListener('DOMContentLoaded', function() {
    updateLocalStorageData();

    const searchBar = document.getElementById('searchBar');
    const table = document.getElementById('crudTable');
    const tableBody = table.getElementsByTagName('tbody')[0];
    const sortOrder = document.getElementById('sortOrder');
    const clearData = document.getElementById('clearData');

    searchBar.addEventListener('keyup', function() {
        const searchValue = searchBar.value.toLowerCase();
        const rows = tableBody.getElementsByTagName('tr');

        Array.from(rows).forEach(row => {
            const cells = row.getElementsByTagName('td');
            let match = false;

            Array.from(cells).forEach(cell => {
                if (cell.textContent.toLowerCase().includes(searchValue)) {
                    match = true;
                }
            });

            if (match) {
                row.style.display = '';
            } else {
                row.style.display = 'none';
            }
        });
    });

    clearData.addEventListener('click', function() {
        if (confirm("Are you sure you want to clear all data?")) {
            localStorage.removeItem('peopleList');
            showData();
        }
    });

    sortOrder.addEventListener('change', function() {
        const order = this.value;
        sortData(order);
    });

    showData();
});