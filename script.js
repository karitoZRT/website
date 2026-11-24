
let navLinks = document.querySelectorAll(".navLink");
let pages = document.querySelectorAll(".page");

let projectButtons = document.querySelectorAll('[data-page="projects"]');
projectButtons.forEach(function(button) {

    button.onclick = function(event) {

        event.preventDefault();
        changePage("projects");
    };
});
// Function to change pages
function changePage(pageName) {
    // Hide all pages
    pages.forEach(function(page) {
        page.classList.remove("active");
    });

    // Remove active status from navbar links
    navLinks.forEach(function(link) {
        link.classList.remove("active");
    });

    // Show selected page
    document.getElementById(pageName).classList.add("active");

    // Highlight selected navbar link
    navLinks.forEach(function(link) {
        if (link.dataset.page === pageName) {
            link.classList.add("active");
        }
    });
}

// Listen for navbar clicks
navLinks.forEach(function(link) {
    link.onclick = function(event) {

        event.preventDefault();
        let pageName = link.dataset.page;
        changePage(pageName);
    };
});

async function loadGitHubActivity() {

    let username = "karitoZRT";
    let repositoryName = "website";

    let repoUrl = "https://api.github.com/users/" + username + "/repos?per_page=100";
    let commitsUrl = "https://api.github.com/repos/" + username + "/" + repositoryName + "/commits?author=" + username + "&per_page=100";

    let commitList = document.getElementById("commitList");

    try {
        let repoResponse = await fetch(repoUrl);
        let commitsResponse = await fetch(commitsUrl);

        if (!repoResponse.ok || !commitsResponse.ok) {
            commitList.textContent = "Unable to retrieve GitHub data.";
            return;
        }

        let repositories = await repoResponse.json();
        let commits = await commitsResponse.json();

        document.getElementById("totalCommits").textContent = String(commits.length);
        document.getElementById("totalRepos").textContent = String(repositories.length);

        let activeDays = [];

        commits.forEach(function(commit) {
            let date = commit.commit.author.date.substring(0, 10);

            if (!activeDays.includes(date)) {
                activeDays.push(date);
            }
        });

        document.getElementById("totalContributions").textContent = String(activeDays.length);

        commitList.innerHTML = "";

        commits.slice(0, 4).forEach(function(commit) {

            let item = document.createElement("div");
            item.className = "commitItem";

            let icon = document.createElement("span");
            icon.className = "commitIcon";
            icon.textContent = "⌁";

            let details = document.createElement("div");
            details.className = "commitDetails";

            let message = document.createElement("strong");
            message.textContent = commit.commit.message.split("\n")[0];

            let repository = document.createElement("p");
            repository.textContent = repositoryName;

            let link = document.createElement("a");
            link.href = commit.html_url;
            link.target = "_blank";
            link.rel = "noopener noreferrer";
            link.textContent = "View commit ↗";

            details.appendChild(message);
            details.appendChild(repository);
            details.appendChild(link);

            item.appendChild(icon);
            item.appendChild(details);

            commitList.appendChild(item);
        });

        if (commits.length === 0) {
            commitList.textContent = "No commits found.";
        }
    }
    catch (error) {
        commitList.textContent = "Unable to load GitHub activity.";
        console.error(error);
    }
}

loadGitHubActivity().catch(function(error) {
    console.error(error);
});
