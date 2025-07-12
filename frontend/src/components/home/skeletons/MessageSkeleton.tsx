import type { FC, JSX } from "react";

const MessageSkeleton:FC = ():JSX.Element => {
  return (
    <>
      <div className='flex gap-3 items-center'>
        <div className='skeleton bg-gray-700 w-10 h-10 rounded-full shrink-0'></div>
        <div className='flex flex-col gap-1'>
          <div className='skeleton bg-gray-700 h-4 w-40'></div>
          <div className='skeleton bg-gray-700 h-4 w-40'></div>
        </div>
      </div>
      <div className='flex gap-3 items-center justify-end'>
        <div className='flex flex-col gap-1'>
          <div className='skeleton bg-gray-700 h-4 w-40'></div>
        </div>
        <div className='skeleton bg-gray-700 w-10 h-10 rounded-full shrink-0'></div>
      </div>
    </>
  )
}

export default MessageSkeleton;