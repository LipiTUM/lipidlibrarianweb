## Query

LipidLibrarian supports multiple query mechanisms:

| Mode               | Description                                                                      |
|--------------------|----------------------------------------------------------------------------------|
| **Quick Search**   | Keyword-based search for lipid names, masses or database identifiers.            |
| **Advanced Query** | Fine grained control over search parameters, such as sources, mode, and adducts. |
| **API Access**     | For automated or programmatic queries (JSON/REST format).                        |

### 1. Quick Search

Accessible from every page in the navigation bar or menu and from the home page.

- **Lipid Name** (e.g. PC 18:1/20:0)
- ***m/z* Ratio** (e.g. 816.18249)
- **Database Identifier** (e.g. SLM:000487065)

### 2. Advanced Query

Accessible from the home page.

You can either start a text query for a **Lipid Name** or **Database Identifier**, or a query for ***m/z* Ratio** with tolerance, mode or adducts with the possibility to restrict the query to a subset of the available data sources:

- **ALEX¹²³** for masses including MS2 fragment masses
- **LIPID MAPS LMSD** for mass, structure, database cross-links
- **Swiss Lipids** for mass, structure, database cross-links, and reactions
- **LION/web** for ontology information
- **LINEX** for reactions

### 3. API Access

see the [API Documentation](https://lipidlibrarian.tools.lipidomics.dev/documentation#api).
 