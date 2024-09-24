import React from "react";

const loading = () => {
  return (
    <div className="relative h-screen  bg-zinc-800 flex divide-y divide-zinc-700 flex-col justify-between gap-2 ">
      <div className="flex flex-col gap-4 items-center justify-center h-full">
        <div className="bg-zinc-900/50 animate-pulse w-20 h-20 rounded-full"></div>
        <div className="bg-zinc-900/30 w-52 h-4 animate-pulse rounded-md"></div>
        <div className="bg-zinc-900/30 w-72 h-3 rounded-sm animate-pulse"></div>
      </div>

      <div className="bg-zinc-900/40 w-full h-[10rem] animate-pulse flex items-center justify-center">
        <div className="mx-2 relative md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl w-[90%] h-[6rem] bg-zinc-900 animate-pulse mt-4 rounded-xl">
          <div className="bg-zinc-800 w-52 h-3 m-3 animate-pulse rounded-sm"></div>
          <div className="bg-zinc-800 w-16 h-6 rounded-md m-3 animate-pulse absolute bottom-2 right-2"></div>
        </div>
      </div>
    </div>
  );
};

export default loading;
