import { useEffect, useState } from "react";
import { IdeaItem, Wishlist } from "../types/types";
import PopularItems from "../components/PopularItems";
import AddIdeaModal from "../components/AddIdeaModal";
import { Alert, Divider } from '@mui/material';

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
                // randomly choose 4 items from trendingData sorted by uses
                let randomTrending = trendingData.trending.sort(() => 0.5 - Math.random()).slice(0, 4);
                randomTrending = randomTrending.sort((a: IdeaItem, b: IdeaItem) => (b.uses || 0) - (a.uses || 0));

                // Update state with fetched data
                setWishlists(wishlistData.filter((wishlist: Wishlist) => wishlist.owner));
                setIdeas(ideaData.ideas);
                setTrending(randomTrending);

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

    const [modalOpen, setModalOpen] = useState(false);

    function addItemToWishlist(wishlistId: number, quantity: number = 1) {
        // Add item to wishlist API call
        setToken(localStorage.getItem('token') || '')
        //console.log(token)
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
        <section className="bg-white rounded-[25px] shadow-lg max-w-7xl border-2 border-[#5651e5]" style={{ marginTop: "30px" }}>

            {/* Trending Section */}
            <div className="mb-10">
                <PopularItems 
                    addButtonsEnabled={true} 
                    bgColor={"#fff"} 
                    loading={loading} 
                    title={"Trending Now"} 
                    subtitle="Most popular ideas this week"
                    items={trending} 
                    tagsEnabled={false} 
                    wishlistCountEnabled={true} 
                    onAdd={handleOpenModal}
                />
            </div>
            
            {/* Divider */}
            <Divider 
                sx={{ 
                    my: 6, 
                    borderColor: '#5651e5', 
                    borderWidth: 1,
                }} 
            />
            
            {/* Recommendations Section */}
            <div className="mt-10">
                <PopularItems 
                    addButtonsEnabled={true} 
                    bgColor={"#fff"} 
                    loading={loading} 
                    title="Recommended for You" 
                    subtitle="Personalized suggestions based on your preferences"
                    items={ideas} 
                    tagsEnabled={true} 
                    wishlistCountEnabled={false} 
                    onAdd={handleOpenModal}
                />
            </div>
            
            <AddIdeaModal 
                open={modalOpen} 
                onClose={handleCloseModal} 
                wishlists={wishlists} 
                onAdd={handleAddItem}
            />
            
            <Alert 
                severity="success" 
                sx={{ 
                    position: 'fixed', 
                    bottom: 20, 
                    left: '50%', 
                    transform: 'translateX(-50%)', 
                    zIndex: 900, 
                    opacity: addedAlert ? 1 : 0, 
                    transition: addedAlert ? "none" : "opacity 1s ease-out",
                    backgroundColor: '#5651e5',
                    color: 'white',
                    '& .MuiAlert-icon': {
                        color: 'white'
                    }
                }}
            >
                Item added to wishlist!
            </Alert>
        </section>
    );
};

export default Ideas;
