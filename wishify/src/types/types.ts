export interface Wishlist {
    eventID: number,
    name: string,
    desc: string
};

export interface Event {
    name: string,
    desc: string,
    url: string,
    dateUpdated: string,
    address: string,
    city: string
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
};