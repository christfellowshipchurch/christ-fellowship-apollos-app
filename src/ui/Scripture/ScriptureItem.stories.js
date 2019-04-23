import React from 'react';
import { ScrollView } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import { PaddedView } from '@apollosproject/ui-kit';

import ScriptureItem from './ScriptureItem';

const genesis1 = {
  scripture: {
    reference: 'Genesis 1:1-5',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>In the beginning, God created the heavens and the earth. <span data-number="2" class="v">2</span>The earth was formless and empty. Darkness was on the surface of the deep and God’s Spirit was hovering over the surface of the waters.</p><p class="p"><span data-number="3" class="v">3</span>God said, “Let there be light,” and there was light. <span data-number="4" class="v">4</span>God saw the light, and saw that it was good. God divided the light from the darkness. <span data-number="5" class="v">5</span>God called the light “day”, and the darkness he called “night”. There was evening and there was morning, the first day.</p>',
    isLoading: false,
    copyright: 'PUBLIC DOMAIN',
  },
};

const john1 = {
  scripture: {
    reference: 'John 1:1',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>In the beginning was the Word, and the Word was with God, and the Word was God. </p>',
    isLoading: false,
    copyright:
      'PUBLIC DOMAIN except in the United Kingdom, where a Crown Copyright applies to printing the KJV. See http://www.cambridge.org/about-us/who-we-are/queens-printers-patent',
  },
};

const psalm23 = {
  scripture: {
    reference: 'Psalm 23',
    html:
      '<p class="d">A Psalm by David.</p><p class="q1"><span data-number="1" class="v">1</span>Yahweh is my shepherd:</p><p class="q2">I shall lack nothing.</p><p class="q1"><span data-number="2" class="v">2</span>He makes me lie down in green pastures.</p><p class="q2">He leads me beside still waters.</p><p class="q1"><span data-number="3" class="v">3</span>He restores my soul.</p><p class="q2">He guides me in the paths of righteousness for his name’s sake.</p><p class="q1"><span data-number="4" class="v">4</span>Even though I walk through the valley of the shadow of death,</p><p class="q2">I will fear no evil, for you are with me.</p><p class="q1">Your rod and your staff,</p><p class="q2">they comfort me.</p><p class="q1"><span data-number="5" class="v">5</span>You prepare a table before me</p><p class="q2">in the presence of my enemies.</p><p class="q1">You anoint my head with oil.</p><p class="q2">My cup runs over.</p><p class="q1"><span data-number="6" class="v">6</span>Surely goodness and loving kindness shall follow me all the days of my life,</p><p class="q2">and I will dwell in Yahweh’s house forever.</p>',
    isLoading: false,
  },
};

const psalm32 = {
  scripture: {
    reference: 'Psalm 32',
    html:
      '<p class="d">By David. A contemplative psalm.</p><p class="q1"><span data-number="1" class="v">1</span>Blessed is he whose disobedience is forgiven,</p><p class="q2">whose sin is covered.</p><p class="q1"><span data-number="2" class="v">2</span>Blessed is the man to whom Yahweh doesn’t impute iniquity,</p><p class="q2">in whose spirit there is no deceit.</p><p class="q1"><span data-number="3" class="v">3</span>When I kept silence, my bones wasted away through my groaning all day long.</p><p class="q1"><span data-number="4" class="v">4</span>For day and night your hand was heavy on me.</p><p class="q2">My strength was sapped in the heat of summer. <span class="qs">Selah.</span></p><p class="q1"><span data-number="5" class="v">5</span>I acknowledged my sin to you.</p><p class="q2">I didn’t hide my iniquity.</p><p class="q1">I said, I will confess my transgressions to Yahweh,</p><p class="q2">and you forgave the iniquity of my sin. <span class="qs">Selah.</span></p><p class="q1"><span data-number="6" class="v">6</span>For this, let everyone who is godly pray to you in a time when you may be found.</p><p class="q2">Surely when the great waters overflow, they shall not reach to him.</p><p class="q1"><span data-number="7" class="v">7</span>You are my hiding place.</p><p class="q2">You will preserve me from trouble.</p><p class="q2">You will surround me with songs of deliverance. <span class="qs">Selah.</span></p><p class="q1"><span data-number="8" class="v">8</span>I will instruct you and teach you in the way which you shall go.</p><p class="q2">I will counsel you with my eye on you.</p><p class="q1"><span data-number="9" class="v">9</span>Don’t be like the horse, or like the mule, which have no understanding,</p><p class="q2">who are controlled by bit and bridle, or else they will not come near to you.</p><p class="q1"><span data-number="10" class="v">10</span>Many sorrows come to the wicked,</p><p class="q2">but loving kindness shall surround him who trusts in Yahweh.</p><p class="q1"><span data-number="11" class="v">11</span>Be glad in Yahweh, and rejoice, you righteous!</p><p class="q2">Shout for joy, all you who are upright in heart!</p>',
  },
};

