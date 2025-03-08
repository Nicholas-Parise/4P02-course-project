import React, {useState} from 'react'
import styled from 'styled-components'
import Navbar from '../components/Navbarmain'
import { EditText, EditTextarea } from 'react-edit-text';
import 'react-edit-text/dist/index.css';
import banner from "../assets/bday-banner.jpg";

const EventSection = styled.section`
  margin-top: 20px;
  display: grid;
  grid-template-columns: 3fr 1fr;
  grid-template-rows: auto 1fr;
  gap: 20px;
`
const EventImage = styled.img`
  grid-column: 1 / -1;
  display: block;
  width: 100%;
  object-fit: cover;
`
const Content = styled.div`
  grid-column: 1 / 2;
`
const Sidebar = styled.div`
  grid-column: 2 / 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
`
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
`

const Event = () => {
  const [event, setEvent] = useState({
    title: "Stephen's Birthday",
    description: "Type your description here.",
    date: "2023-10-01",
    address: "123 Event Street",
    city: "Event City",
  });

  return (
    <Navbar></Navbar>
    
    <EventSection>
      <EventImage src={banner}></EventImage>
      <Content>
        <EditText
          name="textbox1"
          style={{ fontWeight: 'bold' }}
          defaultValue={event.title}
        />
        <EditTextarea
          defaultValue={event.description}
          style={{
            resize: "none"
          }}
          rows={12}
        />
      </Content>
      <Sidebar>
        <RSVP>RSVP Now</RSVP>
        <div>
          <p style={{ fontWeight: 'bold' }}>Date:</p>
          <EditText
            name="date"
            defaultValue={event.date}
          />
        </div>
        <div>
          <p style={{ fontWeight: 'bold' }}>Address:</p>
          <EditText
            name="address"
            defaultValue={event.address}
          />
        </div>
        <div>
          <p style={{ fontWeight: 'bold' }}>City:</p>
          <EditText
            name="city"
            defaultValue={event.city}
          />
        </div>
      </Sidebar>
    </EventSection>
  );
};
export default Event;