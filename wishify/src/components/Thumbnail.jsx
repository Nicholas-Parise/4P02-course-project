import React from 'react';
import styled from "styled-components";
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

const EventButton = styled.button`
    background: rgb(91, 241, 252);
    display: grid;
    font-size: clamp(0.5em, 1em, 1em);
    border-radius: 25px;
    border-color: black;
    padding-top: 30px;
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

const MenuContainer = styled.div`
position: fixed;
top: 50%;
right: 0;
bottom: 50%;
left: 0;
z-index: 9999;
`

const Menu = styled.div`
    display: grid;
    align-content: center;
    justify-content: center;
`

const MenuButton = styled.button`
    &:hover{
        border: solid #5fd5dd 1px;
        border-radius: 20px;
    } 
`

const TitleButton = styled.button`
`


export const WishlistThumbnail = (props) => {

    const WishlistOverlayMenu = () => {
        return (
            <MenuContainer id={"overlayMenu"}>
                <Menu>
                    <p>{props.title}</p>
                    <MenuButton onClick={openWishlist}>Open</MenuButton>
                    <MenuButton>Edit</MenuButton>
                    <MenuButton>Share</MenuButton>
                </Menu>
            </MenuContainer>
        )
    }

    const openWishlist = (e) => {
        alert("Opened " + props.title);
    }


    if (props.role == "viewer"){
        return(
            <WishlistButton onClick={openWishlist}><Eye></Eye>{props.title}</WishlistButton>
        )
    } else if(props.role == "contributor"){
        return(
            <WishlistButton onClick={openWishlist}><Pencil></Pencil>{props.title}</WishlistButton>
        )
    } else{
        return(
            <>
                <WishlistButton onClick={props.toggleActive}><Key></Key>{props.title}</WishlistButton>
                {props.active == props.title ? <WishlistOverlayMenu></WishlistOverlayMenu> : ""}
            </>
        )
    }
}

export const EventThumbnail = (props) => {

    const EventOverlayMenu = () => {
        return (
            <EventMenu>
                <button onClick={props.toggleActive} style={{overflow: 'hidden', fontSize: "initial", textAlign: 'center', borderBottom: '1px solid black'}}>{props.title}</button>
                <MenuButton onClick={openEvent}>Open</MenuButton>
                <MenuButton>Edit</MenuButton>
                <MenuButton>Share</MenuButton>
            </EventMenu>
        )
    }

    const openEvent = (e) => {
        alert("Opened " + props.title);
    }


    if (props.role == "viewer"){
        return(
            <EventButton onClick={openEvent}><Eye></Eye>{props.title}</EventButton>
        )
    } else if(props.role == "contributor"){
        return(
            <EventButton onClick={openEvent}><Pencil></Pencil>{props.title}</EventButton>
        )
    } else{
        return(
            <>
                {props.active == props.title ? <EventOverlayMenu></EventOverlayMenu> : <EventButton onClick={props.toggleActive}><Key></Key>{props.title}</EventButton>}
            </>
        )
    }
}