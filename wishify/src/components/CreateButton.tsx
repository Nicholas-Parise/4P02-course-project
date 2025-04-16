import styled from "@emotion/styled";


const CreateWishlistButton = styled.button<{isDisabled?: boolean}>`
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    transition: background 0.3s;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        background: ${({ isDisabled }) =>
            isDisabled
                ? "linear-gradient(to right, #8d8aee, #5651e5);" // Keep disabled gradient
                : "linear-gradient(to right, #5651e5, #343188)"};
        transform: ${({ isDisabled }) => (isDisabled ? "none" : "scale(1.05)")};
        cursor: ${({ isDisabled }) => (isDisabled ? "not-allowed" : "pointer")};
    }
`

const CreateEventButton = styled.button`
    background: linear-gradient(to right, #8d8aee, #5651e5);
    color: white;
    border-radius: 25px;
    padding: 20px;
    width: 200px;
    height: 200px;
    transition: background 0.3s;
    @media screen and (max-width: 440px){
        width: 150px;
        height: 150px;
    }
    &:hover {
        background: linear-gradient(to right, #5651e5, #343188);
        transform: scale(1.05);
        cursor: pointer;
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
