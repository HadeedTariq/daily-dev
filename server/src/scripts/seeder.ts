import { insertDummyUsers } from "./dummy-users";
import { seedSquads } from "./dummy-squad";
import { generatePostContent, seedPosts } from "./dummy-posts";
import { seedPostStats } from "./dummy-posts-upvotes";
import { seedPostComments } from "./dummy-posts-comments";
import { seedFollowers } from "./dummy-follow-following";

export const seedDbData = async () => {
  insertDummyUsers().then(() => {
    console.log("Dummy users inserted");
  });
  seedSquads().then(() => {
    console.log("Dummy squads inserted");
  });
  seedPosts({
    postsPerSquad: 5,
  }).then(() => {
    console.log("Dummy posts inserted");
  });
  seedPostStats().then(() => {
    console.log("Dummy users inserted");
  });
  seedPostComments().then(() => {
    console.log("Dummy users inserted");
  });
  seedFollowers().then(() => {
    console.log("Dummy users inserted");
  });
};
