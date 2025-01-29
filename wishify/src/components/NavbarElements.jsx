import { FaBars } from "react-icons/fa";
import { NavLink as Link } from "react-router-dom";
import styled from "styled-components";
const BarsMaxWidth = "600px";

export const Nav = styled.nav`
    background: #63d471;
    height: 85px;
    width: 100%;
    display: flex;
    z-index: 12;
    gap: 1vw;
    justify-content: space-between; 
`;

export const NavLink = styled(Link)`
    color: #808080;
    display: flex;
    align-items: center;
    text-decoration: none;
    padding: 0 1rem;
    height: 100%;
    cursor: pointer;
    &.active {
        color: #000000;
    }
`;

export const Bars = styled(FaBars)`
    display: none;
    color: #808080;
    @media screen and (max-width: ${BarsMaxWidth}) {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        transform: translate(-100%, 75%);
        font-size: 1.8rem;
        cursor: pointer;
    }
`;

export const NavMenu = styled.div`
    display: flex;
    justify-content: space-between;
    justify-self: center;
    align-items: flex-start;
    @media screen and (max-width: ${BarsMaxWidth}) {
        display: none;
    }
`;

export const NavNameLabel = styled.p`
    align-self: center; 
    margin-right: 2vw;
    @media screen and (max-width: ${BarsMaxWidth}) {
        display: none;
    }
`

export const NavBtn = styled.nav`
    display: flex;
    align-items: center;
    margin-right: 24px;
    @media screen and (max-width: ${BarsMaxWidth}) {
        display: none;
    }
`;

export const NavBtnLink = styled(Link)`
    border-radius: 4px;
    background: #808080;
    padding: 10px 22px;
    color: #000000;
    outline: none;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    text-decoration: none;
    margin-left: 24px;
    &:hover {
        transition: all 0.2s ease-in-out;
        background: #fff;
        color: #808080;
    }
`;