function getInputs() {
	var beg = document.getElementById("beg").checked
	var end = document.getElementById("end").checked
	var find = document.getElementById("find").value
	var replace = document.getElementById("replace").value
	var keepSame = document.getElementById("keepSame").checked

	const message = [beg, end, find, replace, keepSame]

	//send the configurations to the plugin
	if(window.webkit && window.webkit.messageHandlers.sketchPlugin){
		window.webkit.messageHandlers.sketchPlugin.postMessage(JSON.stringify(message))
	} else {
		console.error("Failed to send options - could not to find 'sketchPlugin' message handler. Is every thing set up properly for messaging?")
	} 

}

function closeWindow() {
	const message = "close"

	if(window.webkit && window.webkit.messageHandlers.sketchPlugin){
		window.webkit.messageHandlers.sketchPlugin.postMessage(JSON.stringify(message))
	} else {
		console.error("Failed to send options - could not to find 'sketchPlugin' message handler. Is every thing set up properly for messaging?")
	} 
}