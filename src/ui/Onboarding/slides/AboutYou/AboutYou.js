import React, { memo } from 'react';
import { Image, View } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import { get } from 'lodash';

import {
  styled,
  H2,
  H5,
  Radio,
  RadioButton,
  H6,
  DateInput,
  FlexedView,
  PaddedView,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const Content = styled({
  justifyContent: 'center',
})(FlexedView);

const StyledImage = styled(({ theme }) => ({
  flex: 2,
  resizeMode: 'contain',
  marginBottom: theme.sizing.baseUnit * 2,
}))(Image);

const TextContent = styled({
  flex: 1,
  justifyContent: 'center',
})(PaddedView);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
  marginBottom: theme.sizing.baseUnit * 0.5,
}))(H2);

const Description = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
  marginBottom: theme.sizing.baseUnit,
}))(H5);

const Label = styled({
  color: 'gray',
  opacity: 0.7,
})(H6);

const StyledDate = styled(({ theme }) => ({
  marginTop: 0,
  marginBottom: theme.sizing.baseUnit,
}))(DateInput);

const StyledRadio = styled(({ theme }) => ({
  marginBottom: theme.sizing.baseUnit,
  flexDirection: 'row',
}))(Radio);

const RadioLabel = styled(({ theme }) => ({
  marginLeft: theme.sizing.baseUnit * 0.5,
}))(H5);

const AboutYou = memo(
  ({
    onPressPrimary,
    imgSrc,
    slideTitle,
    description,
    defaultDate,
    genderList,
    values,
    touched,
    errors,
    setFieldValue,
    ...props
  }) => (
    <Slide onPressPrimary={onPressPrimary} {...props}>
      <Content>
        {imgSrc ? <StyledImage source={imgSrc} /> : null}
        <TextContent>
          <Title>{slideTitle}</Title>
          <Description>{description}</Description>
          <View>
            <Label>Gender</Label>
            <StyledRadio
              label="Gender"
              type="radio"
              value={get(values, 'gender')}
              error={get(touched, 'gender') && get(errors, 'gender')}
              onChange={(value) => setFieldValue('gender', value)}
            >
              {genderList.map((gender) => [
                <RadioButton
                  key={gender}
                  value={gender}
                  label={() => <RadioLabel>{gender}</RadioLabel>}
                  underline={false}
                />,
              ])}
            </StyledRadio>
          </View>
          <View>
            <Label>Birthday</Label>
            <StyledDate
              type={'DateInput'}
              placeholder={'Select a date...'}
              value={moment
                .utc(get(values, 'birthDate', defaultDate) || defaultDate)
                .toDate()}
              error={get(touched, 'birthDate') && get(errors, 'birthDate')}
              displayValue={moment(
                get(values, 'birthDate', defaultDate) || defaultDate
              ).format('MM/DD/YYYY')}
              onChange={(value) => setFieldValue('birthDate', value)}
            />
          </View>
        </TextContent>
      </Content>
    </Slide>
  )
);

AboutYou.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  setFieldValue: PropTypes.func.isRequired,
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  imgSrc: Image.propTypes,
  defaultDate: PropTypes.instanceOf(Date),
  genderList: PropTypes.arrayOf(PropTypes.number),
  values: PropTypes.shape({}),
  touched: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  onPressPrimary: PropTypes.func,
};

AboutYou.defaultProps = {
  slideTitle: "This one's easy.",
  description:
    'Help us understand who you are so we can connect you with the best ministries and events.',
  genderList: ['Male', 'Female'],
  defaultDate: new Date(),
};

AboutYou.displayName = 'AboutYou';

export default AboutYou;
