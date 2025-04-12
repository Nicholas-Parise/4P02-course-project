import { useEffect, useState } from "react";
import { IdeaItem, Wishlist } from "../types/types";
import React from "react";
import PopularItems from "../components/PopularItems";
import AddIdeaModal from "../components/AddIdeaModal";
import {Alert} from '@mui/material/';

const Ideas = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [ideas, setIdeas] = useState<IdeaItem[]>([]);
    const [addedAlert, setAddedAlert] = useState(false);
    const [loading, setLoading] = useState(true);
    const [trending, setTrending] = useState<IdeaItem[]>([]);
    const [wishlists, setWishlists] = useState<Wishlist[]>([]);
    const [activeItem, setActiveItem] = useState<IdeaItem | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            setToken(localStorage.getItem('token') || '');
            console.log(token);

            const wishlistUrl = "https://api.wishify.ca/wishlists";
            const ideaUrl = "https://api.wishify.ca/ideas";
            const trendingUrl = "https://api.wishify.ca/ideas/trending";

            try {
                // Use Promise.all to fetch all data concurrently
                const [wishlistResponse, ideaResponse, trendingResponse] = await Promise.all([
                    fetch(wishlistUrl, {
                        method: 'get',
                        headers: new Headers({
                            'Authorization': "Bearer " + token,
                        }),
                    }),
                    fetch(ideaUrl, {
                        method: 'get',
                        headers: new Headers({
                            'Authorization': "Bearer " + token,
                        }),
                    }),
                    fetch(trendingUrl, {
                        method: 'get',
                        headers: new Headers({
                            'Authorization': "Bearer " + token,
                        }),
                    }),
                ]);

                // Parse JSON responses
                const wishlistData = await wishlistResponse.json();
                const ideaData = await ideaResponse.json();
                const trendingData = await trendingResponse.json();

                // Update state with fetched data
                setWishlists(wishlistData);
                setIdeas(ideaData.ideas);
                setTrending(trendingData.trending);

                console.log("Wishlists:", wishlistData);
                console.log("Ideas:", ideaData.ideas);
                console.log("Trending:", trendingData.trending);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                // Set loading to false after all requests are complete
                setLoading(false);
            }
        };

        fetchData();
    }, []);



    const getColor = (love: boolean | null) => {
        if (love === null) {
            return "#808080"; // Default color for null
        } else if (love) {
            return "#00FF00"; // Green for true
        } else {
            return "#FF0000"; // Red for false
        }
    };

    const [modalOpen, setModalOpen] = useState(false);

    function addItemToWishlist(wishlistId: number, quantity: number = 1) {
        // Add item to wishlist API call
        setToken(localStorage.getItem('token') || '')
        console.log(token)
        fetch("https://api.wishify.ca/items/", {
            method: 'post',
            headers: new Headers({
                'Authorization': "Bearer "+token,
                'Content-Type': 'application/json'
            }),
            body: JSON.stringify({
                "idea_id": activeItem?.id,
                "wishlists_id": wishlistId,
                "quantity": quantity
            })  
          })
            .then((response) => response.json())
            .then((data) => {
              console.log(data)
              //setLoading(false)
            })
            .catch((error) => {
              //setError(error)
              //setLoading(false)
              console.log(error)
            }
        )
    }
    const handleAddItem = (wishlistID: number, quantity: number) => {
        setAddedAlert(true);
        console.log(wishlistID)
        handleCloseModal();
        addItemToWishlist(wishlistID, quantity);
        //show alert for 2 seconds that says item added to wishlist
        setTimeout(() => {
            setAddedAlert(false);
        }, 2000);
    };
    const handleOpenModal = (item?: IdeaItem) => {
        console.log("Open modal clicked");
        console.log(item);
        setActiveItem(item);
        setModalOpen(true);
    }
    const handleCloseModal = () => {
        setModalOpen(false);
    }

    return (
        <section className="bg-white border-2 border-solid border-[#5651e5] rounded-[25px]">
            <h1 className="text-3xl font-bold text-center text-[#5651e5]">Ideas</h1>
            <PopularItems loading={loading} title={"Trending"} items={trending} tagsEnabled={false} wishlistCountEnabled={true} onAdd={handleOpenModal}/>
            <PopularItems loading={loading} title="AI Recommended For You" items={ideas} tagsEnabled={true} wishlistCountEnabled={false} onAdd={handleOpenModal}/>
            <div className="grid md:grid-cols-4 gap-4 p-4">
                {/*ideas.map((item) => (
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
                ))*/}
                
            </div>
            <AddIdeaModal open={modalOpen} onClose={handleCloseModal} wishlists={wishlists} onAdd={handleAddItem}/>
            <Alert severity="success" sx={{ position: 'fixed', bottom: 20, left: '50%', transform: 'translateX(-50%)', zIndex: 900, opacity: addedAlert ? 1 : 0, transition: addedAlert ? "none" : "opacity 1s ease-out"}}>
                Item added to wishlist!
            </Alert>
        </section>
        
    );
};

export default Ideas;