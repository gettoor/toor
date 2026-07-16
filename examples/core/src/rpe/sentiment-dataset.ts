import { RPEDatasetEntry } from '@gettoor/core';

function entry(
  input: string,
  sentiment: 'positive' | 'neutral' | 'negative',
): RPEDatasetEntry {
  return {
    vars: {
      input,
    },
    expectedResponse: sentiment,
  };
}

export const EASY_DATASET: RPEDatasetEntry[] = [
  entry(
    'I absolutely loved the product. It exceeded all my expectations.',
    'positive'
  ),
  entry(
    'The service was fast, friendly, and professional.',
    'positive'
  ),
  entry(
    'This is the best purchase I\'ve made all year.',
    'positive'
  ),
  entry(
    'Everything worked perfectly from start to finish.',
    'positive'
  ),
  entry(
    'I\'m very happy with the quality.',
    'positive'
  ),
  entry(
    'The support team solved my problem within minutes.',
    'positive'
  ),
  entry(
    'The app is intuitive and easy to use.',
    'positive'
  ),
  entry(
    'Delivery arrived earlier than expected.',
    'positive'
  ),
  entry(
    'The food was delicious and beautifully presented.',
    'positive'
  ),
  entry(
    'I\'d definitely recommend this to my friends.',
    'positive'
  ),
  entry(
    'Excellent value for the price.',
    'positive'
  ),
  entry(
    'The update fixed all the issues I had.',
    'positive'
  ),
  entry(
    'Customer service went above and beyond.',
    'positive'
  ),
  entry(
    'The experience was smooth and enjoyable.',
    'positive'
  ),
  entry(
    'I\'m impressed with how reliable it has been.',
    'positive'
  ),
  entry(
    'The package arrived today.',
    'neutral'
  ),
  entry(
    'The meeting starts at 2 PM.',
    'neutral'
  ),
  entry(
    'I downloaded the latest version yesterday.',
    'neutral'
  ),
  entry(
    'The device comes in black and silver.',
    'neutral'
  ),
  entry(
    'Your order has been shipped.',
    'neutral'
  ),
  entry(
    'The restaurant is open until 10 PM.',
    'neutral'
  ),
  entry(
    'This model has 256 GB of storage.',
    'neutral'
  ),
  entry(
    'I attended the conference last week.',
    'neutral'
  ),
  entry(
    'The report contains twelve sections.',
    'neutral'
  ),
  entry(
    'The train departed on schedule.',
    'neutral'
  ),
  entry(
    'It rained for most of the afternoon.',
    'neutral'
  ),
  entry(
    'The document was updated this morning.',
    'neutral'
  ),
  entry(
    'The software requires Windows 11.',
    'neutral'
  ),
  entry(
    'I received your email.',
    'neutral'
  ),
  entry(
    'The event will take place online.',
    'neutral'
  ),
  entry(
    'I\'m extremely disappointed with the quality.',
    'negative'
  ),
  entry(
    'The product stopped working after two days.',
    'negative'
  ),
  entry(
    'Customer support never responded to my request.',
    'negative'
  ),
  entry(
    'This was a complete waste of money.',
    'negative'
  ),
  entry(
    'The food was cold and tasted awful.',
    'negative'
  ),
  entry(
    'I regret buying this.',
    'negative'
  ),
  entry(
    'The app crashes every time I open it.',
    'negative'
  ),
  entry(
    'Delivery was delayed by over a week.',
    'negative'
  ),
  entry(
    'Nothing worked as advertised.',
    'negative'
  ),
  entry(
    'The instructions were confusing and incomplete.',
    'negative'
  ),
  entry(
    'This is by far the worst experience I\'ve had.',
    'negative'
  ),
  entry(
    'The interface is slow and frustrating to use.',
    'negative'
  ),
  entry(
    'I\'m unhappy with the overall experience.',
    'negative'
  ),
  entry(
    'The refund process was unnecessarily complicated.',
    'negative'
  ),
  entry(
    'I wouldn\'t recommend this product to anyone.',
    'negative'
  ),
  entry(
    'The battery barely lasts an hour.',
    'negative'
  ),
  entry(
    'The website keeps showing errors.',
    'negative'
  ),
  entry(
    'The item arrived damaged.',
    'negative'
  ),
  entry(
    'I expected much better for the price.',
    'negative'
  ),
  entry(
    'The experience left me very frustrated.',
    'negative'
  ),
];

