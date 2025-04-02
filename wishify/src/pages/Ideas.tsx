import { useEffect } from "react";
import { IdeaItem, Tag } from "../types/types";
import React from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';

const Ideas = () => {

    const shirt: Tag = {
        name: "Shirts",
        love: true
    };
    const rollerCoaster: Tag = {
        name: "Roller Coasters",
        love: true
    };
    const electronics: Tag = {
        name: "Electronics",
        love: true
    };
    const keyboards: Tag = {
        name: "Keyboards",
        love: true
    };
    const gaming: Tag = {
        name: "Gaming",
        love: true
    };
    const accessories: Tag = {
        name: "Accessories",
        love: null
    };
    const wallets: Tag = {
        name: "Wallets",
        love: false
    };
    const music: Tag = {
        name: "Music",
        love: true
    };
    const vinyl: Tag = {
        name: "Vinyl",
        love: true
    };
    const outdoor: Tag = {
        name: "Outdoor",
        love: false
    };
    const charging: Tag = {
        name: "Charging",
        love: null
    };
    const handmade: Tag = {
        name: "Handmade",
        love: null
    };
    const mugs: Tag = {
        name: "Mugs",
        love: null
    };
    const books: Tag = {
        name: "Books",
        love: true
    };
    const programming: Tag = {
        name: "Programming",
        love: true
    };
    const computerScience: Tag = {
        name: "Computer Science",
        love: true
    };
    const space: Tag = {
        name: "Space",
        love: true
    };
    const hoodies: Tag = {
        name: "Hoodies",
        love: null
    };
    const toxic: Tag = {
        name: "Toxic",
        love: false
    };
    const hate: Tag = {
        name: "Hate",
        love: false
    };
    const good: Tag = {
        name: "Good",
        love: true
    };
    const love: Tag = {
        name: "Love",
        love: true
    };
    // delete when API is ready
    const ideas: IdeaItem[] = [
        {
            id: 1,
            match_rating: 1,
            name: "Pheonix Wooden Coaster T-Shirt",
            tags: [shirt, rollerCoaster],
            image: "https://ih1.redbubble.net/image.1830814849.1212/ssrco,slim_fit_t_shirt,flatlay,101010:01c5ca27c6,front,wide_portrait,750x1000-bg,f8f8f8.jpg",
            sponsor: "Knoebels Amusement Resort"
        },
        {
            id: 2,
            match_rating: 0.9,
            name: "Cyberpunk LED Keyboard",
            tags: [electronics, keyboards, gaming],
            image: "",
            sponsor: "Illogitech"
        },
        {
            id: 3,
            match_rating: 0.7,
            name: "Minimalist Leather Wallet",
            tags: [accessories, wallets],
            image: "",
            sponsor: "The Edge Wallet"
        },
        {
            id: 4,
            match_rating: 1,
            name: "Vintage Vinyl Record Player",
            tags: [music, vinyl, electronics],
            image: "",
            sponsor: null
        },
        {
            id: 5,
            match_rating: 0.85,
            name: "NASA Logo Hoodie",
            tags: [space, hoodies],
            image: "",
            sponsor: "NASA"
        },
        {
            id: 6,
            match_rating: 0.95,
            name: "Mechanical Gaming Mouse",
            tags: [electronics, gaming],
            image: "",
            sponsor: null
        },
        {
            id: 7,
            match_rating: 0.75,
            name: "Handmade Ceramic Coffee Mug",
            tags: [mugs, handmade],
            image: "",
            sponsor: null
        },
        {
            id: 8,
            match_rating: 1,
            name: "The Art of Computer Programming (Book Set)",
            tags: [books, programming, computerScience],
            image: "",
            sponsor: null
        },
        {
            id: 9,
            match_rating: 0.8,
            name: "Portable Solar Power Bank",
            tags: [electronics, charging, outdoor],
            image: "",
            sponsor: null
        },
        {
            id: 10,
            match_rating: 0.2,
            name: "Racism",
            tags: [toxic, hate],
            image: "",
            sponsor: "Racism Inc."
        },
        {
            id: 11,
            match_rating: 0.1,
            name: "War",
            tags: [toxic, hate],
            image: "",
            sponsor: null
        },
        {
            id: 12,
            match_rating: 0.89,
            name: "Peace and Love",
            tags: [good, love],
            image: "",
            sponsor: "Ringo Starr"
        },
    ];

    const trending: IdeaItem[] = [
        {
            id: 1,
            match_rating: 1,
            name: "PS5 Console",
            tags: [gaming, electronics],
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdHG_9JDYt5Xr8gaLDchcGIhjjdAkE5m8U5A&s",
            sponsor: null
        },
    ]

    const getColor = (love: boolean | null) => {
        if (love === null) {
            return "#808080"; // Default color for null
        } else if (love) {
            return "#00FF00"; // Green for true
        } else {
            return "#FF0000"; // Red for false
        }
    };

    var sortedIdeas = ideas.sort((a, b) => b.match_rating - a.match_rating);
    return (
        <section className="bg-white border-2 border-solid border-[#5651e5] rounded-[25px]">
            <h1 className="text-3xl font-bold text-center text-[#5651e5]">Ideas</h1>
            <h1>
                Trending
            </h1>
            <div className="grid md:grid-cols-4 gap-4 p-4">
                {trending.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg shadow-md p-4 text-center">
                        <div className="flex flex-col h-full flex-grow relative">
                            <img src={item.image || "/assets/placeholder-item.png"} alt={item.name} className="mx-auto max-w-32 max-h-32 rounded-lg mb-4" />
                            <h2 className="mt-auto text-xl font-semibold">{item.name}</h2>
                            <p className="text-gray-600 text-sm">{item.sponsor ? `Sponsored by ${item.sponsor}` : null}</p>
                            <Fab className="-top-2 -right-2" sx={{position: "absolute", width: "40px", height: "40px", zIndex: 0}} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                ))}
            </div>
            <h1>
                AI Recommended Gifts For You
            </h1>
            <div className="grid md:grid-cols-4 gap-4 p-4">
                {ideas.map((item) => (
                    <div key={item.id} className="bg-white border rounded-lg shadow-md p-4 text-center">
                        <div className="flex flex-col h-full flex-grow relative">
                            <img src={item.image || "/assets/placeholder-item.png"} alt={item.name} className="mx-auto max-w-32 max-h-32 rounded-lg mb-4" />
                            <h2 className="mt-auto text-xl font-semibold">{item.name}</h2>
                            <p className="text-gray-600 text-sm">{item.sponsor ? `Sponsored by ${item.sponsor}` : null}</p>
                            <ul className="absolute -top-4 -left-4 flex flex-col items-start">
                                {item.tags.map((tag, index) => (
                                    <li
                                        key={index}
                                        className="text-white text-sm font-medium py-1 px-2 rounded mb-1"
                                        //style={{ backgroundColor: item.gradients[index % item.gradients.length] }}
                                        style={{ backgroundColor: getColor(item.tags[index % item.tags.length].love) }}
                                    >
                                        {tag.name}
                                    </li>
                                ))}
                            </ul>
                            <Fab className="-top-2 -right-2" sx={{position: "absolute", width: "40px", height: "40px"}} color="primary" aria-label="add">
                                <AddIcon />
                            </Fab>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Ideas;