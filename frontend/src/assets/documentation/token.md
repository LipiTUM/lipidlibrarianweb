## Sessions & Session Tokens

LipidLibrarian Web uses a **session system** to persist your query history and allow you to revisit, share, and collaborate on lipid search results. Each session is uniquely identified by a **session token** — a [UUID](https://en.wikipedia.org/wiki/Universally_unique_identifier) (Universally Unique Identifier) assigned to every visitor of the website.

---

### How Sessions Work

When you first visit LipidLibrarian Web, a session token is automatically assigned to you. All queries you perform during your visit are stored under this token in the database. This means:

- Your query history is **persistent** — results are saved and accessible even after the query has completed.
- You can **revisit past results** at any time without re-running the search.
- You can **share your session** with collaborators so they can view the exact same query results.

Your session and its associated query history are accessible via the **History side panel**, which can be opened from any page on the website by clicking the button in the top right-hand corner.

---

### The History Panel & Session Manager

The History side panel is the central place for managing your session. It is divided into two main areas:

#### Query History (Top of Panel)
- Displays all lipid queries associated with your current session token.
- Use the **Refresh** button at the top of the panel to load newly submitted queries into the list.
- Each query object in the history can contain **multiple lipid results**.
- Queries can be **deleted** from the history if they are no longer needed.
- Select any lipid from a query to open it in the full **Results view** for detailed inspection.

#### Session Manager (Bottom of Panel)
- Displays your **current session token**.
- Allows you to **switch to a different session** by entering another token, giving you access to its associated query history.
- Allows you to **share your session** with collaborators by handing them your token — anyone who enters it will see the same query history.

---

### Session Tokens

A session token is a **UUID (Universally Unique Identifier)**, a standardized 128-bit identifier typically represented in the format:

```
xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
```

For example:
```
550e8400-e29b-41d4-a716-446655440000
```

#### Automatic Assignment
Every visitor is automatically assigned a randomly generated UUID session token upon accessing the website. No login or registration is required.

#### Custom Tokens
You may define your own session token, as long as it conforms to the UUID format. This is useful when you want to:
- Resume a specific known session.
- Set up a predictable, shareable token in advance for team collaboration.

#### Finding Your Token
Your current session token is always visible at the **bottom of the History side panel**.

---

### Sharing a Session

To share your query results with a colleague:

1. Open the **History side panel** by clicking the button in the top right-hand corner.
2. Scroll to the **Session Manager** at the bottom of the panel.
3. Copy your **current session token**.
4. Send the token to your colleague.
5. Your colleague opens LipidLibrarian Web, opens the History side panel, and enters your token in the Session Manager.

They will now have access to the full query history associated with that session.
