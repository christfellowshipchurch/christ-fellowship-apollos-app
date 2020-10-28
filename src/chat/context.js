import React from 'react';
import { Keyboard } from 'react-native';

const getContextAwareComponent = (context, originalComponent) => {
  const Context = context;
  const OriginalComponent = originalComponent;
  const ContextAwareComponent = (props) => (
    <Context.Consumer>
      {(c) => <OriginalComponent {...c} {...props} />}
    </Context.Consumer>
  );

  ContextAwareComponent.themePath = OriginalComponent.themePath;
  ContextAwareComponent.extraThemePaths = OriginalComponent.extraThemePaths;
  ContextAwareComponent.displayName =
    OriginalComponent.displayName || OriginalComponent.name || 'Component';
  ContextAwareComponent.displayName = ContextAwareComponent.displayName.replace(
    'Base',
    ''
  );

  return ContextAwareComponent;
};

// ---
export const PlayerContext = React.createContext({});

export function withPlayerContext(OriginalComponent) {
  return getContextAwareComponent(PlayerContext, OriginalComponent);
}

// ---
export const ChatContext = React.createContext({ client: null });

export function withChatContext(OriginalComponent) {
  return getContextAwareComponent(ChatContext, OriginalComponent);
}

// ---
export const TranslationContext = React.createContext({
  t: () => 'Value not found',
});

export function withTranslationContext(OriginalComponent) {
  return getContextAwareComponent(TranslationContext, OriginalComponent);
}

// ---
export const ChannelContext = React.createContext({});

export function withChannelContext(OriginalComponent) {
  return getContextAwareComponent(ChannelContext, OriginalComponent);
}

// ---
export const SuggestionsContext = React.createContext({});

export function withSuggestionsContext(OriginalComponent) {
  return getContextAwareComponent(SuggestionsContext, OriginalComponent);
}

// ---
export const MessageContentContext = React.createContext({});

export function withMessageContentContext(OriginalComponent) {
  return getContextAwareComponent(MessageContentContext, OriginalComponent);
}

// ---
export const KeyboardContext = React.createContext({
  dismissKeyboard: Keyboard.dismiss,
});

export function withKeyboardContext(OriginalComponent) {
  return getContextAwareComponent(KeyboardContext, OriginalComponent);
}
