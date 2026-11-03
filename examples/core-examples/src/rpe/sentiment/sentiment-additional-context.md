## Prompt Contract: Sentiment Classification

### Task
Classify the sentiment of the provided input as `positive`, `neutral`, or `negative`.

### Invariants
- The task must remain sentiment classification.
- The output must be exactly one of: `positive`, `neutral`, `negative`.
- The output must contain only the sentiment label, without explanations, formatting, or additional text.
- Classification must be based on the sentiment expressed in the input.
- Mixed sentiments must be classified according to the dominant sentiment.
- Ambiguous inputs or inputs with insufficient sentiment evidence must default to `neutral`.
- The `{{input}}` placeholder must be preserved exactly.

### Allowed Modifications
- Clarify the definitions of sentiment categories.
- Improve instructions for handling ambiguity, mixed sentiment, negation, sarcasm, and implicit sentiment.
- Add examples or decision rules to improve classification accuracy.
- Restructure or rephrase instructions without changing the task or output contract.

### Prohibited Modifications
- Introducing new sentiment categories or output formats.
- Adding, removing, or renaming placeholders.
- Requiring explanations, confidence scores, or structured responses.
- Introducing external context or assumptions not supported by the input.
- Changing the classification task or its intended semantics.