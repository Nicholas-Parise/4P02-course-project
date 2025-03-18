import React, {act, useState} from 'react'
import styled from '@emotion/styled'
import {CreateEvent} from '../components/CreateButton'
import {EventThumbnail} from '../components/Thumbnail'

const EventContainer = styled.div`
  display: flex;
  gap: 3vw;
  margin: 3vw;
  flex-wrap: wrap;
`

const Events = () => {
  const [eventCount, setEventCount] = useState(0);

  const [activeOverlay, toggleActiveOverlay] = useState(undefined);

  const addThumbnailFunc = (e) => {
    setEventCount(prevCount => prevCount + 1);
  }

  const changeActiveOverlay = (title) => {
    if(activeOverlay == title){
      toggleActiveOverlay(undefined)
    } else{
      toggleActiveOverlay(title)
    }
  }

  return (
    <section className='bg-white border-2 border-solid border-[#5651e5] rounded-[25px]'>
      <h1>My Events</h1>
      <EventContainer value={activeOverlay}>
        <CreateEvent addThumbnail={addThumbnailFunc}>Create an Event</CreateEvent>
        {Array.from({ length: eventCount }, (_, index) => (
          <EventThumbnail active={activeOverlay} toggleActive={() => changeActiveOverlay("Event " + (parseInt(index)+1))} key={index} title={"Event " + (parseInt(index)+1)}></EventThumbnail>
        ))}
      </EventContainer>
      <h1>Shared Events</h1>
      <EventContainer>
        <EventThumbnail title={"Stephen's Birthday"} id={1234} role={"contributor"}></EventThumbnail>
      </EventContainer>
    </section>
  )
}

export default Events