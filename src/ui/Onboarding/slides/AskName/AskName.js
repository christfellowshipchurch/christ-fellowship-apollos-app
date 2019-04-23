import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';

import {
  styled,
  withTheme,
  Icon,
  H2,
  H5,
  PaddedView,
  TextInput,
} from '@apollosproject/ui-kit';

import Slide from '../../Slide';

const BrandIcon = withTheme(({ theme }) => ({
  name: 'brand-icon',
  size: theme.sizing.baseUnit * 3.0,
  fill: theme.colors.primary,
  style: {
    marginTop: theme.sizing.baseUnit * 2,
    marginBottom: theme.sizing.baseUnit * 0.5,
  },
}))(Icon);

const Title = styled(({ theme }) => ({
  color: theme.colors.primary,
}))(H2);

const StyledH5 = styled(({ theme }) => ({
  color: theme.colors.text.secondary,
}))(H5);

// memo = sfc PureComponent 💥
// eslint-disable-next-line react/display-name
const AskName = memo(
  ({
    onPressPrimary,
    slideTitle,
    description,
    firstName,
    lastName,
    values,
    touched,
    errors,
    setFieldValue,
    ...props
  }) => {
    let LastNameInput = null;

    return (
      <Slide onPressPrimary={onPressPrimary} {...props}>
        <PaddedView vertical={false}>
          <BrandIcon />
          <Title>{slideTitle}</Title>
          <StyledH5>{description}</StyledH5>
          <TextInput
            label={'First Name'}
            type={'text'}
            textContentType={'givenName'} // ios autofill
            returnKeyType={'next'}
            value={get(values, 'firstName')}
            error={
              get(touched, 'firstName', false) && get(errors, 'firstName', null)
            }
            onChangeText={(text) => setFieldValue('firstName', text)}
            onSubmitEditing={() => LastNameInput.focus()}
            enablesReturnKeyAutomatically
          />
          <TextInput
            label={'Last Name'}
            type={'text'}
            textContentType={'familyName'} // ios autofill
            returnKeyType={'next'}
            value={get(values, 'lastName')}
            error={
              get(touched, 'lastName', false) && get(errors, 'lastName', null)
            }
            onChangeText={(text) => setFieldValue('lastName', text)}
            onSubmitEditing={onPressPrimary}
            enablesReturnKeyAutomatically
            inputRef={(r) => {
              LastNameInput = r;
            }}
          />
        </PaddedView>
      </Slide>
    );
  }
);

AskName.propTypes = {
  /* The `Swiper` component used in `<Onboading>` looks for and hijacks the title prop of it's
   * children. Thus we have to use more unique name.
   */
  setFieldValue: PropTypes.func.isRequired,
  slideTitle: PropTypes.string,
  description: PropTypes.string,
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  touched: PropTypes.shape({}),
  errors: PropTypes.shape({}),
  values: PropTypes.shape({}),
  onPressPrimary: PropTypes.func,
};

AskName.defaultProps = {
  slideTitle: 'Welcome!',
  description: "Every relationship starts with a name. What's yours?",
};

export default AskName;
