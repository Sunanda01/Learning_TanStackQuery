import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useState } from "react";

const updateProductTitle=async({id,newTitle})=>{
    const res=await fetch(`https://dummyjson.com/products/${id}`,{
        method:"PATCH",
        headers: { "Content-Type": "application/json" },
        body:JSON.stringify({title:newTitle})
    });
    const data=await res.json();
    // console.log(data);
    return data;
}

function OptimisticUpdate() {
    const queryClient=useQueryClient();
    const [title, setTitle] = useState('Old Product Title');
    const mutation=useMutation({
        mutationFn:updateProductTitle,
        onMutate:async({id,newTitle})=>{
            setTitle(newTitle);
            await queryClient.cancelQueries(["product",id]);
            const prevData=queryClient.getQueryData(["product",id]);
            queryClient.setQueryData(["product",id],(oldData)=>({
                ...oldData,
                title:newTitle
            }));
            return {prevData};
        },
        
        onError:(error,variables,context)=>{
            setTitle(context.prevData?.title || "Old Product Title");
        },
        onSettled:(data,error,variables)=>{
            queryClient.invalidateQueries(["product",variables.id]);
        },      
    });
    // if(mutation.isPending){
    //     return (
    //         <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
    //           Updating......
    //         </h2>
    //       );
    // }
    if (mutation.isError) {
        return (
          <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
            Mutation Error :{mutation.error.message}
          </h2>
        );
      }

  return (
     <div className="flex flex-col items-center">
      <h1 className="text-lg font-bold">
      {mutation.isPending ? (<h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900 opacity-5">
        {title}
            </h2>) : <h2 className="text-4xl text-center pb-2 font-bold tracking-tight text-gray-900">
              {title}
            </h2>}
      </h1>
      <button
        className="bg-green-500 text-white p-2 rounded-md mt-2"
        onClick={() => mutation.mutate({ id: 1, newTitle: "New Product Title" })}
      >
        Update Title
      </button>
    </div>
  );
}

export default OptimisticUpdate