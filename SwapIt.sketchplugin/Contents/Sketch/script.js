@import "ui-functions.js" //functions for the config window
var sketch = require('sketch/dom')
var UI = require('sketch/ui')
var Settings = require('sketch/settings')
const Async = require('sketch/async')
var fiber

var run = function(context) {
  var begOfString = Settings.settingForKey('begOfString-key')
  var findString = Settings.settingForKey('findString-key')
  var replaceString = Settings.settingForKey('replaceString-key')
  var useDocSymbols = Settings.settingForKey('useDocSymbols-key')
  

  
  if (begOfString == undefined) {
    createWindow(context, options => {searchLayers(options)})
  }
  else {
    var message = [begOfString, "", findString, replaceString, useDocSymbols]
    searchLayers(message)
  }
  
}

function searchLayers(message) {
  begOfString = message[0]
  endOfString = message[1]
  findString = message[2]
  replaceString = message[3]
  useDocSymbols = message[4]

  //save the above configs for next time it runs
  Settings.setSettingForKey('begOfString-key', begOfString)
  Settings.setSettingForKey('findString-key', findString)
  Settings.setSettingForKey('replaceString-key', replaceString)
  Settings.setSettingForKey('useDocSymbols-key', useDocSymbols)

  //ensure proper slashes are used
  if (begOfString && findString.charAt(findString.length-1) != '/') {
    findString.concat('/')
  }
  else if (begOfString == false && findString.charAt(0) != '/') {
    findString = '/' + findString
  }
  
  if (begOfString && replaceString.charAt(replaceString.length-1) != '/') {
    replaceString.concat('/')
  }
  else if (begOfString == false && replaceString.charAt(0) != '/') {
    replaceString = '/' + replaceString
  }

  var symbolsUpdated = 0
  //reference the Sketch Document currently used
  var doc = sketch.getSelectedDocument()

  //to get the specific layers a user has selected in the current page
  var selection = doc.selectedLayers
  var layers = selection.layers

  //if no layers are selected, pick one first
  if (layers.length == 0){
    UI.alert('Swap It','Select at least one artboard or layer')
  }
  
  else {

    var symbolList = []
    //get all linked libraries
    var libraries = require('sketch/dom').getLibraries()
    
    for (i = 0; i < libraries.length; i++) {
      //get the list of symbols
      var symbolReferences = libraries[i].getImportableSymbolReferencesForDocument(doc)
      symbolList = symbolList.concat(symbolReferences)
    }

    //get all the symbols in the current doc if selected as option
    if (useDocSymbols) {
      var Page = require('sketch/dom').Page
      var symbolListLocal = []
      for (k=0; k < doc.pages.length; k++) {
        if (doc.pages[k].isSymbolsPage()) {
          symbolListLocal = symbolListLocal.concat(doc.pages[k].layers)
        }
        else {
          var isSymbolsPage = doc.pages[k].layers.findIndex(obj => {return obj.type === "SymbolMaster"})
          if (isSymbolsPage != -1) {
            for (m=0; m <doc.pages[k].layers.length; m++) {
              if (doc.pages[k].layers[m].type == "SymbolMaster") {
                symbolListLocal.push(doc.pages[k].layers[m])
              }
            } 
          }
        }
      }
    }

    //loop through all the layers in the artboard(s) selected
    //start off with only 1 artboard - loop through layers in it
    for (j = 0; j < layers.length; j++) {
      //if the layer is an artboard, go through all layers inside it
      if (layers[j].type == "Artboard") {
        symbolsUpdated += checkSymbol(layers[j].layers, symbolList, symbolListLocal, begOfString, findString, replaceString, useDocSymbols)
      }
      else if (layers[j].type == "SymbolMaster") {
        symbolsUpdated += checkSymbol(layers[j].layers, symbolList, symbolListLocal, begOfString, findString, replaceString, useDocSymbols)
      }
      else {
        var layer = [ layers[j] ] 
        symbolsUpdated += checkSymbol(layer, symbolList, symbolListLocal, begOfString, findString, replaceString, useDocSymbols)
      }

    }
    
    //notify user of the changes
    if (symbolsUpdated == 0) {
      UI.message("No symbols were replaced")
    }
    else if (symbolsUpdated == 1) {
      UI.message("1 symbol was replaced!")
    }
    else {
      UI.message(symbolsUpdated + " symbols were replaced!")
    }
    
  } 
}


function checkSymbol (layers, symbolList, symbolListLocal, begOfString, findString, replaceString, useDocSymbols) {
  count = 0
  //loop through all the layers in the artboard(s) selected, or just a group of layers selected
  for (i = 0; i < layers.length; i++){
    //if the layer is a symbol instance
    if (layers[i].type == "SymbolInstance") {
      
      //get the symbol name
      var layerName = layers[i].master.name
      //if modifier is at the beginning of the string, check if the symbol name has the same modifer
      if (begOfString && layerName.startsWith(findString)) {
        var startIndex = findString.length
        var symbolName = replaceString + layerName.substr(startIndex)
        count += replaceSymbol(layers[i], symbolList, symbolListLocal, symbolName, useDocSymbols)
      }
      
      //if the modifier is at the end, also check symbol
      else if (begOfString == false && layerName.endsWith(findString)) {
        var endIndex = findString.length
        var symbolName = layerName.slice(0, -endIndex) + replaceString
        count += replaceSymbol(layers[i], symbolList, symbolListLocal, symbolName, useDocSymbols)
      }

    }
  
  }

  return count
}

function replaceSymbol (layer, symbolList, symbolListLocal, symbolName, useDocSymbols) {
  count = 0

  //search if there's a replacement
  var index = symbolList.findIndex(obj => {return obj.name === symbolName})

  //if not found within a library, check the local doc if selected as option
  if (index == -1 && useDocSymbols) {
    var index2 = symbolListLocal.findIndex(obj => {return obj.name === symbolName})
    if (index2 > -1) {
      //replace with the master by changing the ID
      symbolMaster = symbolListLocal[index2]
      layer.symbolId = symbolMaster.symbolId
      count = 1
    }
  }

  else if (index > -1) {
    //replace with the master by changing the ID
    symbolMaster = symbolList[index].import()
    layer.symbolId = symbolMaster.symbolId
    count = 1
  }

  return count
}  

var config = function(context) {

  if(!fiber){
    fiber = Async.createFiber()
    fiber.onCleanup(() => {
      UI.cleanup()
    })
  }

  //gather the options from the user
  createWindow(context, options => {searchLayers(options)})

}

var report = function(context) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("https://forms.gle/FfKRM377zF5X497p6"))
}

var feedback = function(context) {
  NSWorkspace.sharedWorkspace().openURL(NSURL.URLWithString("https://forms.gle/FfKRM377zF5X497p6"))
}
