import { useNavigate } from "react-router-dom";
import styled from "@emotion/styled";
import {FaCrown} from 'react-icons/fa';
import { useRef, useEffect, useState } from "react";


const WishlistButton = styled.button`
    background: #FFFFFF;
    border-radius: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid #5651e5;
    padding: 15px;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    font-size: 1.5rem;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }

    @media (max-width: 480px) {
        font-size: 1.6rem;
    }
`

const WishlistMenu = styled.div`
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    border: 2px solid #5651e5;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    font-size: 1.1rem;
    overflow: hidden;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`

const EventButton = styled.button`
    background: #FFFFFF;
    border-radius: 25px;
    overflow: hidden;
    text-overflow: ellipsis;
    border: 2px solid #5651e5;
    padding: 15px;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    font-size: 1.5rem;
    transition: transform 0.2s ease;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  
    &:hover {
        transform: scale(1.05);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        font-size: 1.6rem;
      }

    @media (max-width: 480px) {
        font-size: 1.6rem;
    }
`

const EventMenu = styled.div`
    background: #FFFFFF;
    display: flex;
    flex-direction: column;
    border-radius: 25px;
    border: 2px solid #5651e5;
    width: 100%;
    aspect-ratio: 1/1;
    position: relative;
    font-size: 1.1rem;
    overflow: hidden;

    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`

const createStyledIcon = (IconComponent: any) => styled(IconComponent)`
  position: absolute;
  left: 20px;
  top: 10px;
`;

const OwnerText = styled.p`
    position: absolute;
    font-size: 1.2rem;
    padding: 4px;
    left: 4px;
    top: 4px;
`

const Crown = createStyledIcon(FaCrown);

const MenuButton = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px 4px;
    border: none;
    background: none;
    font-size: inherit;
  
    &:hover {
        background: rgba(86, 81, 229, 0.1);
        cursor: pointer;
    }
`

const OverlayTitle = styled.p`
    padding: 10px 8px;
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 1.3rem;
`



export const WishlistThumbnail = (props: any) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        if (props.image) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.src = `${props.image}?${new Date().getTime()}`; // Cache busting
        } else {
            setImageLoaded(false);
        }
    }, [props.image]);

    const WishlistOverlayMenu = () => {
        return (
            <WishlistMenu 
                style={imageLoaded ? {
                    background: `linear-gradient(rgba(255, 255, 255, 0.85), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
                onMouseLeave={props.toggleActive}
            >
                <p style={{margin: "4px", paddingLeft:"10px"}}>Creator: {props.owner}</p>
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

    if(props.isOwner){
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            return (
                <>
                {props.active == props.title ? 
                    <WishlistOverlayMenu /> 
                    : 
                    <WishlistButton 
                        onClick={props.toggleActive}
                        style={imageLoaded ? {
                            background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${props.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#000',
                            textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                        } : {}}
                    >
                        {props.title}
                        <Crown />
                    </WishlistButton>
                }
                </>
            );
        }

        return (
            <>
            {props.active == props.title ? 
                <WishlistOverlayMenu /> 
                : 
                <WishlistButton 
                    onMouseEnter={props.toggleActive}
                    style={imageLoaded ? {
                        background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${props.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#000',
                        textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                    } : {}}
                >
                    {props.title}
                    <Crown />
                </WishlistButton>
            }
            </>
        );
    } else {
        return(
            <WishlistButton 
                onClick={openWishlist}
                style={imageLoaded ? {
                    background: `linear-gradient(rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0.7)), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#000',
                    textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                } : {}}
            >
                <OwnerText>Creator: {props.owner}</OwnerText>
                {props.title}
            </WishlistButton>
        )
    }
}

export const EventThumbnail = (props: any) => {
    const EventOverlayMenu = () => {
        
        return (
            <EventMenu onMouseLeave={props.toggleActive}>
                <p style={{margin: "4px", paddingLeft:"10px"}}>Creator: {props.owner}</p>
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

    if(props.isOwner){
        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

        if (isTouchDevice) {
            return (
                <>
                {props.active == props.title ? <EventOverlayMenu></EventOverlayMenu> : <EventButton onClick={props.toggleActive}>{props.title}<Crown></Crown></EventButton>}
                </>
            );
        }

        return (
            <>
            {props.active == props.title ? <EventOverlayMenu></EventOverlayMenu> : <EventButton onMouseEnter={props.toggleActive}>{props.title}<Crown></Crown></EventButton>}
            </>
        );
    } else {
        return(
            <EventButton onClick={openEvent}><OwnerText>Creator: {props.owner}</OwnerText>{props.title}</EventButton>
        )
    }
}