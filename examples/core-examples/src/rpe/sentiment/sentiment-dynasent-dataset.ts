/**
 * Contains selected examples derived from:
 *
 * DynaSent: A Dynamic Benchmark for Sentiment Analysis
 * Christopher Potts, Zhengxuan Wu, Atticus Geiger, and Douwe Kiela
 * https://github.com/cgpotts/dynasent
 *
 * Licensed under Apache License, Version 2.0, January 2004
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * The original dataset has been modified by selecting a subset and
 * transforming it into Toor's dataset format.
 */

import { RPEDatasetEntry } from '@gettoor/core';
import { entry } from './dataset-common.js';

export const DYNASENT_TRAINING_HIGH_CONFIDENCE: RPEDatasetEntry[] = [
  entry(
    'Please if you have other options and want to avoid aggravation go elsewhere. This place sucks.',
    'negative',
  ),
  entry(
    'I tried a new place. I can\'t wait to return and try more.',
    'positive',
  ),
  entry(
    'You should have',
    'neutral',
  ),
  entry(
    'Please be very careful on choosing to store your valuables at this location. This place sucks.',
    'negative',
  ),
  entry(
    'It work very well',
    'positive',
  ),
  entry(
    'say so',
    'neutral',
  ),
  entry(
    'I got food posisoning from restaurant. I felt so sick and horrible.',
    'negative',
  ),
  entry(
    'And we all did...one by one and went to bar bar that has a welcoming atmosphere with polite & pleasant staff! impressed',
    'positive',
  ),
  entry(
    'Family platter was good for about 6ppl. WE had too many people.',
    'neutral',
  ),
  entry(
    'Food was barely passable and grossly overpriced.bad',
    'negative',
  ),
  entry(
    'Everything tasted like pure perfection.',
    'positive',
  ),
  entry(
    'You told me I would be next',
    'neutral',
  ),
  entry(
    'With so many options available, I only order Mr. Chop Chop when some one else insists. It is horrible.',
    'negative',
  ),
  entry(
    'It has the perfect amount of pumpkin flavour and you can see the little specks of orange from the real pumpkin. It is really good.',
    'positive',
  ),
  entry(
    'they are looking it',
    'neutral',
  ),
  entry(
    'Stuffs were rude and were tying to ignore you at all time. distasteful.',
    'negative',
  ),
  entry(
    'Great casino staff.',
    'positive',
  ),
  entry(
    'i call the hotel manager',
    'neutral',
  ),
  entry(
    'That movie was bad.  I own all three.',
    'negative',
  ),
  entry(
    'I come here at least once a week. loved it',
    'positive',
  ),
];

export const DYNASENT_VALIDATION_HIGH_CONFIDENCE: RPEDatasetEntry[] = [
  entry(
    'you look average today',
    'neutral',
  ),
  entry(
    'Fuck this place. Go buy some.',
    'negative',
  ),
  entry(
    'So much food that we all left feeling like we could use a nap, and a smile that was hard pressed to leave this garlic lover\'s face. I enjoyed myself.',
    'positive',
  ),
  entry(
    'They charge by the pound',
    'neutral',
  ),
  entry(
    'This place is not well',
    'negative',
  ),
  entry(
    'Limits are ~$10 even on a weekday morning. We love this price.',
    'positive',
  ),
  entry(
    'no body',
    'neutral',
  ),
  entry(
    'I tried a new place. This place was once of the worst places I have ever been too !!',
    'negative',
  ),
  entry(
    'and the portion was perfect for slipping. highly recommended',
    'positive',
  ),
  entry(
    'Only showing it the way it is...',
    'neutral',
  ),
  entry(
    'The zombie girl was sitting on the edge of the stage still in character trying to stop the hand from running off. It was horrible.',
    'negative',
  ),
  entry(
    'I recommend autohausaz to all my friends. It is the best!',
    'positive',
  ),
  entry(
    'crown was done later 5 years',
    'neutral',
  ),
  entry(
    'The bank was given worst services',
    'negative',
  ),
  entry(
    'The photo was amazing',
    'positive',
  ),
  entry(
    'finding nemo in deep blue sea',
    'neutral',
  ),
  entry(
    'But I can\'t not take away one star for forgetting both of our appetizers. It sucked.',
    'negative',
  ),
  entry(
    'We were pretty proud of ourselves for having our email with our travel itinerary pulled up to show Tammy just like the instructions said. It was so good.',
    'positive',
  ),
  entry(
    'I got the newspaper',
    'neutral',
  ),
  entry(
    'They take more hour it was so irritating',
    'negative',
  ),
];

export const DYNASENT_TEST_HIGH_CONFIDENCE: RPEDatasetEntry[] = [
  entry(
    'The portions for all three items were  generous.',
    'positive',
  ),
  entry(
    'terminology',
    'neutral',
  ),
  entry(
    'it is SO thin and so small that it was nearly impossible to separate them the next day after putting them in the fridge. It really sucks.',
    'negative',
  ),
  entry(
    'Chicken is so good.',
    'positive',
  ),
  entry(
    'n one cannaot this.',
    'neutral',
  ),
  entry(
    'Had to call them back for a new issue. It was bad.',
    'negative',
  ),
  entry(
    'The sushi restaurant was amazing',
    'positive',
  ),
  entry(
    'Neither',
    'neutral',
  ),
  entry(
    'Be prepared to spend at least $20+ if you wish to have a decent experience as the GameWorks cards no longer work by hours. This place is the worse.',
    'negative',
  ),
  entry(
    'While we entered the restaurant, we immediately received a warm welcome from the waitress. loved it',
    'positive',
  ),
  entry(
    'swearing',
    'neutral',
  ),
  entry(
    'They dumplings really suck.',
    'negative',
  ),
  entry(
    'I usually go to Nordies to stock up on my Chanel makeup.. but staying out at Marks lately.. It is so good.',
    'positive',
  ),
  entry(
    'nobody',
    'neutral',
  ),
  entry(
    'the service was not good enough',
    'negative',
  ),
  entry(
    'The flavors mix well.',
    'positive',
  ),
  entry(
    'defence',
    'neutral',
  ),
  entry(
    'He asked them where I was at and they did not know was there reply. It was bad.',
    'negative',
  ),
  entry(
    'Our cookies and cream was amazing.',
    'positive',
  ),
  entry(
    'that is unlike',
    'neutral',
  ),
];