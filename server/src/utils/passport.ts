import { env } from "@/common/utils/envConfig";
import passport, { PassportStatic } from "passport";
import {
  Strategy as GitHubStrategy,
  Profile as GitHubProfile,
} from "passport-github2";

// Define the shape of the user object
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
}

// Use GitHub Strategy
passport.use(
  new GitHubStrategy(
    {
      clientID: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/github/callback",
    },
    (
      accessToken: string,
      refreshToken: string,
      profile: GitHubProfile,
      done: (err: any, user?: User | false) => void
    ) => {
      const user: User = {
        id: profile.id.toString(),
        username: profile.username || "",
        name: profile.displayName || "",
        email: profile.emails?.map((email) => email.value)[0] as string,
      };
      return done(null, user);
    }
  )
);

passport.serializeUser(((user: User, done: (err: any, user?: User) => void) => {
  done(null, user);
}) as any);

passport.deserializeUser(
  (user: User, done: (err: any, user?: User | null) => void) => {
    console.log(user);

    done(null, user);
  }
);

export { passport };
