import styled from "@emotion/styled";


const CreateWishlistButton = styled.button<{isDisabled?: boolean}>`
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 15px;
    width: 100%;
    aspect-ratio: 1/1;
    transition: all 0.3s;
    font-size: 1.5rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  
    &:hover {
        background: ${({ isDisabled }) =>
            isDisabled
                ? "linear-gradient(to right, #8d8aee, #5651e5);" // Keep disabled gradient
                : "linear-gradient(to right, #5651e5, #343188)"};
        transform: ${({ isDisabled }) => (isDisabled ? "none" : "scale(1.05)")};
        cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
    }

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }

    @media (max-width: 480px) {
        font-size: 1.6rem;
        padding: 12px;
    }

    @media (max-width: 900px) and (orientation: landscape) {
        font-size: 1.2rem;
        padding: 10px;
    }
`

const CreateEventButton = styled.button`
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 15px;
    width: 100%;
    aspect-ratio: 1/1;
    transition: all 0.3s;
    font-size: 1.5rem;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
  
    &:hover {
        background: linear-gradient(to right, #5651e5, #343188);
        transform: scale(1.05);
        cursor: pointer;
    }

    @media (max-width: 768px) {
        font-size: 1.6rem;
    }

    @media (max-width: 480px) {
        font-size: 1.6rem;
        padding: 12px;
    }
    
    @media (max-width: 900px) and (orientation: landscape) {
        font-size: 1.2rem;
        padding: 10px;
    }
`

export const CreateWishlist = (props: any) => {
    if(!props.disabled){
        return(
            <CreateWishlistButton isDisabled={false} onClick={props.addThumbnail}>{props.children}</CreateWishlistButton>
        )
    } else {
        return(
            <CreateWishlistButton isDisabled={true} onClick={props.addThumbnail}>{props.children}</CreateWishlistButton>
        )
    }
}

export const CreateEvent = (props: any) => {
    return(
        <CreateEventButton onClick={props.addThumbnail}>{props.children}</CreateEventButton>
    )
}