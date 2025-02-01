//import React from 'react'
import { type WishlistItem } from '../types/types';
import WishlistItemEntry from './WishlistItemEntry';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext } from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';

const ListOfWishes = ({wishlistItems, setWishlistItems}: {wishlistItems: WishlistItem[], setWishlistItems: Function}) => {
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    if(over && active.id !== over.id) {
      setWishlistItems((wishlistItems: WishlistItem[]) => {
        const oldIndex = wishlistItems.findIndex(item => item.id === active.id);
        const newIndex = wishlistItems.findIndex(item => item.id === over.id);
        return arrayMove(wishlistItems, oldIndex, newIndex);
      });
      
    }
  }

  console.log(wishlistItems)
  
  return (
    <div>
        <div className='ml-4 mr-4 pl-5 pr-5 rounded-4xl shadow-lg grid grid-cols-[auto_1fr_100px_150px]'>
          <div className='p-1 pl-0 pr-5 border-r-2 border-gray-600'>Rank</div>
          <div className='p-1 pl-8 border-r-2 border-gray-600'>Gift</div>
          <div className='p-1 border-r-2 border-gray-600 text-center'>Quantity</div>
          <div className='p-1 text-center'>Price</div>
        </div>
        <DndContext modifiers={[restrictToVerticalAxis]}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={wishlistItems}>
            {wishlistItems.map((item, index) => {
                return(
                    <WishlistItemEntry item={item} key={index} index={index}/>
                );
            })}
          </SortableContext>
        </DndContext>
    </div>
  )
}

export default ListOfWishes