export const MODERATE_DATASET: RPEDatasetEntry[] = [
  entry(
    'Well, that could have gone worse.',
    'positive'
  ),
  entry(
    'It\'s not bad once you get used to all the crashes.',
    'negative'
  ),
  entry(
    'I expected to hate it, but it turned out to be surprisingly good.',
    'positive'
  ),
  entry(
    'The movie was certainly one of the movies I\'ve ever seen.',
    'neutral'
  ),
  entry(
    'Thanks for making me wait only three hours.',
    'negative'
  ),
  entry(
    'I can\'t say I\'m unhappy with the result.',
    'positive'
  ),
  entry(
    'It works, I guess.',
    'neutral'
  ),
  entry(
    'Amazing. Another update that fixes one bug and introduces five more.',
    'negative'
  ),
  entry(
    'I wouldn\'t hesitate to avoid buying this again.',
    'negative'
  ),
  entry(
    'For the price, it exists.',
    'neutral'
  ),
  entry(
    'I kept waiting for it to disappoint me, but it never did.',
    'positive'
  ),
  entry(
    'The customer support agent apologized so many times that I almost forgot they never solved the issue.',
    'negative'
  ),
  entry(
    'It\'s fine if your expectations are exceptionally low.',
    'negative'
  ),
  entry(
    'Nothing special, but nothing to complain about either.',
    'neutral'
  ),
  entry(
    'I\'ve definitely paid more for something much worse.',
    'positive'
  ),
  entry(
    'The packaging deserves five stars. Shame about what was inside.',
    'negative'
  ),
  entry(
    'I didn\'t love it, but I didn\'t regret buying it either.',
    'neutral'
  ),
  entry(
    'Against all odds, they actually delivered exactly what they promised.',
    'positive'
  ),
  entry(
    'It exceeded my expectations, although to be fair they were incredibly low.',
    'positive'
  ),
  entry(
    'Congratulations on creating software that almost works.',
    'negative'
  ),
  entry(
    'I wouldn\'t call it great, but I\'d happily use it again.',
    'positive'
  ),
  entry(
    'The second attempt was almost acceptable.',
    'negative'
  ),
  entry(
    'I expected excellence and got competence.',
    'neutral'
  ),
  entry(
    'It somehow managed to grow on me.',
    'positive'
  ),
  entry(
    'I can finally stop looking for alternatives.',
    'positive'
  ),
  entry(
    'The bugs are becoming familiar enough to feel like features.',
    'negative'
  ),
  entry(
    'It\'s difficult to be excited or disappointed by it.',
    'neutral'
  ),
  entry(
    'This is exactly what I needed, even if I didn\'t realize it at first.',
    'positive'
  ),
  entry(
    'The silence from customer support was remarkably consistent.',
    'negative'
  ),
  entry(
    'I don\'t have strong feelings about it either way.',
    'neutral'
  ),
  entry(
    'It does the job, eventually.',
    'neutral'
  ),
  entry(
    'I was prepared for disaster, so this felt like a pleasant surprise.',
    'positive'
  ),
  entry(
    'If reliability isn\'t important to you, this is perfect.',
    'negative'
  ),
  entry(
    'It isn\'t the worst decision I\'ve made this month.',
    'neutral'
  ),
  entry(
    'Not once did it make me question my purchase.',
    'positive'
  ),
  entry(
    'The marketing team deserves an award. The engineers, less so.',
    'negative'
  ),
  entry(
    'Nothing about it stood out, for better or worse.',
    'neutral'
  ),
  entry(
    'I\'m almost disappointed that I have nothing to complain about.',
    'positive'
  ),
  entry(
    'The experience was memorable, though not for the reasons I hoped.',
    'negative'
  ),
  entry(
    'I\'ve seen worse implementations of the same idea.',
    'neutral'
  ),
  entry(
    'After the latest update, I no longer dread opening the app.',
    'positive'
  ),
  entry(
    'I admire the confidence required to release it in this state.',
    'negative'
  ),
  entry(
    'It consistently meets my completely average expectations.',
    'neutral'
  ),
  entry(
    'The more I use it, the less I want to replace it.',
    'positive'
  ),
  entry(
    'It promises simplicity and delivers character-building.',
    'negative'
  ),
  entry(
    'I neither regret nor celebrate buying it.',
    'neutral'
  ),
  entry(
    'I wouldn\'t be upset if all products were this dependable.',
    'positive'
  ),
  entry(
    'At least the error messages are polite.',
    'negative'
  ),
  entry(
    'The experience left no lasting impression.',
    'neutral'
  ),
  entry(
    'Somehow, despite its flaws, I genuinely like using it.',
    'positive'
  ),
];

