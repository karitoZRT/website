
let navLinks = document.querySelectorAll(".navLink");
let pages = document.querySelectorAll(".page");
let projectButton = document.querySelector(".projectButton");

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

// Latest Projects button
projectButton.onclick = function(event) {
    event.preventDefault();
    changePage("projects");
};


async function loadGitHubActivity() {

    let username = "karitoZRT";

    let repoUrl = "https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated";

    let eventsUrl = "https://api.github.com/users/" + username + "/events/public?per_page=100";

    let commitList = document.getElementById("commitList");

    try {

        let repoResponse = await fetch(repoUrl);
        let eventsResponse = await fetch(eventsUrl);

        if (!repoResponse.ok || !eventsResponse.ok) {
            new Error("Unable to retrieve GitHub data");
        }

        let repositories = await repoResponse.json();
        let events = await eventsResponse.json();

        let totalCommits = 0;
        let activeDays = [];

        let recentCommits = [];
        events.forEach(function(event) {

            if (event.type === "PushEvent") {

                let commits = event.payload.commits;
                totalCommits += commits.length;

                let date = event.created_at.substring(0, 10);
                if (!activeDays.includes(date)) {
                    activeDays.push(date);
                }

                commits.forEach(function(commit) {

                    recentCommits.push({
                        message: commit.message,
                        repository: event.repo.name,
                        url: "https://github.com/" +
                            event.repo.name +
                            "/commit/" + commit.sha,
                        date: event.created_at
                    });

                });

            }

        });
        document.getElementById("totalCommits").textContent = totalCommits;
        document.getElementById("totalRepos").textContent = repositories.length;
        document.getElementById("totalContributions").textContent = activeDays.length;

        commitList.innerHTML = "";
        recentCommits.slice(0, 4).forEach(function(commit) {

            let item = document.createElement("div");
            item.className = "commitItem";

            let icon = document.createElement("span");
            icon.className = "commitIcon";
            icon.textContent = "⌁";

            let details = document.createElement("div");
            details.className = "commitDetails";

            let message = document.createElement("strong");
            message.textContent = commit.message.split("\n")[0];

            let repository = document.createElement("p");
            repository.textContent = commit.repository;

            let link = document.createElement("a");
            link.href = commit.url;
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
        if (recentCommits.length === 0) {
            commitList.textContent = "No recent public commits found.";
        }
    }
    catch (error) {
        commitList.textContent = "Unable to load GitHub activity.";
        console.error(error);
    }
}
loadGitHubActivity();
