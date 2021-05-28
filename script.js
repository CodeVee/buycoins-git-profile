

const getUserWithRepos = async (username) => {
    const url = 'https://api.github.com/graphql';

    const request = JSON.stringify({
        query: `{
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
                  updatedAt
                  forkCount
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
          Authorization: 'Bearer ',
        },
    }

    const response = await fetch(url, options);
    const data = await response.json();
    console.log(data.hasOwnProperty('errors'))
    console.log(data);
}

getUserWithRepos('codevel');