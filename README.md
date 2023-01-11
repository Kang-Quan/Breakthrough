# Hello, this Github repository shows the front-end of Breakthrough

To run this project, clone it locally on your pc.

### Type `npm install` in the terminal to install all dependencies 
### Then type `npm start` in the terminal to run the project

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### This application is created to be played with an AI

However, the AI code is in a private repository due to it being written for a school project.
To prevent plagiarism I will not release the code. Once I found a suitable place to host the backend AI, I will host so that 
it can be played as intented.

### How is the AI created
Algorithm:
Idea to solve the problem is to enumerate all states, choose the state that is winning and play according to that move. So, we use minimax algorithm to do this. The search space is the set of all possible valid moves. For each turn the space is finite. However, similar to the game of chess it is a very large space that is too large to search or enumerate exhaustively. 
1nd technique I used is to implement alpha beta pruning to the tree. It stops evaluating a move when at least one possibility has been found that proves the move to be worse than a previously examined move. So, we can skip the entire branch after evaluating that move. This will significantly improve the time since we reduce it search space.
2nd technique I used is to reduce the depth of the search tree. We will adjust the depth of to make it fit into the time frame of 3secs. However, by limiting the depth, solution will no longer be optimal. This is the trade off we have to make given the time constrain.

### Evaluation function:
The evaluation function is used to estimate goodness or value in a particular position. So that we can tell the function which position are good that can potentially reach the goal state of winning.
There are only 2 ways to win in this game. First get to the other side and secondly eliminate all the opponent pieces.

First evaluation function I have tried is to eliminate all opponent pieces to win the game. What I did was to count the number of black pieces. Count the number of white pieces. Then take the black piece minus the white pieces.
This evaluation will prefer states that leads to a better exchange of pieces. 

Second way of winning is to get to the other side. One simple evaluation function I used is to find the distance of each black piece to the end goal then assign a score to them. 


