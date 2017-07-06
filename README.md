Tide is a applicaiton framework for quickly building client-side applications with React and MobX.



Finished
===
Router
- Todo: Document

Event Bubbling

- React events bubble up through the compoennt network
- React context is filled out with:
    - parent: PropTypes.object
    - app: PropTypes.object
    - store: PropTypes.object
    - router: PropTypes.object
    - tide: PropTypes.object

Components: View
  - Autobinds the methods

Requests
- todo: document

Query Objects
- todo: document


Unfinished
===
Test
- Need to be done

Store
  - storage and caching of data

Revisable Actions
  - It will be useful to be able to undo actions taken

  Option 1:
    - explicitly make user create a function to undo a specific action (useful in the case of ajax actions)

  Option 2:
    - Integrate mobx-store which lets you undo/redo singular changes (useful in the case of ui actions)

  Option 3:
    - patch mobx to report all changes made in an action block; these can then be reverted b/c we will know previous state (better form of option 2)

  Option 4:
    - undo the redux way; anytime an action completes, make a total copy of the data store ... via toJS()
    - store in localstorage


Debugging Components
----

We will integrate this with MobX remote dev.

We may also want to configure: https://github.com/gaearon/react-transform-catch-errors

Look here too:  https://gist.github.com/Aldredcz/4d63b0a9049b00f54439f8780be7f0d8


Notes
---
Tide uses context extensively.
In order to work effectively with this; you should treat context as shallowly immutable. In that if you set a
store/router via props then do not change it.