export const HARD_DATASET: RPEDatasetEntry[] = [
  entry(
    'I expected perfection, got something merely excellent, and somehow that feels like my problem.',
    'positive'
  ),
  entry(
    'It solved the issue I bought it for, which was honestly unexpected.',
    'positive'
  ),
  entry(
    'The only thing consistent about it is how consistently inconsistent it is.',
    'negative'
  ),
  entry(
    'I\'m still trying to decide whether I like it.',
    'neutral'
  ),
  entry(
    'It exceeded my expectations, although they started somewhere underground.',
    'positive'
  ),
  entry(
    'Nothing actually broke, which feels like an achievement.',
    'positive'
  ),
  entry(
    'I kept lowering my expectations until they finally matched reality.',
    'negative'
  ),
  entry(
    'If mediocrity had a flagship product, this would be a strong contender.',
    'negative'
  ),
  entry(
    'It has all the features I expected.',
    'neutral'
  ),
  entry(
    'I can see why some people would absolutely love it.',
    'neutral'
  ),
  entry(
    'I can also see why others wouldn\'t.',
    'neutral'
  ),
  entry(
    'I wouldn\'t recommend against it.',
    'positive'
  ),
  entry(
    'I wouldn\'t recommend recommending it either.',
    'neutral'
  ),
  entry(
    'The experience improved dramatically once I stopped expecting it to work properly.',
    'negative'
  ),
  entry(
    'It\'s one of those rare products that gets less annoying over time.',
    'positive'
  ),
  entry(
    'I\'ve certainly paid more for less.',
    'positive'
  ),
  entry(
    'I\'ve also paid less for more.',
    'negative'
  ),
  entry(
    'It\'s difficult to criticize something that mostly delivers.',
    'positive'
  ),
  entry(
    'Technically, it functions.',
    'neutral'
  ),
  entry(
    'Functionally, that\'s open to interpretation.',
    'negative'
  ),
  entry(
    'I appreciate the ambition, even if reality didn\'t.',
    'negative'
  ),
  entry(
    'It\'s surprisingly adequate.',
    'positive'
  ),
  entry(
    'Surprisingly, it\'s exactly adequate.',
    'neutral'
  ),
  entry(
    'I don\'t miss using the previous version.',
    'positive'
  ),
  entry(
    'I\'m not sure I\'ll miss using this one either.',
    'neutral'
  ),
  entry(
    'The documentation was more convincing than the software.',
    'negative'
  ),
  entry(
    'After a week, I stopped noticing the flaws.',
    'neutral'
  ),
  entry(
    'Whether that\'s because they were fixed or because I gave up is unclear.',
    'negative'
  ),
  entry(
    'It almost feels unfair to call it disappointing.',
    'negative'
  ),
  entry(
    'I wanted a reason to return it but never found one.',
    'positive'
  ),
  entry(
    'I wanted a reason to keep it but never really found that either.',
    'neutral'
  ),
  entry(
    'This product has successfully lowered the bar for everything else.',
    'negative'
  ),
  entry(
    'Every update makes me slightly less nervous.',
    'positive'
  ),
  entry(
    'Every update also introduces a new surprise.',
    'negative'
  ),
  entry(
    'It earns exactly the amount of enthusiasm I feel right now.',
    'neutral'
  ),
  entry(
    'I expected to complain a lot more than I actually did.',
    'positive'
  ),
  entry(
    'I expected to praise it a lot more than I actually can.',
    'negative'
  ),
  entry(
    'I\'d buy it again if the alternatives disappeared.',
    'neutral'
  ),
  entry(
    'I keep recommending it with an unusually long list of caveats.',
    'neutral'
  ),
  entry(
    'Against my better judgment, I kind of enjoy it.',
    'positive'
  ),
  entry(
    'Against the marketing, it performs exactly as advertised.',
    'positive'
  ),
  entry(
    'The product is honest. The advertising isn\'t.',
    'negative'
  ),
  entry(
    'It works best when you don\'t ask too much of it.',
    'neutral'
  ),
  entry(
    'It works best when you don\'t use it.',
    'negative'
  ),
  entry(
    'I never thought "good enough" could feel this reassuring.',
    'positive'
  ),
  entry(
    'It\'s impossible to love, but equally difficult to hate.',
    'neutral'
  ),
  entry(
    'The longer I own it, the more justified the purchase feels.',
    'positive'
  ),
  entry(
    'The longer I own it, the more excuses I find for it.',
    'negative'
  ),
  entry(
    'It left me with fewer complaints than compliments.',
    'positive'
  ),
  entry(
    'I finished using it with exactly the same opinion I started with.',
    'neutral'
  )
];

