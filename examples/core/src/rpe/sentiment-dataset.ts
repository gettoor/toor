import { RPEDatasetEntry } from '@gettoor/core';

let entryIdSeq = 0;

function entry(
  input: string,
  sentiment: 'positive' | 'neutral' | 'negative',
  reasoning?: string,
): RPEDatasetEntry {
  return {
    datasetEntryId: `e${entryIdSeq++}`,
    vars: {
      input,
    },
    expectedResponse: sentiment,
    expectedResponseReasoning: reasoning,
  };
}

export const EASY_DATASET: RPEDatasetEntry[] = [
  entry(
    'I absolutely loved the product. It exceeded all my expectations.',
    'positive',
    'Explicit positive language ("loved", "exceeded expectations") with no negation or qualifier.'
  ),
  entry(
    'The battery barely lasts an hour.',
    'negative',
    'A battery lasting only an hour describes a clear product shortcoming.'
  ),
  entry(
    'The service was fast, friendly, and professional.',
    'positive',
    'Three positive adjectives describe the service with no caveats.'
  ),
  entry(
    'This is the best purchase I\'ve made all year.',
    'positive',
    'Superlative praise ("the best purchase") is unambiguously positive.'
  ),
  entry(
    'Everything worked perfectly from start to finish.',
    'positive',
    '"Perfectly" with no exceptions noted signals a fully positive outcome.'
  ),
  entry(
    'I\'m very happy with the quality.',
    'positive',
    'Direct statement of happiness with the product.'
  ),
  entry(
    'The support team solved my problem within minutes.',
    'positive',
    'A fast, successful resolution is a positive outcome.'
  ),
  entry(
    'The app is intuitive and easy to use.',
    'positive',
    'Ease of use is described favorably with no drawbacks mentioned.'
  ),
  entry(
    'Delivery arrived earlier than expected.',
    'positive',
    'Beating expectations on delivery time is a favorable outcome.'
  ),
  entry(
    'The food was delicious and beautifully presented.',
    'positive',
    'Two favorable descriptors with no negative qualifiers.'
  ),
  entry(
    'I\'d definitely recommend this to my friends.',
    'positive',
    'Willingness to recommend indicates satisfaction.'
  ),
  entry(
    'Excellent value for the price.',
    'positive',
    '"Excellent" directly praises the value proposition.'
  ),
  entry(
    'The update fixed all the issues I had.',
    'positive',
    'All prior issues being resolved is a positive resolution.'
  ),
  entry(
    'Customer service went above and beyond.',
    'positive',
    'The idiom "above and beyond" expresses strong approval.'
  ),
  entry(
    'The experience was smooth and enjoyable.',
    'positive',
    'Both descriptors are favorable with no negation.'
  ),
  entry(
    'I\'m impressed with how reliable it has been.',
    'positive',
    'Being "impressed" with reliability is explicit praise.'
  ),
  entry(
    'The package arrived today.',
    'neutral',
    'A plain factual statement with no evaluative language.'
  ),
  entry(
    'The meeting starts at 2 PM.',
    'neutral',
    'Purely informational, no sentiment expressed.'
  ),
  entry(
    'I downloaded the latest version yesterday.',
    'neutral',
    'States an action without any opinion attached.'
  ),
  entry(
    'The device comes in black and silver.',
    'neutral',
    'A factual product spec, not an evaluation.'
  ),
  entry(
    'Your order has been shipped.',
    'neutral',
    'A status update with no emotional content.'
  ),
  entry(
    'The restaurant is open until 10 PM.',
    'neutral',
    'States operating hours, not an opinion.'
  ),
  entry(
    'This model has 256 GB of storage.',
    'neutral',
    'A specification, not an evaluation.'
  ),
  entry(
    'I attended the conference last week.',
    'neutral',
    'Reports an action without judging it.'
  ),
  entry(
    'The report contains twelve sections.',
    'neutral',
    'A factual description of structure.'
  ),
  entry(
    'The train departed on schedule.',
    'neutral',
    'States a fact about timing without opinion.'
  ),
  entry(
    'It rained for most of the afternoon.',
    'neutral',
    'A weather observation with no sentiment.'
  ),
  entry(
    'The document was updated this morning.',
    'neutral',
    'A factual status update.'
  ),
  entry(
    'The software requires Windows 11.',
    'neutral',
    'A system requirement, purely informational.'
  ),
  entry(
    'I received your email.',
    'neutral',
    'An acknowledgment with no evaluative content.'
  ),
  entry(
    'The event will take place online.',
    'neutral',
    'States a logistical fact.'
  ),
  entry(
    'I\'m extremely disappointed with the quality.',
    'negative',
    '"Extremely disappointed" is explicit negative sentiment.'
  ),
  entry(
    'The product stopped working after two days.',
    'negative',
    'Premature failure describes a clear defect.'
  ),
  entry(
    'Customer support never responded to my request.',
    'negative',
    'Being ignored by support is a negative experience.'
  ),
  entry(
    'This was a complete waste of money.',
    'negative',
    '"Waste of money" is a strong negative judgment.'
  ),
  entry(
    'The food was cold and tasted awful.',
    'negative',
    'Two explicit negative descriptors.'
  ),
  entry(
    'I regret buying this.',
    'negative',
    'Regret directly expresses dissatisfaction with the purchase.'
  ),
  entry(
    'The app crashes every time I open it.',
    'negative',
    'Constant crashing describes a severe defect.'
  ),
  entry(
    'Delivery was delayed by over a week.',
    'negative',
    'A significant shipping delay is a negative experience.'
  ),
  entry(
    'Nothing worked as advertised.',
    'negative',
    'Failing to meet advertised claims is a clear complaint.'
  ),
  entry(
    'The instructions were confusing and incomplete.',
    'negative',
    'Both descriptors criticize the documentation.'
  ),
  entry(
    'This is by far the worst experience I\'ve had.',
    'negative',
    'Superlative negative judgment ("worst experience").'
  ),
  entry(
    'The interface is slow and frustrating to use.',
    'negative',
    'Both "slow" and "frustrating" are negative descriptors.'
  ),
  entry(
    'I\'m unhappy with the overall experience.',
    'negative',
    'Direct statement of unhappiness.'
  ),
  entry(
    'The refund process was unnecessarily complicated.',
    'negative',
    'Criticizes the process as needlessly difficult.'
  ),
  entry(
    'I wouldn\'t recommend this product to anyone.',
    'negative',
    'Explicit refusal to recommend signals dissatisfaction.'
  ),
  entry(
    'The website keeps showing errors.',
    'negative',
    'Recurring errors describe a malfunctioning product.'
  ),
  entry(
    'The item arrived damaged.',
    'negative',
    'Receiving a damaged item is a negative outcome.'
  ),
  entry(
    'I expected much better for the price.',
    'negative',
    'Explicitly states the product fell short of expectations.'
  ),
  entry(
    'The experience left me very frustrated.',
    'negative',
    'Direct statement of frustration.'
  ),
];

