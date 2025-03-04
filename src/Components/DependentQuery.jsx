import { useQuery } from "@tanstack/react-query";
import { useState } from "react";


const fetchUser=async(userId)=>{
    const res=await fetch(`https://dummyjson.com/users/${userId}`);
    const data= await res.json();
    return data;
}

const fetchUserPost=async(userId)=>{
    const res=await fetch (`https://dummyjson.com/users/${userId}/posts`);
    const data=await res.json();
    return data.posts;
}

function DependentQuery() {
    const[id,setId]=useState(1);

    const{data:user,isLoading:userLoading, error:userError}=useQuery({
        queryKey:['user',id],
        queryFn:()=>fetchUser(id),
        enabled:!!id
    })

    const{data:posts,isLoading,error}=useQuery({
        queryKey:['posts',user?.id],
        queryFn:()=>fetchUserPost(user?.id),
        enabled:!!user?.id
    })
  return (
    <div className="flex  flex-col justify-center items-center m-2 bg-yellow-100 ">
     <div className="flex ">
     {userLoading && <div className="flex">Loading...</div>}
     {userError && <div className="flex">Error: {userError.message}</div>}
     {user && <h1 className="text-3xl font-bold flex">{user.firstName} {user.lastName}</h1> }

     </div>
     <div className="flex flex-col">
     {isLoading && <div>Posts Loading...</div>}
     {error && <div>Error: {error.message}</div>}
     {posts && 
        
            posts.map((post)=>(
                <div key={post.id} className="group relative">
                
                <div className="mt-4 flex">
                  <div className="flex-col flex gap-2">
                    <h3 className="text-sm text-gray-700 flex">
                     
                        <span aria-hidden="true" className="absolute inset-0" />
                        {post.title}
                     
                    </h3>
                    <p className="mt-2 text-sm text-gray-500 flex">
                      {post.body}
                    </p>
                  </div>
                  <p className="text-sm font-medium text-gray-900 ml-2 flex items-center">
                    {post.reactions.likes} Likes
                  </p>
                </div>
                <hr />
              </div>
             
            ))
        
     }
     </div>
  
        <button 
        className="flex bg-pink-300 p-2 font-bold rounded-md text-gray-700 mt-4"
        onClick={()=>{setId((prev)=>prev+1)}}>Load Next</button>
    </div>
  )
}

export default DependentQuery