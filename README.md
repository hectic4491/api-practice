This is a simple flask app to use as reference.



An app will typically have many files, but these are the 4 main files:
> -app.py: To behave as our WSGI web application framework.
> -index.html: To behave as our HTML document.
> -styles.css: To behave as our styling file.
> -script.js: To behave as our interactice site scripting.

The index.html has a textarea element to document different events that
occur while the HTML page is parsed and loaded.

The script.js file has the event listeners that log different events as the page is loaded. This is to demonstrate which of these events we may want to choose as a wrapping function for our actual JavaScript code.

Here is the page that details the script:
https://developer.mozilla.org/en-US/docs/Web/API/Window/load_event

NOTE** The placement of the script element on the HTML page will effect the order of the event log.
The script element here is placed at the end of body to ensure that all elements have been loaded before being queried in scrip.js.
If the element was placed in the head, then the elements would not be correctly queried.
If the script element is deferred using defer or set to async, then some 
events (although they happen) are never logged.
Test out different methods to find which is appropriate for the web page.

Here's a page with some helpful visualizations:
https://www.growingwiththeweb.com/2014/02/async-vs-defer-attributes.html
