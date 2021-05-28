const avatar = document.getElementById('avatar');
const avatarsm = document.getElementById('avatarsm');
const fullName = document.getElementById('name');
const login = document.getElementById('username');
const description = document.getElementById('description');
const repos = document.getElementById('repos');
const repocount = document.getElementById('repo-count');

const getUserWithRepos = async (username) => {
    const url = 'https://api.github.com/graphql';

    const request = JSON.stringify({
        query: `{
            viewer {
                avatarUrl
              }
            user(login: "${username}") {
              name
              login
              bio
              avatarUrl
              repositories(first: 20 orderBy: {field:PUSHED_AT, direction: DESC}) {
                totalCount
                nodes {
                  name
                  stargazerCount
                  pushedAt
                  forkCount
                  isFork
                  parent {
                   forkCount
                  }
                  description
                  languages(first: 1) {
                    nodes {
                      name
                    }
                  }
                  
                }
              }
            }
          }`
    });

    const options = {
        method: 'post',
        body: request,
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': request.length,
          Authorization: 'Bearer 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',
        },
    }

    const response = await fetch(url, options);
    const data = await response.json();
    if (data.hasOwnProperty('errors')) {
        alert(data.errors[0].type)
        return;
    }

    const viewer = data.data.viewer;
    const record = data.data.user;

    fullName.innerText = record.name;
    login.innerText = record.login;
    description.innerText = record.bio;
    avatar.src = record.avatarUrl;
    avatarsm.src = viewer.avatarUrl;

    const repositoriesCount = record.repositories.totalCount;
    repocount.innerHTML = `
    <span>${repositoriesCount}</span> ${repositoriesCount > 1 ? 'results' : 'result'} for <span>public</span> repositories
    `;
    const repositories = record.repositories.nodes;
    repos.innerHTML = '';

    repositories.forEach(repository => {

        const name = repository.name;
        const stars = repository.stargazerCount;
        const forks = repository.isFork ? repository.parent.forkCount : repository.forkCount;
        const repoDescription = repository.description;
        const updatedAt = calculateDays(repository.pushedAt);
        const language = repository.languages.nodes.length
                    ? repository.languages.nodes[0].name : '';

        const repo = formatRepo(name, stars, forks, repoDescription, updatedAt, language);
        repos.innerHTML += repo;
    });

}

function calculateDays(date) {
    const actualDate = new Date(date);
    const today = new Date();
   
    const time_difference = today.getTime() - actualDate.getTime();   
    const days_difference = time_difference / (1000 * 60 * 60 * 24);
    
    const days = Math.floor(days_difference);
    const hours = Math.floor((days_difference % 1) * 24) + 1;

    if (days > 30) {
        return `Updated on ${actualDate.getDate()} ${actualDate.toLocaleString('default', { month: 'short' })} ${actualDate.getFullYear()}`
    }

    if (days > 1) {
        return `Updated ${days} days ago`;
    }

    if (days === 1) {
        return `Updated a day ago`;
    }

    return `Updated ${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
}

function formatRepo(name, stars, forks, description, updated, language) {

    const lanSpan = language ? `<span class="repo-color repo-${language.toLowerCase()}"></span><small>${language}</small>` : '';
    const forkSpan = forks ? `<svg aria-label="fork" role="img" viewBox="0 0 16 16" version="1.1" data-view-component="true" height="16" width="16" class="svg">
                                    <path fill-rule="evenodd" d="M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z"></path>
                                </svg>
                                <small>${forks}</small>` : '';
    const starSpan = stars ? `<img src="assets/star.svg" alt="star"><small>${stars}</small>` : '';
    return `
    <div class="repo">
                    <div class="repo-info">
                        <h3 class="repo-name">${name}</h3>
                        <span class="repo-description">${description ? description : ''}</span>
                        <div class="repo-detail">
                        ${lanSpan}${starSpan}${forkSpan}
                            <small>${updated}</small>
                        </div>
                    </div>
                    <button class="repo-star">
                        <img src="assets/star.svg" alt="star">
                        Star
                    </button>
                </div>
    
    `
}
//getUserWithRepos('ireade');