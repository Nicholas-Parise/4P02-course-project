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

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: 0.8rem;
        padding: 6px;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: 0.9rem;
        padding: 8px;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: 1rem;
        padding: 10px;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: 1.1rem;
        padding: 12px;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 1.2rem;
        padding: 10px;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 1rem;
        padding: 8px;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.9rem;
        padding: 6px;
    }

    /* Portrait responsive styles */
    @media (max-width: 768px) {
        font-size: 1.6rem;
    }

    @media (max-width: 480px) {
        font-size: 1.4rem;
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

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: 0.8rem;
        padding: 6px;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: 0.9rem;
        padding: 8px;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: 1rem;
        padding: 10px;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: 1.1rem;
        padding: 12px;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 1.2rem;
        padding: 10px;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 1rem;
        padding: 8px;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.9rem;
        padding: 6px;
    }

    /* Portrait responsive styles */
    @media (max-width: 768px) {
        font-size: 1.6rem;
    }

    @media (max-width: 480px) {
        font-size: 1.4rem;
    }
`

// Wishlist Menu with comprehensive landscape styles
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

  /* Landscape responsive tiers */
  @media (max-width: 600px) and (orientation: landscape) {
    font-size: 0.7rem;
  }

  @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
    font-size: 0.8rem;
  }

  @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
    font-size: 0.9rem;
  }

  @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
    font-size: 1rem;
  }

  /* Portrait responsive styles */
  @media (max-width: 768px) {
    font-size: 1rem;
  }

  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

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

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: 0.8rem;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: 0.9rem;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: 1rem;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: 1.1rem;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 1rem;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.9rem;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.8rem;
    }

    /* Portrait responsive styles */
    @media (max-width: 768px) {
        font-size: 1.3rem;
    }

    @media (max-width: 480px) {
        font-size: 1rem;
    }
`;

const createStyledIcon = (IconComponent: any) => styled(IconComponent)`
    position: absolute;
    left: 20px;
    top: 10px;
    font-size: 1.3rem;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        left: 8px;
        top: 4px;
        font-size: 0.8rem;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        left: 10px;
        top: 5px;
        font-size: 0.9rem;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        left: 12px;
        top: 6px;
        font-size: 1rem;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        left: 15px;
        top: 8px;
        font-size: 1.1rem;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 1rem;
        left: 15px;
        top: 8px;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.9rem;
        left: 12px;
        top: 6px;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.8rem;
        left: 8px;
        top: 4px;
    }
`;

const Crown = createStyledIcon(FaCrown);

const OwnerText = styled.p`
    position: absolute;
    font-size: 0.9rem;
    padding: 4px;
    left: 4px;
    top: 4px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 80%;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: 0.6rem;
        max-width: 70%;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: 0.65rem;
        max-width: 75%;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: 0.7rem;
        max-width: 80%;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: 0.75rem;
        max-width: 85%;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 0.7rem;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.6rem;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.5rem;
        max-width: 70%;
    }
`;

const MenuOwnerText = styled.p`
    font-size: 0.9rem;
    padding: 4px 10px;
    margin: 4px 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: 0.65rem;
        padding: 2px 6px;
        margin: 2px 0;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: 0.7rem;
        padding: 3px 7px;
        margin: 3px 0;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: 0.75rem;
        padding: 3px 8px;
        margin: 3px 0;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: 0.8rem;
        padding: 4px 9px;
        margin: 4px 0;
    }

    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 0.7rem;
        padding: 3px 8px;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.6rem;
        padding: 2px 6px;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.55rem;
        padding: 1px 4px;
    }
`;

const WishlistMenuButton = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px 2px;
    border: none;
    background: none;
    font-size: inherit;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        padding: 1px 0;
        font-size: 0.65rem;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        padding: 2px 0;
        font-size: 0.7rem;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        padding: 3px 0;
        font-size: 0.75rem;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        padding: 4px 0;
        font-size: 0.8rem;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 0.8rem;
        padding: 3px 0;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.7rem;
        padding: 2px 0;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.65rem;
        padding: 1px 0;
    }

    &:hover {
        background: rgba(86, 81, 229, 0.1);
        cursor: pointer;
    }
