import React, { useRef } from 'react';
import { View } from 'react-native';
import PropTypes from 'prop-types';
import { get, isEmpty } from 'lodash';
import Color from 'color';

import RBSheet from 'react-native-raw-bottom-sheet';
import {
    styled,
    BackgroundView,
    PaddedView,
    Icon,
    withTheme,
    ImageSourceType,
    UIText,
    TouchableScale,
} from '@apollosproject/ui-kit';

import DateLabel from '../../ui/DateLabel';

import CoverImageBackground from '../CoverImageBackground';
import Resources from '../Resources';
import MembersFeedConnected from '../MembersFeedConnected';
import HeaderConnected from '../HeaderConnected';
import SummaryConnected from '../SummaryConnected';

const ScheduleView = styled(() => ({
    flexDirection: 'row',
    alignItems: 'center',
}))(View);

const IconView = styled({
    paddingRight: 6,
})(View);

const StyledIcon = withTheme(({ theme }) => ({
    fill: theme.colors.text.tertiary,
}))(Icon);

const Cell = styled(({ theme }) => ({
    paddingBottom: theme.sizing.baseUnit * 0.5,
    flexDirection: 'row',
    justifyContent: 'flex-start',
}))(View);

const CellItem = styled(({ theme, first }) => ({
    marginRight: first ? theme.sizing.baseUnit : 0,
    justifyContent: 'center',
    flex: 1,
}))(View);

const StyledButton = styled(({ theme, disabled, isLoading, isCheckedIn }) => {
    let backgroundColor = theme.colors.primary;

    if (isLoading || disabled)
        backgroundColor = Color(theme.colors.primary)
            .mix(Color(theme.colors.background.screen))
            .hex();

    if (isCheckedIn)
        backgroundColor = Color(theme.colors.success)
            .mix(Color(theme.colors.background.screen))
            .hex();

    return {
        paddingVertical: theme.sizing.baseUnit * 0.25,
        paddingHorizontal: theme.sizing.baseUnit * 0.5,
        marginLeft: 5,
        backgroundColor,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: theme.sizing.baseBorderRadius,
        ...(isLoading ? { width: 75, justifyContent: 'center' } : {}),
    };
})(View);

const ButtonTitle = styled(({ theme }) => ({
    fontSize: 12,
    color: theme.colors.background.screen,
    paddingHorizontal: theme.sizing.baseUnit * 0.25,
}))(UIText);

const ButtonIcon = withTheme(({ theme }) => ({
    size: 16,
    fill: theme.colors.background.screen,
    style: { paddingHorizontal: theme.sizing.baseUnit * 0.25 },
}))(Icon);

const Group = ({ id, content, loading, navigation }) => {
    const refRBSheet = useRef();
    const coverImageSources = get(content, 'coverImage.sources', []);
    const resources = get(content, 'groupResources', []);
    const dateTime = get(content, 'dateTime', {});

    const start = get(dateTime, 'start');

    return (
        <CoverImageBackground isLoading={loading} source={coverImageSources}>
            <HeaderConnected id={id} />

            <BackgroundView>
                <PaddedView vertical={false}>
                    <Cell>
                        {content.dateTime ? (
                            <CellItem first>
                                <ScheduleView>
                                    <IconView>
                                        <StyledIcon isLoading={loading} name="time" size={16} />
                                    </IconView>
                                    <DateLabel
                                        withTime
                                        isLoading={!start && loading}
                                        date={start}
                                    />
                                </ScheduleView>
                            </CellItem>
                        ) : null}

                        <CellItem>
                            <TouchableScale onPress={() => refRBSheet.current.open()}>
                                <StyledButton pill={false}>
                                    <ButtonIcon name={'check'} />
                                    <ButtonTitle bold>{'Check In'}</ButtonTitle>
                                </StyledButton>
                            </TouchableScale>
                        </CellItem>
                    </Cell>

                    <SummaryConnected id={id} />
                </PaddedView>

                <MembersFeedConnected id={id} />

                {!isEmpty(resources) ? (
                    <Resources
                        isLoading={loading}
                        navigation={navigation}
                        resources={resources}
                    />
                ) : null}

                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown
                    closeOnPressMask={false}
                    customStyles={{
                        wrapper: {
                            backgroundColor: 'transparent',
                        },
                        draggableIcon: {
                            backgroundColor: '#000',
                        },
                    }}
                >
                    <UIText>Oh sheet!</UIText>
                </RBSheet>
            </BackgroundView>
        </CoverImageBackground>
    );
};

Group.propTypes = {
    id: PropTypes.string,
    content: PropTypes.shape({
        __typename: PropTypes.string,
        id: PropTypes.string,
        title: PropTypes.string,
        summary: PropTypes.string,
        groupType: PropTypes.string,
        groupResources: PropTypes.arrayOf(
            PropTypes.shape({
                title: PropTypes.string,
                action: PropTypes.string,
                relatedNode: PropTypes.shape({ id: PropTypes.string }),
            })
        ),
        coverImage: ImageSourceType,
    }),
    loading: PropTypes.bool,
};

export default Group;
