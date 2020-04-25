execute(){
	/opt/firefox/firefox file:///home/rodolfoap/crowd-simulation/index.html
}
case "$1" in
e)
	vi -p boids.js index.html
	execute
;;
"")
	execute
;;
esac
