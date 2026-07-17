import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import axios from 'axios';
import LoadingStatus from './LoadingStatus';

type StoryNode = {
  id: number;
  content: string;
  is_ending: boolean;
  is_winning_ending: boolean;
  options: { text: string; node_id: number | null }[];
};

type Story = {
  id: number;
  title: string;
  created_at: string;
  root_node: StoryNode;
  all_nodes: Record<number, StoryNode>;
};

const API_BASE_URL = "/api"

function StoryLoader() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [story, setStory] = useState< Story | null >(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState< string | null >(null);

    useEffect(() => { loadStory(Number(id)); }, [id]);

    const loadStory = async (storyId: number) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.get(`${API_BASE_URL}/stories/${storyId}/complete`);
            setStory(response.data);
        } catch (err) {
            if (axios.isAxiosError(err) && err.response?.status === 404) {
                setError("Story is not found.");
            } else {
                setError("Failed to load story.");
            }
        } finally {
            setLoading(false);
        }
    }

    const createNewStory = () => {
        navigate("/");
    }

    if (loading) {
        return <LoadingStatus theme={"story"} />
    }

    if (error) {
        return (
        <div className='story-loader'>
            <div className='error-message'>
                <h2>Story Not Found.</h2>
                <p>{error}</p>
                <button onClick={createNewStory}>Go to Story Generator</button>
            </div>
        </div>
        )
    }

    if (story) {
        return (
            <div className='story-loader'></div> // TODO
        )
    }
}

export default StoryLoader;