# pikapika
Pokedex web app built with React &amp; Redux.

## How to run it
* `npm install` or `yarn install`
* `npm run` or `yarn run` — init local dev server, your browser will open the main page on localhost

## Design overview
What's inside, why and how it works.
### General
I follow most of the approaches described in this article: https://hackernoon.com/structuring-projects-and-naming-components-in-react-1261b6e18d76.
Also most of the time I'm not using `constructor` in React components to keep code simple, another article: https://hackernoon.com/the-constructor-is-dead-long-live-the-constructor-c10871bea599 
### React
All the components in this application can be roughly divided into two types: presentational and container components.
An article about this concept: https://medium.com/@dan_abramov/smart-and-dumb-components-7ca2f9a7c7d0

Presentational components are stored in `src\components`. They are designed to display the UI.

Container components are wrapping presentational components and connect them to the store. They populate the `props` of presentational componens with application state data and dispatch functions. Container components are created right where they are needed — in Screens where the components are composed into a page. Screens are located in `src\screens`. As a project grows in scale they most likely should be moved to `src\components` to allow their reusing.

In this project I'm using [antd](https://ant.design/), a React UI library.
### Redux
#### Models
[Rematch](https://github.com/rematch/rematch/) is what I use to minimize Redux boilerplate code. State, reducers, actions and side-effects are combined into "models". They are stored in `src\store` and grouped in folders if they have something in common.

There is an `index.js` file in `src\store` root where every model is imported and the store is initialized.
#### Data structure
All Pokémon data is being loaded from [PokéAPI](https://pokeapi.co/).
There are a few comments in the `models` to explain the reason behind certain decisions.
NOTE: at the time of development a part of PokéAPI functionality — pagination — is broken: https://github.com/PokeAPI/pokeapi/issues/372.
### Linting and rules
The linting is based on [Standard ESLint config](https://github.com/standard/eslint-config-standard).
I've made a few adjustments though.
* Indent is 4 spaces to make the code more readable.
* No space before function parenthesis.
* Trailing commas are required in multiline code.
* Support for linting of new features with [babel-eslint](https://github.com/babel/babel-eslint).
