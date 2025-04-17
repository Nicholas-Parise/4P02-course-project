export interface Wishlist {
    id: number,
    name: string,
    event_id: number,
    description: string,
    image: string
    blind?: boolean,
    owner?: boolean,
    share_token?: string,
    deadline?: string,
    creator_displayname?: string,
    creator_id?: number
};

export interface Event {
    id: number,
    name: string,
    description: string,
    url: string,
    owner?: boolean,
    addr: string,
    city: string,
    deadline: string,
    image: string,
    dateUpdated: string,
    dateCreated: string,
    creator_id: number,
    creator_displayname: string,
    share_token: string
};

export interface WishlistItem {
    id: number,
    priority: number,
    price: number,
    name: string,
    description: string,
    url: string,
    image: string,
    picture: File,
    quantity: number,
    quantitySupplied: number
    dateupdated: string,
    datecreated: string,
    contributions: Contribution[]
};

export interface IdeaItem {
    id: number,
    match_rating: number,
    name: string,
    image: string,
    sponsor: boolean,
    price: string,
    rating?: string,
    wishlistCount?: number,
    uses: number
}

export interface Contribution {
    id: number,
    item_id: number,
    user_id: number,
    user_displayname: string,
    picture: string,
    pro: boolean,
    quantity: number,
    purchased: boolean,
    note: string,
    dateUpdated: string,
    dateCreated: string
}

export interface Member {
    blind: boolean,
    displayname: string,
    email: string,
    id: number,
    owner: boolean,
    pro: boolean,
    picture: string
}

export interface User {
    id: number,
    email: string,
    displayname: string,
    bio: string,
    picture: string,
    pro: boolean,
    setup: boolean,
    notifications: boolean,
    datecreated: string,
    dateupdated: string
}

export interface Notification {
    id: number,
    title: string,
    body: string,
    url: string,
    is_read: boolean,
    created: string
}