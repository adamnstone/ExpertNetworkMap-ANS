# Expert Network Map Documetation

## Iteration 6

### Updates

- highighted nodes made opaque and in front of connections
- link transparency is no longer correlated to connection strength (this is indicated by how close the nodes are pulled together)
- link width is no longer a variable
- links between two not-highlighted students are barely visible (low transparency), but links that are between a highlighted node and a not-highlighted node use a transparency gradient
- `condenseLinksForSimulation` improves performance by squashing multiple links between the same two nodes in different directions and on different topics
- *bug fix*: when the topic is filtered, the visible links are only those that pertain to that topic 

## Previous Iterations

[Read previous documentation here!](https://fabacademy.org/2023/labs/charlotte/students/adam-stone/lessons/side-projects/lab-link-graph/)