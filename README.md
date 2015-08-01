## Ramen Buffet

### http

`get()` fetches all notes and sets the collection to the app view.

`post(model)` creates a new note and saves to the database.

`destroy(model)` deletes a note and removes it from the database.


### Helper Functions

`getLists` returns an array of all list names.

`setLists(array)` appends each list name to the DOM.

`setNote(model)` appends one model to DOM.

`setNotes(selector, models)` appends all notes from a list.

`getNotesByListname(string)` returns models from one list.

`setListValue(string)` changes the value of the list name input.

`resetActiveList(string)` refreshes the list names while keeping the currently displayed list still highlighted.

`notify(string)` displays a notification.

`tojquery(string || selector)` forces a string to be a jQuery object.

`convertDate(date)` returns a human readible date.

`init` initializes all listeners and functions.

`deviceEnv(number)` takes in milliseconds as a duration to collapses list of list names if mobile is detected.

`isListSelected` returns `true` and the list name of currently displayed list or returns `false`.

`setFirstChildActive` applies an `.
active` class to the first list name.

`setActiveList` toggles state of all lists.

`isMobile` returns the `userAgent` based on the user's device.

`getCurrentList` returns the string of the current list being displayed.


#### Events

`onChangeListeners` calls all listeners.

`garbageWatcher` returns the number of notes where done is `true`.

`appendDoneStats` appends the number of note marked done or appends icon indicating there are no notes marked done.

`listWatcher` rerenders the total count of notes next to the list name.

`fixPath` removes Facebook `location.hash` from address bar.

#### Animations

`sunny` rotates element 1 degree every 800 milliseconds.

`toggleLists` collapses and uncollapses lists.