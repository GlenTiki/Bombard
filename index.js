var http = require('http');

var location = process.argv[2];
var depthToGo = process.argv[3];
var requestsPerProcess = process.argv[4];
var currentDepth = process.argv[5];

if(currentDepth === undefined){
	currentDepth = 1;
}

console.log(currentDepth);

// if the process is a child and the current depth is at the depth 
// inputted, stop spawning
// else keep going.
if (currentDepth === depthToGo){  
  child();
}else{
  parent();
}

// spawn 2 children, curl the url
function parent() {
	currentDepth++;
	var spawn = require('child_process').spawn;

	// spawn 2 children of this node.
	// do some piping if they output anything.
	spawn(process.execPath, [__filename, location, depthToGo, 
							requestsPerProcess, currentDepth])
							.stdout.pipe(process.stdout);
	spawn(process.execPath, [__filename, location, depthToGo, 
							requestsPerProcess, currentDepth])
							.stdout.pipe(process.stdout);

	curl();
}

// spawn no children, curl the url
function child() {
  	curl();
}

function curl(){
	for(var i = 0; i < requestsPerProcess; i++){
		http.get(location);
	}
}

/* 
Example use:
node index.js localhost:3000 4 1000
arg2 = the host to bombard
arg3 = the depth of child process's. 
arg4 = the number of requests per process.

NOTES:
the sum of processes spawned 
is worked out by the formula:
2^arg3 + 2^(arg3-1) + .... + 1;
Formula was worked out off the top my head... 
its not mathematically correct, I think

Don't go deeper than 8 if you want your cpu to live,
for god sake.
*/
