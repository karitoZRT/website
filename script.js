
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
    let repoUrl = "https://api.github.com/users/" + username + "/repos?per_page=100&sort=updated";
    let commitList = document.getElementById("commitList");

    try {
        let repoResponse = await fetch(repoUrl);
        if (!repoResponse.ok) {
            commitList.textContent = "Unable to retrieve GitHub repositories.";
            return;
        }
        let repositories = await repoResponse.json();
        document.getElementById("totalRepos").textContent = String(repositories.length);

        // Get commits from the website repository
        let websiteResponse = await fetch(
            "https://api.github.com/repos/" + username + "/website/commits?author=" + username + "&per_page=100"
        );
        let websiteCommits = [];
        if (websiteResponse.ok) {
            websiteCommits = await websiteResponse.json();
        }

        document.getElementById("totalCommits").textContent = String(websiteCommits.length);
        let activeDays = [];
        websiteCommits.forEach(function(commit) {
            let date = commit.commit.author.date.substring(0, 10);

            if (!activeDays.includes(date)) {
                activeDays.push(date);
            }
        });

        document.getElementById("totalContributions").textContent = String(activeDays.length);
        // Get recent commits from the 10 most recently updated repositories
        let recentRepositories = repositories.slice(0, 10);
        let recentActivity = [];

        for (let i = 0; i < recentRepositories.length; i++) {

            let repository = recentRepositories[i];

            let response = await fetch(
                "https://api.github.com/repos/" + username + "/" + repository.name + "/commits?author=avxenophontos&per_page=5"
            );
            if (response.ok) {
                let commits = await response.json();

                commits.forEach(function(commit) {
                    recentActivity.push({
                        message: commit.commit.message,
                        repository: repository.name,
                        date: commit.commit.author.date,
                        url: commit.html_url
                    });
                });
            }
        }

        // Sort commits from newest to oldest
        recentActivity.sort(function(a, b) {
            return new Date(b.date) - new Date(a.date);
        });

        commitList.innerHTML = "";
        recentActivity.slice(0, 4).forEach(function(activity) {
            let item = document.createElement("div");
            item.className = "commitItem";

            let icon = document.createElement("span");
            icon.className = "commitIcon";
            icon.textContent = "⌁";

            let details = document.createElement("div");
            details.className = "commitDetails";

            let message = document.createElement("strong");
            message.textContent = activity.message.split("\n")[0];

            let repository = document.createElement("p");
            repository.textContent = activity.repository;

            let link = document.createElement("a");
            link.href = activity.url;
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

        if (recentActivity.length === 0) {
            commitList.textContent = "No recent commits found in public repositories.";
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
