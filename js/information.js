// validate form inputs before submitting data
function validateForm()
{
    let name = document.getElementById(`name`).value;
    let growth = document.getElementById(`growth`).value;
    let server = document.getElementById(`server`).value;
    let guild = document.getElementById(`guild`).value;
    

    if(name == "")
        {
            alert("IGN is required");
            return false;
        }
        
        if(growth == "")
        {
            alert("Growth rate is required");
            return false;
        }
        else if(isNaN(growth) || growth <= 100000)
        {
            alert("Please input a valid growth rate");
            return false;
        }
        
        if(server == "")
        {
            alert("Server is required");
            return false;
        }
        
        if(guild == "")
        {
            alert("Guild is required");
            return false;
        }
        
        return true;        
}


// function to show data
function showData()
{
    let peopleList;
    if(localStorage.getItem("peopleList") == null)
    {
        peopleList = [];
    }
    else
    {
        peopleList = JSON.parse(localStorage.getItem(`peopleList`))
    }

    let html = "";

    peopleList.forEach(function (element, index) {
        let formattedGrowth = parseFloat(element.growth).toLocaleString();
        let upperCaseServer = element.server.toUpperCase();
        let upperCaseGuild = element.guild.toUpperCase();

        html += "<tr>";
        html += "<td>" + element.name + "</td>";
        html += "<td>" + formattedGrowth + "</td>";
        html += "<td>" + upperCaseServer + "</td>";
        html += "<td>" + upperCaseGuild + "</td>";
        html += '<td><button onclick="deleteData('+index+')" class="btn btn-danger">Delete</button><button onclick="updateData('+index+')" class="btn btn-warning m-2">Edit</button></td>'
        html += "</tr>";
    });

    document.querySelector("#crudTable tbody").innerHTML = html;
}
// loads all data when document or page loads
document.onload = showData();

// function to add data

function AddData()
{
    // if form validate
    if(validateForm() == true)
    {
        let name = document.getElementById("name").value;
        let growth = document.getElementById("growth").value;
        let server = document.getElementById("server").value;
        let guild = document.getElementById("guild").value;

        let peopleList;
        if(localStorage.getItem("peopleList") == null)
        {
            peopleList = [];
        }
        else
        {
            peopleList = JSON.parse(localStorage.getItem(`peopleList`))
        }

        peopleList.push({
            name : name,
            growth : growth,
            server : server,
            guild : guild,
        });

        localStorage.setItem("peopleList", JSON.stringify(peopleList));
        showData();
        document.getElementById(`name`).value = "";
        document.getElementById(`growth`).value = "";
        document.getElementById(`server`).value = "";
        document.getElementById(`guild`).value = "";

    }
}

// function to delete data from local storage
function deleteData(index)
{
    let peopleList;
    if(localStorage.getItem("peopleList") == null)
        {
            peopleList = [];
        }
        else
        {
            peopleList = JSON.parse(localStorage.getItem(`peopleList`));
        }

        peopleList.splice(index, 1);
        localStorage.setItem(`peopleList`, JSON.stringify(peopleList));
        showData();
}

// function to update/edit data in local storage
function updateData(index)
{
    // submit button will hide and update button will show for updating of data
    document.getElementById("Submit").style.display = "none";
    document.getElementById("Update").style.display = "block";

    let peopleList;
    if(localStorage.getItem("peopleList") == null)
        {
            peopleList = [];
        }
        else
        {
            peopleList = JSON.parse(localStorage.getItem(`peopleList`));
        }
        
        document.getElementById("name").value = peopleList[index].name;
        document.getElementById("growth").value = peopleList[index].growth;
        document.getElementById("server").value = peopleList[index].server;
        document.getElementById("guild").value = peopleList[index].guild;


        document.querySelector("#Update").onclick = function(){
            if(validateForm() == true)
            {
                peopleList[index].name = document.getElementById("name").value;
                peopleList[index].growth = document.getElementById("growth").value;
                peopleList[index].server = document.getElementById("server").value;
                peopleList[index].guild = document.getElementById("guild").value;
                
                peopleList[index].medHistory = medHistory;
                localStorage.setItem("peopleList", JSON.stringify(peopleList));

                showData();

                document.getElementById("name").value = "";
                document.getElementById("growth").value = "";
                document.getElementById("server").value = "";
                document.getElementById("guild").value = "";
                // uncheck after submit
                
                
                // update button will hide and submit button will show
                document.getElementById("Submit").style.display = "block";
                document.getElementById("Update").style.display = "none";
            }
        }
}

document.addEventListener('DOMContentLoaded', function() {
    const searchBar = document.getElementById('searchBar');
    const table = document.getElementById('crudTable');
    const tableBody = table.getElementsByTagName('tbody')[0];

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
});