`;

const EventMenuButton = styled.button`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 6px 2px;
    border: none;
    background: none;
    font-size: inherit;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        padding: 2px 0;
        font-size: 0.7rem;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        padding: 3px 0;
        font-size: 0.8rem;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        padding: 4px 0;
        font-size: 0.85rem;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        padding: 5px 0;
        font-size: 0.9rem;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 0.9rem;
        padding: 4px 0;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.8rem;
        padding: 3px 0;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.7rem;
        padding: 2px 0;
    }

    &:hover {
        background: rgba(86, 81, 229, 0.1);
        cursor: pointer;
    }
`;

const TextContainer = styled.div`
    background: rgb(255, 255, 255);
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.9em;

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        padding: 3px 6px;
        font-size: 0.7em;
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        padding: 4px 7px;
        font-size: 0.75em;
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        padding: 4px 8px;
        font-size: 0.8em;
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        padding: 5px 9px;
        font-size: 0.85em;
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: 0.8em;
        padding: 4px 8px;
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: 0.7em;
        padding: 3px 6px;
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: 0.6em;
        padding: 2px 4px;
    }
`;

const WishlistTitle = styled.p<{ inMenu?: boolean }>`
    padding: ${props => props.inMenu ? '12px 6px' : '8px 6px'};
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${props => props.inMenu ? '1.4rem' : '1.1rem'};

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1rem' : '0.8rem'};
        padding: ${props => props.inMenu ? '6px 3px' : '4px 3px'};
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.1rem' : '0.9rem'};
        padding: ${props => props.inMenu ? '8px 4px' : '5px 4px'};
    }
    
    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.2rem' : '1rem'};
        padding: ${props => props.inMenu ? '10px 5px' : '6px 4px'};
    }
  
    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.3rem' : '1.05rem'};
        padding: ${props => props.inMenu ? '12px 6px' : '7px 5px'};
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '1.2rem' : '0.9rem'};
        padding: ${props => props.inMenu ? '10px 5px' : '5px 4px'};
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '1rem' : '0.8rem'};
        padding: ${props => props.inMenu ? '8px 4px' : '4px 3px'};
    } 

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '0.9rem' : '0.7rem'};
        padding: ${props => props.inMenu ? '6px 3px' : '3px 2px'};
    }

    /* Portrait responsive styles */
    @media (max-width: 768px) {
        font-size: ${props => props.inMenu ? '1.3rem' : '1rem'};
    }

    @media (max-width: 480px) {
        font-size: ${props => props.inMenu ? '1.1rem' : '0.9rem'};
    }
`;

const EventTitle = styled.p<{ inMenu?: boolean }>`
    padding: ${props => props.inMenu ? '14px 8px' : '10px 8px'};
    font-weight: bold;
    text-align: center;
    border-bottom: 1px solid #e0e0e0;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: ${props => props.inMenu ? '1.6rem' : '1.3rem'};

    /* Landscape responsive tiers */
    @media (max-width: 600px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.1rem' : '0.9rem'};
        padding: ${props => props.inMenu ? '7px 4px' : '5px 4px'};
    }

    @media (min-width: 601px) and (max-width: 800px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.2rem' : '1rem'};
        padding: ${props => props.inMenu ? '8px 5px' : '6px 5px'};
    }

    @media (min-width: 801px) and (max-width: 1000px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.3rem' : '1.1rem'};
        padding: ${props => props.inMenu ? '9px 6px' : '7px 6px'};
    }

    @media (min-width: 1001px) and (max-width: 1200px) and (orientation: landscape) {
        font-size: ${props => props.inMenu ? '1.4rem' : '1.2rem'};
        padding: ${props => props.inMenu ? '10px 7px' : '8px 7px'};
    }

    /* iPad Air portrait */
    @media (width: 820px) and (height: 1180px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '1.2rem' : '1rem'};
        padding: ${props => props.inMenu ? '8px 5px' : '6px 5px'};
    }

    /* Surface Pro 7 portrait */
    @media (width: 912px) and (height: 1368px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '1.1rem' : '0.9rem'};
        padding: ${props => props.inMenu ? '7px 4px' : '5px 4px'};
    }

    /* Surface Duo unfolded */
    @media (width: 540px) and (height: 720px) and (orientation: portrait) {
        font-size: ${props => props.inMenu ? '1rem' : '0.8rem'};
        padding: ${props => props.inMenu ? '6px 3px' : '4px 3px'};
    }

    /* Portrait responsive styles */
    @media (max-width: 768px) {
        font-size: ${props => props.inMenu ? '1.5rem' : '1.3rem'};
    }

    @media (max-width: 480px) {
        font-size: ${props => props.inMenu ? '1.2rem' : '1rem'};
    }
