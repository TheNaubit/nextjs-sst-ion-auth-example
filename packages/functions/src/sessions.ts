import { createSessionBuilder } from "sst/auth";

// This is the session with the structure defined, we can add any other fields we want to store in the session
// For example here we are storing other data:
// https://gist.github.com/mattkinnersley/9aa751dc7ea115cdebbe2bf44a068ec7#file-session-ts
export const session = createSessionBuilder<{
	user: {
		email: string;
	};
}>();
