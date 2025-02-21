import React from 'react';
import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {FaEye, FaPencilAlt, FaKey} from 'react-icons/fa';

const WishlistButton = styled.button`
    background: rgb(91, 241, 252);
    border-radius: 25px;
    border-color: black;
    padding: 20px;
    width: 200px;
    height: 200px;
    position: relative;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`

const WishlistMenu = styled.div`
    background: rgb(91, 241, 252);
    display: grid;
    gap: 0px;
    grid-template-rows: 37.5% 1fr 1fr 1fr;
    border-radius: 25px;
    border-color: black;
    width: 200px;
    height: 200px;
    font-size: clamp(0.5em, 0.75em, 1em);
    position: relative;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`

const EventButton = styled.button`
    background: rgb(91, 241, 252);
    border-radius: 25px;
    border-color: black;
    padding: 20px;
    width: 200px;
    height: 200px;
    position: relative;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`

const EventMenu = styled.div`
    background: rgb(91, 241, 252);
    display: grid;
    gap: 0px;
    grid-template-rows: 37.5% 1fr 1fr 1fr;
    border-radius: 25px;
    border-color: black;
    width: 200px;
    height: 200px;
    font-size: clamp(0.5em, 0.75em, 1em);
    position: relative;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`

const createStyledIcon = (IconComponent) => styled(IconComponent)`
  position: absolute;
  left: 20px;
  top: 10px;
`;

const Eye = createStyledIcon(FaEye);
const Pencil = createStyledIcon(FaPencilAlt);
const Key = createStyledIcon(FaKey);

const MenuButton = styled.button`
    &:hover{
        border: solid #5fd5dd 1px;
        border-radius: 20px;
    } 
`


export const WishlistThumbnail = (props) => {

    const WishlistOverlayMenu = () => {
        return (
            <WishlistMenu onMouseLeave={props.toggleActive}>
                <button style={{overflow: 'hidden', fontSize: "initial", textAlign: 'center', borderBottom: '1px solid black'}}>{props.title}</button>
                <MenuButton onClick={openWishlist}>Open</MenuButton>
                <MenuButton>Edit</MenuButton>
                <MenuButton>Share</MenuButton>
            </WishlistMenu>
        )
    }
    let navigate = useNavigate(); 
    const openWishlist = (e) => {
        let path = "/wishlists/" + props.id;
        navigate(path);
    }


    if(props.role == "contributor"){
        return(
            <WishlistButton onClick={openWishlist}><Eye></Eye>{props.title}</WishlistButton>
        )
    } else{
        return(
            <>
                {props.active == props.title ? <WishlistOverlayMenu></WishlistOverlayMenu> : <WishlistButton onMouseEnter={props.toggleActive}>{props.title}</WishlistButton>}
            </>
        )
    }
}

export const EventThumbnail = (props) => {

    const EventOverlayMenu = () => {
        return (
            <EventMenu onMouseLeave={props.toggleActive}>
                <button style={{overflow: 'hidden', fontSize: "initial", textAlign: 'center', borderBottom: '1px solid black'}}>{props.title}</button>
                <MenuButton onClick={openEvent}>Open</MenuButton>
                <MenuButton>Edit</MenuButton>
                <MenuButton>Share</MenuButton>
            </EventMenu>
        )
    }

    const openEvent = (e) => {
        alert("Opened " + props.title);
    }


    if(props.role == "contributor"){
        return(
            <EventButton onClick={openEvent}><Eye></Eye>{props.title}</EventButton>
        )
    } else{
        return(
            <>
                {props.active == props.title ? <EventOverlayMenu></EventOverlayMenu> : <EventButton onMouseEnter={props.toggleActive}>{props.title}</EventButton>}
            </>
        )
    }
}