export const MODERATE_DATASET: RPEDatasetEntry[] = [
  entry(
    'Well, that could have gone worse.',
    'positive',
    'An idiomatic sigh of relief; despite mentioning "worse", the phrase signals things turned out acceptably compared to a feared outcome.'
  ),
  entry(
    'It\'s not bad once you get used to all the crashes.',
    'negative',
    'The faint praise ("not bad") is undercut by "all the crashes", which is the dominant, disqualifying flaw.'
  ),
  entry(
    'I expected to hate it, but it turned out to be surprisingly good.',
    'positive',
    'The contrastive "but" resolves in favor of "surprisingly good".'
  ),
  entry(
    'The movie was certainly one of the movies I\'ve ever seen.',
    'neutral',
    'The sentence is deliberately incomplete/tautological (missing a superlative like "best" or "worst"), leaving no discernible sentiment.'
  ),
  entry(
    'Thanks for making me wait only three hours.',
    'negative',
    'Sarcastic gratitude for an excessive wait time; the literal complaint is a three-hour delay.'
  ),
  entry(
    'I can\'t say I\'m unhappy with the result.',
    'positive',
    'A double negative ("can\'t say... unhappy") resolves to satisfaction.'
  ),
  entry(
    'It works, I guess.',
    'neutral',
    '"I guess" signals reluctant, lukewarm acknowledgment rather than clear approval or complaint.'
  ),
  entry(
    'Amazing. Another update that fixes one bug and introduces five more.',
    'negative',
    '"Amazing" is sarcastic; the real content is a net-negative bug count after the update.'
  ),
  entry(
    'I wouldn\'t hesitate to avoid buying this again.',
    'negative',
    'Stripped of the double negative, this means "I would avoid buying this again".'
  ),
  entry(
    'For the price, it exists.',
    'neutral',
    'A deadpan, minimal description with no explicit praise or complaint beyond bare functionality.'
  ),
  entry(
    'I kept waiting for it to disappoint me, but it never did.',
    'positive',
    'The anticipated disappointment never materializes, leaving a positive outcome.'
  ),
  entry(
    'The customer support agent apologized so many times that I almost forgot they never solved the issue.',
    'negative',
    'Repeated apologies don\'t offset the core complaint: the issue was never resolved.'
  ),
  entry(
    'It\'s fine if your expectations are exceptionally low.',
    'negative',
    'A backhanded remark implying the product only satisfies if you expect very little.'
  ),
  entry(
    'Nothing special, but nothing to complain about either.',
    'neutral',
    'Explicitly balanced: no praise, no complaint.'
  ),
  entry(
    'I\'ve definitely paid more for something much worse.',
    'positive',
    'A comparative statement implying this purchase is good value relative to worse past experiences.'
  ),
  entry(
    'The packaging deserves five stars. Shame about what was inside.',
    'negative',
    'The praise is confined to packaging; the pivot "shame about what was inside" delivers the real, negative verdict on the product itself.'
  ),
  entry(
    'I didn\'t love it, but I didn\'t regret buying it either.',
    'neutral',
    'Explicitly rules out both strong positive and negative reactions.'
  ),
  entry(
    'Against all odds, they actually delivered exactly what they promised.',
    'positive',
    'Despite low expectations ("against all odds"), the promise was fulfilled.'
  ),
  entry(
    'It exceeded my expectations, although to be fair they were incredibly low.',
    'positive',
    'The core claim is that it exceeded expectations; the low starting bar is a caveat, not a reversal.'
  ),
  entry(
    'Congratulations on creating software that almost works.',
    'negative',
    'Sarcastic congratulations; "almost works" is a direct admission of failure.'
  ),
  entry(
    'I wouldn\'t call it great, but I\'d happily use it again.',
    'positive',
    'Willingness to happily reuse it outweighs the modest disclaimer "not great".'
  ),
  entry(
    'The second attempt was almost acceptable.',
    'negative',
    '"Almost acceptable" means it fell short of the acceptable bar.'
  ),
  entry(
    'I expected excellence and got competence.',
    'neutral',
    'States a gap between a high expectation and an adequate (neither bad nor exceptional) result.'
  ),
  entry(
    'It somehow managed to grow on me.',
    'positive',
    '"Grow on me" is an idiom for developing genuine fondness.'
  ),
  entry(
    'I can finally stop looking for alternatives.',
    'positive',
    'Ending the search for alternatives implies satisfaction with the current option.'
  ),
  entry(
    'The bugs are becoming familiar enough to feel like features.',
    'negative',
    'Sarcastically reframing persistent bugs as "features" does not change that they are still bugs.'
  ),
  entry(
    'It\'s difficult to be excited or disappointed by it.',
    'neutral',
    'Explicitly rules out both positive and negative emotional reactions.'
  ),
  entry(
    'This is exactly what I needed, even if I didn\'t realize it at first.',
    'positive',
    'The core claim ("exactly what I needed") is affirmed despite the initial uncertainty.'
  ),
  entry(
    'The silence from customer support was remarkably consistent.',
    'negative',
    '"Silence" from support describes unresponsiveness, framed sarcastically as a virtue ("remarkably consistent").'
  ),
  entry(
    'I don\'t have strong feelings about it either way.',
    'neutral',
    'An explicit disclaimer of any strong sentiment.'
  ),
  entry(
    'It does the job, eventually.',
    'neutral',
    'Confirms basic functionality while "eventually" notes a mild delay, netting out to lukewarm acknowledgment rather than praise or complaint.'
  ),
  entry(
    'I was prepared for disaster, so this felt like a pleasant surprise.',
    'positive',
    'The outcome beat a very low, disaster-level expectation.'
  ),
  entry(
    'If reliability isn\'t important to you, this is perfect.',
    'negative',
    'Implies the product is unreliable; "perfect" only applies if you don\'t care about reliability.'
  ),
  entry(
    'It isn\'t the worst decision I\'ve made this month.',
    'neutral',
    'A deadpan comparison against a low bar ("worst decision this month") that neither praises nor condemns the specific choice.'
  ),
  entry(
    'Not once did it make me question my purchase.',
    'positive',
    'Never doubting the purchase indicates consistent satisfaction.'
  ),
  entry(
    'The marketing team deserves an award. The engineers, less so.',
    'negative',
    'The pivot "less so" directs criticism at the engineering (the actual product), outweighing praise for marketing.'
  ),
  entry(
    'Nothing about it stood out, for better or worse.',
    'neutral',
    'Explicitly states neither positive nor negative distinction.'
  ),
  entry(
    'I\'m almost disappointed that I have nothing to complain about.',
    'positive',
    'The ironic framing reveals genuine satisfaction — there is nothing to complain about.'
  ),
  entry(
    'The experience was memorable, though not for the reasons I hoped.',
    'negative',
    '"Not for the reasons I hoped" reveals the memorable quality was a bad one.'
  ),
  entry(
    'I\'ve seen worse implementations of the same idea.',
    'neutral',
    'A relative comparison that neither praises nor strongly criticizes this specific implementation.'
  ),
  entry(
    'After the latest update, I no longer dread opening the app.',
    'positive',
    'The removal of dread signals a genuine improvement in experience.'
  ),
  entry(
    'I admire the confidence required to release it in this state.',
    'negative',
    'Sarcastic "admiration" targets the poor state of the release.'
  ),
  entry(
    'It consistently meets my completely average expectations.',
    'neutral',
    'Both "consistently meets" and "average" point to an unremarkable, neither-good-nor-bad outcome.'
  ),
  entry(
    'The more I use it, the less I want to replace it.',
    'positive',
    'Growing reluctance to replace it signals growing satisfaction.'
  ),
  entry(
    'It promises simplicity and delivers character-building.',
    'negative',
    '"Character-building" is a euphemism for a frustrating, difficult experience that fails to deliver the promised simplicity.'
  ),
  entry(
    'I neither regret nor celebrate buying it.',
    'neutral',
    'Explicitly rules out both negative regret and positive celebration.'
  ),
  entry(
    'I wouldn\'t be upset if all products were this dependable.',
    'positive',
    'Wishing all products matched this one\'s dependability is high praise.'
  ),
  entry(
    'At least the error messages are polite.',
    'negative',
    '"At least" signals a consolation prize; the implied context is frequent errors, with politeness being the only redeeming detail.'
  ),
  entry(
    'The experience left no lasting impression.',
    'neutral',
    'Explicitly states the absence of any strong reaction, positive or negative.'
  ),
  entry(
    'Somehow, despite its flaws, I genuinely like using it.',
    'positive',
    '"Genuinely like" is a direct positive statement that outweighs the acknowledged flaws.'
  ),
];

