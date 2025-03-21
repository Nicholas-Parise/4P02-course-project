export interface Wishlist {
    id: number,
    name: string,
    eventID: number,
    desc: string,
    image: string
};

export interface Event {
    id: number,
    name: string,
    desc: string,
    url: string,
    addr: string,
    city: string,
    image: string,
    dateUpdated: string,
    dateCreated: string
};

export interface WishlistItem {
    id: number,
    priority: number,
    price: number,
    name: string,
    description: string,
    url: string,
    image: string,
    quantity: number,
    quantitySupplied: number
    dateupdated: string,
    datecreated: string,
    contributions: Contribution[]
};

export interface Contribution{
    id: number,
    item_id: number,
    user_id: number,
    user_displayname: string,
    quantity: number,
    purchased: boolean,
    note: string,
    dateUpdated: string,
    dateCreated: string
}