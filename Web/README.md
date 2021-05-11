# ecad.fun

# setup

.

create an `.env` file containing environment variables for local useage:

- REACT_APP_SERVER=http://localhost:8080
- REACT_APP_WEBSOCKET_SERVER=ws://localhost:8080
- REACT_APP_AUTH0_DOMAIN=
- REACT_APP_AUTH0_CLIENT_ID=
- REACT_APP_AUTH0_AUDIENCE=

## auth

https://auth0.com/blog/complete-guide-to-react-user-authentication/#Retrieving-User-Information

https://www.youtube.com/watch?v=1rgeO_EbSGg

https://www.youtube.com/watch?v=pSOXSUmcYvo&list=PLZ14qQz3cfJL6aoKZ_Ly7jiYrwi9ihviW&index=3

multiple environments

https://auth0.com/docs/dev-lifecycle/set-up-multiple-environments?_ga=2.133442438.928364951.1609088841-1632117338.1609088841

add from auth0.com

- REACT_APP_AUTH0_DOMAIN=
- REACT_APP_AUTH0_CLIENT_ID=

for API calls:

- REACT_APP_AUTH0_AUDIENCE=

## userId

take the user object from auth0 an there the unique property: `user.sub`

# commit messages:

https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716

- `feat`: (new feature for the user, not a new feature for build script)
- `fix`: (bug fix for the user, not a fix to a build script)
- `docs`: (changes to the documentation)
- `style`: (formatting, missing semi colons, etc; no production code change)
- `refactor`: (refactoring production code, eg. renaming a variable)
- `test`: (adding missing tests, refactoring tests; no production code change)
- `chore`: (updating grunt tasks etc; no production code change)

# icons

from: https://www.flaticon.com/

# Undo-Redo

## on dynamic graphic chnages

see: actionLine: pointerDown, pointerUp

- on start of the dynamic action make a copy of the element you want to dynamicly change, return that 'oldData' in ActionState
- on mouse move change the element (in the project), return { ActionResult.withUndo: false }
- when finished the mouse move return { ActionResult.doCUD with "update",newData,oldData}, get that oldData from the ActionState

# ideas

easy is realative. (easy for whom)

simple is an objective

haskell, clojoure

https://www.youtube.com/watch?v=6arkndScw7A&t=649s
https://www.youtube.com/watch?v=IcfhcJrtJqI

dockerize

https://medium.com/@tiangolo/react-in-docker-with-nginx-built-with-multi-stage-docker-builds-including-testing-8cc49d6ec305

typescript local package

https://medium.com/cameron-nokes/the-30-second-guide-to-publishing-a-typescript-package-to-npm-89d93ff7bccd

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run: elaborate

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