`;

export const WishlistThumbnail = (props: any) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        if (props.image) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.src = `${props.image}?${new Date().getTime()}`;
        } else {
            setImageLoaded(false);
        }
    }, [props.image]);

    const WishlistOverlayMenu = () => {
        return (
            <WishlistMenu 
                style={imageLoaded ? {
                    background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
                onMouseLeave={props.toggleActive}
            >
                <MenuOwnerText>Creator: {props.owner}</MenuOwnerText>
                <WishlistTitle inMenu title={props.title}>{props.title}</WishlistTitle>
                <WishlistMenuButton onClick={openWishlist}>Open</WishlistMenuButton>
                <WishlistMenuButton onClick={props.edit}>Edit</WishlistMenuButton>
                <WishlistMenuButton onClick={props.share}>Share</WishlistMenuButton>
                <WishlistMenuButton onClick={props.duplicate}>Duplicate</WishlistMenuButton>
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
                            background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#000',
                            textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                        } : {}}
                    >
                        <TextContainer>{props.title}</TextContainer>
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
                        background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#000',
                        textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                    } : {}}
                >
                    <TextContainer>{props.title}</TextContainer>
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
                    background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#000',
                    textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                } : {}}
            >
                <OwnerText>Creator: {props.owner}</OwnerText>
                <TextContainer>{props.title}</TextContainer>
            </WishlistButton>
        )
    }
}

export const EventThumbnail = (props: any) => {
    const [imageLoaded, setImageLoaded] = useState(false);
    
    useEffect(() => {
        if (props.image) {
            const img = new Image();
            img.onload = () => setImageLoaded(true);
            img.src = `${props.image}?${new Date().getTime()}`;
        } else {
            setImageLoaded(false);
        }
    }, [props.image]);

    const EventOverlayMenu = () => {
        return (
            <EventMenu 
                style={imageLoaded ? {
                    background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.8)), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                } : {}}
                onMouseLeave={props.toggleActive}
            >
                <MenuOwnerText>Creator: {props.owner}</MenuOwnerText>
                <EventTitle inMenu title={props.title}>{props.title}</EventTitle>
                <EventMenuButton onClick={openEvent}>Open</EventMenuButton>
                <EventMenuButton onClick={props.edit}>Edit</EventMenuButton>
                <EventMenuButton onClick={props.share}>Share</EventMenuButton>
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
                {props.active == props.title ? 
                    <EventOverlayMenu /> 
                    : 
                    <EventButton 
                        onClick={props.toggleActive}
                        style={imageLoaded ? {
                            background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            color: '#000',
                            textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                        } : {}}
                    >
                        <TextContainer>{props.title}</TextContainer>
                        <Crown />
                    </EventButton>
                }
                </>
            );
        }

        return (
            <>
            {props.active == props.title ? 
                <EventOverlayMenu /> 
                : 
                <EventButton 
                    onMouseEnter={props.toggleActive}
                    style={imageLoaded ? {
                        background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        color: '#000',
                        textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                    } : {}}
                >
                    <TextContainer>{props.title}</TextContainer>
                    <Crown />
                </EventButton>
            }
            </>
        );
    } else {
        return(
            <EventButton 
                onClick={openEvent}
                style={imageLoaded ? {
                    background: `linear-gradient(rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.4)), url(${props.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    color: '#000',
                    textShadow: '0 0 4px rgba(255, 255, 255, 0.8)'
                } : {}}
            >
                <OwnerText>Creator: {props.owner}</OwnerText>
                <TextContainer>{props.title}</TextContainer>
            </EventButton>
        )
    }
}