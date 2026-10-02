import { RPECandidate } from '../rpe-candidate/index.js';
import { RPEDatasetEntry } from '../rpe-dataset/index.js';
import { RPEEvaluator } from './rpe-evaluator-types.js';
import { NoPerFieldRPEEvaluatorError } from './per-field-rpe-evaluator-errors.js';
import { perFieldRPEEvaluator } from './per-field-rpe-evaluator.js';
import {
  PerFieldRPEEvaluatorEvaluators,
  PerFieldRPEEvaluatorFieldEvaluator,
} from './per-field-rpe-evaluator-types.js';

function createFieldEvaluator(
  score: number,
  reasoning: string,
): jest.MockedFunction<PerFieldRPEEvaluatorFieldEvaluator> {
  return jest.fn(async (_value, _expectedValue, field) => ({
    field: field.field,
    score,
    reasoning,
  }));
}

function createCandidate(): RPECandidate {
  return {
    candidateId: 'candidate-1',
    modules: {},
  };
}

function createDatasetEntry(
  expectedResponse?: RPEDatasetEntry['expectedResponse'],
): RPEDatasetEntry {
  return {
    datasetEntryId: 'entry-1',
    vars: {},
    expectedResponse,
  };
}

function createEvaluator(
  evaluators: PerFieldRPEEvaluatorEvaluators,
): RPEEvaluator {
  return perFieldRPEEvaluator({ evaluators });
}

describe('perFieldRPEEvaluator', () => {
  it('should validate a single field', async () => {
    const sentiment = createFieldEvaluator(1, 'correct sentiment');
    const evaluator = perFieldRPEEvaluator({
      evaluators: {
        sentiment,
      },
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({ sentiment: 'positive' });
    const response = { sentiment: 'positive' };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(sentiment).toHaveBeenCalledTimes(1);
    expect(sentiment).toHaveBeenCalledWith(
      'positive',
      'positive',
      { field: 'sentiment' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 1,
      reasoning: 'sentiment: correct sentiment',
    });
  });

  it('should validate two fields', async () => {
    const sentiment = createFieldEvaluator(1, 'correct sentiment');
    const priority = createFieldEvaluator(0.5, 'priority noted');
    const evaluator = createEvaluator({
      sentiment,
      priority,
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      sentiment: 'positive',
      priority: 'high',
    });
    const response = { sentiment: 'positive', priority: 'high' };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(sentiment).toHaveBeenCalledTimes(1);
    expect(sentiment).toHaveBeenCalledWith(
      'positive',
      'positive',
      { field: 'sentiment' },
    );
    expect(priority).toHaveBeenCalledTimes(1);
    expect(priority).toHaveBeenCalledWith(
      'high',
      'high',
      { field: 'priority' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 0.75,
      reasoning: 'sentiment: correct sentiment\npriority: priority noted',
    });
  });

  it('should validate a field which is an array', async () => {
    const firstTag = createFieldEvaluator(1, 'first tag');
    const secondTag = createFieldEvaluator(0, 'second tag');
    const evaluator = createEvaluator({
      tags: {
        0: firstTag,
        1: secondTag,
      },
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      tags: ['billing', 'urgent'],
    });
    const response = { tags: ['billing', 'urgent'] };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(firstTag).toHaveBeenCalledTimes(1);
    expect(firstTag).toHaveBeenCalledWith(
      'billing',
      'billing',
      { field: 'tags[0]' },
    );
    expect(secondTag).toHaveBeenCalledTimes(1);
    expect(secondTag).toHaveBeenCalledWith(
      'urgent',
      'urgent',
      { field: 'tags[1]' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 0.5,
      reasoning: 'tags[0]: first tag\ntags[1]: second tag',
    });
  });

  it('should validate a non-array field and an array field', async () => {
    const sentiment = createFieldEvaluator(1, 'correct sentiment');
    const firstTag = createFieldEvaluator(0, 'first tag');
    const secondTag = createFieldEvaluator(0.5, 'second tag');
    const evaluator = createEvaluator({
      sentiment,
      tags: {
        0: firstTag,
        1: secondTag,
      },
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      sentiment: 'positive',
      tags: ['billing', 'urgent'],
    });
    const response = {
      sentiment: 'positive',
      tags: ['billing', 'urgent'],
    };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(sentiment).toHaveBeenCalledWith(
      'positive',
      'positive',
      { field: 'sentiment' },
    );
    expect(firstTag).toHaveBeenCalledWith(
      'billing',
      'billing',
      { field: 'tags[0]' },
    );
    expect(secondTag).toHaveBeenCalledWith(
      'urgent',
      'urgent',
      { field: 'tags[1]' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 0.5,
      reasoning: [
        'sentiment: correct sentiment',
        'tags[0]: first tag',
        'tags[1]: second tag',
      ].join('\n'),
    });
  });

  it('should validate a nested object with a field and an array', async () => {
    const subject = createFieldEvaluator(1, 'subject matches');
    const firstLabel = createFieldEvaluator(0, 'first label');
    const secondLabel = createFieldEvaluator(1, 'second label');
    const evaluator = createEvaluator({
      ticket: {
        subject,
        labels: {
          0: firstLabel,
          1: secondLabel,
        },
      },
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      ticket: {
        subject: 'Invoice missing',
        labels: ['billing', 'urgent'],
      },
    });
    const response = {
      ticket: {
        subject: 'Invoice missing',
        labels: ['billing', 'urgent'],
      },
    };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(subject).toHaveBeenCalledWith(
      'Invoice missing',
      'Invoice missing',
      { field: 'ticket.subject' },
    );
    expect(firstLabel).toHaveBeenCalledWith(
      'billing',
      'billing',
      { field: 'ticket.labels[0]' },
    );
    expect(secondLabel).toHaveBeenCalledWith(
      'urgent',
      'urgent',
      { field: 'ticket.labels[1]' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 2 / 3,
      reasoning: [
        'ticket.subject: subject matches',
        'ticket.labels[0]: first label',
        'ticket.labels[1]: second label',
      ].join('\n'),
    });
  });

  it('should validate a whole object using a single evaluator', async () => {
    const ticket = createFieldEvaluator(0.8, 'ticket matches');
    const evaluator = createEvaluator({
      ticket,
    });

    const ticketValue = {
      subject: 'Invoice missing',
      labels: ['billing', 'urgent'],
    };
    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      ticket: ticketValue,
    });
    const response = {
      ticket: ticketValue,
    };

    const output = await evaluator.run({
      candidate,
      datasetEntry,
      response,
    });

    expect(ticket).toHaveBeenCalledTimes(1);
    expect(ticket).toHaveBeenCalledWith(
      ticketValue,
      ticketValue,
      { field: 'ticket' },
    );
    expect(output).toEqual({
      candidateRef: { candidateId: 'candidate-1' },
      datasetEntry,
      response,
      score: 0.8,
      reasoning: 'ticket: ticket matches',
    });
  });

  it('should throw when a field has no evaluator', async () => {
    const sentiment = createFieldEvaluator(1, 'correct sentiment');
    const evaluator = createEvaluator({
      sentiment,
    });

    const candidate = createCandidate();
    const datasetEntry = createDatasetEntry({
      sentiment: 'positive',
      priority: 'high',
    });
    const response = { sentiment: 'positive', priority: 'high' };

    await expect(evaluator.run({
      candidate,
      datasetEntry,
      response,
    })).rejects.toThrow(new NoPerFieldRPEEvaluatorError('priority'));

    expect(sentiment).toHaveBeenCalledTimes(1);
  });
});
