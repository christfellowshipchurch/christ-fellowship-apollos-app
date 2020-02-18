import Color from 'color';
import dark from './dark-theme';

/* Add your custom theme definitions below. Anything that is supported in UI-Kit Theme can be
 overridden and/or customized here! */

/* Base colors.
 * These get used by theme types (see /types directory) to color
 * specific parts of the interface. For more control on how certain
 * elements are colored, go there. The next level of control comes
 * on a per-component basis with "overrides"
 */
// const colors = {};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
// const typography = {};

/* Responsive breakpoints */
// export const breakpoints = {};

/* Base sizing units. These are used to scale
 * space, and size components relatively to one another.
 */
// export const sizing = {};

/* Base alpha values. These are used to keep transparent values across the app consistant */
// export const alpha = {};

/* Base overlays. These are used as configuration for LinearGradients across the app */
// export const overlays = () => ({});

/* Overrides allow you to override the styles of any component styled using the `styled` HOC.
 * For example, this component:
 * const SomeComponent = styled({ margin: 10, padding: 20 }, 'SomeComponent');
 * can have its styles overriden by including in overrides:
 * {
 *   overides: {
 *     SomeComponent: {
 *       margin: 5,
 *       padding: 15,
 *     },
 *   },
 * }
 */

const colors = {
    primary: '#00aeef',
    secondary: '#000',
    alert: '#d52158',
    success: '#1ec27f',
    warning: '#e09541',
};

/* Base Typography sizing and fonts.
 * To control speicfic styles used on different type components (like H1, H2, etc), see "overrides"
 */
const typography = {
    baseFontSize: 16,
    baseLineHeight: 23.04, // 1.44 ratio
    sans: {
        regular: {
            default: 'Gotham-Book',
            italic: 'Gotham-BookItalic',
        },
        medium: {
            default: 'Gotham-Medium',
            italic: 'Gotham-MediumItalic',
        },
        bold: {
            default: 'Gotham-Bold',
            italic: 'Gotham-BoldItalic',
        },
        black: {
            default: 'Gotham-Black',
            italic: 'Gotham-BlackItalic',
        },
    },
};

const overlays = ({ alpha: themeAlpha, colors: themeColors }) => ({
    'gradient-bottom-short': ({ overlayColor }) => ({
        colors: [
            `${Color(overlayColor)
                .alpha(themeAlpha.low)
                .string()}`,
            `${Color(overlayColor)
                .alpha(themeAlpha.high)
                .string()}`,
        ],
        start: { x: 0, y: 0.6 },
        end: { x: 0, y: 1 },
        locations: [0, 0.6],
    }),
    'gradient-none': ({ overlayColor }) => ({
        colors: ['transparent'],
        start: { x: 0, y: 1 },
        end: { x: 0, y: 1 },
        locations: [0, 1],
    }),
    'gradient-user-profile': ({ overlayColor }) => ({
        colors: [
            `${Color(overlayColor)
                .alpha(0.25)
                .string()}`,
            `${Color(overlayColor)
                .alpha(0.6)
                .string()}`,
            `${Color(overlayColor)
                .alpha(0.87)
                .string()}`,
        ],
        start: { x: 0, y: 0 },
        end: { x: 0, y: 1 },
        locations: [0, 0.7, 1],
    }),
});

const sizing = {
    baseBorderRadius: 8,
    avatar: {
        small: 32,
        medium: 80,
        large: 150,
    },
};

const types = { dark };

export default {
    colors,
    typography,
    overlays,
    sizing,
    types,
};
