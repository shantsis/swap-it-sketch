# Swap It
Swap it is a sketch plugin that can be used to switch symbols across multiple artboards instantly. The plugin is designed to be flexible to enable swapping symbols such as:
* Light mode ↔ Dark mode
* Low fidelity ↔ High fidelity
* Default state ↔ Filled state

and more!

## How to Use
Swap It looks for symbols with a matching name across your linked libraries. For the plugin to pick up the corresponding symbol, the symbol should have the same path name, with the modifier at the beginning or end of the name. 

For example, to swap buttons between light and dark mode, the symbol names should be `dark/button/default` & `light/button/default`, or `button/default/dark` & `button/default/light`.


To use the plugin:
1. Select one or more layers (or one or more artboards)
2. From the menu, select Plugins → Swap It → Configure...
3. Select whether the modifier is located at the beginning (e.g. dark/....) or end (.../dark) of the symbol name
4. Enter the modifiers the plugin should find and replace (e.g. 'dark' & 'light'). Note these fields are case sensitive.
5. (Optional) Select to use symbols located within the document (i.e. not in a library)
6. Run the plugin!

## Feedback and Issues
If you have any feedback or are encountering a problem, please open an issue here or fill out the feedback or report bug forms.


Happy swapping!