const psalm119 = {
  scripture: {
    reference: 'Psalm 119:129 - 144',
    html:
      '<p class="d">PEY</p><p class="q1"><span data-number="129" class="v">129</span>Your testimonies are wonderful,</p><p class="q2">therefore my soul keeps them.</p><p class="q1"><span data-number="130" class="v">130</span>The entrance of your words gives light.</p><p class="q2">It gives understanding to the simple.</p><p class="q1"><span data-number="131" class="v">131</span>I opened my mouth wide and panted,</p><p class="q2">for I longed for your commandments.</p><p class="q1"><span data-number="132" class="v">132</span>Turn to me, and have mercy on me,</p><p class="q2">as you always do to those who love your name.</p><p class="q1"><span data-number="133" class="v">133</span>Establish my footsteps in your word.</p><p class="q2">Don’t let any iniquity have dominion over me.</p><p class="q1"><span data-number="134" class="v">134</span>Redeem me from the oppression of man,</p><p class="q2">so I will observe your precepts.</p><p class="q1"><span data-number="135" class="v">135</span>Make your face shine on your servant.</p><p class="q2">Teach me your statutes.</p><p class="q1"><span data-number="136" class="v">136</span>Streams of tears run down my eyes,</p><p class="q2">because they don’t observe your law.</p><p class="d">TZADI</p><p class="q1"><span data-number="137" class="v">137</span>You are righteous, Yahweh.</p><p class="q2">Your judgments are upright.</p><p class="q1"><span data-number="138" class="v">138</span>You have commanded your statutes in righteousness.</p><p class="q2">They are fully trustworthy.</p><p class="q1"><span data-number="139" class="v">139</span>My zeal wears me out,</p><p class="q2">because my enemies ignore your words.</p><p class="q1"><span data-number="140" class="v">140</span>Your promises have been thoroughly tested,</p><p class="q2">and your servant loves them.</p><p class="q1"><span data-number="141" class="v">141</span>I am small and despised.</p><p class="q2">I don’t forget your precepts.</p><p class="q1"><span data-number="142" class="v">142</span>Your righteousness is an everlasting righteousness.</p><p class="q2">Your law is truth.</p><p class="q1"><span data-number="143" class="v">143</span>Trouble and anguish have taken hold of me.</p><p class="q2">Your commandments are my delight.</p><p class="q1"><span data-number="144" class="v">144</span>Your testimonies are righteous forever.</p><p class="q2">Give me understanding, that I may live.</p>',
  },
};

const songOfSolomon1 = {
  scripture: {
    reference: 'Song of Solomon 1:1-4',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>The Song of songs, which is Solomon’s.</p><p class="sp">Beloved</p><p class="q1"><span data-number="2" class="v">2</span>Let him kiss me with the kisses of his mouth;</p><p class="q2">for your love is better than wine.</p><p class="q1"><span data-number="3" class="v">3</span>Your oils have a pleasing fragrance.</p><p class="q2">Your name is oil poured out,</p><p class="q2">therefore the virgins love you.</p><p class="q1"><span data-number="4" class="v">4</span>Take me away with you.</p><p class="q2">Let’s hurry.</p><p class="q2">The king has brought me into his rooms.</p><p class="sp">Friends</p><p class="q1">We will be glad and rejoice in you.</p><p class="q2">We will praise your love more than wine!</p><p class="sp">Beloved</p><p class="q1">They are right to love you.</p>',
    isLoading: false,
  },
};