export const HARD_DATASET: RPEDatasetEntry[] = [
  entry(
    'It solved the issue I bought it for, which was honestly unexpected.',
    'positive',
    'Solving the core problem is a positive outcome, even though it was unexpected.'
  ),
  entry(
    'The only thing consistent about it is how consistently inconsistent it is.',
    'negative',
    'Describes unreliability as the product\'s only defining trait.'
  ),
  entry(
    'I\'m still trying to decide whether I like it.',
    'neutral',
    'Explicit, ongoing indecision with no lean either way.'
  ),
  entry(
    'It exceeded my expectations, although they started somewhere underground.',
    'positive',
    'The core claim is exceeding expectations; the low starting point is a qualifier, not a reversal.'
  ),
  entry(
    'Nothing actually broke, which feels like an achievement.',
    'positive',
    'Framing "nothing broke" as an achievement expresses relief and approval.'
  ),
  entry(
    'I kept lowering my expectations until they finally matched reality.',
    'negative',
    'Having to repeatedly lower expectations to match a disappointing reality is a negative account.'
  ),
  entry(
    'If mediocrity had a flagship product, this would be a strong contender.',
    'negative',
    'Directly labels the product as a top example of mediocrity.'
  ),
  entry(
    'It has all the features I expected.',
    'neutral',
    'States that expectations were met without expressing enthusiasm or disappointment.'
  ),
  entry(
    'I can see why some people would absolutely love it.',
    'neutral',
    'Describes others\' potential reaction without committing to the speaker\'s own opinion.'
  ),
  entry(
    'I can also see why others wouldn\'t.',
    'neutral',
    'Continues the balanced, non-committal framing of the previous entry, acknowledging valid views on both sides.'
  ),
  entry(
    'I wouldn\'t recommend against it.',
    'positive',
    'A double negative that resolves to a mild, non-objecting endorsement.'
  ),
  entry(
    'I wouldn\'t recommend recommending it either.',
    'neutral',
    'Paired with the previous entry\'s mild non-objection, this adds an equally mild reluctance to actively endorse it, landing on genuine ambivalence rather than a clear lean.'
  ),
  entry(
    'The experience improved dramatically once I stopped expecting it to work properly.',
    'negative',
    'The "improvement" comes only from abandoning the expectation that it work properly, revealing the product doesn\'t.'
  ),
  entry(
    'It\'s one of those rare products that gets less annoying over time.',
    'positive',
    'A trend of decreasing annoyance over time is a positive trajectory.'
  ),
  entry(
    'I\'ve certainly paid more for less.',
    'positive',
    'A favorable value comparison against worse past purchases.'
  ),
  entry(
    'I\'ve also paid less for more.',
    'negative',
    'The mirror comparison to the previous entry: elsewhere the speaker got more for less, implying this product is comparatively poor value.'
  ),
  entry(
    'It\'s difficult to criticize something that mostly delivers.',
    'positive',
    '"Mostly delivers" is the operative claim, framed as resistant to criticism.'
  ),
  entry(
    'Technically, it functions.',
    'neutral',
    'A bare, minimal statement of function with no evaluative language, deliberately setting up the negative twist in the next entry.'
  ),
  entry(
    'Functionally, that\'s open to interpretation.',
    'negative',
    'Undercuts the previous entry\'s bare claim of functioning, casting doubt on whether it actually works well.'
  ),
  entry(
    'I appreciate the ambition, even if reality didn\'t.',
    'negative',
    'The pivot "even if reality didn\'t" reveals the product failed to live up to its ambition.'
  ),
  entry(
    'It\'s surprisingly adequate.',
    'positive',
    '"Surprisingly" signals the outcome beat a low expectation, even though "adequate" alone is modest.'
  ),
  entry(
    'Surprisingly, it\'s exactly adequate.',
    'neutral',
    'Unlike the previous entry, this pins the result precisely at "adequate" with no upside beyond that baseline.'
  ),
  entry(
    'I don\'t miss using the previous version.',
    'positive',
    'Not missing the old version implies the current one is an improvement.'
  ),
  entry(
    'I\'m not sure I\'ll miss using this one either.',
    'neutral',
    'Genuine uncertainty about future feelings, without a clear positive or negative claim about the product now.'
  ),
  entry(
    'The documentation was more convincing than the software.',
    'negative',
    'Implies the software fails to live up to its own documentation/marketing.'
  ),
  entry(
    'After a week, I stopped noticing the flaws.',
    'neutral',
    'Standing alone, this could reflect either genuine improvement or resignation, a genuine ambiguity resolved explicitly in the next entry.'
  ),
  entry(
    'Whether that\'s because they were fixed or because I gave up is unclear.',
    'neutral',
    'Explicitly states the ambiguity ("is unclear") between a positive explanation (fixed) and a negative one (gave up), without resolving it.'
  ),
  entry(
    'It almost feels unfair to call it disappointing.',
    'negative',
    'The baseline word under discussion is "disappointing"; softening it as "almost unfair" tempers but does not remove the negative judgment.'
  ),
  entry(
    'I wanted a reason to return it but never found one.',
    'positive',
    'Never finding grounds to return it implies satisfaction with keeping it.'
  ),
  entry(
    'I wanted a reason to keep it but never really found that either.',
    'negative',
    'The mirror of the previous entry: never finding a reason to keep it implies the product failed to earn the speaker\'s attachment.'
  ),
  entry(
    'This product has successfully lowered the bar for everything else.',
    'negative',
    'Sarcastically frames the product as a new, worse standard rather than a genuine success.'
  ),
  entry(
    'Every update makes me slightly less nervous.',
    'positive',
    'A trend of decreasing anxiety with each update is a positive trajectory.'
  ),
  entry(
    'Every update also introduces a new surprise.',
    'negative',
    'In the context of software updates causing nervousness, "surprise" implies unwelcome new problems.'
  ),
  entry(
    'It earns exactly the amount of enthusiasm I feel right now.',
    'neutral',
    'Self-referential and deadpan, expressing neither stated enthusiasm nor disappointment.'
  ),
  entry(
    'I expected to complain a lot more than I actually did.',
    'positive',
    'Fewer complaints than expected is a favorable outcome.'
  ),
  entry(
    'I expected to praise it a lot more than I actually can.',
    'negative',
    'Falling short of expected praise reveals disappointment.'
  ),
  entry(
    'I\'d buy it again if the alternatives disappeared.',
    'negative',
    'Repurchasing only as a last resort implies a preference for other options over this product.'
  ),
  entry(
    'I keep recommending it with an unusually long list of caveats.',
    'neutral',
    'The act of recommending (positive) is balanced by an unusually long list of caveats (negative), netting out to mixed.'
  ),
  entry(
    'Against my better judgment, I kind of enjoy it.',
    'positive',
    'Despite reservations, the speaker states genuine enjoyment.'
  ),
  entry(
    'Against the marketing, it performs exactly as advertised.',
    'positive',
    'Performing exactly as advertised, despite skepticism about the marketing, is a favorable outcome.'
  ),
  entry(
    'The product is honest. The advertising isn\'t.',
    'negative',
    'The overall judgment centers on deceptive advertising, casting a negative light on the buying experience despite the product itself being described as honest.'
  ),
  entry(
    'It works best when you don\'t ask too much of it.',
    'neutral',
    'Acknowledges functional limitations without an explicit strong complaint, the milder half of the escalating pair with the next entry.'
  ),
  entry(
    'It works best when you don\'t use it.',
    'negative',
    'The logical extreme of the previous entry — implying the product essentially doesn\'t work when actually used.'
  ),
  entry(
    'I never thought "good enough" could feel this reassuring.',
    'positive',
    'Finding genuine reassurance/comfort in the outcome is a positive statement.'
  ),
  entry(
    'It\'s impossible to love, but equally difficult to hate.',
    'neutral',
    'Explicitly rules out both strong positive and negative reactions.'
  ),
  entry(
    'The longer I own it, the more justified the purchase feels.',
    'positive',
    'Growing sense of justification over time reflects growing satisfaction.'
  ),
  entry(
    'The longer I own it, the more excuses I find for it.',
    'negative',
    'Needing increasing excuses over time implies ongoing, unresolved disappointment.'
  ),
  entry(
    'It left me with fewer complaints than compliments.',
    'positive',
    'A net-favorable balance of compliments over complaints.'
  ),
  entry(
    'I finished using it with exactly the same opinion I started with.',
    'neutral',
    'Explicitly states no change in opinion, without revealing what that opinion was, so no lean can be inferred.'
  )
];

