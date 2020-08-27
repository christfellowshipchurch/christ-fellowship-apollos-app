import ApollosConfig from '@apollosproject/config';
import { StreamChat } from 'stream-chat';

const apiKey = ApollosConfig.STREAM_CHAT_API_KEY;
const client = new StreamChat(apiKey);

export default client;
