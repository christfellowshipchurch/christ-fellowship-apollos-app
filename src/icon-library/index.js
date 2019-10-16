import { library } from '@fortawesome/fontawesome-svg-core'
import { forEach } from 'lodash'
import {
    faHome,
    faCog,
    faUser,
    faThLarge,
    faAngleLeft,
    faText,
    faCheckCircle,
    faTimesCircle,
    faBan,
    faAngleDown,
    faEllipsisV,
    faLock,
    faCalendarAlt,
    faBirthdayCake,
    faMapMarkedAlt,
    faMapMarkerAlt,
    faAngleRight,
    faUsers,
    faEnvelope,
    faBible,
    faMobile,
    faSearch,
    faBars,
    faLink,
    faInfoCircle,
    faVideo,
    faUserFriends,
    faBook,
    faQuestionCircle,
    faExternalLinkSquare,
    faCircle
} from '@fortawesome/pro-light-svg-icons'

// load desired icons in an array to not overload the library with more
// icons than needed (for performance)
const icons = [
    faHome,
    faCog,
    faUser,
    faThLarge,
    faAngleLeft,
    faText,
    faCheckCircle,
    faTimesCircle,
    faBan,
    faAngleDown,
    faAngleRight,
    faEllipsisV,
    faLock,
    faCalendarAlt,
    faBirthdayCake,
    faMapMarkedAlt,
    faMapMarkerAlt,
    faUsers,
    faEnvelope,
    faBible,
    faMobile,
    faSearch,
    faBars,
    faLink,
    faInfoCircle,
    faVideo,
    faUserFriends,
    faBook,
    faQuestionCircle,
    faExternalLinkSquare,
    faCircle
]

library.add(...icons)

// iterate over each icon and add it to the library
// forEach(icons, n => library.add(n))