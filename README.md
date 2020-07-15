# README

### Project: Legal History Timeline

This is a web application prototype programmed by Philip Hofmann with THREE.js, during his student job as programmer at the Faculty of Law at the University of Zurich (UZH). The development was requested and happened in collaboration with Antonia Hartmann from professorship Thier at UZH.

Three.js is a cross-browser JavaScript library and application programming interface (API) used to create and display animated 3D computer graphics in a web browser. Three.js uses WebGL.

This project was meant for students or interested individuals to explore an interactive timeline visually and which development was requested and supported by Antonia Hartmann from chair

Check out this version at:
https://phhofm.github.io/LegalHistoryTimelinePrototype/static/

Check out the documentation at
https://phhofm.github.io/LegalHistoryTimelinePrototype/docs/

---

Developer notes
---

##### General
To inspect a pre-build, open the index.html in the /static/ folder.

For a dynamic build, first check if you have node package manager installed: in console, execute "npm -v". If nothing is returned, go to https://www.npmjs.com/get-npm and install.
Navigate to the threejs folder in the console and execute "npm install". This will create the node_modules folder.
Have a look at the index.ts file in the src folder on how to use this project. In the console, navigate to the folder that contains this project and run "npm start", this should automatically build and open the app in a webbrowser. If not, run "npm run build" and check the result by opening the resulting index.html in the "dist" folder.

##### Built with Three.js, webpack, npm, typescript, particles.js, dat.gui and spin.js
