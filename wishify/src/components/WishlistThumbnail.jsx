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
    .contributor{
        display: block;
    }
`

const createStyledIcon = (IconComponent) => styled(IconComponent)`
  position: absolute;
  left: 20px;
  top: 20px;
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
display: grid;
align-content: center;
justify-content: center;
z-index: 9999;
`

const MenuButton = styled.button`
`


const WishlistThumbnail = (props) => {

    const WishlistOverlayMenu = () => {
        return (
            <MenuContainer id={"overlayMenu"}>
                <p>{props.title}</p>
                <MenuButton>Open</MenuButton>
                <MenuButton>Edit</MenuButton>
                <MenuButton>Share</MenuButton>
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

export default WishlistThumbnail