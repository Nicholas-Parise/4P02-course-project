import { useEffect, useState } from "react";
import { IdeaItem, Tag } from "../types/types";
import React from "react";
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import PopularItems from "../components/PopularItems";

const Ideas = () => {
    const [token, setToken] = useState<string>(localStorage.getItem('token') || '')
    const [ideas, setIdeas] = useState<IdeaItem[]>([]);
    // fetch ideas data from API
    const ideaUrl = "https://api.wishify.ca/ideas";
    useEffect(() => {
        setToken(localStorage.getItem('token') || '')
        console.log(token)
        fetch(ideaUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer "+token
            })
          })
            .then((response) => response.json())
            .then((data) => {
              let ideas = data.ideas;
              setIdeas(ideas);
              //setLoading(false)
            })
            .catch((error) => {
              //setError(error)
              //setLoading(false)
              console.log(error)
            })
            //.finally(() => setLoading(false))
    }, []);
    // fetch trending data from API
    const trendingUrl = "https://api.wishify.ca/ideas/trending";
    const [trending, setTrending] = useState<IdeaItem[]>([]);
    useEffect(() => {
        setToken(localStorage.getItem('token') || '')
        console.log(token)
        fetch(trendingUrl, {
            method: 'get',
            headers: new Headers({
              'Authorization': "Bearer "+token
            })
          })
            .then((response) => response.json())
            .then((data) => {
              let trending = data.trending;
              setTrending(trending);
              //setLoading(false)
            })
            .catch((error) => {
              //setError(error)
              //setLoading(false)
              console.log(error)
            })
            //.finally(() => setLoading(false))
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

    return (
        <section className="bg-white border-2 border-solid border-[#5651e5] rounded-[25px]">
            <h1 className="text-3xl font-bold text-center text-[#5651e5]">Ideas</h1>
            <PopularItems title={"Trending"} items={trending} tagsEnabled={false} wishlistCountEnabled={true}/>
            <div className="grid md:grid-cols-4 gap-4 p-4">
                {/*trending.map((item) => (
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
                ))*/}
            </div>
            <PopularItems title="AI Recommended For You" items={ideas} tagsEnabled={true} wishlistCountEnabled={false}/>
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
        </section>
    );
};

export default Ideas;