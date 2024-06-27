
import { UserButton } from "@clerk/nextjs";
import Image from "next/image";
import { currentUser } from "@clerk/nextjs/server";
import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/createThread.actions";

export default async function Home() {
const user = await currentUser()
  const result = await fetchPosts(1, 30)
  return (
  <>
    <section className=" mt-9 flex flex-col gap-10"> 
      {result.posts.length === 0 ? (
        <>
          <h1 className=" no-result ">not thread found!</h1>
        </>
      ) : (
        <>
          {result.posts.map((post)=>(
            <ThreadCard 
            key = {post._id}
            id = {post._id}
            currentUserId = {user?.id || ""}
            parentId={post.parentId}
            author = {post.author}
            community = {post.community}
            content = {post.text}
            createdAt = {post.createdAt}
            comments = {post.children}
            />
          ))}
        </>
      )}
    </section>
  </>
  );
}
