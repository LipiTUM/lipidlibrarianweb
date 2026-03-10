## Query History

LipidLibrarian Web automatically keeps track of every lipid query you submit. This query history is tied to your [session token](documentation#token) and is accessible from any page on the website via the **History side panel**. It lets you quickly revisit, manage, and share past results without having to re-run searches.

> **Note:** The History feature requires **cookies to be enabled** in your browser. See in the section Why Cookies Are Required below.

---

### Accessing the History Panel

The History side panel can be opened from **any page** on the LipidLibrarian website by clicking the history button in the **top right-hand corner** of the navigation bar. This means your query history is always just one click away, regardless of which part of the site you are currently viewing.

---

### What the History Panel Shows

Once open, the History side panel displays all lipid queries that have been submitted under your current session token. Each entry in the list represents a single query and may contain **multiple lipid results** — for example, if your search matched several lipid species at once.

For each query in the list you can:

- **View the results** — click on any lipid within a query to open it in the full Results view for detailed inspection of nomenclature, masses, adducts, fragments, identifiers, ontology terms, and reactions.
- **Refresh the history** — use the **Refresh** button at the top of the panel to pull in any queries that were submitted since you last opened the panel.
- **Delete a query** — remove any query from your history if it is no longer needed.

---

### Navigating to a Result from History

Selecting a lipid from the History panel takes you directly to the detailed view for that lipid. Here you can explore all information LipidLibrarian has gathered, including:

- Name, hierarchy level, and lipid class
- Masses and database source information
- Adducts and fragments
- Database and structure identifiers
- Synonyms
- Ontology information
- Associated reactions

Use the navigation bar on the left side of the Results view to jump between these categories quickly.

---

### Why Cookies Are Required

LipidLibrarian Web uses a **cookie to store your session token** in your browser. This is what connects your browser to your query history.

When you first visit the site, a UUID session token is generated and saved in a cookie on your device. Every time you return to the site or navigate between pages, your browser sends this cookie back to the server, allowing LipidLibrarian to identify your session and load the correct query history for you.

**Without cookies enabled, this process breaks down:**

- LipidLibrarian cannot read or store your session token between page loads.
- Your browser and the server have no way to recognise each other across requests.
- The History panel will be unable to retrieve your past queries.
- Any results you navigate away from will be unrecoverable without re-running the search.

#### How to Enable Cookies

If you want to use the history or session sharing features, cookies must be enabled for the LipidLibrarian domain in your browser settings. The exact steps vary by browser.

If you use a browser extension that blocks cookies (such as an ad blocker or privacy tool), you may need to add LipidLibrarian to its allowlist.

---

### Tips

- Your query history is **not limited to a single browser session** — as long as the cookie persists on your device and you haven't cleared your browser data, your history will be available the next time you visit.
- You can **switch sessions** or **share your history** with colleagues using the Session Manager at the bottom of the History panel. See [Sessions & Session Tokens](documentation#token) for details.
- If you clear your browser cookies, your session token will be lost. LipidLibrarian will assign you a new token, and your previous history will no longer be linked to your browser — though it can be recovered by manually entering the old token in the Session Manager, if you saved it.
