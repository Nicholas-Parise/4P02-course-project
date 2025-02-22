export interface Wishlist {
    eventID: number,
    name: string,
    desc: string
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
    desc: string,
    url: string,
    imageSrc: string,
    quantity: number,
    quantitySupplied: number
    dateUpdated: string,
    contributions: Contribution[]
};

export interface Contribution{
    user: string,
    quantity: number
}