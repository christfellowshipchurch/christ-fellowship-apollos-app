import { withTheme, H4, H6 } from '@apollosproject/ui-kit';

export const Summary = withTheme(({ theme }) => ({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
  style: {
    fontWeight: 'normal',
    color: theme.colors.text.secondary,
  },
}))(H6);

export const Title = withTheme(({ theme }) => ({
  numberOfLines: 2,
  ellipsizeMode: 'tail',
  style: {
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
}))(H4);
