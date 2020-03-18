//a compilation of functions used to create the config window
var UI = require('sketch/ui')
const MochaJSDelegate = require("./MochaJSDelegate")  //for the message handler

var _window

function createWindow(context, applyMessage) {

  //create the OS window 
  var window = NSPanel.alloc().initWithContentRect_styleMask_backing_defer_(
    NSMakeRect(0, 0, 350, 300),
    NSWindowStyleMaskClosable | NSWindowStyleMaskTitled ,
    NSBackingStoreBuffered,
    false
  )

  window.releasedWhenClosed = false //don't delete from memory
  window.makeKeyAndOrderFront(nil) //front and keyboard focus
  window.center()
  window.isMovable = false
  window.floatingPanel = true //keep it on the top
  window.becomesKeyOnlyIfNeeded = true

  //remove zoom and minimize buttons
  window.standardWindowButton(NSWindowZoomButton).hidden = true
  window.standardWindowButton(NSWindowMiniaturizeButton).hidden = true

  //point it to the html file to load in web view
  const UIfolderURL = context.scriptURL.URLByDeletingLastPathComponent().URLByAppendingPathComponent("../Resources")
  const indexURL = UIfolderURL.URLByAppendingPathComponent("index.html")

  const webView = createWebView(UIfolderURL, indexURL, applyMessage) 
  window.contentView = webView //webview
  _window = window

}

function createWebView(UIfolderURL, indexURL, applyMessage) {
  //create a web view and set it to display
  const webView = WKWebView.alloc().init()
  
  //set handlers for messages from script
  
  const messageHandler = new MochaJSDelegate({
    "userContentController:didReceiveScriptMessage:": (_, wkMessage) => {
      // handle message here
      const message = JSON.parse(wkMessage.body())
      if (message == "close") {
        _window.close()
      }
      else if (message[0] == false && message[1] == false) {
        UI.alert('Swap It','Select the modifier location (i.e. beginning or end of the symbol name).')
      }
      else if (message[2] == "" || message[3] == "") {
        UI.alert('Swap It','Enter the find and replace parameters to search the symbols accordingly.')
      }
      else {
        applyMessage(message)
         _window.close()
      }
      
      
    }
  }).getClassInstance()

  webView.navigationDelegate = messageHandler
  
  const userContentController = webView.configuration().userContentController()
  userContentController.addScriptMessageHandler_name(messageHandler, "sketchPlugin")

  //load page in web view
  webView.loadFileURL_allowingReadAccessToURL(indexURL, UIfolderURL)

  return webView
}

function cleanup(){
  if(_window){
    _window.orderOut(nil)
    _window = null
  }
}