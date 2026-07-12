let currentUser = null;
let applications = [];
let editIndex = -1;

const loginSection = document.getElementById("loginSection");
const dashboard = document.getElementById("dashboard");
const welcome = document.getElementById("welcome");

function signup() {

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    if(username === "" || password === ""){
        alert("Please fill all fields.");
        return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.find(user => user.username === username);

    if(exists){
        alert("Username already exists.");
        return;
    }

    users.push({
        username,
        password
    });

    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully.");

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
}

function login(){

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u => u.username === username && u.password === password
    );

    if(!user){
        alert("Invalid username or password.");
        return;
    }

    currentUser = username;

    loginSection.style.display = "none";
    dashboard.style.display = "block";

    welcome.textContent = "Welcome, " + currentUser;

    loadApplications();

}

function logout(){

    currentUser = null;
    applications = [];

    loginSection.style.display = "block";
    dashboard.style.display = "none";

    document.getElementById("username").value = "";
    document.getElementById("password").value = "";

}

function saveApplications(){

    localStorage.setItem(
        currentUser + "_applications",
        JSON.stringify(applications)
    );

}

function loadApplications(){

    applications = JSON.parse(
        localStorage.getItem(currentUser + "_applications")
    ) || [];

    renderApplications();
    updateDashboard();

}

document.getElementById("toggleTheme").addEventListener("click",function(){

    document.body.classList.toggle("dark");

    if(document.body.classList.contains("dark")){
        localStorage.setItem("theme","dark");
        this.textContent = "☀️ Light Mode";
    }
    else{
        localStorage.setItem("theme","light");
        this.textContent = "🌙 Dark Mode";
    }

});

window.onload = function(){

    const theme = localStorage.getItem("theme");

    if(theme === "dark"){

        document.body.classList.add("dark");

        document.getElementById("toggleTheme").textContent =
        "☀️ Light Mode";

    }

}

function addApplication(){

    const company = document.getElementById("company").value.trim();
    const role = document.getElementById("role").value.trim();
    const location = document.getElementById("location").value.trim();
    const ctc = document.getElementById("ctc").value.trim();
    const date = document.getElementById("date").value;
    const status = document.getElementById("status").value;
    const notes = document.getElementById("notes").value.trim();

    if(company === "" || role === ""){
        alert("Company and Role are required.");
        return;
    }

    const application = {
        company,
        role,
        location,
        ctc,
        date,
        status,
        notes
    };

    if(editIndex === -1){
        applications.push(application);
    }
    else{
        applications[editIndex] = application;
        editIndex = -1;

        document.querySelector(".form-card button").textContent =
        "Add Application";
    }

    saveApplications();
    renderApplications();
    updateDashboard();
    clearForm();

}

function renderApplications(list = applications){

    const table = document.getElementById("applicationTable");

    table.innerHTML = "";

    if(list.length === 0){

        table.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;">
                No applications added yet.
            </td>
        </tr>
        `;

        return;
    }

    list.forEach((app)=>{

        const originalIndex = applications.indexOf(app);

        table.innerHTML += `
        <tr>

            <td>${app.company}</td>

            <td>${app.role}</td>

            <td>${app.location}</td>

            <td>${app.ctc}</td>

            <td>${app.date}</td>

            <td>${app.status}</td>

            <td>${app.notes}</td>

            <td>

                <button onclick="editApplication(${originalIndex})">
                    Edit
                </button>

                <button onclick="deleteApplication(${originalIndex})">
                    Delete
                </button>

            </td>

        </tr>
        `;

    });

}

function updateDashboard(){

    document.getElementById("totalCount").textContent =
    applications.length;

    document.getElementById("appliedCount").textContent =
    applications.filter(app => app.status === "Applied").length;

    document.getElementById("oaCount").textContent =
    applications.filter(app => app.status === "OA").length;

    document.getElementById("interviewCount").textContent =
    applications.filter(app => app.status === "Interview").length;

    document.getElementById("selectedCount").textContent =
    applications.filter(app => app.status === "Selected").length;

    document.getElementById("rejectedCount").textContent =
    applications.filter(app => app.status === "Rejected").length;

}

function clearForm(){

    document.getElementById("company").value = "";
    document.getElementById("role").value = "";
    document.getElementById("location").value = "";
    document.getElementById("ctc").value = "";
    document.getElementById("date").value = "";
    document.getElementById("status").value = "Applied";
    document.getElementById("notes").value = "";

}

function editApplication(index){

    const app = applications[index];

    document.getElementById("company").value = app.company;
    document.getElementById("role").value = app.role;
    document.getElementById("location").value = app.location;
    document.getElementById("ctc").value = app.ctc;
    document.getElementById("date").value = app.date;
    document.getElementById("status").value = app.status;
    document.getElementById("notes").value = app.notes;

    editIndex = index;

    document.querySelector(".form-card button").textContent =
    "Update Application";

    window.scrollTo({
        top:0,
        behavior:"smooth"
    });

}

function deleteApplication(index){

    const confirmDelete = confirm(
        "Are you sure you want to delete this application?"
    );

    if(!confirmDelete){
        return;
    }

    applications.splice(index,1);

    saveApplications();
    renderApplications();
    updateDashboard();

}

document.getElementById("searchInput").addEventListener("keyup",searchApplications);

document.getElementById("filterStatus").addEventListener("change",searchApplications);

function searchApplications(){

    const searchText =
    document.getElementById("searchInput").value
    .toLowerCase();

    const filter =
    document.getElementById("filterStatus").value;

    const filtered = applications.filter(app=>{

        const matchesSearch =
        app.company.toLowerCase().includes(searchText);

        const matchesFilter =
        filter === "All" || app.status === filter;

        return matchesSearch && matchesFilter;

    });

    renderApplications(filtered);

}