import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { EditText, EditTextarea } from 'react-edit-text';
import { useParams } from 'react-router-dom';
import 'react-edit-text/dist/index.css';
import banner from "../assets/bday-banner.jpg";

const EventSection = styled.section`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
`;
const EventImage = styled.img`
  grid-column: 1 / -1;
  display: block;
  width: 100%;
  object-fit: cover;
`;
const Content = styled.div`
  grid-column: 1 / 2;
`;
const Sidebar = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const RSVP = styled.button`
  background: rgb(0, 0, 0);
  color: white;
  padding: 10px;
  width: 100%;
  text-align: center;
  &:hover {
    background: #222;
    cursor: pointer;
  }
`;

const Event = () => {
  const { id } = useParams();
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const eventUrl = `https://api.wishify.ca/events/${id}`;
  const [event, setEvent] = useState({
    title: '',
    description: '',
    deadline: '',
    addr: '',
    city: '',
  });
  const [originalEvent, setOriginalEvent] = useState(null);
  const [saving, setSaving] = useState(false);

  // Fetch event data on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(eventUrl, {
          method: 'GET',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
          }),
        });
        const data = await response.json();
        const fetchedEvent = {
          title: data.title || '',
          description: data.description || '',
          deadline: data.deadline || '',
          addr: data.addr || '',
          city: data.city || '',
        };
        setEvent(fetchedEvent);
        setOriginalEvent(fetchedEvent);
      } catch (error) {
        console.error('Error fetching event:', error);
      }
    };

    fetchEvent();
  }, [eventUrl, token, id]);

  // Save event data to the backend
  const saveEvent = async () => {
    if (JSON.stringify(event) !== JSON.stringify(originalEvent)) {
      setSaving(true);
      try {
        await fetch(eventUrl, {
          method: 'PUT',
          headers: new Headers({
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(event),
        });
        console.log('Event saved:', event);
        setOriginalEvent(event);
      } catch (error) {
        console.error('Error saving event:', error);
      } finally {
        setSaving(false);
      }
    }
  };

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(saveEvent, 30000); // Save every 30 seconds
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [event, originalEvent, eventUrl, token]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (JSON.stringify(event) !== JSON.stringify(originalEvent)) {
        saveEvent();
        e.preventDefault();
        e.returnValue = ''; // Required for some browsers
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [event, originalEvent]);

  return (
    <>
      <EventSection>
        <EventImage src={banner}></EventImage>
        <Content>
          <EditText
            name="title"
            style={{ fontWeight: 'bold' }}
            value={event.title}
            onChange={(e) => setEvent({ ...event, title: e.target.value })}
            onBlur={saveEvent} // Save on blur
          />
          <EditTextarea
            value={event.description}
            onChange={(e) => setEvent({ ...event, description: e.target.value })}
            onBlur={saveEvent} // Save on blur
            style={{
              resize: 'none',
            }}
            rows={12}
          />
        </Content>
        <Sidebar>
          <RSVP>RSVP Now</RSVP>
          <div>
            <p style={{ fontWeight: 'bold' }}>Date:</p>
            <input
              aria-label="Date and time"
              type="datetime-local"
              value={event.deadline ? new Date(event.deadline).toISOString().slice(0, 16) : ''}
              onChange={(e) => setEvent({ ...event, deadline: e.target.value })} // Update event.date on change
              onBlur={saveEvent} // Save on blur
            />
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>Address:</p>
            <EditText
              name="address"
              value={event.addr}
              onChange={(e) => setEvent({ ...event, addr: e.target.value })}
              onBlur={saveEvent} // Save on blur
            />
          </div>
          <div>
            <p style={{ fontWeight: 'bold' }}>City:</p>
            <EditText
              name="city"
              value={event.city}
              onChange={(e) => setEvent({ ...event, city: e.target.value })}
              onBlur={saveEvent} // Save on blur
            />
          </div>
        </Sidebar>
      </EventSection>
      {saving && <p style={{ textAlign: 'center', color: 'green' }}>Saving...</p>}
    </>
  );
};

export default Event;