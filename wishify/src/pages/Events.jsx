import React, { useState } from 'react';
import styled from '@emotion/styled';
import { CreateEvent } from '../components/CreateButton';
import { EventThumbnail } from '../components/Thumbnail';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2vw;
  padding: 2vw;
  height: calc(100vh - 80px); 
`;

const EventSection = styled.div`
  flex: 1; // Each section takes equal height
  display: flex;
  flex-direction: column;
  justify-content: space-between; 
`;

const EventContainer = styled.div`
  display: flex;
  gap: 3vw;
  padding: 1vw;
  overflow-x: auto; 
  padding-bottom: 1vw; 
`;

const SharedEventContainer = styled.div`
  display: flex;
  gap: 3vw;
  padding: 1vw;
  overflow-x: auto; 
  padding-bottom: 1vw; 
`;

const EventThumbnailWrapper = styled.div`
  flex: 0 0 auto; /
  width: 200px; 
  height: 200px; 
`;

const Events = () => {
  const [eventCount, setEventCount] = useState(0);
  const [activeOverlay, toggleActiveOverlay] = useState(undefined);

  const addThumbnailFunc = () => {
    setEventCount((prevCount) => prevCount + 1);
  };

  const changeActiveOverlay = (title) => {
    if (activeOverlay === title) {
      toggleActiveOverlay(undefined);
    } else {
      toggleActiveOverlay(title);
    }
  };

  return (
    <PageContainer>
      <EventSection>
        <div style={{ 
          background: '#FFFFFF', 
          color: 'black', 
          padding: '5px', 
          textAlign: 'center',
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          My Events
        </div>
        <EventContainer>
          <EventThumbnailWrapper>
            <CreateEvent addThumbnail={addThumbnailFunc}>Create an Event</CreateEvent>
          </EventThumbnailWrapper>
          {Array.from({ length: eventCount }, (_, index) => (
            <EventThumbnailWrapper key={index}>
              <EventThumbnail
                active={activeOverlay}
                toggleActive={() => changeActiveOverlay(`Event ${index + 1}`)}
                title={`Event ${index + 1}`}
              />
            </EventThumbnailWrapper>
          ))}
        </EventContainer>
      </EventSection>

      <EventSection>
        <div style={{ 
          background: '#FFFFFF', 
          color: 'black', 
          padding: '5px', 
          textAlign: 'center',
          paddingLeft: '10px', 
          borderRadius: '20px', 
          width: '100%',  
          fontSize: '25px', 
          fontWeight: 'bold' 
        }}>
          Shared Events
        </div>
        <SharedEventContainer>
          <EventThumbnailWrapper>
            <EventThumbnail
              title={"Stephen's Birthday"}
              id={1234}
              role={"contributor"}
              owner={"Stephen"}
            />
          </EventThumbnailWrapper>
        </SharedEventContainer>
      </EventSection>
    </PageContainer>
  );
};

export default Events;