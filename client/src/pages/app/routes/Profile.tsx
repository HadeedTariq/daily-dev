"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, GitlabIcon as GitHub, Twitter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { profileApi } from "@/lib/axios";

const initialProfile = {
  name: "Jane Developer",
  username: "jane_dev",
  bio: "Passionate full-stack developer | Open source enthusiast | Coffee lover",
  avatar: "/placeholder.svg?height=100&width=100",
  followers: 1234,
  following: 567,
  posts: 89,
  tags: ["React", "Node.js", "TypeScript", "GraphQL"],
  github: "jane_dev",
  twitter: "jane_dev",
};

export default function DailyDevProfile() {
  const { isLoading, data: profile } = useQuery({
    queryKey: ["getProfile"],
    queryFn: async () => {
      const { data } = await profileApi.get("/");
      return data as any;
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl font-bold">
            Daily Dev Profile
          </CardTitle>
          <Button variant="outline" size="icon">
            <Edit className="h-4 w-4" />
            <span className="sr-only">Edit profile</span>
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center">
              <Avatar className="h-32 w-32">
                <AvatarImage src={profile.avatar} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <h2 className="mt-4 text-xl font-semibold">{profile.name}</h2>
              <p className="text-sm text-gray-500">@{profile.username}</p>
              <div className="mt-4 flex gap-4">
                <a
                  href={`https://github.com/${profile.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <GitHub className="h-6 w-6" />
                  <span className="sr-only">GitHub profile</span>
                </a>
                <a
                  href={`https://twitter.com/${profile.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900"
                >
                  <Twitter className="h-6 w-6" />
                  <span className="sr-only">Twitter profile</span>
                </a>
              </div>
            </div>
            <div className="flex-1">
              <p className="text-gray-700">{profile.bio}</p>
              <div className="mt-4 flex justify-between">
                <div className="text-center">
                  <p className="font-semibold">{profile.followers}</p>
                  <p className="text-sm text-gray-500">Followers</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.following}</p>
                  <p className="text-sm text-gray-500">Following</p>
                </div>
                <div className="text-center">
                  <p className="font-semibold">{profile.posts}</p>
                  <p className="text-sm text-gray-500">Posts</p>
                </div>
              </div>
              <div className="mt-6">
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
