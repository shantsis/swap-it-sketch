# Swap It
Swap it is a Sketch plugin that can be used to switch symbols across multiple artboards instantly. The plugin is designed to be flexible to enable swapping symbols such as:
* Light mode ↔ Dark mode
* Low fidelity ↔ High fidelity
* Default state ↔ Filled state

and more!

## How to Use
Swap It looks for symbols with a matching name across your linked libraries (or symbols within your document). For the plugin to pick up the corresponding symbol, they should have the same path name, with the modifier at the beginning or end of the name. 

For example, to swap buttons between light and dark mode, the symbol names should be `dark/button/default` & `light/button/default`, or `button/default/dark` & `button/default/light`.

![Image symbol buttons](https://github.com/shantsis/swap-it-sketch/blob/initial/readME-images/light-dark-buttons.png)


To use the plugin:
1. Select one or more layers (or one or more artboards)
2. From the menu, select Plugins → Swap It → Configure...
3. Select whether the modifier is located at the beginning (e.g. `dark/....`) or end (`.../dark`) of the symbol name
4. Enter the modifiers the plugin should find and replace (e.g. 'dark' & 'light'). Note these fields are case sensitive.
5. (Optional) Select to use symbols located within the document (i.e. not in a library)
6. Run the plugin!

![GIF of using the plugin](https://github.com/shantsis/swap-it-sketch/blob/initial/readME-images/demo.gif)

## Installing the plugin

### Option 1: Automatic
Search for Swap It in Sketchrunner, Sketchpacks, or Sketch Toolbox if you already have one of these installed.

### Option 2: Manual
1. Download and open swap-it-sketch.zip
2. Navigate to SwapIt.sketchplugin and copy/move to your plugins directory

To find your plugins directory:
1. From the Sketch menu, navigate to Plugins → Manage Plugins...
2. Select the gear in the lower left of the plugins window, and Select Reveal Plugins Folder

## Feedback and Issues
If you have any feedback or are encountering a problem, please open an issue here or fill out the [feedback or report bug form](https://forms.gle/FfKRM377zF5X497p6).


Happy swapping! :v:

Credits to Matt Curtis for [MochaJSDelegate](https://github.com/matt-curtis/MochaJSDelegate), and Nick Zdravkovski for the idea.
