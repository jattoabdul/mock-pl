# Sterling Mock Premier League

A simple API that serves the latest scores of fixtures of matches in a “Mock Premier League”

> APP URL => https://mock-pl-test.herokuapp.com/api/v1

#### Acceptance Criteria
There should be:

- Admin accounts which are used to
    - signup/login
    - manage teams (add, remove, edit, view)
    - create fixtures (add, remove, edit, view)
    - Generate unique links for fixture
- Users accounts who can
    - signup/login
    - view teams
    - view completed fixtures
    - view pending fixtures
    - robustly search fixtures/teams
- Only the search API should be availble to the public.

#### System dependencies (Tools/Stack)
> - Node
> - MongoDB
> - Redis
> - Docker
> - POSTMAN
> - Jest
> - Express
> - Eslint

#### To get started
> - Ensure MongoDB is running properly
> - Start Redis Server: `$ redis-server`
> - Copy and Update Environment Variable: `cp .env.sample .env && cp .env.sample .env.docker`
> - Install Dependencies: `$ yarn install`
> - Start Application Server `$ yarn dev`
> - To test with ngrok, start a tunnel with: `$ ngrok http 3000`
> - Access App on `http//:localhost:3000` or via ngrok on generated URL

#### How to run the test suite
>  `$ yarn run test`

#### How to run linter
>  `$ yarn lint`

#### To get started with Docker
 > - Install Docker
 > - Give Start Shell Script Access: `$ chmod +x start.sh`
 > - To See Start Shell Script Commands, Run: `$ ./start.sh -h`
 > - Run `$ ./start.sh run` or `$ docker-compose up --build`
 > - To Stop Containers, Run: `$ ./start.sh stop` or `$ docker-compose down`
 
 #### How to run the test suite in Docker
 > `$ docker-compose run -e "RAILS_ENV=test" mock-pl npm run test -f d`

#### Services (job queues, cache servers, search engines, etc.)
>- Redis - For Caching & Session Persistence

#### Deployment instructions for Heroku
> - Add and Commit to Git `$ git am 'deploy: deploying to heroku'`
> - `$ git push heroku master`

#### LICENSE
>- [MIT License](https://github.com/jattoabdul/andela-bootcamp-postit/blob/master/LICENSE)

#### Author(s)
>- [Aminujatto Abdulqahhar](https://github.com/jattoabdul)
