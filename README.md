# Interactive Real-Time 3D Smart Warehouse

An MSc Advanced Computer Graphics project built with Three.js/WebGL. It demonstrates graphics primitives, hierarchical modelling, transformations, vectors, perspective and orthographic projection, camera/view transformations, procedural texture mapping, physically based materials, moving lights, real-time shadow maps, animation and interaction.

## Step 1 - Install the required software

Install Node.js LTS from https://nodejs.org and VS Code from https://code.visualstudio.com. Open a terminal and verify:

```bash
node --version
npm --version
```

Both commands must print version numbers.

## Step 2 - Open the project in VS Code

Extract this project folder. In VS Code choose **File > Open Folder** and select `advanced-cg-smart-warehouse`.

Open the VS Code terminal with **Terminal > New Terminal**. The prompt should end with the project folder name.

## Step 3 - Install the packages

Type exactly:

```bash
npm install
```

This reads `package.json` and installs Three.js, lil-gui and Vite in a generated `node_modules` folder.

## Step 4 - Run the development version

```bash
npm run dev
```

Hold Ctrl and click the displayed address, usually `http://localhost:5173`. Keep the terminal running while using the project. Stop it later with `Ctrl+C`.

## Step 5 - Learn the file structure

```text
advanced-cg-smart-warehouse/
├── index.html          Page, heads-up display and keyboard guide
├── package.json        Dependencies and terminal scripts
├── src/
│   ├── main.js         Scene, renderer, cameras, animation and interaction
│   ├── objects.js      Warehouse, shelves, boxes, robot and moving lamp
│   ├── textures.js     Procedural concrete/cardboard/warning textures
│   └── style.css       Screen overlay and control-panel styling
└── README.md           Setup, explanation, demo and viva guide
```

Do not manually edit `node_modules` or `package-lock.json`.

## Step 6 - Test every required feature

1. Drag the mouse to orbit; scroll to zoom.
2. Press `1`, `2`, and `3` to show perspective, orthographic top and robot-follow cameras.
3. Watch the AGV translate and its four child wheels rotate.
4. Observe the lamp orbit and shadows change direction in real time.
5. Open **Moving light** and change speed, radius, height and intensity.
6. Turn on **Show cone** to reveal the spotlight direction.
7. Choose **Manual**, then drive with W/A/S/D.
8. Press N for day/night, F for polygon wireframe, Space to pause, and R to reset.
9. Turn dynamic shadows off/on and compare the result.

## Step 7 - Understand how the code maps to theory

| Syllabus concept | Implementation |
|---|---|
| Graphics primitives | Plane, box, cylinder and sphere geometries |
| Model/world coordinates | Each shelf and robot part starts locally, then its group is positioned in the world |
| Translation | Robot position changes every frame |
| Rotation | Wheels rotate; robot turns; floor rotates -90 degrees about X |
| Scaling | Different primitive dimensions form walls, beams, shelves and boxes |
| Composite/hierarchical transformation | Robot group movement affects body, sensors and wheels; wheels also rotate locally |
| Vectors | Camera offsets, `lookAt`, local robot movement and circular light trajectory |
| Camera/view transformation | Orbit and follow cameras view world objects from different reference frames |
| Perspective projection | Main and follow `PerspectiveCamera` objects |
| Parallel projection | Top `OrthographicCamera`, without perspective size reduction |
| Clipping | Camera near/far values are 0.1 and 100 |
| Texture mapping | Canvas-generated concrete, cardboard and warning maps use UV coordinates |
| Lighting/materials | Hemisphere, directional and spot lights with standard PBR materials |
| Dynamic shadows | Moving spotlight recomputes its shadow map each rendered frame |
| Rasterisation | WebGL/GPU converts geometry triangles to fragments/pixels; F exposes polygons |
| Animation | `requestAnimationFrame`, delta time and parametric light motion |

For a point `Pmodel`, the conceptual transform is `Pworld = T × R × S × Pmodel`. A wheel inherits the parent robot transform: `Mwheel-world = Mrobot-world × Mwheel-local`.

The moving lamp uses `x = r cos(t)` and `z = r sin(t)`. The paired equations create an orbit of radius `r` at a configurable height.

The full viewing path is:

```text
Model space -> model matrix -> world space -> view matrix -> camera space
-> projection matrix -> clip space -> perspective division -> NDC
-> viewport transformation -> rasterisation -> screen pixels
```

## Step 8 - Make a production build

After testing, type:

```bash
npm run build
```

Vite creates a `dist` folder. Test that build with:

```bash
npm run preview
```

Do not open `dist/index.html` by double-clicking; use the preview command because ES modules require a web server.

## Step 9 - Recommended live demonstration order

1. Introduce the smart-warehouse objective.
2. Orbit around the scene and identify its primitives.
3. Show automatic translation and local wheel rotation.
4. press F to expose polygon meshes, then return to shaded mode.
5. Change light radius/speed and point out live shadow updates.
6. Toggle day/night and shadows for visual comparison.
7. Switch perspective -> orthographic -> follow cameras.
8. Select manual mode and drive with W/A/S/D.
9. Pause and expose the spotlight helper.
10. End by explaining the model-view-projection pipeline.

## Step 10 - Viva answers you should know

**Why Three.js instead of Unity?** Three.js removes WebGL boilerplate but keeps the scene graph, matrices, cameras, projection, materials, lights and shadow configuration visible in code, which supports explanation of the taught graphics pipeline.

**Why use groups?** A group creates a hierarchy. Parent translation/rotation moves all robot parts consistently, while each wheel retains its own local rotation.

**How are shadows dynamic?** The spotlight casts a depth-based shadow map from the light's viewpoint. Because its position changes each frame, the light-space depth relationships and resulting projected shadows change.

**Perspective versus orthographic?** Perspective projection makes distant objects appear smaller; orthographic projection preserves parallel lines and relative dimensions, making the top view useful as a technical plan.

**Why delta time?** Movement is multiplied by elapsed seconds, so speed remains approximately consistent on displays with different frame rates.

**What is procedural texturing?** The project draws repeatable texture images at runtime using a 2D canvas, then maps them onto 3D mesh UV coordinates. This avoids missing external image files and still demonstrates texture mapping.

## Step 11 - Presentation structure

Use: title; problem and motivation; objectives; requirements; scene architecture; primitives; hierarchical robot; transformations and mathematics; camera/view coordinates; perspective versus orthographic projection; textures/PBR materials; lighting; shadow mapping; animation; interaction; screenshots/results; performance and limitations; future work; conclusion; live demo.

## Step 12 - Sensible personal improvements

First make this version run reliably. Then change warehouse colours, box arrangement, robot design, labels, and presentation screenshots. Optional extensions are collision detection, a waypoint path, loading one GLTF forklift, FPS monitoring, bloom, or a camera-frustum helper. Document any external assets and their licences.

## Troubleshooting

- `npm is not recognized`: install Node.js LTS and restart VS Code.
- Blank page: read the browser console with F12; run through `npm run dev`, not by double-clicking HTML.
- Low performance: close other tabs, reduce pixel ratio in `main.js`, or change 2048 shadow maps to 1024.
- Black scene: confirm day mode is enabled and do not remove the hemisphere light.
- W/A/S/D does not drive: choose **Manual** in the control panel first.
