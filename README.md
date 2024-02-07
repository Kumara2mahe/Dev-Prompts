# Dev Prompts

*Platform that serves as a hub for exchanging AI prompts in a format similar to blog posts.*

[![image](https://drive.google.com/uc?export=view&id=1DUTuRvZ_rp7oLUjbb0K2JM_F9Gp0yJhq)](https://devprompts-nextjs.vercel.app/)

## Tech Stack

- Next.js
- MongoDB
- NextAuth
- TailwindCSS

## Features

- **Modern Design with Glassmorphism Trend Style**: A modern and visually appealing design, incorporating the glassmorphism trend style for a sleek and contemporary appearance.

- **Discover and Share AI Prompts**: Allow users to discover AI prompts shared by the community and create their own prompts to share with the world.

- **Edit and Delete Created Prompts**: Users have the ability to edit their created prompts at any time and delete them when needed.

- **Profile Page**: Each user gets a dedicated profile page showcasing all the prompts they've created, providing an overview of their contributions.

- **View Other People's Profiles**: Users can explore the profiles of other creators to view the prompts they've shared, fostering a sense of community.

- **Copy to Clipboard**: Implement a convenient "Copy to Clipboard" functionality for users to easily copy the AI prompts for their use.

- **Search Prompts by Specific Tag**: Allow users to search for prompts based on specific tags, making it easier to find prompts related to specific topics.

- **OAuth Authentication using NextAuth**: Enable secure OAuth authentication using NextAuth with Google & Github accounts, ensuring a streamlined and trustworthy login experience.

- **Responsive Website**: Develop a fully responsive website to ensure optimal user experience across various devices, from desktops to smartphones

and many more, including code architecture and reusability

## New Features

- **Profile Settings**
    - **Privacy**: User can now hide their email address from displaying on the prompts they created.
    - **Preference**: Option to change a custom username instead of Social account's username which they used to authenticate.

- **Custom Confirm Dialog To Delete Prompt**: An custom dialog box will now popup when user try to delete their own prompt, with a form to ask confirmation before delete like in github while try to delete a repositary.

- **Clear Search**: Users can now clear their search with a single click and revert to intial state.

## Quick Start

Follow these steps to set up the project locally on your machine.

**Prerequisites**

Make sure you have the following installed on your machine:

- [Git](https://git-scm.com/)
- [Node.js](https://nodejs.org/en)
- [npm](https://www.npmjs.com/) (Node Package Manager)

**Cloning the Repository**

```bash
git clone https://github.com/Kumara2mahe/Dev-Prompts.git
cd Dev-Prompts
```

**Installation**

Install the project dependencies using npm:

```bash
npm install
```

**Set Up Environment Variables**

Create a new file named `.env` in the root of your project and add the following content:

```env
DATABASE_URI="mongodb+srv://<username>:<password@<domain>/?retryWrites=true&w=majority"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_URL_INTERNAL="http://localhost:3000"
NEXTAUTH_SECRET="<random-secret-string>"

# OAuth2
GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
GITHUB_ID="<github-client-id>"
GITHUB_SECRET="<github-client-secret>"
```

Replace the placeholder values with your actual credentials.

**Running the Project**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the project.

