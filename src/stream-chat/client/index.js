import ApollosConfig from '@apollosproject/config';
import { StreamChat } from 'stream-chat';
import { Streami18n as CoreStreami18n } from 'stream-chat-react-native';

const apiKey = ApollosConfig.STREAM_CHAT_API_KEY;
export const StreamChatClient = new StreamChat(apiKey);

export const Streami18n = new CoreStreami18n({ language: 'en' });
