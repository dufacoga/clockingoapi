# 🤝 Contributing to FlexiQueryAPIv2

Thanks for taking a moment to contribute! Whether you're reporting a bug, suggesting an improvement, or submitting a pull request — your effort is appreciated.

**FlexiQueryAPIv2** is a secure and generic API built with **Node.js and Express**, designed to support **dynamic SQL execution** across multiple database providers (MySQL, SQLite, SQL Server) via **REST** and **GraphQL** interfaces.

---

## 🐞 Found a Bug or Have a Feature Request?

If you discover an issue or have a suggestion to improve the project, please [open an issue](https://github.com/dufacoga/FlexiQueryAPIv2/issues). Include relevant details, logs (if safe), and reproduction steps if possible.

---

## 🔧 How to Submit a Pull Request

1. Discuss the change in an open issue (optional but recommended).
2. Fork this repository to your GitHub account.
3. Create a new branch:

   ```bash
   git checkout -b fix/sql-timeout-issue
   ```

4. Make your changes in VSCode or your preferred code editor.
5. Commit using clear, descriptive messages:

   ```bash
   git commit -m "Add timeout handling to SQL Server executor"
   ```

6. Push your branch and open a pull request targeting `main`.

---

## 🛠️ Development Setup

This is a Node.js REST + GraphQL API. To run it locally:

1. Ensure you have [Node.js](https://nodejs.org) (v18 or higher) and npm installed.
2. Clone the repository and navigate into the folder.
3. Install dependencies:

   ```bash
   npm install
   ```

4. Set up your `.env` file with your DB and API key settings.
5. Run the app:

   ```bash
   npm start
   ```

6. Open your browser to:
   - REST UI: [http://localhost:4000/swagger](http://localhost:4000/swagger)

If using SQLite, a preloaded `example.db` with sample data is included.

---

## 🛡️ Code Style & Security Guidelines

To keep the API safe and stable, please follow these rules:

- ✅ Use the existing `SqlSecurityValidator` when changing query handling.
- 🚫 Never allow dangerous SQL operations (`DROP`, `TRUNCATE`, `ALTER`, etc.).
- 🧼 Do **not** log raw user queries — always sanitize them before logging.
- ✅ Follow the current folder structure and clean architecture practices.
- ✅ Use environment variables via the config module for configuration.

---

## 🧩 Adding Support for a New Database

To contribute support for another DBMS (e.g., PostgreSQL):

1. Implement a new class that follows the `ISqlExecutor` interface.
2. Add configuration handling in `config/index.js`.
3. Update `SqlExecutorFactory` and `QueryBuilderFactory` to include the new DB type.
4. Extend the security validator if needed.

---

## 🧭 Branch Naming Suggestions

- fix/connection-string
- feature/add-postgresql-support
- docs/improve-readme
- refactor/validator-structure

---

## 🤝 Code of Conduct

This project follows a basic rule: **be respectful and constructive**. Whether you’re writing a PR, reviewing code, or opening an issue — be kind and helpful.

If needed, refer to the [Code of Conduct](CODE_OF_CONDUCT.md).

---

Thanks for helping make FlexiQueryAPIv2 better!