const mark1 = {
  scripture: {
    reference: 'Mark 1: 1-4',
    html:
      '<p class="p"><span data-number="1" class="v">1</span>The beginning of the Good News of Jesus Christ, the Son of God.</p><p class="p"><span data-number="2" class="v">2</span>As it is written in the prophets,</p><p class="q1">“Behold, I send my messenger before your face,</p><p class="q2">who will prepare your way before you:</p><p class="q1"><span data-number="3" class="v">3</span>the voice of one crying in the wilderness,</p><p class="q2">‘Make ready the way of the Lord!</p><p class="q2">Make his paths straight!’”</p><p class="p"><span data-number="4" class="v">4</span>John came baptizing in the wilderness and preaching the baptism of repentance for forgiveness of sins.',
  },
};

const john3 = {
  scripture: {
    reference: 'John 3:16-17',
    html:
      '<p class="p"><span data-number="16" class="v">16</span><span class="wj">For God so loved the world, that he gave his one and only Son, that whoever believes in him should not perish, but have eternal life. </span><span data-number="17" class="v">17</span><span class="wj">For God didn’t send his Son into the world to judge the world, but that the world should be saved through him. </span></p>',
    isLoading: false,
  },
};

const revelation22 = {
  scripture: {
    reference: 'Revelation 22:20-21',
    html:
      '<p class="p"><span data-number="20" class="v">20</span>He who testifies these things says, <span class="wj">“Yes, I come quickly.” </span></p><p class="p">Amen! Yes, come, Lord Jesus.</p><p class="p"><span data-number="21" class="v">21</span>The grace of the Lord Jesus Christ be with all the saints. Amen.</p>',
    isLoading: false,
  },
};

const revelation22Loading = {
  scripture: {
    reference: 'Revelation 22:20-21',
    html:
      '<p class="p"><span data-number="20" class="v">20</span>He who testifies these things says, <span class="wj">“Yes, I come quickly.” </span></p><p class="p">Amen! Yes, come, Lord Jesus.</p><p class="p"><span data-number="21" class="v">21</span>The grace of the Lord Jesus Christ be with all the saints. Amen.</p>',
    isLoading: true,
  },
};

storiesOf('Scripture', module)
  .add('Genesis 1:1-5', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={genesis1.scripture.reference}
          html={genesis1.scripture.html}
          isLoading={genesis1.scripture.isLoading}
          copyright={genesis1.scripture.copyright}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('John 1:1', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={john1.scripture.reference}
          html={john1.scripture.html}
          isLoading={john1.scripture.isLoading}
          copyright={john1.scripture.copyright}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Psalm 23', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={psalm23.scripture.reference}
          html={psalm23.scripture.html}
          isLoading={psalm23.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Psalm 32', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={psalm32.scripture.reference}
          html={psalm32.scripture.html}
          isLoading={psalm32.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Psalm 119:129 - 144', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={psalm119.scripture.reference}
          html={psalm119.scripture.html}
          isLoading={psalm119.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Song of Solomon 1:1-4', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={songOfSolomon1.scripture.reference}
          html={songOfSolomon1.scripture.html}
          isLoading={songOfSolomon1.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Mark 1: 1-4', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={mark1.scripture.reference}
          html={mark1.scripture.html}
          isLoading={mark1.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('John 3:16-17', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={john3.scripture.reference}
          html={john3.scripture.html}
          isLoading={john3.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Revelation 22:20-21', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={revelation22.scripture.reference}
          html={revelation22.scripture.html}
          isLoading={revelation22.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ))
  .add('Loading State', () => (
    <ScrollView>
      <PaddedView>
        <ScriptureItem
          reference={revelation22Loading.scripture.reference}
          html={revelation22Loading.scripture.html}
          isLoading={revelation22Loading.scripture.isLoading}
        />
      </PaddedView>
    </ScrollView>
  ));
