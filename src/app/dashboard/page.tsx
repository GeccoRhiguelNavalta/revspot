"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { toast } from "sonner";
import Image from "next/image";
import NavBar from "@/components/NavBar";

interface Post {
  id: string;
  title: string;
  image_path: string;
  created_at: string;
  user_id: string;
  likes: number;
  username: string;
}

const DashboardPage = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const limit = 6;

  const loadPosts = useCallback(async () => {
    setLoading(true);

    // Fetch posts with embedded likes count
    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select(
        `
        id,
        title,
        image_path,
        created_at,
        user_id,
        likes:likes(count)
      `
      )
      .order("created_at", { ascending: false })
      .range(page * limit, (page + 1) * limit - 1);

    if (postsError) {
      toast.error("Error loading posts");
      setLoading(false);
      return;
    }

    if (!postsData || postsData.length === 0) {
      setLoading(false);
      return;
    }

    // Get user info for posts author
    const userIds = postsData.map((post) => post.user_id);

    const { data: usersData, error: usersError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds);

    if (usersError) {
      toast.error("Error loading user data");
      setLoading(false);
      return;
    }

    // Map posts and attach username and likes count properly
    const postsWithExtras = postsData.map((post: any) => {
      const user = usersData?.find((u) => u.id === post.user_id);
      return {
        id: post.id,
        title: post.title,
        image_path: post.image_path,
        created_at: post.created_at,
        user_id: post.user_id,
        likes: post.likes?.[0]?.count ?? 0, // Likes count is inside likes array count
        username: user?.display_name ?? "Unknown",
      };
    });

    setPosts((prev) => [...prev, ...postsWithExtras]);
    setLoading(false);
  }, [page]);

  useEffect(() => {
    loadPosts();
  }, [loadPosts]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      ) {
        setPage((prev) => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleLike = async (postId: string) => {
    const { data, error } = await supabase.rpc("toggle_like", {
      post_id: postId,
    });
    if (error) {
      toast.error("Error toggling like");
    } else if (data) {
      setPosts((prev) =>
        prev.map((post) =>
          post.id === postId ? { ...post, likes: data.new_likes } : post
        )
      );
    }
  };

  return (
    <NavBar>
      <div className="pt-20 px-4 bg-slate-900 min-h-screen text-white">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        <div className="grid md:grid-cols-2 gap-4">
          {posts.map((post) => {
            const { data } = supabase.storage
              .from("photos")
              .getPublicUrl(post.image_path);
            const imageUrl = data?.publicUrl;

            return (
              <div
                key={post.id}
                className="bg-white text-black rounded p-4 shadow"
              >
                <Image
                  src={imageUrl}
                  alt={post.title}
                  width={600}
                  height={300}
                  className="w-full h-48 object-cover rounded mb-2"
                />

                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-gray-600">
                  By {post.username} on{" "}
                  {new Date(post.created_at).toLocaleString()}
                </p>
                <button
                  onClick={() => toggleLike(post.id)}
                  className="mt-2 text-red-500 font-bold"
                >
                  ❤️ {post.likes}
                </button>
              </div>
            );
          })}
        </div>

        {loading && <p className="text-center mt-4">Loading...</p>}
      </div>
    </NavBar>
  );
};

export default DashboardPage;
