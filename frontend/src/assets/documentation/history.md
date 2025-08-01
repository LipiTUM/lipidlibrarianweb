## History

The history feature enables the users to quickly inspect, edit and share the query results.

The user can open the history side panel, by clicking on the history button in the navigation bar, accessible from every page of the website.

After submitting a query it is placed in the history. As soon as it finishes, the query results are accessible from the history panel.

### Session

There is a session manager that enables users to access their old sessions or share their current session with co-workers or visit them on other devices.

#### Why cookies?

Without a cookie there is no GDPR compliant way for LipidLibrarianWeb to know who you are if you refresh the page or close the browser window.

#### Implementation Details

This is achieved by assigning a UUID session token to the query in a database, which can either be randomly generated or defined by the user, as long as it is in UUID format. Every visitor of the website automatically gets a token assigned if they accept the cookies from the website and execute a query, which they can find on the bottom of the history panel under current token. At the top of the panel, there is a list of all recently executed queries in chronological order with multiple lipids per query. 
