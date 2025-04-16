import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {FaCrown} from 'react-icons/fa';


const WishlistButton = styled.button`
    background: #FFFFFF;
    border-radius: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid #5651e5;
    padding: 20px;
    width: 200px;
    height: 200px;
    position: relative;
    font-size: clamp(0.5em, 0.75em, 1em);
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover{
        transform: scale(1.05);
        cursor: pointer;
    }
`

const WishlistMenu = styled.div`
    background: #FFFFFF;
    display: grid;
    gap: 0px;
    grid-template-rows: 20% 1fr 1fr 1fr 1fr 1fr;
    border-radius: 25px;
    border: 2px solid #5651e5;
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
    background: #FFFFFF;
    border-radius: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid #5651e5;
    padding: 20px;
    width: 200px;
    height: 200px;
    position: relative;
    font-size: clamp(0.5em, 0.75em, 1em);
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover{
        transform: scale(1.05);
        cursor: pointer;
    }
`

const EventMenu = styled.div`
    background: #FFFFFF;
    display: grid;
    gap: 0px;
    grid-template-rows: 20% 1fr 1fr 1fr 1fr;
    border-radius: 25px;
    border: 2px solid #5651e5;
    width: 200px;
    height: 200px;
    font-size: clamp(0.5em, 0.75em, 1em);
    position: relative;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
`

const createStyledIcon = (IconComponent: any) => styled(IconComponent)`
  position: absolute;
  left: 20px;
  top: 10px;
`;

const OwnerText = styled.p`
    position: absolute;
    right: 20px;
    top: 10px;
`

const Crown = createStyledIcon(FaCrown);

const MenuButton = styled.button`
    &:hover{
        border: solid #5651e5 1px;
        border-radius: 20px;
        cursor: pointer;
    } 
`

const OverlayTitle = styled.p`
    overflow: hidden;
    white-space: nowrap;
    font-size: 18px;
    text-align: center;
    border-bottom: 1px solid black;
    text-overflow: ellipsis;
`



export const WishlistThumbnail = (props: any) => {
    const WishlistOverlayMenu = () => {
        return (
            <WishlistMenu onMouseLeave={props.toggleActive}>
                <p style={{margin: "4px"}}>Creator: {props.owner}</p>
                <OverlayTitle title={props.title}>{props.title}</OverlayTitle>
                <MenuButton onClick={openWishlist}>Open</MenuButton>
                <MenuButton onClick={props.edit}>Edit</MenuButton>
                <MenuButton onClick={props.share}>Share</MenuButton>
                <MenuButton onClick={props.duplicate}>Duplicate</MenuButton>
            </WishlistMenu>
        )
    }

    let navigate = useNavigate(); 
    const openWishlist = () => {
        let path = "/wishlists/" + props.id;
        navigate(path);
    }

    if(props.role == "contributor"){
        return(
        <WishlistButton onClick={openWishlist}><OwnerText style={{fontSize: "small"}}>Owner: {props.owner}</OwnerText>{props.title}</WishlistButton>
        )
    } else{
        return(
            <>
                {props.active == props.title ? <WishlistOverlayMenu></WishlistOverlayMenu> : <WishlistButton onMouseEnter={props.toggleActive}>{props.title}{props.isOwner? <Crown></Crown> : null}</WishlistButton>}
            </>
        )
    }
}

export const EventThumbnail = (props: any) => {
    const EventOverlayMenu = () => {
        return (
            <EventMenu onMouseLeave={props.toggleActive}>
                <p style={{margin: "4px"}}>Creator: {props.owner}</p>
                <OverlayTitle title={props.title}>{props.title}</OverlayTitle>
                <MenuButton onClick={openEvent}>Open</MenuButton>
                <MenuButton onClick={props.edit}>Edit</MenuButton>
                <MenuButton onClick={props.share}>Share</MenuButton>
            </EventMenu>
        )
    }

    let navigate = useNavigate(); 
    const openEvent = () => {
        let path = "/events/" + props.id;
        navigate(path);
    }

    if(props.role == "contributor"){
        return(
        <EventButton onClick={openEvent}><OwnerText style={{fontSize: "small"}}>Owner: {props.owner}</OwnerText>{props.title}</EventButton>
        )
    } else{
        return(
            <>
                {props.active == props.title ? <EventOverlayMenu></EventOverlayMenu> : <EventButton onMouseEnter={props.toggleActive}>{props.title}</EventButton>}
            </>
        )
    }
}