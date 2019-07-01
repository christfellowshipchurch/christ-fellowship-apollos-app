import React from 'react';
import renderer from 'react-test-renderer';
import Providers from 'ChristFellowship/src/Providers';
import { renderWithApolloData } from 'ChristFellowship/src/utils/testUtils';
import GET_CONTENT_ITEM_CONTENT from '../HTMLContent/getContentItemContent';
import GET_SCRIPTURE from './getScripture';
import Devotional from '.';

const content = {
  body:
    '<p>Sometimes God&rsquo;s promises to us involve a fight. We have to fight to keep our focus on Him, fight to move towards the promise we know God has laid on our hearts. We have a real enemy that would love nothing more than to get us sidetracked and doubt God&rsquo;s promises. So we fight saying that we are going to believe God will do what He says He will do, and we keep fighting until we see that promise come to life.</p><p>In Exodus 17:8-15 the nation of Israel, freed from great oppression in Egypt was traveling to the land God promised them. Yet, Israel was fighting, again.&nbsp;<br />&nbsp;<br />As the Israelites were fighting in the valley,&nbsp;Moses was on the hill top lifting his hands in prayer for these great fighters. Israel fought hard, and with the prayers of Moses and the help of his companions, Aaron and Hur, the Amalekites were defeated. Moses knew that it was solely because of the Lord&rsquo;s hand of protection and blessing on the Israelites that they won the battle. &ldquo;Moses built an altar and called it The Lord is my banner&rdquo; (Exodus 17:15).</p><p>In battle opposing nations would fly their own flag on a pole at each of their respective front lines. This was to give their soldiers a feeling of hope and a focal point. This is what God is to us: a banner of encouragement to give us hope and a focal point.</p><blockquote><p>The Lord protects us, covers us with love, and&nbsp;blesses us continually.</p></blockquote><p>The Lord is our banner. He protects us; He covers us with love; He blesses us continually. The Lord gives us hope and a place to focus during the tough fights when the enemy is trying to make us doubt God&rsquo;s promises.&nbsp;</p><p>When was the last time you sat and thanked Jesus for all the ways he is a banner in your life?&nbsp;</p><p>Reflect:</p><ul><li>What is one way the Lord has been your banner?</li><li>How can you focus more today on the Lord and all the things He does for you throughout the day?</li></ul>',
  route: { jumpTo: jest.fn() },
  title: 'God is Our Banner',
};

const scriptures = [
  {
    __typename: 'Scripture',
    id: '1CO.15.57',
    reference: '1 Corinthians 15:57',
    html:
      '<p class="p"><span data-number="57" class="v">57</span>But thanks be to God, who gives us the victory through our Lord Jesus Christ. </p>',
  },
  {
    __typename: 'Scripture',
    id: 'EXO.17.8-EXO.17.15',
    reference: 'Exodus 17:8-15',
    html:
      '<p class="p"><span data-number="8" class="v">8</span>Then Amalek came and fought with Israel in Rephidim. <span data-number="9" class="v">9</span>Moses said to Joshua, “Choose men for us, and go out to fight with Amalek. Tomorrow I will stand on the top of the hill with God’s rod in my hand.” <span data-number="10" class="v">10</span>So Joshua did as Moses had told him, and fought with Amalek; and Moses, Aaron, and Hur went up to the top of the hill. <span data-number="11" class="v">11</span>When Moses held up his hand, Israel prevailed. When he let down his hand, Amalek prevailed. <span data-number="12" class="v">12</span>But Moses’ hands were heavy; so they took a stone, and put it under him, and he sat on it. Aaron and Hur held up his hands, the one on the one side, and the other on the other side. His hands were steady until sunset. <span data-number="13" class="v">13</span>Joshua defeated Amalek and his people with the edge of the sword. <span data-number="14" class="v">14</span>Yahweh said to Moses, “Write this for a memorial in a book, and rehearse it in the ears of Joshua: that I will utterly blot out the memory of Amalek from under the sky.” <span data-number="15" class="v">15</span>Moses built an altar, and called its name “Yahweh our Banner”.</p>',
  },
];

const scriptureMock = {
  request: {
    query: GET_SCRIPTURE,
    variables: { itemId: '1' },
  },
  result: {
    data: {
      node: { scriptures, id: '1', __typename: 'DevotionalContentItem' },
    },
  },
};

const contentItemHTMLMock = {
  request: {
    query: GET_CONTENT_ITEM_CONTENT,
    variables: { contentId: '1' },
  },
  result: {
    data: {
      node: {
        id: '1',
        htmlContent: '<b>Some content!</b>',
        __typename: 'DevotionalContentItem',
      },
    },
  },
};

const mocks = [scriptureMock, contentItemHTMLMock];

const navigation = {
  push: jest.fn(),
};

describe('the Devotional component', () => {
  it('renders a devotional', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <Devotional
          id="1"
          content={content}
          loading={false}
          navigation={navigation}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders even with empty scripture array', async () => {
    const tree = await renderWithApolloData(
      <Providers mocks={mocks}>
        <Devotional
          id="1"
          content={content}
          loading={false}
          navigation={navigation}
        />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
  it('renders a loading state', async () => {
    const tree = renderer.create(
      <Providers mocks={mocks}>
        <Devotional id="1" content={content} loading navigation={navigation} />
      </Providers>
    );
    expect(tree).toMatchSnapshot();
  });
});
