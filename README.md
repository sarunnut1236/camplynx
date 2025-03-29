# YNS Backoffice Management System

## Project info

**URL**: https://lovable.dev/projects/cd5140f8-c601-459e-97e7-8efdaf0f4837

## Environment Setup

This project uses environment variables for configuration. To set up your local environment:

1. Copy the `.env.example` file to a new file called `.env`:
   ```sh
   cp .env.example .env
   ```

2. Update the values in the `.env` file with your actual configuration:
   ```
   VITE_LIFF_ID=your_actual_VITE_LIFF_ID
   ```

3. For LINE LIFF integration, you need to:
   - Create a LINE Login channel in the [LINE Developer Console](https://developers.line.biz/console/)
   - Create a LIFF app within that channel
   - Copy the LIFF ID to your `.env` file

> **Note**: The `.env` file contains sensitive information and is excluded from Git tracking. Never commit your actual `.env` file to version control.

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/cd5140f8-c601-459e-97e7-8efdaf0f4837) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Set up environment variables as described above.
cp .env.example .env
# Edit .env with your settings

# Step 4: Install the necessary dependencies.
npm i

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- LINE LIFF SDK

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/cd5140f8-c601-459e-97e7-8efdaf0f4837) and click on Share -> Publish.

> **Important**: When deploying, remember to configure the environment variables on your hosting platform.

## I want to use a custom domain - is that possible?

We don't support custom domains (yet). If you want to deploy your project under your own domain then we recommend using Netlify. Visit our docs for more details: [Custom domains](https://docs.lovable.dev/tips-tricks/custom-domain/)
