<a name="readme-top"></a>

[![Contributors][contributors-shield]][contributors-url]
[![Issues][issues-shield]][issues-url]
[![Discord-Server][discord-shield]][discord-url]

<!-- Logo -->
<br />

![Demo](https://github.com/MenlyCSE/map-app-guide/assets/154091778/4213a767-9235-4107-8004-e97203811f0c)

<div>
<h3 align="center"></h3>
  <p align="center">
    <a href="https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new"> Ask for Help</a>
    -
    <a href="https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new">Report Bug</a>
      -
    <a href="https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new">Request Feature</a>
  </p>
  <br>
</div>

<!-- shortcuts -->

## Table of Contents

- [ About The Project](#about-the-project)
  - [ Built with](#built-with)
- [ Getting Started](#getting-started)
  - [ Prerequisites](#prerequisites)
    - [ Windows](#windows)
    - [ MacOS](#macos)
  - [ Running the App](#running-the-app)
  - [ API Page](#api-page)
  - [ How to Contribute](#how-to-contribute)

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

## About The Project

The application will track [STEM-related](https://www.steme.org/events) events, making things accessible and affordable.

## Key Features Implemented ✅

### 1. Automatic Event Discovery

- ✅ Fetches STEM events from Eventbrite API every 6 hours
- ✅ Searches within 100km radius of user location
- ✅ Filters events using comprehensive STEM keyword list (25+ keywords)
- ✅ Prevents duplicate events between sources

### 2. Smart STEM Classification

- ✅ Automatically categorizes events by STEM subjects (Biology, Chemistry, Physics, etc.)
- ✅ Estimates appropriate grade levels and age groups
- ✅ Determines virtual vs onsite event types
- ✅ Extracts cost and location information

### 3. Visual Indicators

- ✅ Orange "Eventbrite" tags on full event cards
- ✅ "EB" badges on map carousel cards
- ✅ Clear distinction between event sources
- ✅ Consistent styling across components

### 4. Performance Optimization

- ✅ Local caching (6 hours for Eventbrite, 24 hours for MapSTEM)
- ✅ Background sync manager with intelligent scheduling
- ✅ Graceful error handling and fallback to cached data
- ✅ Debounced search and optimized API calls
- ✅ Pull-to-refresh functionality in event lists

### 5. Environment Variables Added:

```
EVENTBRITE_API_KEY=ZCMCQB6JRUBO2IOB6G
EVENTBRITE_CLIENT_SECRET=6V6VM2SNYISACEYIZN2GKM7BGZHL2GFNNLYFM4PBULB32IKFED
EVENTBRITE_PRIVATE_TOKEN=6BV2HHUTQA2WDN5OGAXF
EVENTBRITE_PUBLIC_TOKEN=KIHZTWNMHR7ISHENYQK7
ENABLE_EVENTBRITE_INTEGRATION=true
EVENTBRITE_CACHE_DURATION=21600000
API_CACHE_DURATION=86400000
```

### 6. STEM Keywords Used for Filtering

The integration uses 25+ keywords to identify STEM events:

- **Science**: Science, Biology, Chemistry, Physics, Astronomy, Geology
- **Technology**: Technology, AI, Machine Learning, Data Science, Computer Science
- **Engineering**: Engineering, Robotics, Programming, Coding
- **Mathematics**: Math, Mathematics, Statistics
- **Interdisciplinary**: STEM, STEAM, Innovation, Research, Laboratory

### 7. Technical Implementation

- ✅ EventbriteService class for API management
- ✅ BackgroundSyncManager for automated syncing
- ✅ ConfigValidator for setup verification
- ✅ EventbriteDebugger for testing and troubleshooting
- ✅ Enhanced error handling and fallback mechanisms
- ✅ Proper image handling for both MapSTEM and Eventbrite events
- ✅ URL handling for Eventbrite event pages

<br>
<br>

### Built With

- ![React][React.js]
- ![Google][Google.api]
- ![NPM][NPM.js]
- ![Node.js][node.js]
- ![Expo][Expo]

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

## Getting Started

Most of our packages and libraries require some knowledge in JavaScript. However, you don't need to worry because you can learn:

- [Introduction to JavaScript](https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures-v8/)
- [Introduction to React Native](https://www.codecademy.com/learn/learn-react-native)

How our team operates:

- [Introduction to Sprints: Team Workflow](https://www.youtube.com/watch?v=9TycLR0TqFA)

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

### Prerequisites

These are the list of things you need for your local environment. It's a good idea to have a code editor like <a href="https://code.visualstudio.com/">Visual Studio Code.</a> Otherwise, follow these simple steps and/or watch the YouTube guides to set up your local project:

#### Windows

<ol>
  <li><a href="https://apps.microsoft.com/detail/9n0dx20hk701?hl=en-US&gl=US">Install Windows terminal</a></li>
  <li><a href="https://git-scm.com/download/win">Install Git</a></li>
  <li><a href="https://nodejs.org/en/download/">Install Node JS</a></li>
  <li>Use your terminal for the following commands:</a></li>
</ol>

```sh
npm install install --global expo-cli
```

```sh
expo register
```

```sh
expo login
```

> [!TIP]
> You can follow this [Windows YouTube Guide](https://www.youtube.com/watch?v=f6TXEnHT_Mk)

<br>

#### MacOS

<ol>
  <li><a href="https://iterm2.com/index.html">Install iTerm2 terminal</a></li>
  <li><a href="https://brew.sh/">Install homeBrew</a></li>
  <li>Use your terminal for the following commands:</a></li>
</ol>

```sh
brew install node
```

```sh
brew install watchman
```

```sh
npm install install --global expo-cli
```

```sh
expo register
```

```sh
expo login
```

> [!TIP]
> You can follow this [MacOS YouTube Guide](https://www.youtube.com/watch?v=4U_OQHGhSf0&t=128s)

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

### Running the App

Use your code editor (e.g., <a href="https://code.visualstudio.com/">Visual Studio Code</a>) to run the following commands:

```sh
git clone https://github.com/STEM-E-Youth-Career-Development-Program/map-app.git
```

```sh
npm install
```

```sh
npm start
```

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

## API Page

This contains a library of information (e.g., user information):

```sh
fetch('https://mapstem-api.azurewebsites.net/api/')
```

> [!TIP]
> You can access the page [here](https://insertLinkHere.com)

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

## How to Contribute

Contributions are what make this community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. With that said, there are a few ways you can add:

- [Did you spot any errors?](https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new)
- [What features could we add?](https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new)
- [What would improve the app?](https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new)
- [How can we work better as a team?](https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues/new)

<br>
<p align="right"><a href="#readme-top">-back to top-</a></p>

<!-- Links -->

[contributors-shield]: https://img.shields.io/github/contributors/STEM-E-Youth-Career-Development-Program/map-app.svg?style=for-the-badge
[contributors-url]: https://github.com/STEM-E-Youth-Career-Development-Program/map-app/graphs/contributors
[issues-shield]: https://img.shields.io/github/issues/STEM-E-Youth-Career-Development-Program/map-app.svg?style=for-the-badge
[issues-url]: https://github.com/STEM-E-Youth-Career-Development-Program/map-app/issues
[discord-shield]: https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fdiscord.com%2Fapi%2Finvites%2FNKDkE52HhH%3Fwith_counts%3Dtrue&query=%24.approximate_presence_count&suffix=%20Online&style=for-the-badge&logo=Discord&logoColor=white&label=Discord&color=%235864f4
[discord-url]: https://discord.gg/2EuA82Xayg
[product-screenshot]: images/screenshot.png
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[Google.api]: https://img.shields.io/badge/Google-black?style=for-the-badge&logo=google&color=%2320232A
[NPM.js]: https://img.shields.io/badge/NPM-20232a?style=for-the-badge&logo=NPM
[node.js]: https://img.shields.io/badge/Node.js-20232a?style=for-the-badge&logo=Node.js
[Expo]: https://img.shields.io/badge/Expo-20232a?style=for-the-badge&logo=Expo
