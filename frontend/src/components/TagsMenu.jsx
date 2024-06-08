import React, {useEffect, useState} from "react";
import "./Menu.scss"
import useAxios from "../utils/useAxios";
import {jwtDecode} from "jwt-decode";
import "./TagsMenu.scss";

function TagsMenu({active, setActive, setTags, restaurant, canEdit})  {
    const api = useAxios();
    const token = localStorage.getItem("authTokens");
    const decode = jwtDecode(token);
    const [loading, setLoading] = useState(true);
    const [allTags, setAllTags] = useState([])
    const [tagsCheckBox, setTagsCheckBox] = useState([]);
    const [tagsIdCheckBox, setTagsIdCheckBox] = useState([]);

    useEffect( () => {
        setLoading(true);

        const getTags = async () => {
            const response = await api.get("/tag/");
            setAllTags(response.data);
        };

        getTags().catch((error) => {
             console.log(error);
        });

        setLoading(false);

    }, []);

    const handleChange = (e, tag) => {
        const { value, checked } = e.target;
        if (checked) {
            setTagsCheckBox([...tagsCheckBox, tag.name]);
            setTagsIdCheckBox([...tagsIdCheckBox, tag.id]);
        }
        else {
            setTagsCheckBox(tagsCheckBox.filter((e) => e !== tag));
            setTagsIdCheckBox(tagsIdCheckBox.filter((e) => e !== tag));
        }

    }


    const handleSubmit = (e) => {
        e.preventDefault();
        setTags(tagsCheckBox.join(';'));
        setActive(false);

        const postTags = async () => {

            const response = await api.post("/restaurant/" + restaurant.id + "/tag-put/", {
                tags: tagsIdCheckBox
            });
            setAllTags(response.data);
        };


        if (canEdit) {
            postTags().catch((error) => {
                console.log(error);
            });

        }
    }


    if (loading) {
        return (<div>
        </div>)
    }
    return (
        <div>
            <div className={active ? 'tags-menu active' : 'tags-menu'} onClick={() => setActive(false)}>
                <div className={active ? 'tags-menu__content active' : 'tags-menu__content'}
                     onClick={e => e.stopPropagation()}>
                    <h1>Тэги:</h1>
                    <form onSubmit={handleSubmit}>
                        <ul>
                            {
                                Object.entries(allTags).map((tagGroup) => (
                                    <li>
                                        <ul>
                                            <h3>{tagGroup[0]}</h3>
                                            {
                                                tagGroup[1].map((tag) => (
                                                    <li key={tag.id}>
                                                        {tag.name} <input id={tag.id}
                                                                          name="checkbox"
                                                                          type="checkbox"
                                                                          value={tag}
                                                                          onChange={(e) => handleChange(e, tag)}/>
                                                    </li>
                                                ))
                                            }
                                        </ul>
                                    </li>
                                ))
                            }
                        </ul>
                        <button type="submit">Применить</button>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default TagsMenu;