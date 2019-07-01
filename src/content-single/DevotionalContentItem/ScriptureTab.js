import React from 'react';
import { ScrollView } from 'react-native';
import PropTypes from 'prop-types';
import { PaddedView } from '@apollosproject/ui-kit';
import ScriptureItem from '@apollosproject/ui-scripture';
import HorizontalContentFeed from '../HorizontalContentFeed';

/**
 * This is the Scripture side of the Devotional tabbed component.
 * Maps over an array of scripture references and renders them
 * using the ScriptureItem component.
 */
const ScriptureTab = ({ id, scripture, isLoading, navigation }) => (
  <ScrollView>
    <PaddedView>
      {scripture.map((ref) => (
        <ScriptureItem
          key={ref.id}
          reference={ref.reference}
          html={ref.html}
          isLoading={isLoading}
        />
      ))}
    </PaddedView>
    <HorizontalContentFeed contentId={id} navigation={navigation} />
  </ScrollView>
);

ScriptureTab.propTypes = {
  /** The id of the devotional content item */
  id: PropTypes.string,
  /** Toggles placeholders */
  isLoading: PropTypes.bool,
  /** An array of scripture objects */
  scripture: PropTypes.arrayOf(
    PropTypes.shape({
      /** The ID of the verse (i.e. '1CO.15.57') */
      id: PropTypes.string,
      /** A human readable reference (i.e. '1 Corinthians 15:57') */
      reference: PropTypes.string,
      /** The scripture source to render */
      html: PropTypes.string,
    })
  ),
};

export default ScriptureTab;
