# Next.js + SST v3 (Ion) + SST Auth

This project is intended to showcase how to use Next.js with the new version of SST (Ion) and the SST Auth.

I did this since right now, the new version of SST was launched, but the docs for the SST Auth in that version don't exist yet; so I wanted to create a basic example for everyone until the official docs and examples are out.

Just keep in mind I did this as an example, which might not follow all the best practices nor be production-ready, so if you use it for your project, do your own work to make it production-ready!

The project uses a Pnpm Monorepo. I created the base project using https://github.com/sst/monorepo-template/tree/main and converted it to use Pnpm Workspaces.

## Get started

1. Clone this repo.

2. Cd into the root folder of this repo.

3. Go to GitHub and create a new OAuth app: https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app . In the `Homepage URL` set for now `http://localhost:3000` and in the `Authorization callback URL` set the Auth lambda URL you will get after the first launch (with `npx sst dev`). After creating the OAuth app, save the Client ID and the Client Secret.

4. Run `pnpm i` to install the dependencies.

5. Run `npx sst dev` to do the initial setup. Once it is deployed, kill it.

6. Run `npx sst secret set GithubClientID <the client ID you copied in the step 4>`.

7. Run `npx sst secret set GithubClientSecret <the client Secret you copied in the step 4>`

8. Run again `npx sst dev` and once it is ready, access `http://localhost:3000`, your project should be working!

## Useful resources

To create this example, I used several resources you might find interesting:

- The old SST v2 Auth docs: https://docs.sst.dev/auth
- This Gist in Svelte from Matt Kinnersley: https://gist.github.com/mattkinnersley/9aa751dc7ea115cdebbe2bf44a068ec7
- The readme and source code from the `future/auth` package from SST: https://github.com/sst/sst/tree/master/packages/sst/src/node/future/auth
