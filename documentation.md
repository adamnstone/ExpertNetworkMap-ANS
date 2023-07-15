# Expert Network Map Documetation

## Iteration 7

### Updates

- `condenseLinksForSimulation` improves performance by squashing multiple links between the same two nodes in different directions and on different topics
- newly introduced Heisenbug resolved through deep-copying `links_not_filtered` before filtering

### Heisenbug

Whenever `links_not_filtered` would be filtered in the `filterStudents` function (or in `updateData`) it would reshape the data where link objects (`{"source": "test student;test/student/link", "target": "another test student;other/test/student/link", "topic": "Moulding and Casting", "value": 2}`) to where the `source` and `target` students became objects storing values like `r`, `x`, `y`, `vx`, `vy`. This only happened when the code was run without using the debugger to step through the lines, revealing a [Heisenbug](https://en.wikipedia.org/wiki/Heisenbug). These attributes led me to believe there was some asynchronous *D3JS* event being run, but none of those should have been triggered before or at the same time as the lines triggering the bug. To solve this I deep-copied the `links_not_filtered` array before filtering. To circumvent this behavior in prior iterations, I simply checked for `l.target` or `l.target.id`, but solving this means that in future iterations I should be able to revert to just using `l.target`.

## Iteration 6

### Updates

- highighted nodes made opaque and in front of connections
- link transparency is no longer correlated to connection strength (this is indicated by how close the nodes are pulled together)
- link width is no longer a variable
- links between two not-highlighted students are barely visible (low transparency), but links that are between a highlighted node and a not-highlighted node use a transparency gradient
- code re-structured to centralize DOM operations and expedite future programming
- *bug fix*: when the topic is filtered, the visible links are only those that pertain to that topic 

## Previous Iterations

[Read previous documentation here!](https://fabacademy.org/2023/labs/charlotte/students/adam-stone/lessons/side-projects/lab-link-graph/)