export const LONG_INPUT_DATASET: RPEDatasetEntry[] = [
  // Easy

  entry(
    'I bought this laptop last week and it has been fantastic so far. The battery lasts all day, the screen looks amazing, and everything feels incredibly fast. I would happily recommend it to anyone looking for a new computer.',
    'positive',
    'Multiple explicit positive statements ("fantastic", "amazing") culminate in a direct recommendation.'
  ),

  entry(
    'This restaurant was a complete disappointment. The food arrived cold, the waiter forgot our order twice, and we waited nearly an hour for dessert. I definitely won\'t be coming back.',
    'negative',
    'Cold food, a forgotten order, and a long wait culminate in an explicit refusal to return.'
  ),

  entry(
    'The package arrived this morning. Everything listed in the order was inside the box and nothing appeared to be damaged. I haven\'t had a chance to try the product yet.',
    'neutral',
    'Purely descriptive report of a delivery\'s contents and condition, with no opinion on the product itself yet.'
  ),

  entry(
    'I was a little unsure before buying it, but I\'m really glad I did. Setup took only a few minutes and it has worked flawlessly ever since. It exceeded my expectations.',
    'positive',
    'Initial uncertainty is resolved by flawless performance and an explicit claim of exceeding expectations.'
  ),

  entry(
    'The software crashes almost every time I try to save my work. I lost several hours because of it, and customer support hasn\'t responded yet. It has been an incredibly frustrating experience.',
    'negative',
    'Frequent crashes, lost work, and unresponsive support culminate in an explicit statement of frustration.'
  ),

  entry(
    'The conference lasted two days and included several keynote presentations. Around five hundred people attended from different countries. The schedule is available online.',
    'neutral',
    'A factual, logistical summary of a conference with no evaluative language.'
  ),

  entry(
    'The hotel staff were incredibly welcoming from the moment we arrived. Our room was spotless, breakfast was excellent, and the location made exploring the city easy. We had a wonderful stay.',
    'positive',
    'Welcoming staff, a spotless room, and excellent breakfast culminate in an explicit "wonderful stay".'
  ),

  entry(
    'I received exactly what I ordered. The color matches the photos and the measurements are correct. Shipping took four business days.',
    'neutral',
    'Confirms the order matches expectations and reports shipping time without any evaluative language.'
  ),

  entry(
    'Nothing about this purchase went well. The wrong item arrived first, the replacement was damaged, and getting a refund took weeks. I regret ordering from this store.',
    'negative',
    'A cascade of failures (wrong item, damaged replacement, slow refund) culminates in explicit regret.'
  ),

  entry(
    'The headphones sound incredible and are comfortable enough to wear for hours. Even after daily use, the battery still lasts much longer than advertised. I couldn\'t be happier.',
    'positive',
    'Strong sensory and comfort praise culminates in an explicit statement of being "happier".'
  ),

  // Moderate

  entry(
    'The phone isn\'t perfect, but after using it for a month I find myself appreciating it more than I expected. There are a few annoying bugs, yet none of them seriously affect my daily use. Overall, I\'m happy with the purchase.',
    'positive',
    'Acknowledges bugs but concludes with an explicit statement of overall happiness with the purchase.'
  ),

  entry(
    'I really wanted to like this camera because the specifications looked impressive. Unfortunately, the image quality doesn\'t justify the price and the autofocus misses more often than it should. It isn\'t terrible, just disappointing.',
    'negative',
    'Despite tempering with "isn\'t terrible", the core verdict is that image quality and autofocus don\'t justify the price, ending on "disappointing".'
  ),

  entry(
    'The product does everything it claims to do. It doesn\'t particularly impress me, but it also doesn\'t give me any reason to complain. I\'ll probably keep using it.',
    'neutral',
    'Explicitly states neither strong impression nor complaint, only a functional, unremarkable experience.'
  ),

  entry(
    'The first few days were rough because the interface was confusing. Once I got used to it, everything started making sense and now I actually enjoy using it. Learning it was worth the effort.',
    'positive',
    'A rough start is resolved into genuine enjoyment, explicitly deemed "worth the effort".'
  ),

  entry(
    'I can understand why other people enjoy this game. Personally, it never really clicked with me, although I can\'t point to anything objectively wrong with it. It simply isn\'t for me.',
    'neutral',
    'Explicitly frames the mismatch as personal preference ("simply isn\'t for me") rather than a quality complaint, with no objective fault found.'
  ),

  entry(
    'The customer support agent was polite throughout the conversation. Unfortunately, despite several promises, my issue remained unresolved after multiple calls. Courtesy alone wasn\'t enough.',
    'negative',
    'Politeness from support doesn\'t offset the unresolved issue, explicitly stated as "not enough".'
  ),

  entry(
    'I expected the update to introduce a lot of problems because previous releases usually did. Surprisingly, everything worked smoothly and performance even improved a little. That was a pleasant surprise.',
    'positive',
    'Expected problems don\'t materialize; the update instead improves performance, framed as a "pleasant surprise".'
  ),

  entry(
    'The meal looked much better than it tasted. Nothing was actually bad, but nothing stood out either, especially considering the price. I left feeling indifferent.',
    'neutral',
    'Explicitly states nothing was bad and nothing stood out, landing on indifference.'
  ),

  entry(
    'The service wasn\'t as terrible as some reviews suggested. Unfortunately, it also wasn\'t nearly good enough for me to recommend it. I\'m somewhere in the middle.',
    'neutral',
    'Explicitly places the service "in the middle", neither bad enough to condemn nor good enough to recommend.'
  ),

  entry(
    'Every time I think the app is finally stable, another update introduces new problems. I appreciate that the developers are trying, but being a paying customer feels like beta testing.',
    'negative',
    'Recurring new problems with each update lead to the pointed comparison of paying customers to unpaid beta testers.'
  ),

  // Hard

  entry(
    'I spent weeks reading reviews before buying this. Oddly enough, almost everything people complained about turned out to be irrelevant to me, while the one issue nobody mentioned became my biggest annoyance. Even so, I don\'t regret the purchase.',
    'positive',
    'Despite an unexpected annoyance, the review explicitly concludes with no regret over the purchase.'
  ),

  entry(
    'After the latest update, I no longer worry about losing my work. I still wouldn\'t describe the software as polished, but at least it has stopped getting in my way. That alone makes it feel much better.',
    'positive',
    'The update removes a major worry (losing work), which the speaker explicitly says makes the experience "much better", despite acknowledging it isn\'t polished.'
  ),

  entry(
    'The product didn\'t fail spectacularly. Instead, it slowly accumulated dozens of tiny frustrations that eventually made me stop using it. None of them alone would justify a bad review, but together they certainly do.',
    'negative',
    'An accumulation of many minor frustrations is explicitly said to justify a bad review, even without one dramatic failure.'
  ),

  entry(
    'The hotel was exactly as advertised. The room was clean, breakfast was acceptable, and the staff behaved professionally throughout our stay. There isn\'t much more to say.',
    'neutral',
    'Describes the hotel as matching expectations exactly, with mild, unremarkable positive descriptors and an explicit closing note that there\'s little more to add.'
  ),

  entry(
    'I expected to return it within a few days. Somehow it has become something I use every single day, despite its obvious flaws. That probably says more than any rating I could give.',
    'positive',
    'Continuing to use it daily despite acknowledged flaws is presented as more telling than any explicit rating, implying genuine value.'
  ),

  entry(
    'The salesperson promised it would simplify my workflow. Instead, I spent several evenings reading documentation just to accomplish what my previous setup handled effortlessly. Eventually it worked, but I never felt rewarded.',
    'negative',
    'Unmet promises and wasted effort culminate in the explicit statement of never feeling "rewarded".'
  ),

  entry(
    'If someone asked whether I liked it, I honestly wouldn\'t know how to answer. It solved the problem I bought it for, but it never made using it enjoyable. My opinion hasn\'t changed much over time.',
    'neutral',
    'Explicitly states uncertainty about whether the speaker even likes it, describing a functional but unenjoyable, unchanged experience.'
  ),

  entry(
    'The experience improved so gradually that I barely noticed it happening. Looking back, I complain much less than I used to and rely on it far more often than expected. That probably means it earned my trust.',
    'positive',
    'A gradual reduction in complaints and increased reliance on the product is explicitly interpreted as it having "earned my trust".'
  ),

  entry(
    'Nothing catastrophic ever happened while using it. Unfortunately, nothing particularly satisfying happened either, leaving me with the strange feeling that I spent a lot of money to feel almost nothing. That isn\'t exactly a compliment.',
    'negative',
    'The absence of both disaster and satisfaction is explicitly called out as not a compliment, given the money spent.'
  ),

  entry(
    'I have recommended it to exactly one person, and only after explaining all of its strengths and weaknesses for fifteen minutes. They ended up buying it anyway. I\'m still not sure whether that was good advice.',
    'neutral',
    'Explicit, ongoing uncertainty about whether recommending it was good advice, with no resolved opinion.'
  ),

  // Very hard

  entry(
    'I kept waiting for the moment when I would understand why people praise this product so much. That moment never really arrived, although neither did the moment when I wanted to stop using it. Somehow it settled into being an ordinary part of my day.',
    'neutral',
    'The anticipated appreciation never arrives, but neither does a desire to stop using it; it settles into ordinary, unremarkable use.'
  ),

  entry(
    'Had you asked me during the first week, I probably would have told you to avoid it. A month later, after several updates, I realized I hadn\'t complained about it in quite some time. Funny how opinions change.',
    'positive',
    'An initially negative impression is reversed by later updates, explicitly noted as no longer prompting complaints.'
  ),

  entry(
    'Everything technically worked from the very beginning. The problem was that using it felt like negotiating with software that clearly had other priorities. I eventually succeeded, but I wouldn\'t call the experience successful.',
    'negative',
    'Despite technically working, the frustrating experience of using it leads the speaker to explicitly withhold the label "successful".'
  ),

  entry(
    'The company deserves credit for responding quickly whenever I contacted them. Unfortunately, every response created a new issue instead of solving the previous one. Efficiency alone doesn\'t make good support.',
    'negative',
    'Quick responses don\'t offset that each one created a new problem, explicitly concluding efficiency isn\'t enough for good support.'
  ),

  entry(
    'I\'ve owned products that were objectively better. Oddly enough, this is the one I keep reaching for without thinking about it. Sometimes convenience wins over perfection.',
    'positive',
    'Despite owning objectively better products, this one is preferred in practice, explicitly framed as convenience winning over perfection.'
  ),

  entry(
    'The feature everyone seems excited about turned out to be the one I used the least. Most of my time was spent using the basic functionality, which behaved exactly as expected. I neither gained nor lost much from the experience.',
    'neutral',
    'The basic functionality performed exactly as expected, leading to an explicit statement of neither gain nor loss.'
  ),

  entry(
    'If I judged it purely by the first impression, the review would have been terrible. If I judged it only by today, it would probably be excellent. Since both experiences are equally real, I\'ll simply keep using it.',
    'positive',
    'The current, "excellent" experience is given equal weight to a poor first impression, and the speaker chooses to keep using it, tipping the balance positive.'
  ),

  entry(
    'There\'s something oddly admirable about software that manages to disappoint you without ever completely failing. Every individual interaction feels acceptable, yet somehow the overall experience leaves you exhausted. That\'s harder to forgive than a single obvious bug.',
    'negative',
    'Every interaction is merely "acceptable" yet the cumulative effect is exhausting, explicitly called harder to forgive than an obvious bug.'
  ),

  entry(
    'When people ask whether it was worth the money, I usually hesitate longer than they expect. Not because I regret buying it, and not because I love it, but because neither answer really captures how I feel after months of using it.',
    'neutral',
    'Explicitly rules out both regret and love as the reason for hesitation, leaving genuine ambivalence.'
  ),

  entry(
    'I started using it because there were no better alternatives. Months later there are better alternatives, yet I haven\'t switched. Whether that says something good about the product or something lazy about me, I honestly can\'t tell.',
    'neutral',
    'Explicitly states the speaker can\'t tell whether continuing to use it reflects well on the product or is just inertia.'
  )
];
