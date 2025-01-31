import React from 'react'
import { type WishlistItem } from '../types/types';
import { useSortable } from '@dnd-kit/sortable';
import {CSS} from '@dnd-kit/utilities';

const WishlistItemEntry = ({ item, index }: {item: WishlistItem, index: number}) => {
  const id = item.id;
  const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id, animateLayoutChanges: () => false });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  

  return (
    <div 
      className='p-5 m-4 bg-blue-300 rounded-4xl shadow-lg grid grid-cols-[auto_auto_1fr_50px_120px] gap-14' 
      ref={setNodeRef} 
      style={style}
      >
        <div className='text-center justify-center'>
          <svg {...attributes} {...listeners} className='w-6 cursor-move touch-none outline-none fill-gray-700' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path d="M96 32H32C14.3 32 0 46.3 0 64v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160H32c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zM288 32h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32V64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32zm0 160h-64c-17.7 0-32 14.3-32 32v64c0 17.7 14.3 32 32 32h64c17.7 0 32-14.3 32-32v-64c0-17.7-14.3-32-32-32z"/></svg>
          {index+1}
        </div>
        <img src={item.imageSrc} className='w-20'></img>
        <div className='flex items-center'>{item.name}</div>
        <div className='flex items-center justify-center'>
          {item.quantitySupplied === item.quantity ? <svg className='w-6 outline-none' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg>
            : item.quantitySupplied === 0 ? item.quantity 
              : <><div className='line-through text-gray-600 mr-2'>{item.quantity}</div>{item.quantity - item.quantitySupplied}</>}
        </div>
        <div className='flex items-center'>{new Intl.NumberFormat('en-CA', {style: 'currency', currency: 'CAD'}).format(item.price)}</div>
      </div>
  )
}

export default WishlistItemEntry