export const LONG_INPUT_DATASET: RPEDatasetEntry[] = [
  // Easy

  entry(
    'I bought this laptop last week and it has been fantastic so far. The battery lasts all day, the screen looks amazing, and everything feels incredibly fast. I would happily recommend it to anyone looking for a new computer.',
    'positive'
  ),

  entry(
    'This restaurant was a complete disappointment. The food arrived cold, the waiter forgot our order twice, and we waited nearly an hour for dessert. I definitely won\'t be coming back.',
    'negative'
  ),

  entry(
    'The package arrived this morning. Everything listed in the order was inside the box and nothing appeared to be damaged. I haven\'t had a chance to try the product yet.',
    'neutral'
  ),

  entry(
    'I was a little unsure before buying it, but I\'m really glad I did. Setup took only a few minutes and it has worked flawlessly ever since. It exceeded my expectations.',
    'positive'
  ),

  entry(
    'The software crashes almost every time I try to save my work. I lost several hours because of it, and customer support hasn\'t responded yet. It has been an incredibly frustrating experience.',
    'negative'
  ),

  entry(
    'The conference lasted two days and included several keynote presentations. Around five hundred people attended from different countries. The schedule is available online.',
    'neutral'
  ),

  entry(
    'The hotel staff were incredibly welcoming from the moment we arrived. Our room was spotless, breakfast was excellent, and the location made exploring the city easy. We had a wonderful stay.',
    'positive'
  ),

  entry(
    'I received exactly what I ordered. The color matches the photos and the measurements are correct. Shipping took four business days.',
    'neutral'
  ),

  entry(
    'Nothing about this purchase went well. The wrong item arrived first, the replacement was damaged, and getting a refund took weeks. I regret ordering from this store.',
    'negative'
  ),

  entry(
    'The headphones sound incredible and are comfortable enough to wear for hours. Even after daily use, the battery still lasts much longer than advertised. I couldn\'t be happier.',
    'positive'
  ),

  // Moderate

  entry(
    'The phone isn\'t perfect, but after using it for a month I find myself appreciating it more than I expected. There are a few annoying bugs, yet none of them seriously affect my daily use. Overall, I\'m happy with the purchase.',
    'positive'
  ),

  entry(
    'I really wanted to like this camera because the specifications looked impressive. Unfortunately, the image quality doesn\'t justify the price and the autofocus misses more often than it should. It isn\'t terrible, just disappointing.',
    'negative'
  ),

  entry(
    'The product does everything it claims to do. It doesn\'t particularly impress me, but it also doesn\'t give me any reason to complain. I\'ll probably keep using it.',
    'neutral'
  ),

  entry(
    'The first few days were rough because the interface was confusing. Once I got used to it, everything started making sense and now I actually enjoy using it. Learning it was worth the effort.',
    'positive'
  ),

  entry(
    'I can understand why other people enjoy this game. Personally, it never really clicked with me, although I can\'t point to anything objectively wrong with it. It simply isn\'t for me.',
    'neutral'
  ),

  entry(
    'The customer support agent was polite throughout the conversation. Unfortunately, despite several promises, my issue remained unresolved after multiple calls. Courtesy alone wasn\'t enough.',
    'negative'
  ),

  entry(
    'I expected the update to introduce a lot of problems because previous releases usually did. Surprisingly, everything worked smoothly and performance even improved a little. That was a pleasant surprise.',
    'positive'
  ),

  entry(
    'The meal looked much better than it tasted. Nothing was actually bad, but nothing stood out either, especially considering the price. I left feeling indifferent.',
    'neutral'
  ),

  entry(
    'The service wasn\'t as terrible as some reviews suggested. Unfortunately, it also wasn\'t nearly good enough for me to recommend it. I\'m somewhere in the middle.',
    'neutral'
  ),

  entry(
    'Every time I think the app is finally stable, another update introduces new problems. I appreciate that the developers are trying, but being a paying customer feels like beta testing.',
    'negative'
  ),

  // Hard

  entry(
    'I spent weeks reading reviews before buying this. Oddly enough, almost everything people complained about turned out to be irrelevant to me, while the one issue nobody mentioned became my biggest annoyance. Even so, I don\'t regret the purchase.',
    'positive'
  ),

  entry(
    'After the latest update, I no longer worry about losing my work. I still wouldn\'t describe the software as polished, but at least it has stopped getting in my way. That alone makes it feel much better.',
    'positive'
  ),

  entry(
    'The product didn\'t fail spectacularly. Instead, it slowly accumulated dozens of tiny frustrations that eventually made me stop using it. None of them alone would justify a bad review, but together they certainly do.',
    'negative'
  ),

  entry(
    'The hotel was exactly as advertised. The room was clean, breakfast was acceptable, and the staff behaved professionally throughout our stay. There isn\'t much more to say.',
    'neutral'
  ),

  entry(
    'I expected to return it within a few days. Somehow it has become something I use every single day, despite its obvious flaws. That probably says more than any rating I could give.',
    'positive'
  ),

  entry(
    'The salesperson promised it would simplify my workflow. Instead, I spent several evenings reading documentation just to accomplish what my previous setup handled effortlessly. Eventually it worked, but I never felt rewarded.',
    'negative'
  ),

  entry(
    'If someone asked whether I liked it, I honestly wouldn\'t know how to answer. It solved the problem I bought it for, but it never made using it enjoyable. My opinion hasn\'t changed much over time.',
    'neutral'
  ),

  entry(
    'The experience improved so gradually that I barely noticed it happening. Looking back, I complain much less than I used to and rely on it far more often than expected. That probably means it earned my trust.',
    'positive'
  ),

  entry(
    'Nothing catastrophic ever happened while using it. Unfortunately, nothing particularly satisfying happened either, leaving me with the strange feeling that I spent a lot of money to feel almost nothing. That isn\'t exactly a compliment.',
    'negative'
  ),

  entry(
    'I have recommended it to exactly one person, and only after explaining all of its strengths and weaknesses for fifteen minutes. They ended up buying it anyway. I\'m still not sure whether that was good advice.',
    'neutral'
  ),

  // Very hard

  entry(
    'I kept waiting for the moment when I would understand why people praise this product so much. That moment never really arrived, although neither did the moment when I wanted to stop using it. Somehow it settled into being an ordinary part of my day.',
    'neutral'
  ),

  entry(
    'Had you asked me during the first week, I probably would have told you to avoid it. A month later, after several updates, I realized I hadn\'t complained about it in quite some time. Funny how opinions change.',
    'positive'
  ),

  entry(
    'Everything technically worked from the very beginning. The problem was that using it felt like negotiating with software that clearly had other priorities. I eventually succeeded, but I wouldn\'t call the experience successful.',
    'negative'
  ),

  entry(
    'The company deserves credit for responding quickly whenever I contacted them. Unfortunately, every response created a new issue instead of solving the previous one. Efficiency alone doesn\'t make good support.',
    'negative'
  ),

  entry(
    'I\'ve owned products that were objectively better. Oddly enough, this is the one I keep reaching for without thinking about it. Sometimes convenience wins over perfection.',
    'positive'
  ),

  entry(
    'The feature everyone seems excited about turned out to be the one I used the least. Most of my time was spent using the basic functionality, which behaved exactly as expected. I neither gained nor lost much from the experience.',
    'neutral'
  ),

  entry(
    'If I judged it purely by the first impression, the review would have been terrible. If I judged it only by today, it would probably be excellent. Since both experiences are equally real, I\'ll simply keep using it.',
    'positive'
  ),

  entry(
    'There\'s something oddly admirable about software that manages to disappoint you without ever completely failing. Every individual interaction feels acceptable, yet somehow the overall experience leaves you exhausted. That\'s harder to forgive than a single obvious bug.',
    'negative'
  ),

  entry(
    'When people ask whether it was worth the money, I usually hesitate longer than they expect. Not because I regret buying it, and not because I love it, but because neither answer really captures how I feel after months of using it.',
    'neutral'
  ),

  entry(
    'I started using it because there were no better alternatives. Months later there are better alternatives, yet I haven\'t switched. Whether that says something good about the product or something lazy about me, I honestly can\'t tell.',
    'neutral'
  )
];