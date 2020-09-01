import ApollosConfig from '@apollosproject/config';
import { StreamChat } from 'stream-chat';
import { Streami18n } from 'stream-chat-react-native';

const apiKey = ApollosConfig.STREAM_CHAT_API_KEY;
const client = new StreamChat(apiKey);

export const streami18n = new Streami18n({ language: 'en' });

export default client;
